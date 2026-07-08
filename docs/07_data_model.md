# Data Model – TypeScript Interfaces  

These interfaces describe the core entities that flow through the front‑end, the mock API (MSW) and the eventual order‑summary view. They are deliberately lightweight because the marketplace is a static mock‑up; all data lives in the client session only.

```ts
/** -----------------------------------------------------------------
 *  Product – a single catalog item shown on the Home page.
 *  The shape mirrors the JSON file `src/mocks/products.json`
 *  (see Deliverables in the RFC) and includes the fields required
 *  for the UI components (ProductCard, ProductDetailPage).
 * ----------------------------------------------------------------- */
export interface Product {
  /** Unique identifier (e.g. UUID or short slug) */
  id: string;
  /** Human‑readable name displayed on cards & detail view */
  name: string;
  /** Short description used in the list view */
  shortDescription: string;
  /** Full description for the detail page */
  description: string;
  /** Price in the store’s currency (integer cents for precision) */
  priceCents: number;
  /** URL/path to the product image (see `assets/images/`) */
  imageUrl: string;
}

/** -----------------------------------------------------------------
 *  CartItem – one line‑item stored in the Zustand `useCart` store.
 * ----------------------------------------------------------------- */
export interface CartItem {
  /** Reference to the product */
  productId: string;
  /** Snapshot of the product name – helps rendering after a page refresh */
  name: string;
  /** Unit price in cents (copied from Product at add‑to‑cart time) */
  priceCents: number;
  /** Quantity selected by the shopper */
  quantity: number;
}

/** -----------------------------------------------------------------
 *  ShippingInfo – data collected on the Checkout page (FR‑7).
 * ----------------------------------------------------------------- */
export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

/** -----------------------------------------------------------------
 *  Order – the final receipt shown on the Confirmation page (FR‑8).
 * ----------------------------------------------------------------- */
export interface Order {
  /** Generated order identifier (e.g. `ORD‑20230708‑001`) */
  orderId: string;
  /** Items that were purchased */
  items: CartItem[];
  /** Total amount in cents (sum of line totals) */
  totalCents: number;
  /** Shipping information supplied by the user */
  shipping: ShippingInfo;
  /** Mock tracking code shown after checkout (FR‑7) */
  trackingNumber: string;
}
```

### Example JSON snippets  

```json
// src/mocks/products.json (5 mock items)
[
  {
    "id": "p1",
    "name": "Acme Widget",
    "shortDescription": "Compact, versatile widget",
    "description": "A full‑size description of the Acme Widget with specs…",
    "priceCents": 1999,
    "imageUrl": "/assets/images/p1.png"
  }
  // …four more objects
]
```

```json
// Example order payload returned by POST /api/checkout
{
  "orderId": "ORD-20230708-001",
  "items": [
    { "productId": "p1", "name": "Acme Widget", "priceCents": 1999, "quantity": 2 }
  ],
  "totalCents": 3998,
  "shipping": {
    "name": "Jane Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "zip": "12345",
    "country": "USA"
  },
  "trackingNumber": "TRK-7F3A9B"
}
```

*The data model respects the non‑functional requirement for **no persistent history** – all objects live only in `localStorage` for the session (FR‑9) [2].*  