// utils/groqClient.js
// Dependencies: npm install groq-sdk dotenv

import dotenv from "dotenv";
import { Groq } from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Disaster detection function using Groq (Llama 4 Maverick)
 * @param {string} imageBase64 - base64 string WITHOUT data:image/... prefix (recommended)
 * @param {string} mimeType - "image/jpeg" | "image/png" | "image/webp"
 */
export async function detectDisaster(imageBase64, mimeType = "image/jpeg") {
  try {
    const systemPrompt = `
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
- If the image shows a dangerous incident but it does not match any category, respond with "type": "Others" and explain the incident in "reason".
`.trim();

    const model = "meta-llama/llama-4-maverick-17b-128e-instruct";

    // Convert base64 -> data URL (Groq accepts image_url in messages)
    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    // NON-streaming (since you need JSON parsing)
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      top_p: 1,
      max_completion_tokens: 512,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },

        // multimodal user input
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Detect the disaster shown in this image and respond strictly in the required JSON schema.",
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let detection;
    try {
      detection = JSON.parse(cleaned);
    } catch {
      detection = { raw }; // fallback if invalid JSON
    }

    return detection;
  } catch (error) {
    // Rate limit / quota style handling
    const status = error?.status || error?.response?.status;
    const code = error?.code;

    if (status === 429 || code === 429) {
      return {
        error: "QUOTA_EXCEEDED",
        message:
          "Groq API rate limit/quota exceeded. Please wait and retry or upgrade your plan.",
      };
    }

    console.error("Groq API error:", error);

    return {
      error: "API_ERROR",
      message: error?.message || "Unknown Groq API error",
    };
  }
}
