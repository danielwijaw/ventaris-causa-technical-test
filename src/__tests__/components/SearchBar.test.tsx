import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with the default value', () => {
    render(<SearchBar onSearch={jest.fn()} defaultValue="widget" />);
    expect(screen.getByLabelText('Search products')).toHaveValue('widget');
  });

  it('renders with an empty default value', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByLabelText('Search products')).toHaveValue('');
  });

  // it('calls onSearch after debounce delay when typing', async () => {
  //   const onSearch = jest.fn();
  //   render(<SearchBar onSearch={onSearch} />);

  //   const input = screen.getByLabelText('Search products');
  //   await userEvent.type(input, 'lamp');

  //   // Should not have been called yet (debounced)
  //   expect(onSearch).not.toHaveBeenCalled();

  //   // Advance timers to trigger debounce
  //   jest.advanceTimersByTime(300);

  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toHaveBeenCalledWith('lamp');
  // });

  // it('debounces multiple rapid keystrokes into a single call', async () => {
  //   const onSearch = jest.fn();
  //   render(<SearchBar onSearch={onSearch} />);

  //   const input = screen.getByLabelText('Search products');
  //   await userEvent.type(input, 'he');
  //   jest.advanceTimersByTime(100);
  //   await userEvent.type(input, 'adphones');
  //   jest.advanceTimersByTime(300);

  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toHaveBeenCalledWith('headphones');
  // });

  // it('clears the input and calls onSearch with empty string', async () => {
  //   const onSearch = jest.fn();
  //   render(<SearchBar onSearch={onSearch} defaultValue="widget" />);

  //   const input = screen.getByLabelText('Search products');
  //   await userEvent.clear(input);
  //   jest.advanceTimersByTime(300);

  //   expect(onSearch).toHaveBeenCalledWith('');
  // });

  it('renders the search icon', () => {
    const { container } = render(<SearchBar onSearch={jest.fn()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});