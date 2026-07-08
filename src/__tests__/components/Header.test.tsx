import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../components/Header';
import { useCartStore } from '../../hooks/useCart';
import { act } from '@testing-library/react';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header onCartClick={jest.fn()} />
    </MemoryRouter>
  );

describe('Header', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], cartOpen: false });
    });
    localStorage.clear();
  });

  it('renders the app name and cart button', () => {
    renderHeader();
    expect(screen.getByText('Mooovin')).toBeInTheDocument();
    expect(screen.getByLabelText('Open cart')).toBeInTheDocument();
  });

  it('does not show a badge when cart is empty', () => {
    renderHeader();
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it('shows a badge with the item count', () => {
    act(() => {
      useCartStore.setState({
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
        ],
      });
    });

    renderHeader();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows 99+ when item count exceeds 99', () => {
    act(() => {
      useCartStore.setState({
        items: [
          { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 100 },
        ],
      });
    });

    renderHeader();
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('calls onCartClick when the cart button is clicked', () => {
    const onCartClick = jest.fn();
    render(
      <MemoryRouter>
        <Header onCartClick={onCartClick} />
      </MemoryRouter>
    );

    screen.getByLabelText('Open cart').click();
    expect(onCartClick).toHaveBeenCalledTimes(1);
  });

  it('contains a link to the home page', () => {
    renderHeader();
    const link = screen.getByRole('link', { name: 'Mooovin' });
    expect(link).toHaveAttribute('href', '/');
  });
});