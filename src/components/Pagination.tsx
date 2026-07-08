interface PaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-[#DEE2E6] bg-white text-[#212529] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-[#0D6EFD] text-white border-[#0D6EFD]'
              : 'bg-white text-[#212529] border-[#DEE2E6] hover:bg-[#F8F9FA]'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-[#DEE2E6] bg-white text-[#212529] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
