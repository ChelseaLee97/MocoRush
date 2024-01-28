import { Address } from 'viem';
import { useContractRead } from 'wagmi';
import { useMocoRushContract } from '~/hooks/useMocoRushContract';

export interface CurrentRoundInfo {
  index: number;
  startTime: Date;
  endTime: Date;
  totalPrize: number;
  totalTickets: number;
  lastButtonPresser: Address;
}

export const useCurrentRound = () => {
  const mocoRushContract = useMocoRushContract();
  const { data, ...queryResult } = useContractRead({
    ...mocoRushContract,
    functionName: 'currentRound',
    cacheOnBlock: true,
  });
  return {
    data: data
      ? ({
          index: Number(data.index),
          startTime: new Date(Number(data.startTime) * 1000),
          endTime: new Date(Number(data.endTime) * 1000),
          totalPrize: Number(data.prizePool / BigInt(1e18)),
          totalTickets: Number(data.totalTicketsBought / BigInt(1e18)),
          lastButtonPresser: data.lastButtonPresser,
        } satisfies CurrentRoundInfo)
      : undefined,
    ...queryResult,
  };
};
