import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutForm } from '../../components/CheckoutForm';

describe('CheckoutForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    isSubmitting: false,
  };

  it('renders all form fields and the submit button', () => {
    render(<CheckoutForm {...defaultProps} />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByText('Pay Now')).toBeInTheDocument();
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(<CheckoutForm {...defaultProps} isSubmitting={true} />);

    expect(screen.getByText('Processing...')).toBeDisabled();
  });

  it('shows Processing... when isSubmitting is true', () => {
    render(<CheckoutForm {...defaultProps} isSubmitting={true} />);

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('Pay Now')).not.toBeInTheDocument();
  });

  it('displays error messages when submitting an empty form', async () => {
    render(<CheckoutForm {...defaultProps} />);

    await userEvent.click(screen.getByText('Pay Now'));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    expect(screen.getByText('ZIP code is required')).toBeInTheDocument();
    expect(screen.getByText('Country is required')).toBeInTheDocument();

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = jest.fn();
    render(<CheckoutForm {...defaultProps} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Address'), '123 Main St');
    await userEvent.type(screen.getByLabelText('City'), 'Springfield');
    await userEvent.type(screen.getByLabelText('ZIP Code'), '12345');
    await userEvent.type(screen.getByLabelText('Country'), 'USA');

    await userEvent.click(screen.getByText('Pay Now'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      address: '123 Main St',
      city: 'Springfield',
      zip: '12345',
      country: 'USA',
    });
  });

  it('clears error for a field when the user starts typing', async () => {
    render(<CheckoutForm {...defaultProps} />);

    await userEvent.click(screen.getByText('Pay Now'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Full Name'), 'J');

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('applies error styling to fields with validation errors', async () => {
    render(<CheckoutForm {...defaultProps} />);

    await userEvent.click(screen.getByText('Pay Now'));

    const nameInput = screen.getByLabelText('Full Name');
    expect(nameInput).toHaveClass('border-[#DC3545]');
  });
});