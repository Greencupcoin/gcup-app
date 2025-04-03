"use client";

import { useEffect, useState } from "react";
import { fetchGolfField } from "../utils/api";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const GCUP_MINT = new PublicKey('Bs7k2iTXZLST6JcJr91g2wGjEKm1LwG7L6Kbggkcvxk');

export default function PlayerTable({ selectedPlayers, setSelectedPlayers, onSubmit, isSubmitting }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [players, setPlayers] = useState([]);
  const [scoreLog, setScoreLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSubmittedTeam, setHasSubmittedTeam] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    loadGolfData();
  }, []);

  useEffect(() => {
    if (!hasSubmittedTeam) return;
    const interval = setInterval(() => {
      fetchScoring();
    }, 60000);
    return () => clearInterval(interval);
  }, [hasSubmittedTeam]);

  const loadGolfData = async () => {
    try {
      setLoading(true);
      const data = await fetchGolfField();

      if (!data.players || !Array.isArray(data.players)) {
        throw new Error("Invalid data.players format");
      }

      setPlayers(data.players);
      setError(null);
    } catch (err) {
      console.error("\u274c Error fetching golf field:", err.message);
      setError("Failed to load players. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchScoring = async () => {
    try {
      const res = await fetch("http://localhost:5001/parsed-scores");
      const data = await res.json();

      const logs = [];

      selectedPlayers.forEach((player) => {
        const result = data.find(
          (entry) => entry.player.toLowerCase() === player.name.toLowerCase()
        );

        if (result && result.scoring_events) {
          result.scoring_events.forEach((event) => {
            let value = 0;
            if (event === "Birdie") value = 10;
            else if (event === "Eagle") value = 50;
            else if (event === "Hole-in-One" || event === "Hole in One") value = 500;
            else if (event === "Bogey") value = -10;
            else if (event === "Double Bogey" || event === "Worse Than Double Bogey") value = -20;

            logs.push({
              player: player.name,
              event,
              value,
              timestamp: new Date().toISOString(),
            });
          });
        }
      });

      setScoreLog(logs);
    } catch (err) {
      console.error("Error fetching scoring:", err);
    }
  };

  const handleSelect = (player) => {
    if (selectedPlayers.length >= 5 && !selectedPlayers.find(p => p.player_id === player.player_id)) return;

    setSelectedPlayers(prev => {
      const exists = prev.find(p => p.player_id === player.player_id);
      return exists ? prev.filter(p => p.player_id !== player.player_id) : [...prev, player];
    });
  };

  const handleSubmit = async () => {
    try {
      await onSubmit();
      setHasSubmittedTeam(true);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error submitting team:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end text-sm text-gray-400 pr-4">
        Selected: {selectedPlayers.length}/5
      </div>

      {showSuccessMessage && (
        <div className="text-center text-green-400 text-lg font-semibold mb-4 bg-green-400/10 p-4 rounded-lg">
          Team submitted successfully! 500 GCUP tokens have been added to your balance.
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading players...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {players.map((player) => (
            <div
              key={player.player_id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedPlayers.find(p => p.player_id === player.player_id)
                  ? 'border-green-400 bg-green-400/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => handleSelect(player)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/24x18/${player.country_code?.toLowerCase()}.png`}
                  alt={player.country}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <h3 className="font-semibold text-base sm:text-lg">{player.name}</h3>
              </div>
              <p className="text-sm text-gray-400">{player.team}</p>
            </div>
          ))}
        </div>
      )}

      {hasSubmittedTeam && scoreLog.length > 0 && (
        <div className="bg-[#1a1a2f] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Live GCUP Scoring</h3>
          <div className="space-y-2">
            {scoreLog.map((log, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{log.player}: {log.event}</span>
                <span className={log.value > 0 ? "text-green-400" : "text-red-400"}>
                  {log.value > 0 ? '+' : ''}{log.value} GCUP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
