"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import CartSummary from "@/components/customer/CartSummary";

export default function CustomerCartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <Link href="/my/menu/list.html" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← 메뉴로 돌아가기
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">장바구니</h1>
        <CartSummary />

        {items.length > 0 && (
          <button
            disabled
            title="주문 기능은 다음 단계에서 제공됩니다."
            className="mt-6 w-full cursor-not-allowed rounded bg-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500"
          >
            주문하기 (준비중)
          </button>
        )}
      </main>
    </div>
  );
}
