import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = "0x5a77ca4bcd5c6d8c0cdfed9fc6c91b1672b67c987d39a129177f3c5bd9b482c2";
const MODULE_NAME = "network";
const CLOCK_ID = "0x6";

export class NetworkService {
  constructor() {
    const rpcUrl = getFullnodeUrl('testnet');
    this.client = new SuiClient({ url: rpcUrl });
  }

  createRegisterNodeTransaction(nodeRegistryId, networkId, nodeType) {
    if (!nodeRegistryId.startsWith('0x') || !networkId.startsWith('0x')) {
      throw new Error('Invalid object ID format');
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::register_node`,
      arguments: [
        tx.object(nodeRegistryId),
        tx.object(networkId),
        tx.pure.u8(nodeType),
        tx.object(CLOCK_ID)
      ]
    });

    return tx;
  }

  createSubmitTaskTransaction(networkId, clusterId, processorType, clusterType, rewardAmount) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::submit_task`,
      arguments: [
        tx.object(networkId),
        tx.pure.u64(clusterId),
        tx.pure.u8(processorType),
        tx.pure.u64(clusterType),
        tx.pure.u64(rewardAmount)
      ]
    });
    return tx;
  }

  async queryTaskInfo(networkId, taskId) {
    const result = await this.client.devInspectTransactionBlock({
      transactionBlock: {
        kind: 'programmable',
        data: {
          function: `${PACKAGE_ID}::${MODULE_NAME}::query_task_info`,
          arguments: [networkId, taskId]
        }
      }
    });
    return result;
  }
}