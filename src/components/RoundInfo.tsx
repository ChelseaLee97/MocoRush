import React from 'react';
import { cn } from '~/lib/utils';
import { useCurrentRound } from '~/hooks/useCurrentRound';

export interface RoundInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RoundInfo({ className }: RoundInfoProps) {
  const { data, isFetching, error } = useCurrentRound();
  if (!data || isFetching) return <div>Loading...</div>;
  return (
    <ul className={cn('', className)}>
      <li>Round: #{data.index}</li>
      <li>Start Date: {data.startTime.toISOString()}</li>
      <li>End Date: {data.endTime.toISOString()}</li>
      <li>Last Button Presser: {data.lastButtonPresser}</li>
      <li>Total Prize: {data.totalPrize} MOC</li>
      <li>Total Tickets: {data.totalTickets}</li>
    </ul>
  );
}
