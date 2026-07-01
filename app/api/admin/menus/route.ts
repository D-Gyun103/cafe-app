import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      menuItems: {
        orderBy: { createdAt: "asc" },
        include: { optionGroups: { include: { choices: true } } },
      },
    },
  });
  return NextResponse.json({ categories });
}

interface OptionChoiceInput {
  name: string;
  extraPrice: number;
}

interface OptionGroupInput {
  name: string;
  type: "single" | "multi";
  required: boolean;
  choices: OptionChoiceInput[];
}

interface CreateMenuInput {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isAvailable: boolean;
  optionGroups: OptionGroupInput[];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateMenuInput | null;

  if (!body?.categoryId || !body?.name || typeof body.basePrice !== "number") {
    return NextResponse.json(
      { error: "카테고리, 메뉴명, 가격은 필수입니다." },
      { status: 400 }
    );
  }

  const menuItem = await prisma.menuItem.create({
    data: {
      categoryId: body.categoryId,
      name: body.name,
      description: body.description || null,
      basePrice: body.basePrice,
      imageUrl: body.imageUrl || null,
      isAvailable: body.isAvailable ?? true,
      optionGroups: {
        create: (body.optionGroups ?? []).map((group) => ({
          name: group.name,
          type: group.type,
          required: group.required,
          choices: { create: group.choices.map((c) => ({ name: c.name, extraPrice: c.extraPrice })) },
        })),
      },
    },
  });

  return NextResponse.json({ menuItem }, { status: 201 });
}
