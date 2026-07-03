import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartOptionChoice {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  options: CartOptionChoice[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clear: () => void;
}

export function buildCartItemId(menuItemId: string, options: CartOptionChoice[]) {
  const choiceKey = options
    .map((o) => o.choiceId)
    .sort()
    .join(",");
  return `${menuItemId}::${choiceKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.cartItemId === item.cartItemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) })),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartItemId !== cartItemId)
              : state.items.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cafe-cart" }
  )
);
