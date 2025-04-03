// Use your LAN IP for mobile device compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.14:5001";
const GCUP_MINT_ADDRESS = "Bs7k2iTXZLST6JcJr91g2wGjEKm1LwG7L6Kbggkcvxk";

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
  try {
    const res = await fetch(`${API_BASE_URL}/api/submit-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: wallet_address,
        players,
        mint_address: GCUP_MINT_ADDRESS,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
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


