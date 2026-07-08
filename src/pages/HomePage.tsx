import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { fetchProducts } from '../api/client';
import type { Product } from '../types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(page, 2);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // Client-side search filtering
  const filteredProducts = products.filter((p) =>
    searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden animate-pulse">
              <div className="aspect-square bg-[#F8F9FA]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#F8F9FA] rounded w-3/4" />
                <div className="h-3 bg-[#F8F9FA] rounded w-full" />
                <div className="h-5 bg-[#F8F9FA] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-[#DC3545] mb-4">{error}</p>
          <button
            onClick={() => void loadProducts()}
            className="rounded-lg bg-[#0D6EFD] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B5ED7] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {searchQuery && (
            <p className="text-sm text-[#6C757D] mb-4">
              {filteredProducts.length > 0
                ? `Showing results for "${searchQuery}"`
                : `No results for "${searchQuery}"`}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!searchQuery && (
            <Pagination
              currentPage={page}
              totalItems={total}
              perPage={2}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
