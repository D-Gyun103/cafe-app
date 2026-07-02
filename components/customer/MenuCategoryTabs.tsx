"use client";

import { useState } from "react";
import MenuCard from "@/components/customer/MenuCard";

interface MenuItemSummary {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  menuItems: MenuItemSummary[];
}

export default function MenuCategoryTabs({ categories }: { categories: CategoryGroup[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  if (!active) {
    return <p className="text-sm text-zinc-500">등록된 메뉴가 없습니다.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-200 pb-px">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveId(category.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
              category.id === active.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {active.menuItems.length === 0 ? (
        <p className="text-sm text-zinc-500">이 카테고리에 등록된 메뉴가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {active.menuItems.map((item) => (
            <MenuCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
