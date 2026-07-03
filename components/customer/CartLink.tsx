"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";

export default function CartLink() {
  const totalQuantity = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link href="/my/cart" className="relative text-sm font-medium text-zinc-600 hover:text-zinc-900">
      장바구니
      {totalQuantity > 0 && (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs font-medium text-white">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
