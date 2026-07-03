import { prisma } from "@/lib/prisma";
import MenuCategoryTabs from "@/components/customer/MenuCategoryTabs";
import CartLink from "@/components/customer/CartLink";

export default async function CustomerMenuListPage() {
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

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
        <span className="text-lg font-semibold text-zinc-900">☕ 카페 메뉴</span>
        <CartLink />
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <MenuCategoryTabs categories={categories} />
      </main>
    </div>
  );
}
