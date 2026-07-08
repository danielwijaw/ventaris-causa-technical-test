# Mooovin Marketplace

A lightweight, mobile-first product marketplace built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite 8** for fast dev server and optimized builds
- **Tailwind CSS v4** (JIT mode) with Mooovin brand palette
- **Zustand** for cart state management with localStorage persistence
- **MSW (Mock Service Worker)** for API mocking
- **React Router v7** for SPA routing

## Getting Started

### Prerequisites

- Node.js 22 (use `nvm use 22`)
- npm

### Install & Run

```bash
cd mini-project-marketplace
nvm use 22
npm install
npm run dev
```

The app starts at `http://localhost:5173`. MSW intercepts all API calls automatically.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Bundle size: ~87 KB gzipped.

### Lint & Format

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── api/          # API client (fetch wrapper)
├── components/   # Reusable UI components
├── hooks/        # Zustand cart store
├── mocks/        # MSW handlers & mock data
├── pages/        # Route-level page components
├── types/        # TypeScript interfaces
├── App.tsx       # Router & layout
└── main.tsx      # Entry point (MSW init + React bootstrap)
```

## Pages

| Route | Page |
|-------|------|
| `/` | Home — product list with search & pagination |
| `/product/:id` | Product detail with Add to Cart |
| `/checkout` | Checkout form with order summary |
| `/confirmation` | Order confirmation with receipt |

## API Endpoints (Mocked by MSW)

- `GET /api/products?page=N&limit=N` — paginated product list
- `POST /api/checkout` — submit order with items and shipping info

## Docker

### Build

```bash
docker build -t mooovin-marketplace .
```

### Run

```bash
docker run -p 8080:80 mooovin-marketplace
```

Open `http://localhost:8080`.

## License

MIT
