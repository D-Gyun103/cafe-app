"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCartItemId, useCartStore } from "@/lib/cartStore";

interface OptionChoice {
  id: string;
  name: string;
  extraPrice: number;
}

interface OptionGroup {
  id: string;
  name: string;
  type: string;
  required: boolean;
  choices: OptionChoice[];
}

interface OptionSelectorProps {
  menuItemId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  optionGroups: OptionGroup[];
}

export default function OptionSelector({
  menuItemId,
  name,
  imageUrl,
  basePrice,
  optionGroups,
}: OptionSelectorProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  function toggleChoice(group: OptionGroup, choiceId: string) {
    setSelected((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") {
        return { ...prev, [group.id]: [choiceId] };
      }
      const next = current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId];
      return { ...prev, [group.id]: next };
    });
  }

  const extraPerUnit = useMemo(() => {
    return optionGroups.reduce((sum, group) => {
      const chosenIds = selected[group.id] ?? [];
      const groupExtra = group.choices
        .filter((choice) => chosenIds.includes(choice.id))
        .reduce((s, choice) => s + choice.extraPrice, 0);
      return sum + groupExtra;
    }, 0);
  }, [optionGroups, selected]);

  const unitPrice = basePrice + extraPerUnit;
  const totalPrice = unitPrice * quantity;

  const missingRequired = optionGroups.some(
    (group) => group.required && (selected[group.id] ?? []).length === 0
  );

  function handleAddToCart() {
    if (missingRequired) return;

    const chosenOptions = optionGroups.flatMap((group) =>
      group.choices
        .filter((choice) => (selected[group.id] ?? []).includes(choice.id))
        .map((choice) => ({
          groupId: group.id,
          groupName: group.name,
          choiceId: choice.id,
          choiceName: choice.name,
          extraPrice: choice.extraPrice,
        }))
    );

    addItem(
      {
        cartItemId: buildCartItemId(menuItemId, chosenOptions),
        menuItemId,
        name,
        imageUrl,
        basePrice,
        unitPrice,
        options: chosenOptions,
      },
      quantity
    );

    router.push("/my/cart");
  }

  return (
    <div className="space-y-6">
      {optionGroups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">
            {group.name}
            {group.required && <span className="ml-1 text-xs text-red-500">필수</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.choices.map((choice) => {
              const isChosen = (selected[group.id] ?? []).includes(choice.id);
              return (
                <button
                  key={choice.id}
                  onClick={() => toggleChoice(group, choice.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    isChosen
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {choice.name}
                  {choice.extraPrice > 0 && ` (+${choice.extraPrice.toLocaleString()}원)`}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900">수량</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-8 w-8 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-medium text-zinc-900">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-8 w-8 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            +
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-zinc-500">합계</span>
          <span className="text-lg font-semibold text-zinc-900">{totalPrice.toLocaleString()}원</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={missingRequired}
          className={`w-full rounded px-4 py-3 text-sm font-medium ${
            missingRequired
              ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          장바구니 담기
        </button>
        {missingRequired && (
          <p className="mt-2 text-xs text-red-500">필수 옵션을 모두 선택해주세요.</p>
        )}
      </div>
    </div>
  );
}
