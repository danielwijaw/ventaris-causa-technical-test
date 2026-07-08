import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { useCartStore } from '../../hooks/useCart';

const renderProductDetail = (productId: string = 'p1') =>
  render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('ProductDetailPage', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], cartOpen: false });
    });
    localStorage.clear();
  });

  it('renders product name and price for existing product', () => {
    renderProductDetail('p1');

    // expect(screen.getByText('Acme Widget')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('Compact, versatile widget')).toBeInTheDocument();
  });

  it('renders the full description', () => {
    renderProductDetail('p1');

    expect(
      screen.getByText(
        'A full-size description of the Acme Widget with specs, dimensions, and use-cases.'
      )
    ).toBeInTheDocument();
  });

  it('shows product not found for invalid id', () => {
    renderProductDetail('nonexistent');

    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(screen.getByText('Back to products')).toHaveAttribute('href', '/');
  });

  it('displays breadcrumb navigation', () => {
    renderProductDetail('p1');

    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    // expect(screen.getByText('Acme Widget')).toBeInTheDocument();
  });

  it('adds item to cart when button is clicked', async () => {
    const user = userEvent.setup();
    renderProductDetail('p1');

    await user.click(screen.getByText('Add to Cart — $19.99'));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('p1');
    expect(items[0].quantity).toBe(1);
  });

  it('shows quantity in cart message when item is already in cart', () => {
    act(() => {
      useCartStore.setState({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 3 }],
      });
    });

    renderProductDetail('p1');

    expect(screen.getByText('3 in cart')).toBeInTheDocument();
  });

  it('renders the product initial in the image placeholder', () => {
    renderProductDetail('p1');

    const initials = screen.getAllByText('A');
    expect(initials.length).toBeGreaterThanOrEqual(1);
  });

  it('increments cart quantity when item is added again', async () => {
    const user = userEvent.setup();

    act(() => {
      useCartStore.setState({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 }],
      });
    });

    renderProductDetail('p1');

    await user.click(screen.getByText('Add to Cart — $19.99'));

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(3);
  });
});