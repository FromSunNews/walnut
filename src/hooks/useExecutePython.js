import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from "../components/shared/use-toast";
import { useNodeApi } from "./useNodeApi";

const CONFIG = {
  PACKAGE_ID: "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a",
  MODULE_NAME: "network",
  NETWORK_ID: "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6",
};

export const useExecutePython = ({ onSuccess }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  const handleError = (error) => {
    console.error('Execution error:', error);
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
    console.log("account", account);
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
      // 1. Submit task on-chain first
      // const tx = new Transaction();
      // tx.moveCall({
      //   target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::submit_task`,
      //   arguments: [
      //     tx.object(CONFIG.NETWORK_ID),
      //     tx.pure.u64(1), // Default clusterId = 1 for now
      //     tx.pure.u8(clusterConfig.processor),
      //     tx.pure.u64(clusterConfig.clusterType),
      //     tx.pure.u64(clusterConfig.rewardAmount),
      //   ],
      // });

      // const txResult = await signAndExecuteTransaction({
      //   transaction: tx,
      //   chain: 'sui:testnet'
      // });

      // console.log("Transaction result:", txResult);

      // 2. After contract call succeeds, execute Python code
      const executionResponse = await nodeApi.executePython(account.address, code);

      if (!executionResponse.success) {
        throw new Error("Code execution failed");
      }

      // 3. Handle success
      toast({
        variant: "success",
        title: "Success",
        description: "Task submitted and code executed successfully"
      });

      onSuccess?.(executionResponse.data);
      return executionResponse.data;

    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  return { executePython, isExecuting };
}; 