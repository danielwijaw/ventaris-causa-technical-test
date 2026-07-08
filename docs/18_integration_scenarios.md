"# Integration Scenarios — Mini Project Marketplace

## 1. Environment Setup

All integration tests use:
- **Jest** as the test runner
- **React Testing Library** for component rendering and queries
- **MSW** (same handlers as the app: `src/mocks/handlers.ts`) to mock API calls
- A clean Zustand store before each test (reset via `useCartStore.setState({ items: [], cartOpen: false })`)

**Test utilities shared across scenarios:**

```ts
// src/__tests__/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useCartStore } from '../hooks/useCart';

beforeEach(() => {
  // Reset cart state before each integration test
  useCartStore.setState({ items: [], cartOpen: false });
});

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
```

## 2. Integration Scenario: Home → Product List → Pagination

**User Story:** As a shopper, I want to browse products and navigate between pages.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/` | Loading skeleton appears briefly | Skeleton placeholders are visible (use `waitForElementToBeRemoved` if needed) |
| 2 | Wait for API response | Products appear in grid | 2 `ProductCard` components rendered with names: \"Acme Widget\", \"Nimbus Lamp\" |
| 3 | Verify pagination controls | Previous (disabled), page 1 (active), page 2, page 3, Next (enabled) | Page buttons visible; previous has `disabled` attribute |
| 4 | Click \"Next\" | Page advances to page 2 | Page 2 button has `aria-current=\"page\"`; products change to \"Zephyr Headphones\", \"Orion Backpack\" |
| 5 | Click \"Previous\" | Returns to page 1 | Products: \"Acme Widget\", \"Nimbus Lamp\" |
| 6 | Click page \"3\" | Shows page 3 | Product: \"Pulse Smartwatch\" only; Next disabled |
| 7 | MSW returns 400 | (Simulate by overriding handler) | Error message visible; \"Try Again\" button visible |
| 8 | Click \"Try Again\" | Retries API call | Products load successfully (if handler restored) |

## 3. Integration Scenario: Search → Filter Products

**User Story:** As a shopper, I want to search for products by name or description.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/` | Products loaded | 2 products visible |
| 2 | Type \"lamp\" in search bar | Wait 300ms debounce | Filtered results show only \"Nimbus Lamp\" |
| 3 | Clear search input | Wait 300ms | All 2 products visible again |
| 4 | Type \"xyzzy\" (no match) | Wait 300ms | \"No results for \\\"xyzzy\"\" message visible |
| 5 | Search while paginated | Go to page 2, type \"backpack\" | Filter applies to current page products; shows matching result if present |

## 4. Integration Scenario: Product Detail → Add to Cart

**User Story:** As a shopper, I want to view product details and add items to my cart.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/` | Products loaded | 2 products visible |
| 2 | Click on product link (e.g., \"Acme Widget\") | Navigates to `/product/p1` | URL is `/product/p1`; full description visible; price \"$19.99\" |
| 3 | Click \"Add to Cart — $19.99\" | Item added to cart; badge updates | Header badge shows \"1\" |
| 4 | Click Add to Cart again | Quantity increments | Header badge shows \"2\" |
| 5 | Click browser back | Returns to home page | Previous pagination/search state preserved |

## 5. Integration Scenario: Cart Drawer → Quantity Update → Checkout

**User Story:** As a shopper, I want to review my cart, adjust quantities, and proceed to checkout.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Add product to cart (from detail page) | Item in store | Cart store has 1 item |
| 2 | Click cart icon in header | Cart drawer slides in from right | Drawer has `role=\"dialog\"` and `aria-modal=\"true\"` |
| 3 | Verify item displayed | Drawer content | Item name visible, quantity control shows \"1\", subtotal matches |
| 4 | Click \"+\" on quantity control | Quantity increases | Input shows \"2\", line total updates |
| 5 | Click \"−\" on quantity control | Quantity decreases | Input shows \"1\", line total updates |
| 6 | Click \"Remove\" | Item removed from cart | Cart shows empty message; subtotal hidden |
| 7 | Add item again, then click \"Proceed to Checkout\" | Navigates to `/checkout`, drawer closes | URL is `/checkout`; cart drawer not visible |

## 6. Integration Scenario: Full Checkout Flow → Confirmation

**User Story:** As a shopper, I want to complete a purchase and see an order confirmation.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Add 2 products to cart | From detail page or home page | Cart store has 2 items, badge shows total count |
| 2 | Navigate to `/checkout` | Checkout page renders | Shipping form visible; order summary shows 2 items with correct totals |
| 3 | Submit empty form | Validation errors shown | All 5 fields show error messages |
| 4 | Fill in valid shipping info | Type: Jane Doe, 123 Main St, Springfield, 12345, USA | Errors clear as fields are filled |
| 5 | Click \"Pay Now\" | Button shows \"Processing...\" and is disabled | Button disabled; no double-submit |
| 6 | Wait for MSW response (1s delay) | Loading state resolves | Navigation to `/confirmation` |
| 7 | Confirmation page renders | Order details visible | Order ID, tracking number, items, total, shipping info all displayed |
| 8 | Cart is cleared | Check Zustand store | `items` is `[]` |
| 9 | Click \"Continue Shopping\" | Navigates to `/` | Home page loads fresh products |

## 7. Integration Scenario: Error Handling — API Failures

**User Story:** As a developer, I want to verify the app handles API errors gracefully.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Override MSW handler for `GET /api/products` to return 500 | Navigate to `/` | Error message \"Failed to load products\" visible; \"Try Again\" button visible |
| 2 | Click \"Try Again\" | Retry API call | If fixed, products load; if still failing, error remains |
| 3 | Override MSW handler for `POST /api/checkout` to return 400 | Navigate to `/checkout` with items, fill form, submit | Error banner visible: \"Shipping address incomplete\" (or server error message) |
| 4 | Override MSW handler for `POST /api/checkout` to return 500 | Submit checkout | Error banner: generic error message \"Checkout failed...\" |
| 5 | Verify form is still usable after error | Edit a field | Form is interactive; re-submit works |

## 8. Integration Scenario: Direct URL Access & Edge Cases

**User Story:** As a user, I want the app to handle direct URL entry and edge cases gracefully.

### Flow Steps

| Step | Action | Expected Result | Assertion |
|------|--------|-----------------|-----------|
| 1 | Navigate directly to `/product/invalid` | Product not found | \"Product not found\" message; link to home |
| 2 | Navigate directly to `/checkout` with empty cart | Redirected to checkout empty state | \"Your cart is empty\" message; link to continue shopping |
| 3 | Navigate directly to `/confirmation` without state | Redirected to home | Navigates to `/` (no crash) |
| 4 | Hard refresh on `/checkout` | Cart state restored from localStorage | If items were in cart, they persist |
| 5 | Navigate to `/` with `?page=999` | API returns empty page | Empty grid; pagination at page 999; Next disabled |

## 9. Responsive Behavior Checks (Manual / Visual)

These are visual checks not automated via Jest but documented for manual QA.

| # | Viewport | Expected Layout |
|---|----------|-----------------|
| RB1 | 320px (mobile) | Single-column product grid; header with logo and cart icon; search bar full-width; drawer overlays full viewport |
| RB2 | 480px (mobile large) | Single-column grid; tap targets ≥ 44px |
| RB3 | 768px (tablet) | Two-column product grid; cart drawer max-width ~384px |
| RB4 | 1024px (desktop) | Three-column product grid; checkout shows two-column layout (form + summary) |

## 10. Accessibility Checks (Manual / Axe)

| # | Check | Tool |
|---|-------|------|
| A11Y1 | All images have alt text or role presentation | axe-core, manual |
| A11Y2 | Focus order follows visual order (tab through cart drawer) | Manual keyboard test |
| A11Y3 | Colour contrast meets WCAG AA (4.5:1 for text) | axe-core, Lighthouse |
| A11Y4 | ARIA labels on interactive elements (cart button, quantity controls, pagination) | axe-core |
| A11Y5 | Form fields have associated labels | Manual, axe-core |
| A11Y6 | Error messages announced by screen readers | Manual test with VoiceOver / NVDA |

## 11. Performance Checks

| # | Metric | Target | Tool |
|---|--------|--------|------|
| PERF1 | Bundle size (gzipped JS) | < 800 KB | Build output, Lighthouse |
| PERF2 | First Contentful Paint (FCP) on simulated 3G | < 2 s | Lighthouse |
| PERF3 | Lighthouse Performance score | ≥ 90 | Lighthouse |
| PERF4 | Lighthouse Accessibility score | ≥ 90 | Lighthouse |

## 12. Test Data Fixtures

Reusable mock data for integration tests:

```ts
// src/__tests__/fixtures.ts
export const mockProducts = [
  {
    id: 'p1',
    name: 'Acme Widget',
    shortDescription: 'Compact, versatile widget',
    description: 'Full description of Acme Widget.',
    priceCents: 1999,
    imageUrl: '/assets/images/p1.png',
  },
  {
    id: 'p2',
    name: 'Nimbus Lamp',
    shortDescription: 'Modern LED lamp',
    description: 'Full description of Nimbus Lamp.',
    priceCents: 3499,
    imageUrl: '/assets/images/p2.png',
  },
  // ... p3, p4, p5 (same as src/mocks/products.json)
];

export const mockShippingInfo = {
  name: 'Jane Doe',
  address: '123 Main St',
  city: 'Springfield',
  zip: '12345',
  country: 'USA',
};

export const mockOrder = {
  orderId: 'ORD-1700000000000',
  items: [
    { productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 },
  ],
  totalCents: 3998,
  shipping: mockShippingInfo,
  trackingNumber: 'TRK-ABC123',
};
```
"