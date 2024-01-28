import { toast } from 'sonner';
import { Abi } from 'viem';
import { useContractWrite, UseContractWriteConfig, usePublicClient } from 'wagmi';

export const useContractWriteWithUi = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TMode extends 'prepared' | undefined = undefined,
>({
  name,
  onConfirm,
  ...args
}: UseContractWriteConfig<TAbi, TFunctionName, TMode> & { name: string; onConfirm?: () => void }) => {
  const publicClient = usePublicClient();
  // @ts-ignore
  return useContractWrite<TAbi, TFunctionName, TMode>({
    ...args,
    onSuccess: ({ hash }) => {
      toast.promise(
        publicClient.waitForTransactionReceipt({ hash }).then(async (it) => {
          if (onConfirm) onConfirm();
          if (it.status !== 'success') throw new Error('Transaction Failed');
        }),
        {
          loading: 'Transaction Sent',
          success: 'Transaction Confirmed',
          error: 'Transaction Failed',
          description: name,
          action: {
            label: 'View Etherscan',
            onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`),
          },
        },
      );
    },
    onError: () => toast.error('Transaction Cancelled', { description: name }),
  });
};
