// utils/geminiClient.js
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
          text: `
Return ONLY valid minified JSON. No explanation, no markdown.

Schema:
{
  "type": one of [
    "Flooding","Heatwave","Storm","Lightning","Earth Tremor","Landslide",
    "Fire","Structure Collapse","Road Sinkhole","Water Contamination",
    "Air Pollution","Waste Pileup","Animal Attack","Traffic Accident",
    "Stampede","Riot","Chemical Spill","Micro-Drought", "Others", "Not a Disaster"
  ],
  "confidence": number between 0 and 1,
  "severity": "low" | "medium" | "high",
  "reason": string
}

Rules:
- If not sure, set type="Not a Disaster" with confidence < 0.5.
- Always fill all fields.
- If image is unclear, respond with type="Not a Disaster" and reason="Image unclear".
- If the image shows a dangerous incident but it does not match any category, respond with "type": "Other" and explain the incident in "reason".
`,
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
