# RFC – Mini‑Project Marketplace (Technical Test)

**Author:** ChatGPT  
**Date:** 2026‑07‑08  
**Status:** Proposed → *Review → Approved → Implement*  

---  

## 1. Purpose & Goals  

| Goal | Success Metric |
|------|----------------|
| **Showcase core e‑commerce flow** (list → search → detail → cart → checkout) with only **5 mock products** | Working UI that a reviewer can click through all steps without errors |
| **Deliver a “full‑stack‑light” prototype** (frontend‑only is acceptable) | < 2 h build time for a competent PR engineer |
| **Match the visual style of** <https://mooovin.jp/en> (color palette, typography, spacing) | Visual inspection shows < 5 % deviation in colour/contrast |
| **Keep the bundle light & fast** | Initial page load < 800 KB (gzip) and < 2 s on a 3G‑like connection |
| **Provide clean, testable code** | ‑ ≥ 80 % unit‑test coverage, lint‑free, TypeScript strict mode |

---  

## 2. Scope  

| In Scope | Out of Scope |
|---------|--------------|
| • Product list, search (client‑side), product detail page | • Real payment gateway integration |
| • Shopping‑cart UI + persist in‑browser storage (localStorage) | • Server‑side persistence (DB) |
| • Checkout “transaction” page that mocks payment & shipping steps | • Order history / user accounts |
| • Responsive design (desktop ≥ 1024 px, mobile ≤ 480 px) | • Admin panel, inventory management |
| • CI pipeline, unit & integration tests | • Internationalisation (i18n) – only EN/JP colour‑palette is needed |

---  

## 3. Functional Requirements  

| # | Feature | Description |
|---|----------|-------------|
| **1.1** | **Product List** | Grid of 5 mock products (image, title, price). Shows pagination (2 per page). |
| **1.2** | **Search** | Instant filter on title/description as the user types (debounced 300 ms). |
| **1.3** | **Detail** | Click → product detail page with larger image, description, “Add to Cart”. |
| **1.4** | **Add to Cart** | Adds product with quantity (default 1). Cart icon shows badge count. |
| **1.5** | **Cart Drawer** | Persistent side‑drawer (or modal) showing line items, subtotal, “Checkout” button. |
| **2.1** | **Transaction – Payment Mock** | Checkout page with a “Payment” section; clicking “Pay” shows a success toast after 1 s. |
| **2.2** | **Transaction – Shipping Mock** | Same page contains a “Shipping” form (address fields) with validation; “Confirm” shows a mock tracking number. |
| **2.3** | **Detail Transaction** | After mock payment, show a summary page: order ID, product list, total, shipping address, estimated delivery. |
| **3** | **No History** | No persistence beyond current session; refresh clears cart. |
| **4** | **UI/UX** | Follow Mooovin JP color palette, typography, spacing, hover/focus states. |
| **5** | **Performance** | Use Vite + React‑SSR‑like fast refresh, tree‑shaken Tailwind. Bundle < 800 KB. |

---  

## 4. Non‑Functional Requirements  

* **Accessibility** – WCAG 2.1 AA (semantic HTML, focus order, ARIA labels).  
* **Responsiveness** – Mobile‑first breakpoints: 320 px, 480 px, 768 px, 1024 px.  
* **Code Quality** – ESLint + Prettier, TypeScript `strict:true`.  
* **Testing** – Jest + React Testing Library (unit + UI smoke).  
* **CI** – GitHub Actions run lint, type‑check, tests on every PR.  
* **Deployment** – One‑click static hosting (Vercel / Netlify) using `npm run build`.  

---  

## 5. Architecture Overview  

```
+-------------------+          +-------------------+
|  Browser (SPA)    | <--->    |  Vite Dev Server  |
+-------------------+          +-------------------+
        |                                 |
        | (static assets, API mock)       |
        v                                 v
+-------------------+          +-------------------+
|  React (TS)       |          |  Mock Service     |
|  - Pages          |          |  Worker (MSW)    |
|  - UI components  |          |  (intercepts /   |
|  - State (Zustand)|          |   returns JSON)  |
+-------------------+          +-------------------+
```

* **Frontend** – React + TypeScript + Vite (dev server + build).  
* **Styling** – Tailwind CSS (JIT mode) + custom colour tokens from Mooovin palette.  
* **State** – Zustand (tiny, no boilerplate) for cart + checkout state.  
* **API Mock** – **Mock Service Worker** (MSW) serves `/api/products`, `/api/checkout`. No actual network; works in dev & production builds (bundled worker).  
* **Persistence** – `localStorage` only for cart restoration during the same browser session (optional).  

---  

## 6. Data Model (TypeScript Interfaces)

```ts
// src/types.ts
export interface Product {
  id: string;               // UUID or short slug
  title: string;
  description: string;
  price: number;           // cents (int) to avoid floating errors
  image: string;           // public URL from /public/assets/
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;               // generated `order-${Date.now()}`
  items: CartItem[];
  totalCents: number;
  shipping: ShippingInfo;
  createdAt: string;        // ISO
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}
```

---  

## 7. API Specification (Mock)

| Method | URL | Request | Response | Notes |
|--------|-----|---------|----------|-------|
| `GET` | `/api/products` | – | `{ products: Product[] }` | Supports `?page=` & `?limit=` query (client handles pagination). |
| `POST`| `/api/checkout` | `{ items: CartItem[], shipping: ShippingInfo }` | `{ orderId: string, tracking: string }` | Simulated 1 s delay, always success. |
| `GET` | `/api/order/:id` | – | `{ order: Order }` | Not required for the test but used for the “Detail Transaction” page. |

All endpoints are intercepted by **MSW**; no network traffic is sent.

---  

## 8. UI Flow & Wireframe Descriptions  

| Screen | Key Elements | Interaction |
|--------|--------------|-------------|
| **Home / Product List** | Header (logo, cart badge), search bar, grid cards, pagination controls (prev/next). | Search → filters list; click card → Detail; Add → updates cart. |
| **Product Detail** | Large image, title, price, description, “Add to Cart” button. | Add → toast “Added to cart”. |
| **Cart Drawer** | List of line items (image, title, qty selector, remove), subtotal, “Checkout” button. | Qty change → updates subtotal; remove → updates badge. |
| **Checkout Page** | Two sections: **Payment (mock)** – “Pay now” button; **Shipping** – address form + “Confirm”. | Pay → loading spinner → success toast; Confirm → generate mock tracking number. |
| **Transaction Summary** | Order ID, list of purchased items, shipping address, total, random tracking code (`TRK‑XXXXX`). | “Back to shop” button resets cart and returns to Home. |

*All pages use the Mooovin palette:*  

| Role | Hex |
|------|-----|
| Primary | `#ff5a5f` (Mooovin Red) |
| Accent  | `#00a699` (Mooovin Teal) |
| Background | `#f7f7f7` |
| Text – Dark | `#333333` |
| Text – Light | `#666666` |

Tailwind config will map these to `theme.extend.colors.{primary,accent,background}` for easy usage.

---  

## 9. Component Breakdown (React)

```
src/
 ├─ components/
 │   ├─ Header.tsx
 │   ├─ SearchBar.tsx
 │   ├─ ProductCard.tsx
 │   ├─ Pagination.tsx
 │   ├─ CartDrawer.tsx
 │   ├─ QuantityInput.tsx
 │   ├─ CheckoutForm.tsx
 │   └─ OrderSummary.tsx
 ├─ pages/
 │   ├─ HomePage.tsx
 │   ├─ ProductDetailPage.tsx
 │   ├─ CheckoutPage.tsx
 │   └─ ConfirmationPage.tsx
 ├─ hooks/
 │   └─ useCart.ts   (Zustand store wrapper)
 ├─ api/
 │   └─ client.ts    (MSW request definitions)
 ├─ types/
 │   └─ index.ts
 ├─ assets/
 │   └─ images/ (5 product jpg/png)
 └─ App.tsx + router (React Router v6)
```

---  

## 10. Development Workflow  

1. **Repo init** – `npm create vite@latest marketplace -- --template react-ts`  
2. **Add dependencies**  

   ```bash
   npm i tailwindcss@latest postcss@latest autoprefixer@latest \
           @headlessui/react @heroicons/react \
           zustand msw react-router-dom@6 \
           classnames
   npm i -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin \
           jest @testing-library/react @testing-library/jest-dom @testing-library/user-event \
           @testing-library/react-hooks
   ```

3. **Configure Tailwind** – JIT mode, custom colors.  
4. **Create MSW handlers** in `src/mocks/handlers.ts` (product list, checkout).  
5. **Implement pages/components** (start with static UI → hook up state).  
6. **Write tests** – one unit test per component, integration test that simulates a full checkout flow.  
7. **CI** – GitHub Actions file `.github/workflows/ci.yml` runs `npm run lint`, `npm run type-check`, `npm test`.  
8. **Deploy** – push to main → Vercel auto‑build (`npm run build`).  

---  

## 11. Timeline (Ideal 2‑day Sprint)

| Day | Milestone |
|-----|-----------|
| **Day 0** | Repo scaffolding, Tailwind + MSW setup (2 h) |
| **Day 1‑Morning** | Build static product list UI, pagination, search (3 h) |
| **Day 1‑Afternoon** | Product detail page + cart store + drawer (3 h) |
| **Day 2‑Morning** | Checkout page (payment & shipping mocks) + transaction summary (3 h) |
| **Day 2‑Afternoon** | Tests (unit + integration), lint & type fixes (2 h) |
| **Day 2‑Evening** | CI config, README, deployment (1 h) |
| **Total** | ~ 15 h (fits “cheap on time” requirement) |

---  

## 12. Deliverables  

| Artifact | Location |
|----------|----------|
| **Source code** | GitHub repo `github.com/<username>/mini‑marketplace` |
| **README** | Build/run instructions, tech stack, design decisions |
| **Live demo** | URL from Vercel / Netlify (e.g., `https://mini‑marketplace.vercel.app`) |
| **Test report** | CI badge + coverage summary (`npm run coverage`) |
| **Design tokens** | `tailwind.config.js` with Mooovin colors & spacing |
| **Mock data** | `src/mocks/products.json` (5 items) |

---  

## 13. Risks & Mitigations  

| Risk | Impact | Mitigation |
|------|--------|------------|
| **MSW not loading in production** (workers need HTTPS) | Show broken API | Bundle the worker as a static script (`public/mockServiceWorker.js`) and register only if `process.env.NODE_ENV !== 'production'` – fallback to static JSON import for production builds. |
| **Bundle size exceeds target** | Slower load → fails “fast & lightweight” | Use Vite's `esbuild` minify, enable `treeshake` and Tailwind’s JIT purge paths (`./src/**/*.tsx`). |
| **Responsive bugs** | Poor UX on mobile | Test with Chrome DevTools Device Toolbar on at least 3 breakpoints; add simple utility classes (`md:`, `lg:`). |
| **State loss on page reload** | Reviewer confused | Explain in README that cart is session‑only (clears on reload) – intentional per spec. |

---  

## 14. Glossary  

| Term | Meaning |
|------|----------|
| **MSW** | Mock Service Worker – intercepts fetch/XHR in browser and returns mocked JSON. |
| **Zustand** | Minimalist state‑management library (store = hook). |
| **Tailwind JIT** | Just‑In‑Time compiler that only outputs CSS used in source files. |
| **Mooovin palette** | Primary red `#ff5a5f`, teal accent `#00a699`, etc., extracted from the reference site. |

---  

## 15. Approval  

> **[ ]** Review & comment  
> **[ ]** Approve for implementation  

*Once approved, the engineer will fork the repo, follow the README, and deliver the live demo within the two‑day window.*