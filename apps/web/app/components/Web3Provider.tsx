'use client';

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { http } from 'wagmi';

const config = getDefaultConfig({
  appName: 'EthShala',
  projectId: 'c03554e26fbbf209dc9bd4f49488e0db', // Replace with your actual WalletConnect project ID from cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
  ssr: true, // Next.js SSR compatibility
  wallets: getDefaultWallets().wallets.map((group) => ({
    ...group,
    wallets: group.wallets.filter((wallet) => wallet.name !== 'MetaMask'),
  })),
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={mounted && resolvedTheme === 'dark' ? darkTheme({
            accentColor: '#10b981',
            accentColorForeground: '#000000',
            borderRadius: 'medium',
          }) : lightTheme({
            accentColor: '#10b981',
            accentColorForeground: '#ffffff',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
