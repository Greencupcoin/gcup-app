"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { submitTeam } from "../utils/api";
import PlayerTable from "../components/PlayerTable";
import TeamScoreBoard from "../components/TeamScoreBoard"; // ✅ NEW
import { Jura } from "next/font/google";

const jura = Jura({ subsets: ["latin"] });

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [gcupBalance, setGcupBalance] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    } else {
      setWalletAddress("");
    }
  }, [connected, publicKey]);

  useEffect(() => {
    const saved = localStorage.getItem("gcup_selected_team");
    if (saved) {
      try {
        setSelectedPlayers(JSON.parse(saved));
      } catch (err) {
        console.warn("Failed to parse saved team:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gcup_selected_team", JSON.stringify(selectedPlayers));
  }, [selectedPlayers]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) return;
      try {
        const res = await fetch(`https://gcup-backend.onrender.com/api/balance/${publicKey.toString()}`);
        const data = await res.json();
        setGcupBalance(data.balance);
      } catch (err) {
        console.error("❌ Error fetching GCUP balance:", err);
        setGcupBalance(null);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [publicKey, connected]);

  const handleSubmitTeam = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (selectedPlayers.length !== 5) {
      toast.error("Please select exactly 5 players");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTeam({
        wallet_address: publicKey.toString(),
        players: selectedPlayers,
      });

      toast.success("Team submitted successfully! 500 GCUP tokens will be sent to your wallet.");
      setSelectedPlayers([]);
    } catch (error) {
      console.error("Error submitting team:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit team";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 gap-6">
          {/* Left: Logo + Title + Tagline */}
          <div>
            <div className="flex items-center gap-3">
              <Image src="/gcup.png" alt="GCUP Logo" width={40} height={40} />
              <h1 className={`${jura.className} text-4xl font-bold text-white uppercase`}>
                GREEN CUP
              </h1>
            </div>
            <p className="text-gray-400 mt-2 ml-[44px]">
              Turn Great Shots into Crypto scores
            </p>
          </div>

          {/* Right: Wallet + Balance */}
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            <WalletMultiButton className="!bg-[#1a1a2f] !rounded-lg !px-6 !py-2 !text-white !font-semibold w-full sm:w-auto" />

            {connected && publicKey && (
              <div className="flex items-center gap-3 bg-[#1a1a2f] text-white font-semibold px-6 py-2 rounded-lg w-full sm:w-auto justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/gcup.png" alt="GCUP Icon" width={20} height={20} />
                  <span>$GCUP balance</span>
                </div>
                <span className="text-green-400 text-sm">
                  {gcupBalance !== null ? `${gcupBalance.toFixed(2)} GCUP` : "Loading..."}
                </span>
              </div>
            )}

            {connected && (
              <div className="text-xs text-gray-400">
                Connected: {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Submit Button + Player Table */}
        <div className="mt-10 flex flex-col gap-4">
          {/* ✅ Team Scoreboard */}
          <TeamScoreBoard />

          {/* Submit Button (Always visible) */}
          <div className="flex justify-start">
            <button
              onClick={handleSubmitTeam}
              disabled={isSubmitting || !connected || selectedPlayers.length !== 5}
              className={`!rounded-lg !px-6 !py-2 !text-white !font-semibold transition w-full sm:w-auto ${
                isSubmitting || !connected || selectedPlayers.length !== 5
                  ? "!bg-gray-700 opacity-50 cursor-not-allowed"
                  : "!bg-[#1a1a2f] hover:bg-green-600 border border-green-400"
              }`}
            >
              {!connected ? "Connect Wallet to Submit" : isSubmitting ? "Submitting..." : "Submit Team"}
            </button>
          </div>

          {/* Player Table */}
          <PlayerTable
            selectedPlayers={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
            onSubmit={handleSubmitTeam}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
