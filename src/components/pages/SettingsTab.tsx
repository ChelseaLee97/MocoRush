import React from 'react';
import { Button, GroupBox } from 'react95';
import { useAccount, useContractRead } from 'wagmi';
import { cn } from '~/lib/utils';
import { useContractWriteWithUi } from '~/hooks/useContractWriteWithUi.ts';
import { useCurrentRound } from '~/hooks/useCurrentRound.ts';
import { useMocoRushContract } from '~/hooks/useMocoRushContract.ts';

export interface SettingsTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SettingsTab({ className }: SettingsTabProps) {
  const { address, isConnected } = useAccount();
  const { data: currentRound } = useCurrentRound();

  const mocoRushContract = useMocoRushContract();
  const { data: ownerAddress } = useContractRead({
    ...mocoRushContract,
    functionName: 'owner',
  });

  const { write: doCloseRound } = useContractWriteWithUi({
    ...mocoRushContract,
    name: 'Close a Round',
    functionName: 'closeRound',
  });

  return (
    <div className={cn('flex flex-col space-y-2 w-full h-full', className)}>
      {ownerAddress && ownerAddress === address && (
        <GroupBox label="Admin Settings" className="py-6 flex flex-col justify-center items-center">
          <Button
            disabled={!currentRound?.endTime || +currentRound.endTime > Date.now()}
            onClick={() => doCloseRound()}
          >
            Close Current Round
          </Button>
        </GroupBox>
      )}
      <GroupBox label="Your Address" className="py-6 flex flex-col justify-center items-center">
        <span className="">{address}</span>
      </GroupBox>
    </div>
  );
}
