import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import MenuForm from "@/components/admin/MenuForm";

export default async function AdminMenuCreatePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">새 메뉴 등록</h1>
        <MenuForm categories={categories} />
      </main>
    </div>
  );
}
