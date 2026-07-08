import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  cartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  itemCount: () => number;
  subtotalCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

      setCartOpen: (open) => set({ cartOpen: open }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalCents: () => get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    }),
    {
      name: 'mooovin-cart',
    }
  )
);

// Convenience hook that returns cart state + actions
// Keeps the API consistent for components
export const useCart = () => {
  const store = useCartStore();
  return {
    items: store.items,
    cartOpen: store.cartOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleCart: store.toggleCart,
    setCartOpen: store.setCartOpen,
    itemCount: store.itemCount(),
    subtotalCents: store.subtotalCents(),
  };
};
