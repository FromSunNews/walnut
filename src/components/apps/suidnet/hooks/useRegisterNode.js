import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from "../../../shared/use-toast";
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';

/**
 * Configuration constants for the Ray node registration smart contract
 * Contains necessary IDs for network, registry and module interactions
 */
const CONFIG = {
  PACKAGE_ID: "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a",
  MODULE_NAME: "network",
  NODE_REGISTRY_ID: "0x3cdd19bc8661286d9abdad8f87f00218fc66c7f73735525a144afeaaeaaeba49",
  NETWORK_ID: "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6",
  CLOCK_ID: "0x6"
};

/**
 * Custom hook for registering nodes in a Ray cluster
 * Handles both backend registration and blockchain transaction for node authorization
 * Supports CPU/GPU node types and provides automatic rollback on failure
 * 
 * @param {Object} params - Hook parameters
 * @param {Function} params.onSuccess - Callback function executed after successful registration
 * @returns {Object} Object containing registration function and loading state
 */
export const useRegisterNode = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Required for wallet feedback
          showRawEffects: true,
          // For tracking object state changes
          showObjectChanges: true,
        },
      }),
  });
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  /**
   * Handles errors during node registration process
   * Attempts to clean up resources by destroying partially registered nodes
   * 
   * @param {Error} error - The error that occurred
   * @param {string} address - Wallet address of the node owner
   * @param {string} instanceId - ID of the node instance if created
   */
  const handleError = (error, address, instanceId) => {
    console.error('Registration error address:', address);
    console.error('Registration error instanceId:', instanceId);

    // If instanceId exists, perform rollback
    if (instanceId) {
      try {
        nodeApi.destroyNode(address, instanceId);
        console.log('Node destroyed successfully after failed registration');
      } catch (destroyError) {
        console.error('Error during node destruction:', destroyError);
      }
    }

    toast({
      variant: "error",
      title: "Error",
      description: error?.message || "Cannot register node. Please try again."
    });
  };

  /**
   * Registers a new node in the Ray cluster
   * Process:
   * 1. Backend registration for resource allocation
   * 2. Smart contract transaction for on-chain authorization
   * 3. Handles rollback on failure
   * 
   * Based on Ray's distributed computing framework capabilities:
   * - Supports heterogeneous clusters (CPU/GPU)
   * - Handles fault tolerance and resource management
   * - Integrates with cloud infrastructure
   * 
   * @param {Object} account - User's wallet account
   * @param {string} selectedDeviceType - Type of node ("CPU" or "GPU")
   */
  const registerNode = async (account, selectedDeviceType) => {
    if (!account) {
      toast({
        variant: "error",
        title: "Error",
        description: "Please connect your wallet first"
      });
      return;
    }

    setIsAuthorizing(true);
    let nodeInstance = null;

    try {
      // Step 1: Register node with backend service
      const backendResponse = await nodeApi.registerNode(account.address);

      /* Example backend response:
      {
        "data": {
          "id": "1c4e4d7f6e5fc8533eb8",
          "ip": "172.31.48.42",
          "architecture": "abc_def",
          "state": {
            "code": 1,
            "name": "running"
          },
          "cpu": {
            "core": 1,
            "threadPerCore": 1
          },
        },
        "error": null,
        "success": {
          "title": "ok"
        },
        "code": 200
      }
      */

      if (!backendResponse.success) {
        throw new Error("Backend registration failed");
      }

      nodeInstance = backendResponse.data;

      // Step 2: Create blockchain transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::register_node`,
        arguments: [
          tx.object(CONFIG.NODE_REGISTRY_ID),
          tx.object(CONFIG.NETWORK_ID),
          tx.pure.u8(selectedDeviceType === "CPU" ? 0 : 1),
          tx.object(CONFIG.CLOCK_ID),
        ],
      });

      // Step 3: Execute transaction on blockchain
      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            // Step 4: Handle successful registration
            console.log("Transaction result:", result);
            if (result) {
              toast({
                variant: "success",
                title: "Success",
                description: "Node authorized successfully"
              });
              onSuccess?.(nodeInstance);
            } else {
              throw new Error("Transaction failed");
            }
          },
          onError: (error) => {
            console.log("Transaction error:", error);
            handleError(error, account.address, nodeInstance?.id);
          },
          onSettled: (data, error) => {
            console.log("Transaction settled", data, error);
            setIsAuthorizing(false);
            console.log("Transaction settled");
          }
        }
      )

    } catch (error) {
      handleError(error, account.address, nodeInstance?.id);
      setIsAuthorizing(false);
    }
  };

  return { registerNode, isAuthorizing };
}; 