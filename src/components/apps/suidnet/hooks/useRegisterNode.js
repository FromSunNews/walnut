import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
// import { useToast } from "../components/shared/use-toast";
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';
import { useToast } from '../../../shared/use-toast';
import { CONFIG } from '../utils/config';

export const useRegisterNode = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) => {
      console.log("bytes", bytes);
      console.log("signature", signature);
      return await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      })
    }
  });
  // const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  const nodeApi = useNodeApi();

  const verifyObjects = async () => {
    try {
      // Kiểm tra package
      const packageObj = await client.getObject({
        id: CONFIG.PACKAGE_ID,
        options: { showContent: true }
      });

      // Kiểm tra registry
      const registryObj = await client.getObject({
        id: CONFIG.NODE_REGISTRY_ID,
        options: { showContent: true }
      });

      // Kiểm tra network
      const networkObj = await client.getObject({
        id: CONFIG.NETWORK_ID,
        options: { showContent: true }
      });

      if (!packageObj || !registryObj || !networkObj) {
        throw new Error("One or more required objects not found");
      }

      return true;
    } catch (error) {
      console.error("Object verification failed:", error);
      return false;
    }
  };

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

  const registerNode = async (account, selectedDeviceType, deviceName, osType) => {
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

      // Verify objects first
      const objectsExist = await verifyObjects();
      if (!objectsExist) {
        throw new Error("Required objects not found on network");
      }
      console.log("account.address", account.address)
      // 1. Register node with backend
      const backendResponse = await nodeApi.registerNode(account.address);
      // const backendResponse = {
      //   "data": {
      //     "id": "1c4e4d7f6e5fc8533eb8",
      //     "ip": "172.31.48.42",
      //     "architecture": "abc_def",
      //     "state": {
      //       "code": 1,
      //       "name": "running"
      //     },
      //     "cpu": {
      //       "core": 1,
      //       "threadPerCore": 1
      //     },
      //   },
      //   "error": null,
      //   "success": {
      //     "title": "ok"
      //   },
      //   "code": 200
      // }

      if (!backendResponse.success) {
        throw new Error("Backend registration failed");
      }

      nodeInstance = backendResponse.data;
      // show node instance info
      onSuccess?.(nodeInstance);

      // 2. Create transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::register_node`,
        arguments: [
          tx.object(CONFIG.NODE_REGISTRY_ID),
          tx.object(CONFIG.NETWORK_ID),
          tx.pure.string(nodeInstance.ip),
          tx.pure.string(nodeInstance.id),
          tx.pure.string(deviceName),
          tx.pure.string(osType),
          tx.pure.u8(selectedDeviceType === "CPU" ? 0 : 1),
          tx.object(CONFIG.CLOCK_ID),
        ],
      });

      // 3. Execute transaction
      signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            // 4. Handle success
            console.log("Transaction result:", result);
            if (result) {
              toast({
                variant: "success",
                title: "Success",
                description: "Node authorized successfully"
              });
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