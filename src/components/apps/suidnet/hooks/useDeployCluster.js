import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from "../../../shared/use-toast";
import { useNodeApi } from "./useNodeApi";
import { getSuiClient } from '../utils/suiClient';

/**
 * Configuration constants for Ray cluster deployment smart contract
 * Contains package ID and network settings for blockchain interactions
 */
const CONFIG = {
  PACKAGE_ID: "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a",
  MODULE_NAME: "network",
  NETWORK_ID: "0x93996af609fc97bf69377860e599796f0c91162568f4077fe96648805bd503f6",
};

/**
 * Custom hook for deploying Ray clusters
 * Handles both cluster deployment on cloud infrastructure and blockchain transaction
 * Based on Ray's distributed computing capabilities:
 * - Supports heterogeneous clusters (CPU/GPU)
 * - Multi-cloud deployment (AWS, GCP, Azure)
 * - Auto-scaling and fault tolerance
 * 
 * @param {Object} params - Hook parameters
 * @param {Function} params.onSuccess - Callback function executed after successful deployment
 * @returns {Object} Object containing deployment function and loading state
 */
export const useDeployCluster = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isDeploying, setIsDeploying] = useState(false);
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
   * Handles errors during cluster deployment
   * Attempts to clean up resources by destroying partially deployed clusters
   * 
   * @param {Error} error - The error that occurred
   * @param {string} address - Wallet address of the cluster owner
   * @param {string} clusterId - ID of the cluster if created
   */
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

  /**
   * Deploys a new Ray cluster with specified configuration
   * Process:
   * 1. Deploy cluster on cloud infrastructure through backend
   * 2. Register cluster on blockchain for decentralized management
   * 3. Configure head node and worker nodes
   * 
   * Features supported by Ray:
   * - Multi-node orchestration
   * - Resource scheduling
   * - Fault tolerance
   * - Auto-scaling
   * 
   * @param {Object} account - User's wallet account
   * @param {Object} clusterConfig - Cluster configuration
   * @param {number} clusterConfig.clusterType - Type of Ray cluster
   * @param {string[]} clusterConfig.locations - Geographic locations for deployment
   * @param {number} clusterConfig.processor - CPU (0) or GPU (1) configuration
   * @returns {Promise<void>}
   */
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