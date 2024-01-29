import React, { useMemo } from 'react';
import { Button, GroupBox, NumberInput, Slider } from 'react95';
import { toast } from 'sonner';
import { useAccount, useContractRead, useContractReads, useContractWrite, usePublicClient } from 'wagmi';
import { cn, DECIMALS, NULL_ADDRESS } from '~/lib/utils';
import { AmountSlider } from '~/components/AmountSlider.tsx';
import { useContractWriteWithUi } from '~/hooks/useContractWriteWithUi.ts';
import { useMocoRushContract } from '~/hooks/useMocoRushContract.ts';
import { useMocTokenContract } from '~/hooks/useMocTokenContract.ts';

export interface RoundTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RoundTab({ className }: RoundTabProps) {
  const mocoRushContract = useMocoRushContract();
  const mocTokenContract = useMocTokenContract();
  const { address, isConnected } = useAccount();
  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...mocoRushContract,
        functionName: 'ticketBalanceOf',
        args: [address ?? NULL_ADDRESS],
      },
      {
        ...mocTokenContract,
        functionName: 'balanceOf',
        args: [address ?? NULL_ADDRESS],
      },
      {
        ...mocTokenContract,
        functionName: 'allowance',
        args: [address ?? NULL_ADDRESS, mocoRushContract.address],
      },
    ],
    enabled: !!address && isConnected,
  });
  const [{ result: ticketBalance }, { result: mocBalance }, { result: mocAllowance }] = data ?? [{}, {}, {}];

  const displayTicketBalance = useMemo(() => {
    return ticketBalance ? Number(ticketBalance / BigInt(1e18)) : 0;
  }, [ticketBalance]);

  const displayMocBalance = useMemo(() => {
    return mocBalance ? Number(mocBalance / DECIMALS) : 0;
  }, [mocBalance]);

  const mocApproved = useMemo(
    () => mocAllowance != null && mocBalance != null && mocAllowance > 0 && mocAllowance >= mocBalance,
    [mocAllowance, mocBalance],
  );

  const [ticketsToUse, setTicketsToUse] = React.useState(0);
  const [ticketsToBuy, setTicketsToBuy] = React.useState(0);

  const { write: doPressButton, isLoading: isPressButtonLoading } = useContractWriteWithUi({
    ...mocoRushContract,
    name: 'Press Button',
    functionName: 'pressButton',
    args: [BigInt(ticketsToUse) * DECIMALS],
    onConfirm: () => setTimeout(() => void refetch(), 3000),
  });

  const { write: doBuyTicket, isLoading: isBuyTicketLoading } = useContractWriteWithUi({
    ...mocoRushContract,
    name: 'Buy Tickets',
    functionName: 'buyTickets',
    args: [BigInt(ticketsToBuy) * DECIMALS, NULL_ADDRESS],
    onConfirm: () => setTimeout(() => void refetch(), 3000),
  });

  const { write: doAllowMoc, isLoading: isAllowMocLoading } = useContractWriteWithUi({
    ...mocTokenContract,
    name: 'Approve MOC',
    functionName: 'approve',
    args: [mocoRushContract.address, mocBalance ?? BigInt(0)],
    onConfirm: () => setTimeout(() => void refetch(), 3000),
  });

  return (
    <div className={cn('flex flex-col space-y-2 w-full h-full')}>
      <span>
        The one who pressed the button last will win the prize. <br />
        Use your ticket to press the button!
      </span>
      <div className={cn('flex flex-row space-x-2 flex-1', className)}>
        <GroupBox label="Press Button" className="flex-1 flex flex-col">
          <span className="mb-2">You have {displayTicketBalance} tickets.</span>
          <div className="flex flex-row w-full space-x-1 mb-2">
            <NumberInput step={0} value={ticketsToUse} onChange={(v) => setTicketsToUse(v)} className="flex-1" />
            <Button onClick={() => setTicketsToUse(displayTicketBalance)}>Max</Button>
          </div>
          <AmountSlider
            value={ticketsToUse}
            max={displayTicketBalance}
            onValueChange={(v) => setTicketsToUse(v)}
            className="mx-2"
          />

          <Button
            size="lg"
            primary
            className="flex-1 font-bold text-3xl mt-4"
            disabled={!address || isPressButtonLoading}
            onClick={() => doPressButton()}
          >
            Press Button!
          </Button>
        </GroupBox>
        <GroupBox label="Buy Ticket" className="flex-1 flex flex-col">
          <span className="mb-2">You have {displayMocBalance} MOC.</span>
          <div className="flex flex-row w-full space-x-1 mb-2">
            <NumberInput value={ticketsToBuy} onChange={(v) => setTicketsToBuy(v)} className="flex-1" />
            <Button onClick={() => setTicketsToBuy(displayMocBalance)}>Max</Button>
          </div>
          <AmountSlider
            value={ticketsToBuy}
            max={displayMocBalance}
            onValueChange={(v) => setTicketsToBuy(v)}
            className="mx-2"
          />

          {isConnected && !mocApproved ? (
            <Button className="w-full mt-4 flex-1" onClick={() => doAllowMoc()} disabled={isAllowMocLoading}>
              Approve MOC
            </Button>
          ) : (
            <Button
              className="w-full mt-4 flex-1"
              onClick={() => doBuyTicket()}
              disabled={!address || isBuyTicketLoading}
            >
              Buy Tickets
            </Button>
          )}
        </GroupBox>
      </div>
    </div>
  );
}
