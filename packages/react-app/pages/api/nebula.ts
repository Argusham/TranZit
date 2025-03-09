// nebula.ts
const API_BASE_URL = "https://nebula-api.thirdweb.com";

// Retrieve the Nebula API key from environment variables.
// Ensure your env file defines NEBULA_API_KEY
const SECRET_KEY = process.env.NEBULA_API_KEY as string;
 

// if (!SECRET_KEY) {
//   throw new Error("No Nebula API Key provided");
// }

// We'll store the session ID in module scope for reuse.
let sessionId: string | null = null;

async function apiRequest(
  endpoint: string,
  method: string,
  body: Record<string, any> = {}
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      // SECRET_KEY is guaranteed to be a string now.
      "x-secret-key": SECRET_KEY
    },
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Response Error:", errorText);
    throw new Error(`API Error: ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

export async function createSession(title = "Chat Session"): Promise<string> {
  const response = await apiRequest("/session", "POST", { title });
  sessionId = response.result.id;
  console.log(`Session created: ${sessionId}`);
  return sessionId as string;
}

export async function sendNebulaMessage(message: string, walletAddress?: string ): Promise<string> {
  if (!sessionId) {
    await createSession();
  }
  const requestBody = {
    message,
    session_id: sessionId,
    walletAddress,
    // Context filter: Celo Mainnet (chain id "42220")
    context_filter: { chain_ids: ["42220"],
      contractAdress: ["0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96"]
     },
  };
  console.log("Sending message with request body:", requestBody);
  const response = await apiRequest("/chat", "POST", requestBody);
  console.log("Response", requestBody);
  return response.message;
}

