"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuItemRow {
  id: string;
  name: string;
  basePrice: number;
  isAvailable: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  menuItems: MenuItemRow[];
}

export default function MenuTable({ categories }: { categories: CategoryGroup[] }) {
  const router = useRouter();

  async function toggleAvailable(id: string, current: boolean) {
    await fetch(`/api/admin/menus/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 이 메뉴를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/menus/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "삭제에 실패했습니다.");
      return;
    }
    router.refresh();
  }

  if (categories.every((c) => c.menuItems.length === 0)) {
    return <p className="text-sm text-zinc-500">등록된 메뉴가 없습니다. 새 메뉴를 등록해보세요.</p>;
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category.id}>
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">{category.name}</h2>
          <table className="w-full overflow-hidden rounded border border-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">메뉴명</th>
                <th className="px-4 py-2 font-medium">가격</th>
                <th className="px-4 py-2 font-medium">판매 상태</th>
                <th className="px-4 py-2 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {category.menuItems.map((item) => (
                <tr key={item.id} className="border-t border-zinc-100">
                  <td className="px-4 py-2 text-zinc-900">{item.name}</td>
                  <td className="px-4 py-2 text-zinc-700">{item.basePrice.toLocaleString()}원</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleAvailable(item.id, item.isAvailable)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {item.isAvailable ? "판매중" : "판매중지"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/menus/detail.html?id=${item.id}`}
                        className="text-zinc-700 underline hover:text-zinc-900"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 underline hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {category.menuItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-zinc-400">
                    이 카테고리에 등록된 메뉴가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
