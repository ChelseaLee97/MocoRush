import React from 'react';
import { Frame } from 'react95';
import { cn } from '~/lib/utils';
import { TransparentPattern } from '~/components/TransparentPattern';
import { useCountdown } from '~/hooks/useCountdown.ts';
import { useCurrentRound } from '~/hooks/useCurrentRound';

const whiteShadow = { textShadow: 'white 2px 2px' };

export interface CurrentRoundInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CurrentRoundInfo({ className }: CurrentRoundInfoProps) {
  const { data, isFetching, error } = useCurrentRound();
  const { days, hours, minutes, seconds, done } = useCountdown(data?.endTime ?? new Date());

  return (
    <div className={cn('w-full flex flex-col', className)}>
      <Frame variant="field" className="mb-4">
        <TransparentPattern className="min-h-[120px] flex flex-col justify-center items-center py-6">
          {error && <div className="text-red-500">{error.message}</div>}
          {isFetching && !data ? (
            <span className="text-black text-xl font-bold">Fetching...</span>
          ) : (
            data && (
              <>
                <h3 className="text-xl font-bold mb-2">Round #{data.index}</h3>
                <h1 className="text-5xl font-bold text-black" style={{ ...whiteShadow }}>
                  {days}d {hours}h {minutes}m {seconds}s
                </h1>
                <Frame variant="button" className="mt-4 py-3 px-6">
                  <span className="text-2xl font-bold text-black">
                    Total Prize: {data ? `${data.totalPrize} MOC` : '- MOC'}
                  </span>
                </Frame>
              </>
            )
          )}
        </TransparentPattern>
      </Frame>
    </div>
  );
}
