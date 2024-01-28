import React, { useMemo } from 'react';
import { Button, GroupBox } from 'react95';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { cn, NULL_ADDRESS } from '~/lib/utils';
import { useContractWriteWithUi } from '~/hooks/useContractWriteWithUi';
import { useMocoRushContract } from '~/hooks/useMocoRushContract';

export interface RewardTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RewardTab({ className }: RewardTabProps) {
  const { address, isConnected } = useAccount();
  const mocoRushContract = useMocoRushContract();
  const { data: rewardBalance, refetch } = useContractRead({
    ...mocoRushContract,
    functionName: 'claimableRewardOf',
    args: [address ?? NULL_ADDRESS],
    enabled: !!address && isConnected,
  });

  const { write: doClaimReward, isLoading: isClaimRewardLoading } = useContractWriteWithUi({
    ...mocoRushContract,
    name: 'Claim Reward',
    functionName: 'claimReward',
    onConfirm: () => setTimeout(() => void refetch(), 3000),
  });

  const displayRewardBalance = useMemo(() => {
    return rewardBalance ? Number(rewardBalance / BigInt(1e18)) : 0;
  }, [rewardBalance]);

  return (
    <div className={cn('flex flex-col space-y-2 w-full h-full', className)}>
      <GroupBox label="Your Claimable Reward" className="py-6 flex flex-col justify-center items-center">
        <span className="text-black text-2xl font-bold">{displayRewardBalance} MOC</span>
      </GroupBox>
      <Button primary={displayRewardBalance > 0} disabled={displayRewardBalance === 0} onClick={() => doClaimReward}>
        Claim Reward
      </Button>
    </div>
  );
}
