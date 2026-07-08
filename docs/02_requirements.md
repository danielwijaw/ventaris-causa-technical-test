# Requirements – Mini‑Project Marketplace

**Derived from:** RFC §3 (Functional), RFC §4 (Non‑Functional), and the Project Charter.

---

## Functional Requirements
| ID | Requirement | Description | Source |
|----|-------------|-------------|--------|
| **FR‑1** | Product List | Display a grid of 5 mock products with image, title, price. Paginate 2 items per page. | RFC §3.1 |
| **FR‑2** | Search | Instant client‑side filter on product title/description, debounced by 300 ms. | RFC §3.2 |
| **FR‑3** | Product Detail | Clicking a product opens a detail page showing larger image, full description, and an **Add to Cart** button. | RFC §3.3 |
| **FR‑4** | Add to Cart | Add a product to the cart with default quantity 1; update cart badge count. | RFC §3.4 |
| **FR‑5** | Cart Drawer | Persistent side‑drawer (or modal) listing line items, quantity controls, subtotal, and a **Checkout** button. | RFC §3.5 |
| **FR‑6** | Checkout – Payment Mock | Checkout page with a **Pay now** button; on click show a loading spinner then a success toast after 1 s. | RFC §3.6.1 |
| **FR‑7** | Checkout – Shipping Mock | Shipping form (name, address, city, zip, country) with validation; **Confirm** shows a mock tracking number. | RFC §3.6.2 |
| **FR‑8** | Transaction Summary | After payment, display order ID, purchased items, total, shipping address, and tracking code. | RFC §3.6.3 |
| **FR‑9** | No Persistent History | Cart data is cleared on full page refresh; only session storage (`localStorage`) is used during the session. | RFC §3.9 |
| **FR‑10** | UI/UX Styling | Apply Mooovin JP colour palette, typography, spacing, hover/focus states, and responsive layout. | RFC §3.4 & §5 |
| **FR‑11** | Performance | Bundle size < 800 KB gzipped; first‑contentful paint < 2 s on simulated 3G. | RFC §3.5 |

---

## Non‑Functional Requirements
| ID | Requirement | Description | Source |
|----|-------------|-------------|--------|
| **NFR‑1** | Accessibility | WCAG 2.1 AA compliance – semantic HTML, correct ARIA labels, focus order, colour contrast. | RFC §4 |
| **NFR‑2** | Responsiveness | Mobile‑first breakpoints: 320 px, 480 px, 768 px, 1024 px. Layout adapts gracefully. | RFC §4 |
| **NFR‑3** | Code Quality | ESLint + Prettier; TypeScript `strict:true`; no lint errors. | RFC §4 |
| **NFR‑4** | Testing | Jest + React Testing Library; ≥ 80 % statement/branch coverage; unit tests for each component and an integration test covering the full checkout flow. | RFC §4 |
| **NFR‑5** | CI / CD | GitHub Actions run lint, type‑check, tests on every PR; auto‑deploy static build to Vercel/Netlify on merge. | RFC §4 |
| **NFR‑6** | Deployment | One‑click static hosting; build command `npm run build`. | RFC §4 |
| **NFR‑7** | Maintainability | Clear folder structure (components, pages, hooks, api, mocks); use Zustand for simple global state. | RFC §5 |
| **NFR‑8** | Performance (Runtime) | Use Vite, React fast refresh, Tailwind JIT, tree‑shaken dependencies; ensure no unnecessary re‑renders. | RFC §5 |
| **NFR‑9** | Security | No external network calls; mock API runs in‑browser with MSW; avoid storing sensitive data. | Implicit from “frontend‑only” scope |

---

**Traceability Matrix** (selected rows):
- **FR‑1** → UI component `ProductCard` (src/components/ProductCard.tsx)
- **FR‑6** → `CheckoutForm` component with mock delay
- **NFR‑1** → All components include proper ARIA attributes and focus styles
- **NFR‑4** → Test files in `src/__tests__/*` covering each component and the checkout flow

These requirements will guide the UX Architect’s wireframes and the engineering implementation.
