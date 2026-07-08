import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CheckoutForm } from '../components/CheckoutForm';
import { OrderSummary } from '../components/OrderSummary';
import { submitCheckout } from '../api/client';
import type { ShippingInfo } from '../types';

export function CheckoutPage() {
  const { items, clearCart, subtotalCents, itemCount } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#212529] mb-4">Your cart is empty</h1>
        <p className="text-[#6C757D] mb-6">Add some products before checking out.</p>
        <Link
          to="/"
          className="rounded-lg bg-[#0D6EFD] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0B5ED7] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (shipping: ShippingInfo) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await submitCheckout({
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          priceCents: i.priceCents,
          quantity: i.quantity,
        })),
        shipping,
      });
      clearCart();
      navigate('/confirmation', { state: { order } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm text-[#6C757D]">
        <Link to="/" className="hover:text-[#0D6EFD] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#212529]">Checkout</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#212529] mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-lg bg-[#DC3545]/10 border border-[#DC3545]/30 p-4 text-sm text-[#DC3545]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-[#212529] mb-4">Shipping Information</h2>
          <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#212529] mb-4">
            Order ({itemCount} items)
          </h2>
          <OrderSummary items={items} subtotalCents={subtotalCents} />
        </div>
      </div>
    </div>
  );
}
