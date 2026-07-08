import { Link, useLocation, Navigate } from 'react-router-dom';
import type { Order } from '../types';

interface OrderSummaryProps {
  items: { name: string; priceCents: number; quantity: number }[];
  subtotalCents: number;
}

function OrderSummary({ items, subtotalCents }: OrderSummaryProps) {
  const subtotal = (subtotalCents / 100).toFixed(2);

  return (
    <div className="bg-[#F8F9FA] rounded-lg p-4 border border-[#DEE2E6] mb-4">
      <h3 className="text-sm font-semibold text-[#212529] mb-2">Items</h3>
      <ul className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between text-sm">
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

export function ConfirmationPage() {
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#28A745]/10 mb-4">
          <svg className="h-8 w-8 text-[#28A745]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#212529] mb-2">Order Confirmed!</h1>
        <p className="text-[#6C757D]">Thank you for your purchase.</p>
      </div>

      <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#6C757D]">Order ID</p>
            <p className="font-mono text-sm font-medium text-[#212529]">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6C757D]">Tracking</p>
            <p className="font-mono text-sm font-medium text-[#212529]">{order.trackingNumber}</p>
          </div>
        </div>

        <OrderSummary items={order.items} subtotalCents={order.totalCents} />

        <div className="bg-[#F8F9FA] rounded-lg p-4 border border-[#DEE2E6]">
          <h3 className="text-sm font-semibold text-[#212529] mb-2">Shipping To</h3>
          <p className="text-sm text-[#6C757D]">
            {order.shipping.name}<br />
            {order.shipping.address}<br />
            {order.shipping.city}, {order.shipping.zip}<br />
            {order.shipping.country}
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-block rounded-lg bg-[#0D6EFD] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0B5ED7] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
