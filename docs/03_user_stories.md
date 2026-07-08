# User Stories – Mini‑Project Marketplace

*Derived from the Project Charter and the functional requirements (RFC §3). Each story includes acceptance criteria and maps to a primary requirement.*

---

## EPIC: **Browse & Purchase Products**
_As a shopper, I want to view a catalog of products, find what I need, and complete a purchase without leaving the site._

---

### 1. Product List & Pagination (FR‑1)
**Story**: As a shopper, I can see a paginated grid of products so I can browse the catalog.

**Acceptance Criteria**
- The home page displays up to two products per page (5 total → 3 pages).
- Each product card shows an image, title, and price.
- Pagination controls (`Previous`, `Next`) navigate between pages and are disabled appropriately.
- The UI respects the Mooovin colour palette and is responsive down to 320 px.

### 2. Instant Search (FR‑2)
**Story**: As a shopper, I can type keywords into a search bar and instantly filter the product list.

**Acceptance Criteria**
- The search input debounces user input by 300 ms.
- Matching is performed on product title and description (case‑insensitive).
- When no matches exist, a friendly “No products found” message appears.
- The search field retains its value when navigating back to the list.

### 3. Product Detail View (FR‑3)
**Story**: As a shopper, I can click a product to see detailed information.

**Acceptance Criteria**
- Clicking a product navigates to `/product/:id`.
- The detail page shows a larger image, full description, price, and an **Add to Cart** button.
- The page includes a back navigation (browser back or breadcrumb) to the list preserving prior pagination/search state.
- All interactive elements have focus outlines and ARIA labels.

### 4. Add to Cart & Cart Badge (FR‑4)
**Story**: As a shopper, I can add a product to my cart and see the cart count update.

**Acceptance Criteria**
- Clicking **Add to Cart** adds the item with quantity 1 to the cart store.
- The cart icon in the header displays a badge with the total item count.
- Adding the same product again increments its quantity.
- A toast notification confirms “Added to cart”.

### 5. Cart Drawer Interaction (FR‑5)
**Story**: As a shopper, I can review and modify my cart before checkout.

**Acceptance Criteria**
- The cart drawer slides in from the side (or appears as a modal) when the cart icon is clicked.
- Each line item shows image, title, quantity selector (± buttons), line subtotal, and a remove button.
- Changing quantity updates the subtotal and cart badge in real‑time.
- The drawer displays the cart subtotal and a **Checkout** button.
- The drawer is keyboard‑navigable and closes on Esc.

### 6. Checkout – Payment Mock (FR‑6)
**Story**: As a shopper, I can simulate paying for my order.

**Acceptance Criteria**
- The checkout page contains a **Pay now** button.
- Clicking the button shows a loading spinner for 1 s, then a success toast “Payment successful”.
- The button is disabled while the mock request is pending.
- The UI follows the primary colour for the button and hover/focus states.

### 7. Checkout – Shipping Form (FR‑7)
**Story**: As a shopper, I can provide shipping information and receive a tracking number.

**Acceptance Criteria**
- The shipping form includes fields: Name, Address, City, ZIP, Country.
- All fields are required; validation messages appear on blur/submit.
- The **Confirm** button is disabled until the form is valid.
- Upon confirmation, a mock tracking number (`TRK‑XXXXX`) is displayed.

### 8. Transaction Summary (FR‑8)
**Story**: As a shopper, I can view an order confirmation with all details after checkout.

**Acceptance Criteria**
- The summary page shows: order ID, list of purchased items (image, title, qty, price), total amount, shipping address, and tracking code.
- A **Back to shop** button clears the cart and returns to the home page.
- The page uses the accent colour for highlights.

---

## Cross‑Cutting Concerns (Non‑Functional)
- All pages must meet **WCAG 2.1 AA** (NFR‑1).
- The application loads under 800 KB gzipped and reaches first‑contentful paint < 2 s on a 3G simulation (NFR‑2).
- Unit tests cover each component; an end‑to‑end test walks through the full EPIC from list to transaction summary (NFR‑4).

These stories will be the basis for the UX Architect’s wireframes and the engineering sprint backlog.
