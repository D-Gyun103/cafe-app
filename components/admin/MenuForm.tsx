"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Choice {
  name: string;
  extraPrice: number;
}

interface OptionGroup {
  name: string;
  type: "single" | "multi";
  required: boolean;
  choices: Choice[];
}

interface Category {
  id: string;
  name: string;
}

interface InitialMenuData {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isAvailable: boolean;
  optionGroups: OptionGroup[];
}

export default function MenuForm({
  categories,
  initialData,
}: {
  categories: Category[];
  initialData?: InitialMenuData;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [basePrice, setBasePrice] = useState(initialData?.basePrice ?? 0);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(initialData?.optionGroups ?? []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addGroup() {
    setOptionGroups([...optionGroups, { name: "", type: "single", required: false, choices: [] }]);
  }

  function removeGroup(index: number) {
    setOptionGroups(optionGroups.filter((_, i) => i !== index));
  }

  function updateGroup(index: number, patch: Partial<OptionGroup>) {
    setOptionGroups(optionGroups.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function addChoice(groupIndex: number) {
    updateGroup(groupIndex, {
      choices: [...optionGroups[groupIndex].choices, { name: "", extraPrice: 0 }],
    });
  }

  function removeChoice(groupIndex: number, choiceIndex: number) {
    updateGroup(groupIndex, {
      choices: optionGroups[groupIndex].choices.filter((_, i) => i !== choiceIndex),
    });
  }

  function updateChoice(groupIndex: number, choiceIndex: number, patch: Partial<Choice>) {
    updateGroup(groupIndex, {
      choices: optionGroups[groupIndex].choices.map((c, i) =>
        i === choiceIndex ? { ...c, ...patch } : c
      ),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!categoryId || !name.trim()) {
      setError("카테고리와 메뉴명은 필수입니다.");
      return;
    }

    const payload = {
      categoryId,
      name: name.trim(),
      description: description.trim() || undefined,
      basePrice: Number(basePrice),
      imageUrl: imageUrl.trim() || undefined,
      isAvailable,
      optionGroups: optionGroups.map((g) => ({
        name: g.name.trim(),
        type: g.type,
        required: g.required,
        choices: g.choices.map((c) => ({ name: c.name.trim(), extraPrice: Number(c.extraPrice) })),
      })),
    };

    setLoading(true);
    const res = await fetch(
      isEdit ? `/api/admin/menus/${initialData!.id}` : "/api/admin/menus",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "저장에 실패했습니다.");
      return;
    }

    router.push("/admin/menus/list.html");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">메뉴명</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          rows={2}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">기본 가격 (원)</label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          min={0}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">이미지 URL (선택)</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          placeholder="/images/americano.jpg"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        판매중
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">옵션 그룹</h3>
          <button
            type="button"
            onClick={addGroup}
            className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
          >
            + 옵션 그룹 추가
          </button>
        </div>

        <div className="space-y-4">
          {optionGroups.map((group, gi) => (
            <div key={gi} className="rounded border border-zinc-200 p-4">
              <div className="mb-3 flex gap-2">
                <input
                  value={group.name}
                  onChange={(e) => updateGroup(gi, { name: e.target.value })}
                  placeholder="옵션 그룹명 (예: 사이즈)"
                  className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm"
                />
                <select
                  value={group.type}
                  onChange={(e) => updateGroup(gi, { type: e.target.value as "single" | "multi" })}
                  className="rounded border border-zinc-300 px-2 py-1 text-sm"
                >
                  <option value="single">단일 선택</option>
                  <option value="multi">복수 선택</option>
                </select>
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <input
                    type="checkbox"
                    checked={group.required}
                    onChange={(e) => updateGroup(gi, { required: e.target.checked })}
                  />
                  필수
                </label>
                <button
                  type="button"
                  onClick={() => removeGroup(gi)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  그룹 삭제
                </button>
              </div>

              <div className="space-y-2">
                {group.choices.map((choice, ci) => (
                  <div key={ci} className="flex gap-2">
                    <input
                      value={choice.name}
                      onChange={(e) => updateChoice(gi, ci, { name: e.target.value })}
                      placeholder="선택지명 (예: Large)"
                      className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm"
                    />
                    <input
                      type="number"
                      value={choice.extraPrice}
                      onChange={(e) => updateChoice(gi, ci, { extraPrice: Number(e.target.value) })}
                      placeholder="추가 금액"
                      className="w-28 rounded border border-zinc-300 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeChoice(gi, ci)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChoice(gi)}
                  className="text-xs text-zinc-700 underline"
                >
                  + 선택지 추가
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "저장 중..." : isEdit ? "수정 저장" : "메뉴 등록"}
      </button>
    </form>
  );
}
