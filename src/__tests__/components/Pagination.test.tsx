import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalItems: 10,
    perPage: 2,
    onPageChange: jest.fn(),
  };

  it('does not render when there is only one page', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalItems={2} perPage={2} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page buttons for each page', () => {
    render(<Pagination {...defaultProps} totalItems={6} perPage={2} />);

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<Pagination {...defaultProps} currentPage={2} totalItems={6} perPage={2} />);

    const page2Btn = screen.getByLabelText('Page 2');
    expect(page2Btn).toHaveAttribute('aria-current', 'page');
  });

  it('disables Previous button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalItems={6} perPage={2} />);

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeEnabled();
  });

  it('disables Next button on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalItems={6} perPage={2} />);

    expect(screen.getByLabelText('Previous page')).toBeEnabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange with the next page when Next is clicked', async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination {...defaultProps} currentPage={1} totalItems={6} perPage={2} onPageChange={onPageChange} />
    );

    await userEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with the previous page when Previous is clicked', async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination {...defaultProps} currentPage={2} totalItems={6} perPage={2} onPageChange={onPageChange} />
    );

    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with page number when a page button is clicked', async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination {...defaultProps} currentPage={1} totalItems={6} perPage={2} onPageChange={onPageChange} />
    );

    await userEvent.click(screen.getByLabelText('Page 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders Previous and Next buttons with correct labels', () => {
    render(<Pagination {...defaultProps} totalItems={6} perPage={2} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});