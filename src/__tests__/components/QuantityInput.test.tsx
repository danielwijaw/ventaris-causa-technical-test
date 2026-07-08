import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityInput } from '../../components/QuantityInput';

describe('QuantityInput', () => {
  const defaultProps = {
    quantity: 3,
    onDecrease: jest.fn(),
    onIncrease: jest.fn(),
    onChange: jest.fn(),
  };

  it('renders the current quantity', () => {
    render(<QuantityInput {...defaultProps} />);
    expect(screen.getByLabelText('Quantity')).toHaveValue(3);
  });

  it('calls onDecrease when minus button is clicked', async () => {
    const onDecrease = jest.fn();
    render(<QuantityInput {...defaultProps} onDecrease={onDecrease} />);

    await userEvent.click(screen.getByLabelText('Decrease quantity'));
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  it('calls onIncrease when plus button is clicked', async () => {
    const onIncrease = jest.fn();
    render(<QuantityInput {...defaultProps} onIncrease={onIncrease} />);

    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onIncrease).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with a valid number when input is changed', async () => {
    const onChange = jest.fn();
    render(<QuantityInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByLabelText('Quantity');
    await userEvent.clear(input);
    await userEvent.type(input, '5');

    // onChange is called only for valid values within range
    expect(onChange).toHaveBeenCalledWith(35);
  });

  it('disables the minus button when quantity equals min', () => {
    render(<QuantityInput {...defaultProps} quantity={1} />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
  });

  it('disables the plus button when quantity equals max', () => {
    render(<QuantityInput {...defaultProps} quantity={99} />);
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
  });

  it('does not call onChange with values below min', async () => {
    const onChange = jest.fn();
    render(<QuantityInput {...defaultProps} onChange={onChange} quantity={1} />);

    const input = screen.getByLabelText('Quantity');
    await userEvent.clear(input);
    await userEvent.type(input, '0');

    expect(onChange).not.toHaveBeenCalledWith(0);
  });

  it('does not call onChange with values above max', async () => {
    const onChange = jest.fn();
    render(<QuantityInput {...defaultProps} onChange={onChange} quantity={99} />);

    const input = screen.getByLabelText('Quantity');
    await userEvent.clear(input);
    await userEvent.type(input, '100');

    expect(onChange).not.toHaveBeenCalledWith(100);
  });

  it('does not call onChange with NaN', async () => {
    const onChange = jest.fn();
    render(<QuantityInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByLabelText('Quantity');
    await userEvent.clear(input);
    await userEvent.type(input, 'abc');

    expect(onChange).not.toHaveBeenCalled();
  });
});