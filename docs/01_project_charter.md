# Project Charter – Mini‑Project Marketplace

**Version:** 0.1 | **Prepared by:** Product Manager & Technical Architect

---

## Objective

Create a lightweight, full‑stack‑light e‑commerce prototype that demonstrates the core shopping flow (product list → search → detail → cart → checkout) using **5 mock products** and matches the visual style of **Mooovin.jp** (RFC §1). The solution must be fast, testable, and deployable as a static site.

---

## Success Metrics (RFC §1)
| Metric | Target |
|--------|--------|
| End‑to‑end UI flow works without errors | 100 % of critical paths (list → checkout) complete successfully in manual testing |
| Build & bundle size | < 800 KB (gzip) |
| First‑contentful paint on 3G‑like connection | < 2 s |
| Visual fidelity to Mooovin palette | ≤ 5 % deviation in colour/contrast (subjective visual inspection) |
| Test coverage | ≥ 80 % unit‑test coverage |
| CI lint/type check passes on every PR | 100 % |

---

## Timeline (RFC §11)
| Day | Milestone |
|-----|-----------|
| **Day 0** | Repository scaffolding, Tailwind + MSW setup (≈ 2 h) |
| **Day 1 – Morning** | Product list UI, pagination, client‑side search (≈ 3 h) |
| **Day 1 – Afternoon** | Product detail page, cart store (Zustand), cart drawer UI (≈ 3 h) |
| **Day 2 – Morning** | Checkout page (payment & shipping mocks), transaction summary (≈ 3 h) |
| **Day 2 – Afternoon** | Unit & integration tests, lint/type fixes (≈ 2 h) |
| **Day 2 – Evening** | CI configuration, README, one‑click static deployment (≈ 1 h) |
| **Total** | **≈ 15 h** (fits the “< 2 h build time for a competent PR engineer” requirement) |

---

## Scope (RFC §2)
| In‑Scope | Out‑of‑Scope |
|----------|--------------|
| • Product list (grid, pagination) | • Real payment gateway integration |
| • Client‑side search (debounced) | • Server‑side persistence (database) |
| • Product detail page | • Order history / user accounts |
| • Cart UI with localStorage persistence | • Admin panel, inventory management |
| • Mock checkout flow (payment & shipping) | • Internationalisation (i18n) – only EN/JP colour‑palette required |
| • Responsive design (desktop ≥ 1024 px, mobile ≤ 480 px) | |
| • CI pipeline, lint, tests | |

---

## Personas
| Role | Reason for Involvement |
|------|------------------------|
| **Product Owner** (business stakeholder) | Defines business goals, success metrics, and validates visual fidelity. |
| **UX Designer** (new persona) | Crafts wireframes, ensures accessibility (WCAG 2.1 AA) and responsive layouts. |
| **Frontend Engineer** | Implements UI, state management, mock API, and performance optimisations. |
| **QA Engineer** | Writes unit / integration tests, validates accessibility and performance criteria. |
| **DevOps / Release Engineer** | Sets up CI pipeline, static hosting deployment, and monitors bundle size. |
| **Technical Architect** (you) | Aligns technical decisions with constraints, produces architecture overview. |

---

*All downstream documentation (requirements, user stories) will be derived from this charter and the RFC sections referenced above.*
