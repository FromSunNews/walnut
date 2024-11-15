import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';
import { useToast } from '../../../shared/use-toast';
import { CONFIG } from '../utils/config';

export const useDeployCluster = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isDeploying, setIsDeploying] = useState(false);
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

  const handleError = async (error, address, clusterId) => {
    console.error('Deployment error:', error);

    if (clusterId) {
      try {
        await nodeApi.destroyNode(address, clusterId);
        console.log('Cluster destroyed after failed deployment');
      } catch (destroyError) {
        console.error('Error during cluster destruction:', destroyError);
      }
    }

    toast({
      variant: "error",
      title: "Error",
      description: error?.message || "Cannot deploy cluster. Please try again."
    });
  };

  const deployCluster = async (account, clusterConfig) => {
    if (!account) {
      toast({
        variant: "error",
        title: "Error",
        description: "Please connect your wallet first"
      });
      return;
    }

    const { clusterType, locations, processor } = clusterConfig;

    if (!clusterType || !locations.length || !processor) {
      toast({
        variant: "error",
        title: "Error",
        description: "Please fill in all cluster information"
      });
      return;
    }

    setIsDeploying(true);
    let clusterInstance = null;

    try {
      // 1. Deploy cluster with backend
      const backendResponse = await nodeApi.deployCluster(account.address, {
        clusterType,
        locations: locations.join(','),
        processor
      });

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
        throw new Error("Backend deployment failed");
      }

      clusterInstance = backendResponse.data;

      // 2. Create transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::register_cluster`,
        arguments: [
          tx.object(CONFIG.NETWORK_ID),
          tx.pure.u8(clusterType), // cluster_type
          tx.pure.u8(processor), // cluster_processor
          tx.pure.string(locations.join(',')), // location
        ],
      });

      // 3. Execute transaction with proper callbacks
      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            console.log("Transaction result:", result);
            if (result) {
              // Lưu vào localStorage để sử dụng sau này
              localStorage.setItem('header_node_ip', clusterInstance.ip);
              toast({
                variant: "success",
                title: "Success",
                description: "Cluster deployed successfully"
              });
              onSuccess?.(clusterInstance);
            } else {
              throw new Error("Transaction failed");
            }
          },
          onError: (error) => {
            console.log("Transaction error:", error);
            handleError(error, account.address, clusterInstance?.id);
          },
          onSettled: (data, error) => {
            console.log("Transaction settled", data, error);
            setIsDeploying(false);
            console.log("Transaction settled");
          }
        }
      );

    } catch (error) {
      await handleError(error, account.address, clusterInstance?.id);
      setIsDeploying(false);
    }
  };

  return { deployCluster, isDeploying };
}; 