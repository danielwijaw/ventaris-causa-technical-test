# Project Folder Layout  

```
/src
│
├─ assets/                # Static images (5 product JPG/PNG) referenced by wireframes
│   └─ images/
│
├─ components/            # Reusable UI pieces (see RFC §9 component breakdown)
│   ├─ Header.tsx
│   ├─ SearchBar.tsx
│   ├─ ProductCard.tsx
│   ├─ Pagination.tsx
│   ├─ CartDrawer.tsx
│   ├─ QuantityInput.tsx
│   ├─ CheckoutForm.tsx
│   └─ OrderSummary.tsx
│
├─ pages/                 # Top‑level routes matching the wireframes
│   ├─ HomePage.tsx
│   ├─ ProductDetailPage.tsx
│   ├─ CheckoutPage.tsx
│   └─ ConfirmationPage.tsx
│
├─ hooks/                 # Custom hooks – currently only Zustand wrapper
│   └─ useCart.ts
│
├─ api/                   # MSW request definitions and a thin client wrapper
│   └─ client.ts
│
├─ types/                 # Shared TypeScript interfaces (Product, CartItem, Order, ShippingInfo)
│   └─ index.ts
│
├─ styles/                # Tailwind config & global CSS (base, utilities)
│   └─ tailwind.config.ts
│
├─ App.tsx                # Root component with React Router v6
├─ main.tsx               # Entry point (Vite bootstrap)
└─ index.html             # HTML template (injects Tailwind JIT CSS)
```

**Folder purpose quick‑look**

| Folder | Responsibility |
|--------|----------------|
| `assets/` | Holds the mock product images used in the **wireframes** and UI components. |
| `components/` | Pure, presentational pieces that map one‑to‑one with the **wireframe placeholders** (Header, CartDrawer, etc.). |
| `pages/` | Route‑level containers that compose components to match the **user journeys** (Home → Detail → Checkout → Confirmation). |
| `hooks/` | Encapsulates the **Zustand store** (`useCart`) so state logic stays out of UI components. |
| `api/` | MSW handlers (`src/mocks/handlers.ts`) and a tiny fetch wrapper (`client.ts`) that respects the **API contract** in `/docs/08_api_contract.md`. |
| `types/` | Centralised TypeScript definitions; mirrors the data model in `/docs/07_data_model.md`. |
| `styles/` | Tailwind‑JIT configuration that implements the **colour palette**, **typography**, and **spacing** from the style guide. |
| Root files | `App.tsx` wires React Router, `main.tsx` boots the Vite dev server, and `index.html` loads the tailwind‑generated CSS. |
