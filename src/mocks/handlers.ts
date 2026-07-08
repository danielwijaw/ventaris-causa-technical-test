import { http, HttpResponse, delay } from 'msw';
import type { Product, CartItem, ShippingInfo } from '../types';
import PRODUCTS from './products.json';

function parseNumber(param: string | null, fallback: number): number {
  const n = Number(param);
  return Number.isNaN(n) || n <= 0 ? fallback : n;
}

export const handlers = [
  http.get('/api/products', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseNumber(url.searchParams.get('page'), 1);
    const limit = parseNumber(url.searchParams.get('limit'), 2);

    if (page < 1 || limit < 1) {
      return HttpResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const startIdx = (page - 1) * limit;
    const pagedProducts = (PRODUCTS as Product[]).slice(startIdx, startIdx + limit);

    await delay(300);

    return HttpResponse.json({
      page,
      limit,
      total: PRODUCTS.length,
      products: pagedProducts,
    });
  }),

  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as {
      items: CartItem[];
      shipping: ShippingInfo;
    };
    const { items, shipping } = body;

    if (!items?.length || !shipping) {
      return HttpResponse.json({ error: 'Shipping address incomplete' }, { status: 400 });
    }

    let totalCents = 0;
    for (const { productId, quantity } of items) {
      const product = (PRODUCTS as Product[]).find((p) => p.id === productId);
      if (!product) {
        return HttpResponse.json({ error: `Product ${productId} not found` }, { status: 400 });
      }
      totalCents += product.priceCents * quantity;
    }

    await delay(1000);

    const orderId = `ORD-${Date.now()}`;
    const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return HttpResponse.json({
      orderId,
      items: items.map((it) => {
        const p = (PRODUCTS as Product[]).find((pr) => pr.id === it.productId)!;
        return {
          productId: it.productId,
          name: p.name,
          priceCents: p.priceCents,
          quantity: it.quantity,
        };
      }),
      totalCents,
      shipping,
      trackingNumber,
    }, { status: 201 });
  }),
];
