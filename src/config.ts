import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: import.meta.env.VITE_ALCHEMY_ID!, // or infuraId
    walletConnectProjectId: import.meta.env.WALLETCONNECT_PROJECT_ID!,

    // Required
    appName: 'Mocorush',
    chains: [sepolia],

    // Optional
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);
