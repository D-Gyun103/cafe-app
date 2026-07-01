"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-zinc-900">☕ 카페 관리자</span>
        <Link href="/admin/menus/list.html" className="text-sm text-zinc-600 hover:text-zinc-900">
          메뉴 관리
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
      >
        로그아웃
      </button>
    </header>
  );
}
