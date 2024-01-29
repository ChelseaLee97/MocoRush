import { toast } from 'sonner';
import { Abi } from 'viem';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  usePublicClient,
} from 'wagmi';

export const useContractWriteWithUi = <TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  name,
  onConfirm,
  ...args
}: UsePrepareContractWriteConfig<TAbi, TFunctionName> & { name: string; onConfirm?: () => void }) => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  // @ts-ignore
  const { config } = usePrepareContractWrite<TAbi, TFunctionName>({ account: address, ...args });
  return useContractWrite({
    ...(config as any),
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
    onError: (err) => toast.error('Transaction Error', { description: err.message }),
  });
};
