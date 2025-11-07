import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all Gram Panchayats (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");

    const panchayats = await prisma.gramPanchayat.findMany({
      where: blockId ? { blockId } : undefined,
      include: {
        block: {
          include: {
            zillaPanchayat: true,
          },
        },
        wards: true,
        _count: {
          select: {
            estimations: true,
            collectors: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: panchayats });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch Gram Panchayats", details: error?.message },
      { status: 500 }
    );
  }
}

// POST: Create new Gram Panchayat
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, blockId, population, area } = body;

    if (!name || !code || !blockId) {
      return NextResponse.json(
        { error: "Name, code, and blockId are required" },
        { status: 400 }
      );
    }

    const panchayat = await prisma.gramPanchayat.create({
      data: {
        name,
        code,
        blockId,
        population: population ? parseInt(population) : null,
        area: area ? parseFloat(area) : null,
      },
      include: {
        block: {
          include: {
            zillaPanchayat: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: panchayat });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create Gram Panchayat", details: error?.message },
      { status: 500 }
    );
  }
}
