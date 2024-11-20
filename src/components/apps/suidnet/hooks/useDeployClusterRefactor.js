import { useTransactionExecution } from './useTransactionExecution';
import { Transaction } from '@mysten/sui/transactions';
import { CONFIG } from '../utils/config';

export const useDeployCluster = ({ onSuccess }) => {
  const { executeTransaction, isLoading: isDeploying } = useTransactionExecution({ onSuccess });

  const deployCluster = async (account, clusterConfig) => {
    await executeTransaction({
      account,
      validate: () => {
        const { clusterType, locations, processor } = clusterConfig;
        return clusterType && locations.length && processor;
      },
      beforeTransaction: async (account) => {
        const response = await nodeApi.deployCluster(account.address, {
          clusterType: clusterConfig.clusterType,
          locations: clusterConfig.locations.join(','),
          processor: clusterConfig.processor
        });
        return response.data;
      },
      createTransaction: (instanceData) => {
        const tx = new Transaction();
        tx.moveCall({
          target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::register_cluster`,
          arguments: [
            tx.object(CONFIG.NETWORK_ID),
            tx.pure.u8(clusterConfig.clusterType),
            tx.pure.u8(clusterConfig.processor),
            tx.pure.string(clusterConfig.locations.join(',')),
          ],
        });
        return tx;
      },
      onSuccessCallback: (result, instanceData) => {
        localStorage.setItem('header_node_ip', instanceData.ip);
        onSuccess?.(instanceData);
      },
      errorCleanup: async (address, instanceId) => {
        if (instanceId) {
          await nodeApi.destroyNode(address, instanceId);
        }
      }
    });
  };

  return { deployCluster, isDeploying };
};