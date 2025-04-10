'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  {
    ssr: false,
    loading: () => <button className="wallet-adapter-button">Loading Wallet...</button>,
  }
);

export default function WalletButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <WalletMultiButton /> : null;
}
