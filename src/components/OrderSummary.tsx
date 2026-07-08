import type { CartItem } from '../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotalCents: number;
}

export function OrderSummary({ items, subtotalCents }: OrderSummaryProps) {
  const subtotal = (subtotalCents / 100).toFixed(2);

  return (
    <div className="bg-[#F8F9FA] rounded-lg p-4 border border-[#DEE2E6]">
      <h3 className="text-base font-semibold text-[#212529] mb-3">Order Summary</h3>
      <ul className="space-y-2 mb-3">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between text-sm">
            <span className="text-[#6C757D] truncate pr-2">
              {item.name} × {item.quantity}
            </span>
            <span className="text-[#212529] font-medium">
              ${((item.priceCents * item.quantity) / 100).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-[#DEE2E6] pt-2 flex items-center justify-between">
        <span className="font-semibold text-[#212529]">Total</span>
        <span className="font-bold text-lg text-[#212529]">${subtotal}</span>
      </div>
    </div>
  );
}
