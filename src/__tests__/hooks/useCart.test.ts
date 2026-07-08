import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '../../hooks/useCart';

// Reset store between tests
beforeEach(() => {
  act(() => {
    useCartStore.setState({
      items: [],
      cartOpen: false,
    });
  });
  // Clear persisted state
  localStorage.clear();
});

describe('useCartStore', () => {
  describe('initial state', () => {
    it('starts with an empty items array', () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.items).toEqual([]);
    });

    it('starts with cartOpen set to false', () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.cartOpen).toBe(false);
    });

    it('returns 0 for itemCount', () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.itemCount()).toBe(0);
    });

    it('returns 0 for subtotalCents', () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.subtotalCents()).toBe(0);
    });
  });

  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        productId: 'p1',
        name: 'Acme Widget',
        priceCents: 1999,
        quantity: 1,
      });
    });

    it('increments quantity when the same item is added again', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('removes an item from the cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
        result.current.addItem({
          productId: 'p2',
          name: 'Nimbus Lamp',
          priceCents: 3499,
        });
      });

      act(() => {
        result.current.removeItem('p1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].productId).toBe('p2');
    });

    it('does nothing if productId does not exist', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      act(() => {
        result.current.removeItem('nonexistent');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates the quantity of an existing item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      act(() => {
        result.current.updateQuantity('p1', 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      act(() => {
        result.current.updateQuantity('p1', 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('removes the item when quantity is negative', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
      });

      act(() => {
        result.current.updateQuantity('p1', -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
        result.current.addItem({
          productId: 'p2',
          name: 'Nimbus Lamp',
          priceCents: 3499,
        });
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('cartOpen state', () => {
    it('toggleCart flips the cartOpen state', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.toggleCart());
      expect(result.current.cartOpen).toBe(true);

      act(() => result.current.toggleCart());
      expect(result.current.cartOpen).toBe(false);
    });

    it('setCartOpen sets the cartOpen state', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.setCartOpen(true));
      expect(result.current.cartOpen).toBe(true);

      act(() => result.current.setCartOpen(false));
      expect(result.current.cartOpen).toBe(false);
    });
  });

  describe('computations', () => {
    it('itemCount returns the total number of items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
        result.current.addItem({
          productId: 'p2',
          name: 'Nimbus Lamp',
          priceCents: 3499,
        });
      });

      act(() => {
        result.current.updateQuantity('p1', 3);
      });

      expect(result.current.itemCount()).toBe(4); // 3 + 1
    });

    it('subtotalCents returns the correct total price', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          productId: 'p1',
          name: 'Acme Widget',
          priceCents: 1999,
        });
        result.current.addItem({
          productId: 'p2',
          name: 'Nimbus Lamp',
          priceCents: 3499,
        });
      });

      act(() => {
        result.current.updateQuantity('p1', 2);
      });

      expect(result.current.subtotalCents()).toBe(1999 * 2 + 3499);
    });
  });
});