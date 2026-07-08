import type { ProductListResponse, CheckoutRequest, CheckoutResponse } from '../types';

export async function fetchProducts(page = 1, limit = 2): Promise<ProductListResponse> {
  const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json() as Promise<ProductListResponse>;
}

export async function submitCheckout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json() as Promise<CheckoutResponse>;
}
