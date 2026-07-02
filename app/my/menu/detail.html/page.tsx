import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import OptionSelector from "@/components/customer/OptionSelector";

export default async function CustomerMenuDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const menuItem = id
    ? await prisma.menuItem.findUnique({
        where: { id },
        include: { optionGroups: { include: { choices: true } } },
      })
    : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <Link href="/my/menu/list.html" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← 메뉴 목록
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">
        {!menuItem ? (
          <p className="text-sm text-red-600">해당 메뉴를 찾을 수 없습니다.</p>
        ) : (
          <div>
            <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
              {menuItem.imageUrl ? (
                <Image src={menuItem.imageUrl} alt={menuItem.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">☕</div>
              )}
              {!menuItem.isAvailable && (
                <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white">
                  품절
                </span>
              )}
            </div>

            <h1 className="text-xl font-semibold text-zinc-900">{menuItem.name}</h1>
            {menuItem.description && (
              <p className="mt-1 text-sm text-zinc-500">{menuItem.description}</p>
            )}
            <p className="mt-2 text-base font-medium text-zinc-900">
              {menuItem.basePrice.toLocaleString()}원
            </p>

            {!menuItem.isAvailable ? (
              <p className="mt-6 rounded bg-zinc-100 px-4 py-3 text-sm text-zinc-500">
                현재 품절된 메뉴입니다.
              </p>
            ) : (
              <div className="mt-6">
                <OptionSelector basePrice={menuItem.basePrice} optionGroups={menuItem.optionGroups} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
