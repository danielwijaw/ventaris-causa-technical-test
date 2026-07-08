# Implementation Notes — Mini Project Marketplace

## Overview

This document summarises what was built, open TODOs, and next-step hand-off points for the Mini Project Marketplace.

## What Was Built

### Tech Stack
- **Vite + React 19 + TypeScript** (strict mode)
- **Tailwind CSS v4** (JIT mode) with Mooovin colour palette from the style guide
- **Zustand** for cart state management with localStorage persistence
- **MSW v2** for mock API (handlers for GET /api/products and POST /api/checkout)
- **React Router v7** for SPA routing (Home → Detail → Checkout → Confirmation)

### Folder Structure (matches `/docs/11_project_structure.md`)
- `src/types/` — Product, CartItem, ShippingInfo, Order interfaces
- `src/api/` — fetch wrapper (`client.ts`)
- `src/hooks/` — Zustand cart store (`useCart.ts`) with persistence
- `src/mocks/` — MSW setup (`browser.ts`, `handlers.ts`, `products.json`)
- `src/components/` — Header, SearchBar, ProductCard, Pagination, CartDrawer, QuantityInput, CheckoutForm, OrderSummary
- `src/pages/` — HomePage, ProductDetailPage, CheckoutPage, ConfirmationPage

### Key Features
- **Product listing** with pagination (2 items/page) and client-side search (debounced 300ms)
- **Product detail** page with Add to Cart
- **Cart drawer** (slide-in from right, overlay backdrop) with +/- quantity controls
- **Checkout** form with validation (all fields required)
- **Order confirmation** page with order summary, shipping info, tracking number
- **Cart persistence** via Zustand + localStorage (`mooovin-cart` key)
- **MSW mock API** with realistic delays (300ms list, 1000ms checkout)
- **Loading skeletons** on HomePage
- **Error states** with retry buttons
- **Empty states** for cart and checkout
- **Responsive design** (mobile-first, grid breakpoints: 1 col → 2 col → 3 col)

### Bundle Size
- JS: 81.16 KB gzipped
- CSS: 5.89 KB gzipped
- Total: **~87 KB gzipped** (well under 800 KB target)

## Open TODOs

1. **Product images** — Placeholder gradient initials used; real images should be placed in `src/assets/images/` (p1.png–p5.png)
2. **Unit tests** — Jest + React Testing Library setup not yet configured (test files go in `src/__tests__/`)
3. **CI pipeline** — GitHub Actions workflow for lint, type-check, test, build not yet configured
4. **Husky pre-commit hooks** — Not configured (the `.husky/pre-commit` script from `/docs/12_lint_prettier_config.md`)
5. **A11y audit** — Basic ARIA labels present but full WCAG audit not performed
6. **Lighthouse performance audit** — Quick check done, bundle size is good, but full Lighthouse audit TBD

## Next-Step Hand-off Points

### For QA / Reviewer
- Verify the routing flow: Home → Product Detail → Cart (drawer) → Checkout → Confirmation
- Test search functionality with product names and descriptions
- Verify cart persistence across page refreshes
- Check responsive layouts at 320px, 480px, 768px, 1024px
- Verify MSW mocks work (both with and without MSW – app should still render)

### For Backend / API Team
- The API contract is defined in `src/mocks/handlers.ts` and mirrored in `src/types/index.ts`
- Expected endpoints: `GET /api/products?page=N&limit=N` and `POST /api/checkout`
- The checkout request body includes `items[]` and `shipping` object
- Response format matches the `Order` interface

### For Product / Design
- All colours from the style guide are implemented as arbitrary Tailwind values (e.g., `bg-[#0D6EFD]`)
- Typography uses Inter font (loaded from Google Fonts)
- Button states (hover, focus, active, disabled) all implemented per style guide
- Missing product images use gradient placeholder with first letter of product name

## How to Run

```bash
cd mini-project-marketplace
nvm use 22
npm install
npm run dev
```

The app starts on `http://localhost:5173` with MSW mocking all API calls.

## Repository Status

- Clean `.gitignore` (from Vite template)
- TypeScript compiles with no errors
- Build succeeds (dev and production)
- Ready for CI pipeline
