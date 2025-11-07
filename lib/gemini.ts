import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.4,
    topP: 1,
    topK: 32,
    maxOutputTokens: 2048,
  },
});

// Material density mapping (kg per liter)
export const MATERIAL_DENSITIES: Record<string, number> = {
  mixed_msw: 0.15,          // Mixed Municipal Solid Waste
  plastic: 0.04,             // Plastic bottles, bags
  paper: 0.12,               // Paper, cardboard
  glass: 0.5,                // Glass bottles, jars
  metal: 0.35,               // Metal cans, containers
  organic: 0.6,              // Food waste, garden waste
  textiles: 0.1,             // Cloth, fabric
  e_waste: 0.4,              // Electronic waste
  construction_debris: 0.8,  // Construction waste
  rubber: 0.3,               // Rubber, tyres
  wood: 0.25,                // Wood waste
};

export const MATERIAL_TYPES = [
  "mixed_msw",
  "plastic",
  "paper",
  "glass",
  "metal",
  "organic",
  "textiles",
  "e_waste",
  "construction_debris",
  "rubber",
  "wood",
] as const;

export type MaterialType = typeof MATERIAL_TYPES[number];
