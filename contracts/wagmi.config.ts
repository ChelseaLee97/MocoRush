import { defineConfig } from '@wagmi/cli';
import { abi as MocoRushABI } from './artifacts/solidity/MocoRush.sol/MocoRush.json';
import { Abi } from 'viem';

export default defineConfig({
  out: '../src/contracts.types.ts',
  contracts: [{ name: 'MocoRush', abi: MocoRushABI as Abi }],
  plugins: [],
});
