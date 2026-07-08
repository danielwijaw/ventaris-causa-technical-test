"# Test Plan — Mini Project Marketplace

## 1. Overall Strategy

The testing strategy follows a **trophy‑shaped** approach (fewer end‑to‑end tests, more integration tests, many unit tests) as recommended by Kent C. Dodds. The goal is to maximise confidence per test execution cost.

| Layer | Focus | Tool | Target Coverage |
|-------|-------|------|-----------------|
| **Unit** | Individual components, hooks, utility functions in isolation | Jest + React Testing Library | ≥ 80 % statement/branch |
| **Integration** | User flows spanning multiple components and the MSW mock API | Jest + React Testing Library + MSW | All critical paths (search → add → checkout → confirmation) |
| **UI / Visual** | Responsive layout, colour palette, typography, accessibility | Manual + Lighthouse + axe‑core | NFR‑1 (WCAG AA), NFR‑2 (responsive) |

## 2. Test Types

### 2.1 Unit Tests
- **Scope:** Every component in `src/components/`, the Zustand store (`useCart.ts`), the API client (`client.ts`), and utility functions.
- **What to test:**
  - Component renders without crashing.
  - Props are correctly displayed (title, price, quantity, etc.).
  - User interactions trigger expected callbacks (onClick, onChange, onSubmit).
  - Edge cases: empty state, error state, loading state, disabled state.
  - Store actions: addItem, removeItem, updateQuantity, clearCart, persistence.
- **What NOT to test:** Internal implementation details (e.g., exact CSS classes, internal state shape). Focus on behaviour visible to the user.

### 2.2 Integration Tests
- **Scope:** Full user flows that exercise multiple components, the Zustand store, and the MSW mock API.
- **What to test:**
  - Home page loads products from MSW, displays them, pagination works.
  - Search filters products client‑side.
  - Clicking a product navigates to detail page.
  - Add to Cart updates the cart badge and drawer.
  - Checkout flow: fill shipping form → submit → see confirmation with order details.
  - Error handling: MSW returns 400/500, UI shows error message.
- **What NOT to test:** Real network calls (MSW replaces them), browser navigation (React Router handles it).

### 2.3 Manual / Visual Tests
- **Scope:** Responsive breakpoints (320px, 480px, 768px, 1024px), colour contrast, focus outlines, ARIA labels.
- **Tools:** Browser DevTools, Lighthouse (accessibility audit), axe DevTools extension.
- **Frequency:** Once per feature completion, before release.

## 3. Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 29.x | Test runner, assertions, mocking, coverage reporting |
| **@testing-library/react** | 14.x | Render components, query DOM, fire events |
| **@testing-library/jest-dom** | 6.x | Custom matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.) |
| **@testing-library/user-event** | 14.x | Simulate realistic user interactions (clicks, typing) |
| **MSW** | 2.x | Mock API handlers reused from `src/mocks/handlers.ts` |
| **jest‑environment‑jsdom** | 29.x | Browser‑like environment for tests |

## 4. Coverage Targets

| Metric | Target | Enforcement |
|--------|--------|-------------|
| Statement coverage | ≥ 80 % | CI pipeline fails below threshold |
| Branch coverage | ≥ 80 % | CI pipeline fails below threshold |
| Function coverage | ≥ 80 % | CI pipeline fails below threshold |
| Line coverage | ≥ 80 % | CI pipeline fails below threshold |

Coverage is collected via Jest's `--coverage` flag. The CI workflow will run:

```bash
npm test -- --coverage --coverageThreshold='{\"global\":{\"statements\":80,\"branches\":80,\"functions\":80,\"lines\":80}}'
```

## 5. Test File Organisation

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Header.test.tsx
│   │   ├── SearchBar.test.tsx
│   │   ├── ProductCard.test.tsx
│   │   ├── Pagination.test.tsx
│   │   ├── CartDrawer.test.tsx
│   │   ├── QuantityInput.test.tsx
│   │   ├── CheckoutForm.test.tsx
│   │   └── OrderSummary.test.tsx
│   ├── hooks/
│   │   └── useCart.test.ts
│   ├── api/
│   │   └── client.test.ts
│   └── integration/
│       ├── homePageFlow.test.tsx
│       ├── checkoutFlow.test.tsx
│       └── errorHandling.test.tsx
```

## 6. Test Configuration

### `jest.config.ts` (to be created at project root)

```ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__tests__/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/mocks/**',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
```

### `src/__tests__/setup.ts`

```ts
import '@testing-library/jest-dom';
import { server } from '../mocks/browser';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 7. CI Integration

The test suite runs in GitHub Actions on every push and pull request:

```yaml
# .github/workflows/test.yml (to be created)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --coverage
```

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| MSW handlers change and tests break | Reuse the same `handlers.ts` in tests; update tests when contract changes |
| Flaky tests due to async delays | Use `waitFor` and `findBy*` queries; avoid arbitrary timeouts |
| Low coverage on edge cases | Enforce coverage thresholds in CI; review uncovered lines in PR |
| Accessibility regressions | Add `jest-axe` for automated a11y checks in integration tests |
"