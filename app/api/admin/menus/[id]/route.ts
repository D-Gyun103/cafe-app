import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

interface UpdateMenuInput {
  categoryId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  optionGroups?: OptionGroupInput[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: { optionGroups: { include: { choices: true } } },
  });

  if (!menuItem) {
    return NextResponse.json({ error: "메뉴를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ menuItem });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as UpdateMenuInput | null;

  if (!body) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "메뉴를 찾을 수 없습니다." }, { status: 404 });
  }

  if (body.optionGroups) {
    await prisma.optionGroup.deleteMany({ where: { menuItemId: id } });
  }

  const menuItem = await prisma.menuItem.update({
    where: { id },
    data: {
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      imageUrl: body.imageUrl,
      isAvailable: body.isAvailable,
      ...(body.optionGroups
        ? {
            optionGroups: {
              create: body.optionGroups.map((group) => ({
                name: group.name,
                type: group.type,
                required: group.required,
                choices: {
                  create: group.choices.map((c) => ({ name: c.name, extraPrice: c.extraPrice })),
                },
              })),
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ menuItem });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { isAvailable?: boolean } | null;

  if (typeof body?.isAvailable !== "boolean") {
    return NextResponse.json({ error: "isAvailable 값이 필요합니다." }, { status: 400 });
  }

  const menuItem = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: body.isAvailable },
  });

  return NextResponse.json({ menuItem });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "이미 주문에 사용된 메뉴는 삭제할 수 없습니다. 판매중지를 이용해주세요." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
