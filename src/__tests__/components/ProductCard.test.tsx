import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore } from '../../hooks/useCart';
import { act } from '@testing-library/react';

const mockProduct = {
  id: 'p1',
  name: 'Acme Widget',
  shortDescription: 'Compact, versatile widget',
  description: 'Full description',
  priceCents: 1999,
  imageUrl: '/assets/images/p1.png',
};

const renderProductCard = () =>
  render(
    <MemoryRouter>
      <ProductCard product={mockProduct} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], cartOpen: false });
    });
    localStorage.clear();
  });

  it('renders product name, description, and price', () => {
    renderProductCard();

    expect(screen.getByText('Acme Widget')).toBeInTheDocument();
    expect(screen.getByText('Compact, versatile widget')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('renders the Add to Cart button', () => {
    renderProductCard();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('has a link to the product detail page', () => {
    renderProductCard();
    const link = screen.getByRole('link', { name: 'Acme Widget' });
    expect(link).toHaveAttribute('href', '/product/p1');
  });

  it('adds item to cart when Add to Cart is clicked', () => {
    renderProductCard();

    screen.getByText('Add to Cart').click();

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      productId: 'p1',
      name: 'Acme Widget',
      priceCents: 1999,
      quantity: 1,
    });
  });

  it('displays the first character of the product name', () => {
    renderProductCard();
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});