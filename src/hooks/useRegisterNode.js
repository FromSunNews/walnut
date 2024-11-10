import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from "../components/shared/use-toast";
import { useNodeApi } from "./useNodeApi";

const CONFIG = {
  PACKAGE_ID: "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a",
  MODULE_NAME: "network",
  NODE_REGISTRY_ID: "0x3cdd19bc8661286d9abdad8f87f00218fc66c7f73735525a144afeaaeaaeba49",
  NETWORK_ID: "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6",
  CLOCK_ID: "0x6"
};


// const PACKAGE_ID = "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a";
// const MODULE_NAME = "network";
// const NODE_REGISTRY_ID = "0x3cdd19bc8661286d9abdad8f87f00218fc66c7f73735525a144afeaaeaaeba49";
// const NETWORK_ID = "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6";
// const CLOCK_ID = "0x6";

export const useRegisterNode = ({ onSuccess }) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  const handleError = (error, address, instanceId) => {
    console.error('Registration error address:', address);
    console.error('Registration error instanceId:', instanceId);

    // Nếu có instanceId, thực hiện rollback
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
      // 1. Register node with backend
      const backendResponse = await nodeApi.registerNode(account.address);

      if (!backendResponse.success) {
        throw new Error("Backend registration failed");
      }

      nodeInstance = backendResponse.data;

      // 2. Create transaction
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

      // 3. Execute transaction với Promise
      const result = await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet'
        }
      );

      // 4. Handle success
      console.log("Transaction result:", result);
      toast({
        variant: "success",
        title: "Success",
        description: "Node authorized successfully"
      });
      onSuccess?.(nodeInstance);

    } catch (error) {
      // Handle error
      handleError(error, account.address, nodeInstance?.id);
    } finally {
      setIsAuthorizing(false);
    }
  };

  return { registerNode, isAuthorizing };
}; 