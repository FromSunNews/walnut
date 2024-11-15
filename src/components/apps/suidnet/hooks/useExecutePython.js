import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';
import { useToast } from '../../../shared/use-toast';
import { CONFIG } from '../utils/config';

export const useExecutePython = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  const handleError = (error, address) => {
    console.error('Execution error:', error);
    console.error('Execution error address:', address);

    toast({
      variant: "error",
      title: "Error",
      description: error?.message || "Cannot execute code. Please try again."
    });
  };

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
      // 1. Check if application is ready on header node
      const headerIp = localStorage.getItem('header_node_ip');
      const applicationStatus = await nodeApi.checkApplication(account.address, headerIp, "header");
      // Kiểm tra response status
      if (applicationStatus.code !== 200) {
        throw new Error(applicationStatus?.data?.status || 'Failed to check application status');
      }
      console.log("Application status:", applicationStatus);

      // 2. execute Python code
      const executionResponse = await nodeApi.executePython(account.address, code, headerIp);
      if (!executionResponse.success) {
        throw new Error("Code execution failed");
      }

      onSuccess?.(executionResponse.data);

      // 3. Create transaction
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

      // 4. Execute transaction
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