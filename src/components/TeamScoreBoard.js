"use client";
import { useEffect, useState } from "react";

export default function TeamScoreBoard() {
  const [team, setTeam] = useState([]);
  const [scores, setScores] = useState({
    birdies: 0,
    eagles: 0,
    bogeys: 0,
    doubles: 0,
  });

  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem("gcup_selected_team") || "[]");
    setTeam(savedTeam);

    const fetchScores = async () => {
      try {
        const res = await fetch("https://gcup-backend.onrender.com/parsed-scores");
        const data = await res.json();

        const playerNames = savedTeam.map(p => p.name);
        const teamEvents = data.filter(entry => playerNames.includes(entry.player));

        const tally = {
          birdies: 0,
          eagles: 0,
          bogeys: 0,
          doubles: 0,
        };

        for (const entry of teamEvents) {
          for (const event of entry.scoring_events) {
            if (event === "Birdie") tally.birdies++;
            if (event === "Eagle") tally.eagles++;
            if (event === "Bogey") tally.bogeys++;
            if (event === "Double Bogey") tally.doubles++;
          }
        }

        setScores(tally);
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (team.length !== 5) return null;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-md mb-6 border border-green-400">
      <h2 className="text-lg font-semibold mb-2">Your Team:</h2>
      <p className="mb-4 text-sm text-green-300">
        {team.map(p => p.name).join(" • ")}
      </p>
      <div className="flex gap-6 text-sm">
        <span>🐦 Birdies: <strong>{scores.birdies}</strong></span>
        <span>🦅 Eagles: <strong>{scores.eagles}</strong></span>
        <span>⛏ Bogeys: <strong>{scores.bogeys}</strong></span>
        <span>💀 Doubles: <strong>{scores.doubles}</strong></span>
      </div>
    </div>
  );
}
