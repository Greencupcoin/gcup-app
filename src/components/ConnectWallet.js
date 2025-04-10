"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWallet() {
  const { publicKey, connected, connecting } = useWallet();

  return (
    <div className="p-4">
      <WalletMultiButton />
      {connecting && <p>Connecting to wallet...</p>}
      {connected && publicKey && <p>Connected: {publicKey.toBase58()}</p>}
    </div>
  );
}