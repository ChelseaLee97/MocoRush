import { useAccount, useContractRead } from 'wagmi';
import { useMocoRushContract } from '~/hooks/useMocoRushContract';

export const useMyCurrentRoundInfo = () => {
  const mocoRushContract = useMocoRushContract();
  const { status, address } = useAccount();

  return useContractRead({
    ...mocoRushContract,
    functionName: 'playerStateForCurrentRound',
    args: [address ?? '0x00'],
    enabled: status === 'connected',
  });
};
