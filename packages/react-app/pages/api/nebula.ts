// import { NextApiRequest, NextApiResponse } from "next";
// import dotenv from "dotenv";

// dotenv.config();

// const API_BASE_URL = "https://nebula-api.thirdweb.com";
// const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
// if (!SECRET_KEY) {
//   console.error("Missing Thirdweb Secret Key!");
//   throw new Error("THIRDWEB_SECRET_KEY is not defined in the environment.");
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { message, walletAddress } = req.body;

//   if (!message || message.trim().length === 0) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const requestBody = {
//       model: "t0", //  Use the correct Nebula model ID
//       messages: [{ role: "user", content: message }],
//       context: {
//         wallet_address: walletAddress || null,
//         chain_ids: "42220", 
//         contract_addresses: "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96",
//       },
//       stream: false, //  Ensure full response
//     };

//     console.log(" Sending request to Nebula:", requestBody); // Debugging output

//     const response = await fetch(`${API_BASE_URL}/chat/completions`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Secret-Key": SECRET_KEY!,
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Nebula API Response Error:", errorText);
//       return res.status(response.status).json({ error: errorText });
//     }

//     const data = await response.json();
//     console.log("Nebula API Response:", data);

//     return res.status(200).json({
//       response: data.choices?.[0]?.message?.content || "No response from Nebula.",
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ error: "Something went wrong with Nebula API." });
//   }
// }


import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Nebula API Config
const API_BASE_URL = "https://nebula-api.thirdweb.com";
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
if (!SECRET_KEY) {
  console.error("❌ Missing Thirdweb Secret Key!");
  throw new Error("THIRDWEB_SECRET_KEY is not defined in the environment.");
}

// OpenAI API Config
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory session store
const userSessions: Record<string, { openaiHistory: any[]; nebulaSession: string | null }> = {};

// System prompt to strictly enforce Tranzit-related conversations
const SYSTEM_PROMPT = {
  role: "system",
  content: `
  You are Kuhle, an AI assistant for TranZit, a Web3 application for decentralized contactless payments.
  - You **only** answer questions related to TranZit or blockchain/Web3.
  - If a user asks about other topics, politely refuse and say you can only help with TranZit-related queries.
  - Keep responses **short, clear, and beginner-friendly**.
  - If asked, **explain TranZit simply**: "TranZit is a decentralized app (dApp) that enables fast and secure payments between commuters and drivers using the Celo blockchain."
  - If asked about "transactions", "wallets", or "smart contracts", forward the question to Nebula for on-chain insights.
  `,
};

function isWeb3Query(message: string): boolean {
  const web3Keywords = ["wallet", "blockchain", "crypto", "token", "transaction"];
  return web3Keywords.some((keyword) => message.toLowerCase().includes(keyword));
}

async function callNebulaAPI(userId: string, message: string, walletAddress?: string) {
  // If session doesn't exist, create one
  if (!userSessions[userId].nebulaSession) {
    const sessionResponse = await fetch(`${API_BASE_URL}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Secret-Key": SECRET_KEY! },
      body: JSON.stringify({ title: `Chat for ${userId}` }),
    });
    const sessionData = await sessionResponse.json();
    userSessions[userId].nebulaSession = sessionData.result.id;
  }

  // Send the message to Nebula
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Secret-Key": SECRET_KEY! },
    body: JSON.stringify({
      model: "t0",
      messages: [{ role: "user", content: message }],
      session_id: userSessions[userId].nebulaSession,
      context: {
        wallet_address: walletAddress || null,
        chain_ids: ["42220"],
        contract_addresses: ["0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96"],
      },
      stream: false,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from Nebula.";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, walletAddress, userId, resetSession } = req.body;
  if (!message || message.trim().length === 0) return res.status(400).json({ error: "Message is required" });

  if (!userSessions[userId] || resetSession) {
    userSessions[userId] = { openaiHistory: [SYSTEM_PROMPT], nebulaSession: null };
    return res.status(200).json({ response: "Your session has been reset. How can I assist with Tranzit?" });
  }

  try {
    let responseText = "";

    if (isWeb3Query(message)) {
      responseText = await callNebulaAPI(userId, message, walletAddress);
    } else {
      userSessions[userId].openaiHistory.push({ role: "user", content: message });
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: userSessions[userId].openaiHistory,
      });

      responseText = response.choices[0]?.message?.content || "I don't understand that.";
      userSessions[userId].openaiHistory.push({ role: "assistant", content: responseText });
    }

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("🔥 AI Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
}
