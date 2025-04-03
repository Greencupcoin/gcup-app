"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWallet() {
  const { publicKey } = useWallet();

  return (
    <div className="p-4">
      <WalletMultiButton />
      {publicKey && <p>Connected: {publicKey.toBase58()}</p>}
    </div>
  );
}
