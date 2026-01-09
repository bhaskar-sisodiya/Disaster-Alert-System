// geminiClient.js
// Dependencies: npm install @google/genai mime

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Disaster detection function
export async function detectDisaster(imageBase64, mimeType = "image/jpeg") {
  try {
    const config = {
      thinkingConfig: { thinkingBudget: 0 }, // disable deep reasoning for speed
      systemInstruction: [
        {
          text: `{
    type: <name of micro-disaster: "Flooding", "Heatwave", "Storm", "Lightning", "Earth Tremor", "Landslide", "Residential Fire", "Industrial Fire", "Market Fire", "Vehicle Fire", "Power Outage", "Gas Leak", "Building Collapse", "Bridge Failure", "Road Sinkhole", "Water Contamination", "Disease Outbreak", "Air Pollution", "Waste Pileup", "Animal Attack", "Traffic Accident", "Stampede", "Riot", "Cyber Fraud", "Chemical Spill", "Noise Pollution", "Micro‑Drought", "Not a Disaster">,
    confidence: <value between 0 and 1 (both inclusive)>,
    severity: <low|medium|high>,
    reason: <reason of the micro-disaster>
}`,
        },
      ],
    };

    const model = "gemini-flash-latest";

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType, // e.g. "image/jpeg", "image/png", "image/webp"
            },
          },
        ],
      },
    ];

    // Non-streaming response from Gemini
    const result = await ai.models.generateContent({ model, config, contents });

    const raw = result.candidates[0]?.content?.parts[0]?.text;

    let detection;
    try {
      detection = JSON.parse(raw);
    } catch {
      detection = { raw };
    }

    return detection;
  } catch (error) {
    // Handle quota exceeded (429) gracefully
    if (error.code === 429 || error.status === "RESOURCE_EXHAUSTED") {
      return {
        error: "QUOTA_EXCEEDED",
        message:
          "Gemini API quota exceeded. Please wait for reset or upgrade your plan.",
      };
    }

    // Handle other API errors
    console.error("Gemini API error:", error);
    return {
      error: "API_ERROR",
      message: error.message || "Unknown Gemini API error",
    };
  }
}
