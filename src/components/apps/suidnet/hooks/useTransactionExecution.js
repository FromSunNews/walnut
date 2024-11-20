import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getSuiClient } from '../utils/suiClient';
import { useToast } from '../../../shared/use-toast';

export const useTransactionExecution = ({ onSuccess }) => {
  const client = getSuiClient();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleError = async (error, { address, instanceId, cleanup }) => {
    console.error('Transaction error:', error);
    if (cleanup) await cleanup(address, instanceId);

    toast({
      variant: "error",
      title: "Error",
      description: error?.message || "Transaction failed. Please try again."
    });
  };

  const executeTransaction = async ({
    account,
    validate,
    beforeTransaction,
    createTransaction,
    onSuccessCallback,
    errorCleanup
  }) => {
    if (!account) {
      toast({
        variant: "error",
        title: "Error",
        description: "Please connect your wallet first"
      });
      return;
    }

    if (validate && !validate()) return;

    setIsLoading(true);
    let instanceData = null;

    try {
      // 1. Execute any pre-transaction operations
      if (beforeTransaction) {
        instanceData = await beforeTransaction(account);
      }

      // 2. Create and execute transaction
      const tx = createTransaction(instanceData);

      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            if (result) {
              onSuccessCallback?.(result, instanceData);
              toast({
                variant: "success",
                title: "Success",
                description: "Transaction completed successfully"
              });
            } else {
              throw new Error("Transaction failed");
            }
          },
          onError: (error) => {
            handleError(error, {
              address: account.address,
              instanceId: instanceData?.id,
              cleanup: errorCleanup
            });
          },
          onSettled: () => setIsLoading(false)
        }
      );
    } catch (error) {
      await handleError(error, {
        address: account.address,
        instanceId: instanceData?.id,
        cleanup: errorCleanup
      });
      setIsLoading(false);
    }
  };

  return { executeTransaction, isLoading };
}; 