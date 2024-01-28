import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Address } from 'viem';
import { useChainId, useContractRead } from 'wagmi';
import { unsupportedChainAtom } from '~/atoms/unsupportedChain';
import { mocoRushAbi } from '~/contracts.types';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

const addressByChainId: { [chainId: number]: Address } = {
  31337: (process.env.MOCORUSH_ADDRESS_LOCAL as Address) ?? NULL_ADDRESS, // local hardhat
  11155111: (process.env.MOCORUSH_ADDRESS_SEPOLIA as Address) ?? '0x2da021bd370019f6ed6f447698f78e989ba2dd37', // sepolia
};

export interface MocoRushContractInfo {
  address: Address;
  abi: typeof mocoRushAbi;
}

export const useMocoRushContract = (): MocoRushContractInfo => {
  const chainId = useChainId();

  const setUnsupportedChain = useSetAtom(unsupportedChainAtom);
  useEffect(() => setUnsupportedChain(!addressByChainId[chainId]), [chainId]);

  return {
    address: addressByChainId[chainId] ?? NULL_ADDRESS,
    abi: mocoRushAbi,
  };
};
