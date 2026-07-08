import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { QuantityInput } from './QuantityInput';

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQuantity, subtotalCents, itemCount } = useCart();
  const navigate = useNavigate();

  const subtotal = (subtotalCents / 100).toFixed(2);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEE2E6]">
            <h2 className="text-lg font-semibold text-[#212529]">
              Cart ({itemCount})
            </h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 text-[#6C757D] hover:text-[#212529] transition-colors"
              aria-label="Close cart"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="text-center text-[#6C757D] mt-8">Your cart is empty</p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4 bg-[#F8F9FA] rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#212529] truncate">{item.name}</p>
                      <p className="text-sm text-[#6C757D]">
                        ${(item.priceCents / 100).toFixed(2)} each
                      </p>
                      <p className="text-sm font-semibold text-[#212529] mt-1">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <QuantityInput
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                        onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                        onChange={(val) => updateQuantity(item.productId, val)}
                      />
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-[#DC3545] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-[#DEE2E6] px-6 py-4 space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-[#212529]">Subtotal</span>
                <span className="font-bold text-[#212529]">${subtotal}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-[#0D6EFD] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B5ED7] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
