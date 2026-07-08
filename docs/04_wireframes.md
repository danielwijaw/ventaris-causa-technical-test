# Wireframe Overview  

Below are the high‑level wireframe placeholders for the Mini‑Project Marketplace.  All layouts respect the mobile‑first breakpoints defined in the non‑functional requirements (320 px, 480 px, 768 px, 1024 px) [2].

| Page | Wireframe |
|------|-----------|
| **Home / Product List** | ![Home](/assets/wireframe_home.png) |
| **Product Detail** | ![Detail](/assets/wireframe_detail.png) |
| **Cart Drawer** (persistent side‑drawer or modal) | ![Cart Drawer](/assets/wireframe_cart.png) |
| **Checkout** (payment mock) | ![Checkout](/assets/wireframe_checkout.png) |
| **Order Confirmation** | ![Confirmation](/assets/wireframe_confirmation.png) |

## Layout Notes  

### 1. Home (Product List)  
* Grid of **5 mock products** with image, title, price.  
* **2 items per page** pagination controls at the bottom.  
* **Instant client‑side search** field (debounced 300 ms) above the grid.  
* Responsive breakpoints:  
  * **≤ 480 px** – single‑column list, larger tap targets.  
  * **≥ 768 px** – two‑column grid.  
  * **≥ 1024 px** – three‑column layout (optional stretch).  

*References:* Product list UI & pagination [2]; Search [2].

### 2. Product Detail  
* Larger product image, full description, price, **Add to Cart** button.  
* Back navigation (browser back or breadcrumb) that preserves previous pagination / search state.  
* All interactive elements have focus outlines and appropriate ARIA labels.  

*References:* Detail page acceptance criteria [3]; Add‑to‑Cart [2].

### 3. Cart Drawer  
* Persistent side‑drawer (or modal on mobile) listing line items.  
* Quantity controls (‑/+) per item, subtotal, and a **Checkout** button.  
* Cart badge count visible on the header at all times.  

*References:* Cart drawer UI [2].

### 4. Checkout (Payment Mock)  
* Simple form with a **Pay now** button.  
* On click: show loading spinner → after 1 s display success toast.  
* Mock shipping information displayed (static).  

*References:* Checkout mock flow [2].

### 5. Order Confirmation  
* Thank‑you message with order summary (items, total, shipping ETA).  
* CTA button to “Continue Shopping” that returns to the Home page preserving state.  

---