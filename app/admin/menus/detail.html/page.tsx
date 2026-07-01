import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import MenuForm from "@/components/admin/MenuForm";

export default async function AdminMenuDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const [categories, menuItem] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    id
      ? prisma.menuItem.findUnique({
          where: { id },
          include: { optionGroups: { include: { choices: true } } },
        })
      : null,
  ]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">메뉴 상세/수정</h1>
        {!menuItem ? (
          <p className="text-sm text-red-600">해당 메뉴를 찾을 수 없습니다.</p>
        ) : (
          <MenuForm
            categories={categories}
            initialData={{
              id: menuItem.id,
              categoryId: menuItem.categoryId,
              name: menuItem.name,
              description: menuItem.description,
              basePrice: menuItem.basePrice,
              imageUrl: menuItem.imageUrl,
              isAvailable: menuItem.isAvailable,
              optionGroups: menuItem.optionGroups.map((g) => ({
                name: g.name,
                type: g.type as "single" | "multi",
                required: g.required,
                choices: g.choices.map((c) => ({ name: c.name, extraPrice: c.extraPrice })),
              })),
            }}
          />
        )}
      </main>
    </div>
  );
}
