// Use your live backend as the default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://gcup-backend.onrender.com";

/**
 * Fetches the golf tournament field and metadata.
 */
export async function fetchGolfField() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/golf-field`);
    if (!res.ok) {
      throw new Error(`Failed to fetch golf field: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    throw new Error(`Network error while fetching golf field: ${error.message}`);
  }
}

/**
 * Submits a selected team to the backend for processing GCUP rewards.
 */
export async function submitTeam({ wallet_address, players }) {
  console.log("📦 Submitting to backend:", {
    wallet_address,
    players,
    playerCount: players?.length || 0,
    playerKeys: players?.[0] ? Object.keys(players[0]) : [],
  });

  try {
    const res = await fetch(`${API_BASE_URL}/api/submit-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address,
        players,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Backend responded with:", errorData);
      throw {
        response: {
          data: errorData,
          status: res.status,
          statusText: res.statusText,
        },
      };
    }

    return res.json();
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw new Error(`Network error while submitting team: ${error.message}`);
  }
}
