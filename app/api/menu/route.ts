import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      menuItems: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          basePrice: true,
          imageUrl: true,
          isAvailable: true,
        },
      },
    },
  });
  return NextResponse.json({ categories });
}
