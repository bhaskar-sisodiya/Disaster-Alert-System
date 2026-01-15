// scripts/testGemini.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-flash-latest", // correct model name
      contents: [{ role: "user", parts: [{ text: "Hello Gemini!" }] }],
    });

    // Safely extract text from the first candidate
    const text = result.candidates[0]?.content?.parts[0]?.text;

    console.log("Gemini response:", text);

  } catch (err) {
    console.error("Gemini API error:", err.message);
  }
}

test();