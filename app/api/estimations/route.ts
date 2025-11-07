import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch estimations with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const panchayatId = searchParams.get("panchayatId");
    const wardId = searchParams.get("wardId");
    const collectorId = searchParams.get("collectorId");
    const status = searchParams.get("status");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;

    const where: any = {};
    if (panchayatId) where.panchayatId = panchayatId;
    if (wardId) where.wardId = wardId;
    if (collectorId) where.collectorId = collectorId;
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.collectionDate = {};
      if (fromDate) where.collectionDate.gte = new Date(fromDate);
      if (toDate) where.collectionDate.lte = new Date(toDate);
    }

    const estimations = await prisma.wasteEstimation.findMany({
      where,
      include: {
        gramPanchayat: true,
        ward: true,
        collector: true,
      },
      orderBy: { collectionDate: "desc" },
      take: limit,
    });

    // Calculate summary statistics
    const totalWeight = estimations.reduce((sum, e) => sum + e.estimatedWeightKg, 0);
    const totalVolume = estimations.reduce((sum, e) => sum + e.estimatedVolumeLiters, 0);
    const avgConfidence = estimations.length > 0 
      ? estimations.reduce((sum, e) => sum + e.confidence, 0) / estimations.length 
      : 0;

    return NextResponse.json({
      success: true,
      data: estimations,
      summary: {
        count: estimations.length,
        totalWeightKg: parseFloat(totalWeight.toFixed(2)),
        totalVolumeLiters: parseFloat(totalVolume.toFixed(2)),
        avgConfidence: parseFloat(avgConfidence.toFixed(2)),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch estimations", details: error?.message },
      { status: 500 }
    );
  }
}
