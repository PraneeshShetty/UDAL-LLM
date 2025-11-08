import { NextRequest, NextResponse } from "next/server";
import { geminiModel, MATERIAL_DENSITIES } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

// Estimation result from Gemini
interface GeminiEstimation {
  material: string;
  volume_liters_estimate: number;
  volume_confidence: number;
  material_confidence: number;
  fullness_percent: number | null;
  moisture_level: "dry" | "moist" | "wet" | null;
  contamination_level: number | null;
  image_quality: "good" | "medium" | "poor";
  reasoning_short: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract form data
    const imageFile = formData.get("image") as File | null;
    let panchayatId = formData.get("panchayatId") as string;
    let wardId = formData.get("wardId") as string;
    let collectorId = formData.get("collectorId") as string;
    const containerType = (formData.get("containerType") as string) || undefined;
    const containerVolumeLitersStr = formData.get("containerVolumeLiters") as string;
    const containerVolumeLiters = containerVolumeLitersStr ? parseFloat(containerVolumeLitersStr) : undefined;
    const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : undefined;
    const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : undefined;
    const address = (formData.get("address") as string) || undefined;

    // Validate required fields
    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    
    // Use demo mode: fetch first available IDs if not provided
    let panchayat, ward, collector;
    
    if (!panchayatId || panchayatId.trim() === "") {
      // Fetch first panchayat with "Demo" in the name
      panchayat = await prisma.gramPanchayat.findFirst({
        where: { name: { contains: "Demo" } }
      });
      if (!panchayat) {
        // Fallback to any panchayat
        panchayat = await prisma.gramPanchayat.findFirst();
      }
      if (panchayat) {
        panchayatId = panchayat.id;
      }
    } else {
      panchayat = await prisma.gramPanchayat.findUnique({ where: { id: panchayatId } });
    }

    if (!wardId || wardId.trim() === "") {
      // Fetch first ward from the panchayat
      if (panchayat) {
        ward = await prisma.ward.findFirst({
          where: { panchayatId: panchayat.id }
        });
        if (ward) {
          wardId = ward.id;
        }
      }
    } else {
      ward = await prisma.ward.findUnique({ where: { id: wardId } });
    }

    if (!collectorId || collectorId.trim() === "") {
      // Fetch first collector from the panchayat
      if (panchayat) {
        collector = await prisma.collector.findFirst({
          where: { panchayatId: panchayat.id }
        });
        if (collector) {
          collectorId = collector.id;
        }
      }
    } else {
      collector = await prisma.collector.findUnique({ where: { id: collectorId } });
    }

    if (!panchayat || !ward || !collector) {
      return NextResponse.json({ 
        error: "Demo data not found. Please run: npx prisma db seed" 
      }, { status: 400 });
    }

    // Convert image to base64 for Gemini (no file system writes in serverless)
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = imageFile.type || "image/jpeg";
    
    // Generate a unique identifier for this image (without saving to disk)
    const timestamp = Date.now();
    const imageUrl = `data:${mimeType};base64,${base64Image.substring(0, 100)}...`; // Store preview only

    // Create prompt for Gemini
    const prompt = `
You are an expert AI waste analyzer for municipal solid waste management in rural India (Gram Panchayat level).

**Task**: Analyze this waste image and provide accurate estimates for waste management.

**Context**:
${containerType ? `- Container type: ${containerType}` : "- No container specified"}
${containerVolumeLiters ? `- Known container volume: ${containerVolumeLiters} liters` : "- Container volume unknown"}

**Instructions**:
1. Identify the **dominant waste material type** from: mixed_msw, plastic, paper, glass, metal, organic, textiles, e_waste, construction_debris, rubber, wood
2. Estimate the **volume** of visible waste in liters
   - If container volume is provided, estimate fullness percentage and calculate volume
   - If no container, estimate pile/heap volume using visual cues (size relative to surroundings)
3. Assess **moisture level**: dry, moist, or wet
4. Estimate **contamination level** (0.0 to 1.0): how mixed/contaminated is the waste
5. Rate **image quality**: good, medium, or poor
6. Provide brief reasoning for your estimates

**Output Format** (JSON only, no other text):
{
  "material": "one of the allowed material types",
  "volume_liters_estimate": number,
  "volume_confidence": number (0.0-1.0),
  "material_confidence": number (0.0-1.0),
  "fullness_percent": number (0-100) or null,
  "moisture_level": "dry" | "moist" | "wet" | null,
  "contamination_level": number (0.0-1.0) or null,
  "image_quality": "good" | "medium" | "poor",
  "reasoning_short": "brief explanation"
}

**Important**: 
- Be conservative with volume estimates to avoid overestimation
- Consider Indian waste characteristics (more organic waste, mixed waste common)
- Return ONLY valid JSON, no markdown formatting
`.trim();

    // Call Gemini API
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await geminiModel.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    // Parse JSON response (handle potential markdown code blocks)
    let jsonText = responseText;
    if (responseText.startsWith("```")) {
      jsonText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }

    const geminiData: GeminiEstimation = JSON.parse(jsonText);

    // Calculate weight from volume and density
    const materialType = geminiData.material || "mixed_msw";
    const density = MATERIAL_DENSITIES[materialType] || MATERIAL_DENSITIES["mixed_msw"];
    const volumeLiters = geminiData.volume_liters_estimate || 0;
    const weightKg = parseFloat((volumeLiters * density).toFixed(2));

    // Calculate overall confidence
    const imageQualityScore = 
      geminiData.image_quality === "good" ? 1.0 : 
      geminiData.image_quality === "medium" ? 0.6 : 0.3;
    
    const overallConfidence = parseFloat(
      (
        0.5 * (geminiData.material_confidence || 0.5) +
        0.3 * (geminiData.volume_confidence || 0.5) +
        0.2 * imageQualityScore
      ).toFixed(2)
    );

    // Save to database
    const estimation = await prisma.wasteEstimation.create({
      data: {
        panchayatId,
        wardId,
        collectorId,
        imageUrl,
        imageName: imageFile.name,
        imageSize: imageFile.size,
        containerType,
        containerVolumeLiters,
        latitude,
        longitude,
        address,
        estimatedWeightKg: weightKg,
        estimatedVolumeLiters: volumeLiters,
        materialType,
        densityKgPerL: density,
        fullnessPercent: geminiData.fullness_percent,
        moistureLevel: geminiData.moisture_level,
        contaminationLevel: geminiData.contamination_level,
        imageQuality: geminiData.image_quality,
        confidence: overallConfidence,
        aiReasoning: geminiData.reasoning_short,
        status: "PENDING",
      },
      include: {
        gramPanchayat: true,
        ward: true,
        collector: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: estimation,
      geminiRaw: geminiData,
    });

  } catch (error: any) {
    console.error("Waste estimation error:", error);
    
    // Better error messages for debugging
    let errorMessage = "Failed to process waste estimation";
    if (error?.message) {
      if (error.message.includes("DATABASE_URL")) {
        errorMessage = "Database connection error. Please check environment variables.";
      } else if (error.message.includes("Gemini") || error.message.includes("API")) {
        errorMessage = "AI API error. Please check GOOGLE_API_KEY.";
      } else if (error.message.includes("Prisma")) {
        errorMessage = "Database query error. Data might not be seeded.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
