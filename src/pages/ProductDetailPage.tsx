import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import PRODUCTS from '../mocks/products.json';
import type { Product } from '../types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const found = (PRODUCTS as Product[]).find((p) => p.id === id);
    setProduct(found ?? null);
  }, [id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[#6C757D] mb-4">Product not found</p>
        <Link
          to="/"
          className="text-[#0D6EFD] hover:underline font-medium"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const cartItem = items.find((i) => i.productId === product.id);
  const currentQty = cartItem?.quantity ?? 0;
  const price = (product.priceCents / 100).toFixed(2);

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, priceCents: product.priceCents });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm text-[#6C757D]">
        <Link to="/" className="hover:text-[#0D6EFD] transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#212529]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-[#F8F9FA] rounded-lg border border-[#DEE2E6] flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-[#0D6EFD]/10 to-[#0D6EFD]/5 rounded-lg flex items-center justify-center">
            <span className="text-6xl text-[#0D6EFD]/40 font-bold">{product.name.charAt(0)}</span>
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-[#212529] mb-2">{product.name}</h1>
          <p className="text-lg text-[#6C757D] mb-4">{product.shortDescription}</p>
          <p className="text-3xl font-bold text-[#212529] mb-6">${price}</p>

          <p className="text-sm text-[#6C757D] leading-relaxed mb-6">
            {product.description}
          </p>

          {currentQty > 0 && (
            <p className="text-sm text-[#28A745] mb-4">
              {currentQty} in cart
            </p>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full rounded-lg bg-[#0D6EFD] px-6 py-3 text-base font-medium text-white hover:bg-[#0B5ED7] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 transition-colors"
          >
            Add to Cart — ${price}
          </button>
        </div>
      </div>
    </div>
  );
}
