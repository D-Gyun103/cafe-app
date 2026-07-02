import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
