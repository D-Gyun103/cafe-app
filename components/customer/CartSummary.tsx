"use client";

import Image from "next/image";
import { useCartStore, type CartItem } from "@/lib/cartStore";

function CartRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 border-b border-zinc-200 py-4 last:border-b-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">☕</div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900">{item.name}</h3>
          <button
            onClick={() => removeItem(item.cartItemId)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            삭제
          </button>
        </div>
        {item.options.length > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            {item.options.map((o) => o.choiceName).join(", ")}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="h-7 w-7 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-medium text-zinc-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="h-7 w-7 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium text-zinc-900">
            {(item.unitPrice * item.quantity).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-zinc-500">장바구니가 비어 있습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border border-zinc-200 bg-white px-6">
        {items.map((item) => (
          <CartRow key={item.cartItemId} item={item} />
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>총 수량</span>
          <span>{totalQuantity}개</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-zinc-500">총 합계</span>
          <span className="text-lg font-semibold text-zinc-900">{totalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
