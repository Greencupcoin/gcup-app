'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletButton = dynamic(
  () => Promise.resolve(WalletMultiButton),
  { 
    ssr: false,
    loading: () => <button className="wallet-adapter-button">Loading...</button>
  }
);

export default WalletButton;