import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import MenuTable from "@/components/admin/MenuTable";

export default async function AdminMenuListPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      menuItems: {
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, basePrice: true, isAvailable: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">메뉴 관리</h1>
          <Link
            href="/admin/menus/create.html"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            + 새 메뉴 등록
          </Link>
        </div>
        <MenuTable categories={categories} />
      </main>
    </div>
  );
}
