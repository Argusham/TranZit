import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "https://nebula-api.thirdweb.com";
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

if (!SECRET_KEY) {
  console.error("❌ Missing Thirdweb Secret Key!");
  throw new Error("THIRDWEB_SECRET_KEY is not defined in the environment.");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, walletAddress } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const requestBody = {
      model: "t0", // ✅ Use the correct Nebula model ID
      messages: [{ role: "user", content: message }],
      context: {
        wallet_address: walletAddress || null,
        chain_ids: ["42220"], // ✅ Celo Mainnet
        contract_addresses: ["0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96"],
      },
      stream: false, // ✅ Ensure full response
    };

    console.log("📡 Sending request to Nebula:", requestBody); // ✅ Debugging output

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Key": SECRET_KEY!,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 Nebula API Response Error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("✅ Nebula API Response:", data);

    return res.status(200).json({
      response: data.choices?.[0]?.message?.content || "No response from Nebula.",
    });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    return res.status(500).json({ error: "Something went wrong with Nebula API." });
  }
}
