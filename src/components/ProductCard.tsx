import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-[#F8F9FA] flex items-center justify-center p-8">
          <div className="w-full h-full bg-gradient-to-br from-[#0D6EFD]/10 to-[#0D6EFD]/5 rounded-lg flex items-center justify-center">
            <span className="text-4xl text-[#0D6EFD]/40 font-bold">{product.name.charAt(0)}</span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-[#212529] hover:text-[#0D6EFD] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[#6C757D] line-clamp-2">{product.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-[#212529]">${price}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({ productId: product.id, name: product.name, priceCents: product.priceCents });
            }}
            className="rounded-lg bg-[#0D6EFD] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0B5ED7] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
