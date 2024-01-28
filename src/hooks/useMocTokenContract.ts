import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Address } from 'viem';
import { erc20ABI, useChainId } from 'wagmi';
import { NULL_ADDRESS } from '~/lib/utils';
import { unsupportedChainAtom } from '~/atoms/unsupportedChain';

const addressByChainId: { [chainId: number]: Address } = {
  31337: (import.meta.env.VITE_MOC_ADDRESS_LOCAL as Address) ?? NULL_ADDRESS, // local hardhat
  11155111: (import.meta.env.VITE_MOC_ADDRESS_SEPOLIA as Address) ?? '0x2da021bd370019f6ed6f447698f78e989ba2dd37', // sepolia
};

export const useMocTokenContract = () => {
  const chainId = useChainId();

  const setUnsupportedChain = useSetAtom(unsupportedChainAtom);
  useEffect(() => setUnsupportedChain(!addressByChainId[chainId]), [chainId]);

  return {
    address: addressByChainId[chainId] ?? NULL_ADDRESS,
    abi: erc20ABI,
  };
};
