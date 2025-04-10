"use client";

import { useState, useEffect } from "react";
import { WalletContextProvider } from "./WalletProvider";
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Any initialization code here
    } catch (err) {
      console.error("Error initializing wallet:", err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Initializing Wallet</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <WalletContextProvider>
      {children}
      <Toaster position="top-center" />
    </WalletContextProvider>
  );
}