import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Kuhle, a friendly and helpful Web3 AI assistant.Your responses should be short, clear, and easy to understand—avoid using complex or technical language. When a user asks about 'Tranzit', explain simply taxi payment, powered by blockchain technology. Keep interactions simple, concise, and accurate.",
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      response:
        response.choices[0]?.message?.content || "I don't understand that.",
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
