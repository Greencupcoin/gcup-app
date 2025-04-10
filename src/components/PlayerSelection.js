"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useWallet } from "@solana/wallet-adapter-react";

const PlayerSelection = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gcupBalance, setGcupBalance] = useState(null);

  const { publicKey, connected, connecting } = useWallet();

  useEffect(() => {
    fetchPlayers();
    const savedTeam = localStorage.getItem("gcup_selected_team");
    if (savedTeam) {
      setSelectedPlayers(JSON.parse(savedTeam));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gcup_selected_team", JSON.stringify(selectedPlayers));
  }, [selectedPlayers]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) return;
      try {
        const response = await fetch(`https://gcup-backend.onrender.com/api/balance/${publicKey.toString()}`);
        const data = await response.json();
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

  const fetchPlayers = async () => {
    try {
      const response = await fetch('https://gcup-backend.onrender.com/api/golf-field');
      const data = await response.json();
      setPlayers(data.players);
      setTournament(data.tournament);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch players');
      setLoading(false);
    }
  };

  const togglePlayerSelection = (player) => {
    setSelectedPlayers((prev) => {
      if (prev.find((p) => p.player_id === player.player_id)) {
        return prev.filter((p) => p.player_id !== player.player_id);
      } else if (prev.length < 5) {
        return [...prev, player];
      }
      return prev;
    });
  };

  const handleSubmitTeam = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to submit a team");
      return;
    }

    const wallet_address = publicKey.toString();
    localStorage.setItem("gcup_wallet_address", wallet_address);

    try {
      const res = await fetch("https://gcup-backend.onrender.com/api/submit-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address,
          players: selectedPlayers,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit team");
      }

      const data = await res.json();
      alert(data.message || "Team submitted successfully.");
    } catch (error) {
      console.error("Error submitting team:", error);
      alert(error.message || "Failed to submit team. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-4 text-white">Loading players...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-[#0c0c1b] min-h-screen text-white">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-purple-300">Select Your Team</h1>
        {connected && publicKey && (
          <div className="bg-[#1a1a2f] px-4 py-2 rounded-lg text-green-400 font-semibold">
            GCUP Balance: {gcupBalance !== null ? gcupBalance.toFixed(2) : "Loading..."}
          </div>
        )}
      </div>

      {tournament && (
        <div className="mb-6 p-4 bg-[#1a1a2f] rounded-lg shadow text-white">
          <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
          <p className="text-gray-400">{tournament.course}</p>
          <p className="text-gray-400">{tournament.location}</p>
          <p className="text-gray-400">Start Date: {tournament.start_date}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-purple-300">
          Selected Players ({selectedPlayers.length}/5)
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedPlayers.map((player) => (
            <div
              key={player.player_id}
              className="flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full"
            >
              <span>{player.name}</span>
              <button
                onClick={() => togglePlayerSelection(player)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            selectedPlayers.length === 5 && connected
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={selectedPlayers.length !== 5 || !connected}
          onClick={handleSubmitTeam}
        >
          {!connected ? "Connect Wallet to Submit" : "Submit My Team"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-[#0c0c1b] shadow-sm">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#1a1a2f] text-purple-300 font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 font-semibold">#</th>
              <th className="p-3 font-semibold">Player</th>
              <th className="p-3 font-semibold">World Rank</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const isSelected = selectedPlayers.some(
                (p) => p.player_id === player.player_id
              );
              return (
                <tr
                  key={player.player_id}
                  onClick={() => togglePlayerSelection(player)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-900/20 border-l-4 border-purple-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  <td className="p-3 text-gray-500">{index + 1}</td>
                  <td className="p-3 flex items-center gap-2">
                    <div className="w-5 h-4 relative">
                      <Image
                        src={`https://flagcdn.com/24x18/${player.country_code.toLowerCase()}.png`}
                        alt={`${player.name} flag`}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </td>
                  <td className="p-3 text-purple-300">#{player.rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerSelection;

