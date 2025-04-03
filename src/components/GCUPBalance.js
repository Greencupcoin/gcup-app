"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function GCUPBalance() {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!publicKey) {
                setBalance(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:5001/api/balance/${publicKey.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch balance');
                const data = await response.json();
                setBalance(data.balance);
            } catch (err) {
                setError(err.message);
                console.error("❌ Error fetching GCUP balance:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [publicKey]);

    if (!publicKey) return null;

    return (
        <div className="bg-[#1a1a2f] p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">GCUP Balance</h3>
            {loading ? (
                <p className="text-gray-400">Loading balance...</p>
            ) : error ? (
                <p className="text-red-400">Error: {error}</p>
            ) : (
                <p className="text-2xl font-bold text-green-400">
                    {balance !== null ? `${balance.toFixed(2)} GCUP` : 'N/A'}
                </p>
            )}
        </div>
    );
}

