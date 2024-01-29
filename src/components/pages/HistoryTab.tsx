import React, { useState } from 'react';
import { Table, TableBody, TableDataCell, TableHead, TableHeadCell, TableRow } from 'react95';
import { useContractEvent, useContractRead, usePublicClient } from 'wagmi';
import { cn, DECIMALS, NULL_ADDRESS } from '~/lib/utils';
import { useMocoRushContract } from '~/hooks/useMocoRushContract.ts';

export interface RoundHistory {
  roundName: string;
  winner: string;
  startedAt: Date;
  totalPrize: number;
}

export interface HistoryTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export function HistoryTab({ className }: HistoryTabProps) {
  const mocoRushContract = useMocoRushContract();
  const publicClient = usePublicClient();
  const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);

  const updateRoundInfo = async () => {
    const roundIndices = [0, 1];
    const rounds = await Promise.all(
      roundIndices.map((index) =>
        publicClient.readContract({
          ...mocoRushContract,
          functionName: 'rounds',
          args: [BigInt(index)],
        }),
      ),
    );
    console.log(rounds);
    for (const [index, startTime, endTime, prizePool, winner, finished] of rounds) {
      const isFinished = Number(finished) === 1;
      const roundName = `#${index}`;
      const startedAt = new Date(Number(startTime) * 1000);
      const totalPrize = Number(prizePool / DECIMALS);
      setRoundHistory((prev) => {
        const round = prev.find((r) => r.roundName === roundName);
        if (round) {
          return prev.map((r) => (r.roundName === roundName ? { ...r, startedAt, totalPrize } : r));
        }
        return [
          ...prev,
          {
            roundName,
            startedAt,
            totalPrize,
            winner: winner === NULL_ADDRESS ? '-' : `${winner.slice(0, 6)}…${winner.slice(-6)}`,
          },
        ];
      });
    }
  };

  React.useEffect(() => {
    updateRoundInfo().catch(console.error);
    const timer = setTimeout(() => {
      updateRoundInfo().catch(console.error);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('p-2 w-full h-full', className)}>
      <Table className="h-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Round</TableHeadCell>
            <TableHeadCell>Winner</TableHeadCell>
            <TableHeadCell>Started At</TableHeadCell>
            <TableHeadCell>Total Prize</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roundHistory.map((round) => (
            <TableRow key={round.roundName}>
              <TableDataCell>{round.roundName}</TableDataCell>
              <TableDataCell>{round.winner}</TableDataCell>
              <TableDataCell>{round.startedAt.toLocaleString()}</TableDataCell>
              <TableDataCell>{round.totalPrize} MOC</TableDataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
