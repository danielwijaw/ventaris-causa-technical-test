/**
 * MSW (Mock Service Worker) request handlers for the Mini‑Project Marketplace.
 *
 * – Implements the contract described in the RFC (GET /api/products, POST /api/checkout)
 *   and the TypeScript data model (Product, CartItem, Order, ShippingInfo) [7][8].
 * – Pagination defaults to page 1 / limit 2 (the UI shows 2 items per page) [1].
 * – Checkout handler adds a 1 s artificial delay to simulate the payment spinner
 *   (FR‑6) [3].
 * – Shipping cost is assumed to be zero – total = sum(product price × quantity).
 */

import { setupWorker, rest, DefaultRequestBody, DefaultResponseBody } from 'msw';
import { delay } from 'msw';
import type { Product, CartItem, Order, ShippingInfo } from '../types';

// ---------------------------------------------------------------------------
// Static mock data – 5 products (same data that will be stored in
// /docs/14_mock_data.json).  The shape matches the `Product` interface.
// ---------------------------------------------------------------------------
const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Acme Widget',
    shortDescription: 'Compact, versatile widget',
    description:
      'A full‑size description of the Acme Widget with specs, dimensions, and use‑cases.',
    priceCents: 1999,
    imageUrl: '/assets/images/p1.png',
  },
  {
    id: 'p2',
    name: 'Nimbus Lamp',
    shortDescription: 'Modern LED lamp',
    description:
      'A bright, energy‑saving LED lamp with adjustable brightness and sleek design.',
    priceCents: 3499,
    imageUrl: '/assets/images/p2.png',
  },
  {
    id: 'p3',
    name: 'Zephyr Headphones',
    shortDescription: 'Wireless noise‑cancelling',
    description:
      'Over‑ear wireless headphones with active noise cancellation and 20 h battery life.',
    priceCents: 8999,
    imageUrl: '/assets/images/p3.png',
  },
  {
    id: 'p4',
    name: 'Orion Backpack',
    shortDescription: 'Durable travel backpack',
    description:
      'A water‑resistant, 30 L travel backpack with multiple compartments and ergonomic straps.',
    priceCents: 7499,
    imageUrl: '/assets/images/p4.png',
  },
  {
    id: 'p5',
    name: 'Pulse Smartwatch',
    shortDescription: 'Fitness‑focused smartwatch',
    description:
      'A smartwatch with heart‑rate monitoring, GPS, and 7‑day battery life.',
    priceCents: 12999,
    imageUrl: '/assets/images/p5.png',
  },
];

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------
function parseNumber(param: string | null, fallback: number): number {
  const n = Number(param);
  return Number.isNaN(n) || n <= 0 ? fallback : n;
}

// ---------------------------------------------------------------------------
// GET /api/products – paginated list
// ---------------------------------------------------------------------------
const getProductsHandler = rest.get<DefaultRequestBody, DefaultResponseBody, any>(
  '/api/products',
  (req, res, ctx) => {
    // Extract and validate query parameters (page, limit)
    const page = parseNumber(req.url.searchParams.get('page'), 1);
    const limit = parseNumber(req.url.searchParams.get('limit'), 2);

    // Guard: invalid pagination values
    if (page < 1 || limit < 1) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid pagination parameters' })
      );
    }

    const startIdx = (page - 1) * limit;
    const pagedProducts = PRODUCTS.slice(startIdx, startIdx + limit);

    return res(
      ctx.status(200),
      ctx.delay(300), // tiny network‑like latency for the list UI
      ctx.json({
        page,
        limit,
        total: PRODUCTS.length,
        products: pagedProducts,
      })
    );
  }
);

// ---------------------------------------------------------------------------
// POST /api/checkout – mock payment & shipping flow
// ---------------------------------------------------------------------------
const postCheckoutHandler = rest.post<
  {
    items: CartItem[];
    shipping: ShippingInfo;
  },
  DefaultResponseBody,
  any
>('/api/checkout', async (req, res, ctx) => {
  const { items, shipping } = await req.json();

  // Basic validation – all fields required (FR‑7)
  if (!items?.length || !shipping) {
    return res(
      ctx.status(400),
      ctx.json({ error: 'Shipping address incomplete' })
    );
  }

  // Compute totalCents by looking up each product price (protects against tampering)
  let totalCents = 0;
  for (const { productId, quantity } of items) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return res(
        ctx.status(400),
        ctx.json({ error: `Product ${productId} not found` })
      );
    }
    totalCents += product.priceCents * quantity;
  }

  // Simulated 1 second processing delay (FR‑6)
  await ctx.delay(1000);

  const orderId = `ORD-${Date.now()}`;
  const trackingNumber = `TRK-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  // Build the response payload (matches the contract) [8]
  const responseBody = {
    orderId,
    items: items.map((it) => {
      const p = PRODUCTS.find((pr) => pr.id === it.productId)!;
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
  };

  return res(ctx.status(201), ctx.json(responseBody));
});

// ---------------------------------------------------------------------------
// Export the worker that the app will import in src/mocks/browser.ts
// ---------------------------------------------------------------------------
export const worker = setupWorker(getProductsHandler, postCheckoutHandler);

// If you prefer a default export for convenience
export default worker;