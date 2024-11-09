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

export const useDeployCluster = ({ onSuccess }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
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

      // 3. Execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:testnet'
      });

      // 4. Handle success
      console.log("Transaction result:", result);
      toast({
        variant: "success",
        title: "Success",
        description: "Cluster deployed successfully"
      });
      onSuccess?.(clusterInstance);

    } catch (error) {
      await handleError(error, account.address, clusterInstance?.id);
    } finally {
      setIsDeploying(false);
    }
  };

  return { deployCluster, isDeploying };
}; 