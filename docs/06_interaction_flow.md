# Interaction Flow – User Journey  

Below is a textual description of the end‑to‑end flow that the Software and Front‑end architects can translate into a diagram.

1. **Landing / Home** – User arrives at `/`.  
   * The **Product List** component renders a grid of 5 mock items, 2 per page, with pagination controls (**Day 1 – Morning** work item) [2].  
   * The **Search** input sits above the grid; each keystroke triggers a **debounced (300 ms)** client‑side filter of the product titles/descriptions [2].

2. **Navigate to Detail** – Clicking a product card routes to `/product/:id`.  
   * The **Product Detail** page displays a larger image, full description, price, and an **Add to Cart** button (acceptance criteria) [3].  
   * A back‑navigation element (browser back or breadcrumb) preserves the previous pagination/search state.

3. **Add to Cart** – User clicks **Add to Cart**.  
   * The item is added to a **Zustand** cart store with default quantity 1.  
   * The **cart badge** in the header updates instantly (FR‑4) [2].

4. **Open Cart Drawer** – User clicks the cart icon.  
   * A persistent side‑drawer (desktop) or modal (mobile) slides in, listing line items, quantity controls, and a **Checkout** button (FR‑5) [2].  
   * Quantity adjustments recalculate the subtotal in real time.

5. **Proceed to Checkout** – User hits **Checkout**.  
   * The **Checkout** page shows a mock payment summary and a **Pay now** button (FR‑6) [2].  
   * On click, a loading spinner appears, then after 1 second a success toast is shown (mock payment flow).

6. **Order Confirmation** – After successful payment, the user is redirected to an **Order Confirmation** screen.  
   * Displays a thank‑you message, order summary, and a **Continue Shopping** CTA that routes back to Home while preserving any existing search/pagination state.

7. **Edge Cases & Accessibility**  
   * All interactive controls have appropriate ARIA labels and focus outlines (NFR‑1) [2].  
   * The UI adapts at breakpoints 320 px, 480 px, 768 px, 1024 px (mobile‑first) [2]; on mobile the cart drawer becomes a full‑screen modal to avoid layout issues.  

**Resulting Flow:**  

`Home → (Search / Pagination) → Click Product → Detail → Add to Cart → Open Cart Drawer → Checkout → Success Toast → Confirmation → Continue Shopping → Home`

---