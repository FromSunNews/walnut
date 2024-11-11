import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from "../../../shared/use-toast";
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';

/**
 * Configuration constants for Ray task execution smart contract
 * Contains package ID and network settings for blockchain interactions
 */
const CONFIG = {
  PACKAGE_ID: "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a",
  MODULE_NAME: "network",
  NETWORK_ID: "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6",
};

/**
 * Custom hook for executing Python code on Ray cluster
 * Handles both code execution on Ray workers and blockchain transaction for task submission
 * Supports both CPU and GPU execution with configurable cluster settings
 * 
 * @param {Object} params - Hook parameters
 * @param {Function} params.onSuccess - Callback function executed after successful code execution
 * @returns {Object} Object containing execution function and loading state
 */
export const useExecutePython = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Required for transaction feedback
          showRawEffects: true,
          // Track changes in blockchain state
          showObjectChanges: true,
        },
      }),
  });
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  /**
   * Handles errors during Python code execution
   * Provides user feedback through toast notifications
   * 
   * @param {Error} error - The error that occurred
   * @param {string} address - Wallet address of the task submitter
   */
  const handleError = (error, address) => {
    console.error('Execution error:', error);
    console.error('Execution error address:', address);

    toast({
      variant: "error",
      title: "Error",
      description: error?.message || "Cannot execute code. Please try again."
    });
  };

  /**
   * Executes Python code on Ray cluster and submits task to blockchain
   * Process:
   * 1. Execute code on Ray worker nodes
   * 2. Submit task transaction to blockchain
   * 3. Handle execution results and rewards
   * 
   * Features:
   * - Supports both CPU and GPU execution
   * - Configurable cluster types and reward amounts
   * - Integrated with Ray's distributed computing capabilities
   * 
   * @param {Object} account - User's wallet account
   * @param {string} code - Python code to execute
   * @param {Object} clusterConfig - Configuration for execution
   * @param {number} clusterConfig.processor - CPU (0) or GPU (1)
   * @param {number} clusterConfig.clusterType - Type of Ray cluster to use
   * @param {number} clusterConfig.rewardAmount - Reward amount for task execution
   * @returns {Promise<Object|null>} Execution results or null on failure
   */
  const executePython = async (account, code, clusterConfig = {
    processor: 0, // CPU
    clusterType: 1,
    rewardAmount: 100
  }) => {
    if (!account) {
      toast({
        variant: "error",
        title: "Error",
        description: "Please connect your wallet first"
      });
      return;
    }

    setIsExecuting(true);
    try {
      // 1. execute Python code
      const headerIp = localStorage.getItem('header_node_ip');
      const executionResponse = await nodeApi.executePython(account.address, code, headerIp);

      if (!executionResponse.success) {
        throw new Error("Code execution failed");
      }
      // 2. Create transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::submit_task`,
        arguments: [
          tx.object(CONFIG.NETWORK_ID),
          tx.pure.u64(1), // Default clusterId = 1 for now
          tx.pure.u8(clusterConfig.processor),
          tx.pure.u64(clusterConfig.clusterType),
          tx.pure.u64(clusterConfig.rewardAmount),
        ],
      });

      // 2. Execute transaction
      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: async (result) => {
            console.log("Transaction result:", result);
            if (result) {
              toast({
                variant: "success",
                title: "Success",
                description: "Task submitted and code executed successfully"
              });

              onSuccess?.(executionResponse.data);
              return executionResponse.data;
            } else {
              throw new Error("Transaction failed");
            }
          },
          onError: (error) => {
            console.log("Transaction error:", error);
            handleError(error, account.address);
          },
          onSettled: (data, error) => {
            console.log("Transaction settled", data, error);
            setIsExecuting(false);
            console.log("Transaction settled");
          }
        }
      );
    } catch (error) {
      handleError(error, account.address);
      setIsExecuting(false);
      return null;
    }
  };

  return { executePython, isExecuting };
}; 