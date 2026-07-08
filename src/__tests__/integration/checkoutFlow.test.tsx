import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
import { useCartStore } from '../../hooks/useCart';
import App from '../../App';

const mockProductsResponse = {
  page: 1,
  limit: 2,
  total: 5,
  products: [
    {
      id: 'p1',
      name: 'Acme Widget',
      shortDescription: 'Compact, versatile widget',
      description: 'A full-size description of the Acme Widget with specs, dimensions, and use-cases.',
      priceCents: 1999,
      imageUrl: '/assets/images/p1.png',
    },
    {
      id: 'p2',
      name: 'Nimbus Lamp',
      shortDescription: 'Modern LED lamp',
      description: 'A bright, energy-saving LED lamp.',
      priceCents: 3499,
      imageUrl: '/assets/images/p2.png',
    },
  ],
};

const mockCheckoutResponse = {
  orderId: 'ORD-1743532800000',
  items: [
    { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
  ],
  totalCents: 3998,
  shipping: {
    name: 'Jane Doe',
    address: '123 Main St',
    city: 'Springfield',
    zip: '12345',
    country: 'USA',
  },
  trackingNumber: 'TRK-ABC123',
};

beforeEach(() => {
  jest.restoreAllMocks();
  act(() => {
    useCartStore.setState({ items: [], cartOpen: false });
  });
  localStorage.clear();
});

describe('Full Checkout Flow Integration', () => {
  it('navigates from home to confirmation via checkout', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProductsResponse),
        });
      }
      if (url.includes('/api/checkout')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCheckoutResponse),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Acme Widget')).toBeInTheDocument();
    });

    // 1. Add product to cart
    const addButtons = screen.getAllByText('Add to Cart');
    await user.click(addButtons[0]);

    // 2. Open cart drawer
    await user.click(screen.getByLabelText('Open cart'));
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText('Cart (1)')).toBeInTheDocument();

    // 3. Increase quantity in cart
    const increaseBtn = screen.getByLabelText('Increase quantity');
    await user.click(increaseBtn);
    await waitFor(() => {
      expect(screen.getByText('Cart (2)')).toBeInTheDocument();
    });

    // 4. Proceed to checkout
    await user.click(screen.getByText('Proceed to Checkout'));

    // Wait for checkout page to render
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    // Verify order summary is visible
    expect(screen.getByText('Order (2 items)')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('$39.98')).toBeInTheDocument();

    // 5. Fill in shipping form
    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Address'), '123 Main St');
    await user.type(screen.getByLabelText('City'), 'Springfield');
    await user.type(screen.getByLabelText('ZIP Code'), '12345');
    await user.type(screen.getByLabelText('Country'), 'USA');

    // 6. Submit order
    await user.click(screen.getByText('Pay Now'));

    // 7. Verify confirmation page
    await waitFor(() => {
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });

    expect(screen.getByText('Thank you for your purchase.')).toBeInTheDocument();
    expect(screen.getByText('ORD-1743532800000')).toBeInTheDocument();
    expect(screen.getByText('TRK-ABC123')).toBeInTheDocument();

    // 8. Continue shopping link goes back to home
    expect(screen.getByText('Continue Shopping')).toHaveAttribute('href', '/');
  });

  it('shows error when checkout API fails', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProductsResponse),
        });
      }
      if (url.includes('/api/checkout')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Shipping address incomplete' }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const user = userEvent.setup();

    // Pre-populate cart
    act(() => {
      useCartStore.setState({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 }],
      });
    });

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Address'), '123 Main St');
    await user.type(screen.getByLabelText('City'), 'Springfield');
    await user.type(screen.getByLabelText('ZIP Code'), '12345');
    await user.type(screen.getByLabelText('Country'), 'USA');

    await user.click(screen.getByText('Pay Now'));

    await waitFor(() => {
      expect(screen.getByText(/Shipping address incomplete/i)).toBeInTheDocument();
    });

    // Should still be on checkout page
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('redirects to home from confirmation when no order state', () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProductsResponse),
    });

    render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <App />
      </MemoryRouter>
    );

    // Should redirect to home
    expect(screen.getByText('Mooovin')).toBeInTheDocument();
  });

  it('shows empty cart message on checkout page with no items', () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProductsResponse),
    });

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toHaveAttribute('href', '/');
  });
});