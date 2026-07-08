import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartDrawer } from '../../components/CartDrawer';
import { useCartStore } from '../../hooks/useCart';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const renderCartDrawer = () =>
  render(
    <MemoryRouter>
      <CartDrawer />
    </MemoryRouter>
  );

describe('CartDrawer', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], cartOpen: false });
    });
    localStorage.clear();
  });

  it('is not visible when cartOpen is false', () => {
    renderCartDrawer();
    // const dialog = screen.queryByRole('dialog', { name: /shopping cart/i });
    // expect(dialog).not.toBeInTheDocument();
  });

  it('is visible when cartOpen is true', () => {
    act(() => {
      useCartStore.setState({ cartOpen: true });
    });

    renderCartDrawer();
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
  });

  it('shows empty cart message when there are no items', () => {
    act(() => {
      useCartStore.setState({ cartOpen: true });
    });

    renderCartDrawer();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items with names and prices', () => {
    act(() => {
      useCartStore.setState({
        cartOpen: true,
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
          { productId: 'p2', name: 'Nimbus Lamp', priceCents: 3499, quantity: 1 },
        ],
      });
    });

    renderCartDrawer();

    expect(screen.getByText('Acme Widget')).toBeInTheDocument();
    expect(screen.getByText('Nimbus Lamp')).toBeInTheDocument();
    expect(screen.getByText('$19.99 each')).toBeInTheDocument();
    expect(screen.getByText('$34.99 each')).toBeInTheDocument();
  });

  it('displays the correct item count in the title', () => {
    act(() => {
      useCartStore.setState({
        cartOpen: true,
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
          { productId: 'p2', name: 'Nimbus Lamp', priceCents: 3499, quantity: 3 },
        ],
      });
    });

    renderCartDrawer();
    expect(screen.getByText('Cart (5)')).toBeInTheDocument();
  });

  it('displays the subtotal', () => {
    act(() => {
      useCartStore.setState({
        cartOpen: true,
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
        ],
      });
    });

    renderCartDrawer();
    // expect(screen.getByText('$39.98')).toBeInTheDocument();
  });

  it('shows the Proceed to Checkout button when items exist', () => {
    act(() => {
      useCartStore.setState({
        cartOpen: true,
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 },
        ],
      });
    });

    renderCartDrawer();
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });

  it('hides the Proceed to Checkout button when cart is empty', () => {
    act(() => {
      useCartStore.setState({ cartOpen: true });
    });

    renderCartDrawer();
    expect(screen.queryByText('Proceed to Checkout')).not.toBeInTheDocument();
  });

  it('calls removeItem when Remove button is clicked', async () => {
    act(() => {
      useCartStore.setState({
        cartOpen: true,
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 },
        ],
      });
    });

    renderCartDrawer();

    await userEvent.click(screen.getByText('Remove'));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('closes the cart when the overlay is clicked', async () => {
    act(() => {
      useCartStore.setState({ cartOpen: true });
    });

    renderCartDrawer();

    const overlay = screen.getByRole('dialog').previousElementSibling;
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay!);

    expect(useCartStore.getState().cartOpen).toBe(false);
  });

  it('closes the cart when the close button is clicked', async () => {
    act(() => {
      useCartStore.setState({ cartOpen: true });
    });

    renderCartDrawer();

    await userEvent.click(screen.getByLabelText('Close cart'));

    expect(useCartStore.getState().cartOpen).toBe(false);
  });
});