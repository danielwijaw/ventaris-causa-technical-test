import { render, screen } from '@testing-library/react';
import { OrderSummary } from '../../components/OrderSummary';

describe('OrderSummary', () => {
  const defaultProps = {
    items: [
      { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
      { productId: 'p2', name: 'Nimbus Lamp', priceCents: 3499, quantity: 1 },
    ],
    subtotalCents: 1999 * 2 + 3499,
  };

  it('renders the title', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('renders each item with name and quantity', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('Acme Widget × 2')).toBeInTheDocument();
    expect(screen.getByText('Nimbus Lamp × 1')).toBeInTheDocument();
  });

  it('renders the line total for each item', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('$39.98')).toBeInTheDocument();
    expect(screen.getByText('$34.99')).toBeInTheDocument();
  });

  it('renders the grand total', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('$74.97')).toBeInTheDocument();
  });

  it('renders a single item correctly', () => {
    render(
      <OrderSummary
        items={[{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 }]}
        subtotalCents={1999}
      />
    );

    expect(screen.getByText('Acme Widget × 1')).toBeInTheDocument();
    // expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('shows total of $0.00 for empty items list', () => {
    render(<OrderSummary items={[]} subtotalCents={0} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});