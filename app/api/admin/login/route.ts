import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = body?.username?.trim();
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !valid) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const session = await getAdminSession();
  session.adminId = admin.id;
  session.username = admin.username;
  await session.save();

  return NextResponse.json({ ok: true });
}
