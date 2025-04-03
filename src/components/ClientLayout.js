"use client";

import { WalletContextProvider } from "./WalletProvider";
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  return (
    <WalletContextProvider>
      {children}
      <Toaster position="top-center" />
    </WalletContextProvider>
  );
} 