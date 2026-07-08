"# Unit Test Cases — Mini Project Marketplace

## 1. Component Tests

### 1.1 `Header.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| H1 | Renders with logo link | Render `<Header onCartClick={vi.fn()} />` | Logo text \"Mooovin\" is visible; link points to `/` |
| H2 | Renders cart button with aria-label | Render with empty cart | Button has `aria-label=\"Open cart\"` |
| H3 | Shows badge count when items in cart | Cart store has 3 items | Badge element displays \"3\" |
| H4 | Badge caps at 99+ | Cart store has 150 items | Badge displays \"99+\" |
| H5 | Badge hidden when cart empty | Cart store has 0 items | No badge element in DOM |
| H6 | Clicking cart icon fires onCartClick | Click the cart button | `onCartClick` callback is called once |
| H7 | Keyboard accessibility — Enter on cart button | Focus cart button, press Enter | `onCartClick` callback is called once |

### 1.2 `SearchBar.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| S1 | Renders search input | Render `<SearchBar onSearch={vi.fn()} />` | Input element exists with placeholder \"Search products...\" |
| S2 | Fires onSearch after debounce delay (300ms) | Type \"widget\" into input | `onSearch` is called with \"widget\" after 300ms |
| S3 | Clears previous debounce on rapid typing | Type \"w\", wait 100ms, type \"wi\", wait 300ms | `onSearch` is called only once with \"wi\" |
| S4 | Does not fire onSearch before debounce elapses | Type \"a\", wait 100ms | `onSearch` is not called yet |
| S5 | Shows defaultValue when provided | Render with `defaultValue=\"lamp\"` | Input shows \"lamp\" |
| S6 | Handles empty input gracefully | Clear input (value = \"\") | `onSearch` is called with \"\" after debounce |

### 1.3 `ProductCard.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| PC1 | Renders product name and price | Render with valid `Product` (priceCents = 1999) | Name visible; price \"$19.99\" visible |
| PC2 | Renders short description | Render with product | `shortDescription` text is visible |
| PC3 | Links to product detail page | Render with product id=\"p1\" | Anchor element links to `/product/p1` |
| PC4 | \"Add to Cart\" button is present | Render product | Button with text \"Add to Cart\" is visible |
| PC5 | Clicking \"Add to Cart\" adds item to store | Click Add to Cart button | `addItem` is called with productId, name, priceCents (verified via store query) |
| PC6 | Price formats correctly for $0.00 edge case | product.priceCents = 0 | Price shows \"$0.00\" |
| PC7 | Price formats correctly for large values | product.priceCents = 999999 | Price shows \"$9,999.99\" |

### 1.4 `Pagination.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| P1 | Renders nothing when total ≤ perPage | `totalItems=2, perPage=2` | Component returns null |
| P2 | Renders Previous, page numbers, Next | `currentPage=1, totalItems=5, perPage=2` | \"Previous\" disabled, page buttons \"1\", \"2\", \"3\", \"Next\" enabled |
| P3 | Clicking page number calls onPageChange | Click page button \"2\" | `onPageChange` called with `2` |
| P4 | Clicking Next advances page | Click Next button | `onPageChange` called with `currentPage + 1` |
| P5 | Previous disabled on first page | `currentPage=1` | Previous button has `disabled` attribute |
| P6 | Next disabled on last page | `currentPage=3, totalItems=5, perPage=2` | Next button has `disabled` attribute |
| P7 | Active page has aria-current=\"page\" | `currentPage=2` | Page \"2\" button has `aria-current=\"page\"` |

### 1.5 `QuantityInput.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| Q1 | Renders plus, minus buttons and input | Render with `quantity=1` | Minus button, input showing \"1\", plus button all visible |
| Q2 | Clicking minus calls onDecrease | Click minus button | `onDecrease` called once |
| Q3 | Clicking plus calls onIncrease | Click plus button | `onIncrease` called once |
| Q4 | Minus disabled when quantity = min | `quantity=1, min=1` | Minus button has `disabled` attribute |
| Q5 | Plus disabled when quantity = max | `quantity=99, max=99` | Plus button has `disabled` attribute |
| Q6 | Typing valid value calls onChange | Type \"5\" in input | `onChange` called with `5` |
| Q7 | Typing invalid value (below min) does not call onChange | Type \"0\" when min=1 | `onChange` not called (or reverted) |
| Q8 | Buttons have correct aria-labels | Render component | Minus has `aria-label=\"Decrease quantity\"`, Plus has `aria-label=\"Increase quantity\"`, input has `aria-label=\"Quantity\"` |

### 1.6 `CartDrawer.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| CD1 | Renders \"Cart (0)\" when empty | Cart store has 0 items, `cartOpen=true` | Title shows \"Cart (0)\", empty message \"Your cart is empty\" |
| CD2 | Shows line items when cart has items | Cart has 2 items | Both item names and subtotals visible |
| CD3 | Subtotal is calculated correctly | Items: p1 (1999¢ × 2) + p2 (3499¢ × 1) = 7497¢ | Subtotal shows \"$74.97\" |
| CD4 | Remove button removes item | Click \"Remove\" on item | Item removed from store; count decreases |
| CD5 | Proceed to Checkout navigates to /checkout | Click checkout button | `window.location.pathname` equals `/checkout` |
| CD6 | Drawer hidden when cartOpen=false | `cartOpen=false` | Drawer has transform that translates it off-screen |
| CD7 | Overlay click closes drawer | Click overlay (backdrop) | `setCartOpen(false)` called |
| CD8 | Close button closes drawer | Click X button | `setCartOpen(false)` called |
| CD9 | Quantity controls update cart | Click + on a line item | `updateQuantity` called with incremented value |

### 1.7 `CheckoutForm.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| CF1 | Renders all shipping fields | Render `<CheckoutForm />` | Name, Address, City, ZIP, Country inputs visible |
| CF2 | Shows validation errors when submitted empty | Click \"Pay Now\" with empty form | All 5 fields show error messages |
| CF3 | Calls onSubmit with valid data | Fill all fields, click submit | `onSubmit` called with `ShippingInfo` object |
| CF4 | Submit button shows \"Processing...\" when disabled | `isSubmitting=true` | Button text is \"Processing...\", button disabled |
| CF5 | Errors clear when user corrects a field | Type in a field with error | Error message for that field disappears |
| CF6 | Error styling applied to invalid fields | Submit empty form | Inputs with errors have `border-[#DC3545]` class |
| CF7 | Submit disabled during submission | `isSubmitting=true` | Button has `disabled` attribute |

### 1.8 `OrderSummary.tsx`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| OS1 | Renders order items with quantities | Items: Acme Widget ×2, $19.99 each | Shows \"Acme Widget × 2\", line total \"$39.98\" |
| OS2 | Calculates total correctly | subtotalCents = 7497 | Total shows \"$74.97\" |
| OS3 | Handles empty items array | items = [] | Renders with no line items, total shows \"$0.00\" |

## 2. Hook Tests — `useCart.ts` (Zustand Store)

| # | Test Case | Action | Expected Assertion |
|---|-----------|--------|--------------------|
| ST1 | Initial state is empty | Create store (reset) | `items` is `[]`, `itemCount` is `0`, `subtotalCents` is `0` |
| ST2 | addItem adds a new item with quantity 1 | Call `addItem({ productId: 'p1', name: 'Widget', priceCents: 1999 })` | `items.length` is `1`, item.quantity is `1` |
| ST3 | addItem increments quantity for existing item | Call `addItem` twice with same productId | `items.length` is `1`, item.quantity is `2` |
| ST4 | removeItem removes item from cart | Call `removeItem('p1')` | `items` is `[]` |
| ST5 | updateQuantity sets exact quantity | Call `updateQuantity('p1', 5)` | item.quantity is `5` |
| ST6 | updateQuantity with 0 removes item | Call `updateQuantity('p1', 0)` | item is removed |
| ST7 | updateQuantity with negative removes item | Call `updateQuantity('p1', -1)` | item is removed |
| ST8 | clearCart empties all items | Call `clearCart()` | `items` is `[]` |
| ST9 | itemCount returns sum of quantities | Items: qty 2 + qty 3 | `itemCount()` returns `5` |
| ST10 | subtotalCents returns correct total | Items: (1999¢ × 2) + (3499¢ × 1) = 7497¢ | `subtotalCents()` returns `7497` |
| ST11 | toggleCart flips cartOpen | `cartOpen` = false, call `toggleCart()` | `cartOpen` becomes true |
| ST12 | Multiple toggles work correctly | toggle → true, toggle → false, toggle → true | Final state is true |
| ST13 | Persistence middleware saves to localStorage | Add item, check localStorage key `mooovin-cart` | localStorage has serialised state |
| ST14 | Persistence middleware restores on rehydrate | Simulate page reload (create new store) | Items are restored from localStorage |

## 3. API Client Tests — `client.ts`

| # | Test Case | Input / Action | Expected Assertion |
|---|-----------|----------------|--------------------|
| AC1 | fetchProducts returns products | Call `fetchProducts(1, 2)` | Returns object with `page: 1, limit: 2, total: 5, products: [...]` |
| AC2 | fetchProducts throws on non-ok response | MSW returns 500 | `fetchProducts` throws with message \"Failed to fetch products\" |
| AC3 | fetchProducts passes query params correctly | Call `fetchProducts(3, 2)` | Request URL contains `page=3&limit=2` |
| AC4 | submitCheckout returns order on success | Call with valid items + shipping | Returns object with `orderId`, `trackingNumber`, `items`, `totalCents` |
| AC5 | submitCheckout throws on validation error | MSW returns 400 | Throws with error message from response |
| AC6 | submitCheckout sends correct Content-Type | Call submitCheckout | Request has `Content-Type: application/json` header |

## 4. Edge Cases & Boundary Conditions

| # | Scenario | Component(s) | Expected Behaviour |
|---|----------|--------------|-------------------|
| EC1 | Rapid double-click Add to Cart | ProductCard | Quantity increments by 2 (or button disabled during first action) |
| EC2 | Add product to cart, then remove, then add again | CartDrawer | Product appears fresh with quantity 1 |
| EC3 | Search with special characters (e.g., \"&<>'\" ) | SearchBar | Input accepts and filters strings; no XSS (React escapes) |
| EC4 | Very long product name (>50 chars) | ProductCard | Name truncates or wraps without breaking layout |
| EC5 | Empty cart → proceed to checkout | CartDrawer | Checkout button hidden (not rendered) |
| EC6 | Checkout with zero items | CheckoutPage | Redirects to empty cart message / home |
| EC7 | Browser back after checkout | ConfirmationPage | State lost (no duplicate order); redirects to home |
| EC8 | Rapid pagination clicks | Pagination + HomePage | Last click wins; no duplicate API calls |
| EC9 | Network offline / MSW unavailable | HomePage | Error state shown with retry button |
| EC10 | localStorage full / unavailable | useCart | Fallback to in-memory store (no crash) |
"