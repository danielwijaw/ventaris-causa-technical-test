# Style Guide – Mini‑Project Marketplace  

The visual language follows the **Mooovin** brand (the existing colour palette and typography defined in the project’s Tailwind design tokens).  Where exact values aren’t listed in the supplied documents, they will be sourced from the Mooovin design system and reflected in the `tailwind.config.js` file (see RFC Deliverables [4]).

## Colour Palette  

| Usage | Hex / Tailwind Variable |
|-------|------------------------|
| **Primary** – action buttons, links | `#0D6EFD` ( `primary-500` ) |
| **Secondary** – secondary actions | `#6C757D` ( `secondary-500` ) |
| **Success** – success toast, checkout confirmation | `#28A745` ( `success-500` ) |
| **Danger** – error states | `#DC3545` ( `danger-500` ) |
| **Background** – page background | `#F8F9FA` ( `gray-50` ) |
| **Surface** – cards, drawers | `#FFFFFF` ( `white` ) |
| **Text Primary** | `#212529` ( `gray-900` ) |
| **Text Secondary** | `#6C757D` ( `gray-600` ) |
| **Border / Divider** | `#DEE2E6` ( `gray-200` ) |

*All colours meet the WCAG 2.1 AA contrast requirements (NFR‑1) [2].*  

## Typography  

| Element | Font Family | Font Size | Line‑Height | Weight |
|--------|-------------|----------|------------|--------|
| **Body** | `'Inter', sans‑serif` | 16 px (base) | 1.5 | 400 |
| **Headings H1‑H4** | `'Inter', sans‑serif` | 32 px / 24 px / 20 px / 18 px | 1.25 | 600 |
| **Buttons / Nav items** | `'Inter', sans‑serif` | 14 px | 1.4 | 500 |
| **Input / Search** | `'Inter', sans‑serif` | 14 px | 1.4 | 400 |

*Typography follows the Tailwind default `font-family` overrides set in the design tokens.*  

## Spacing & Layout  

| Scale | Pixels |
|-------|--------|
| **0** | 0 |
| **1** | 4 |
| **2** | 8 |
| **3** | 12 |
| **4** | 16 |
| **5** | 24 |
| **6** | 32 |
| **8** | 48 |
| **10** | 64 |

*Used for padding, margin, and grid gutters. Aligns with Tailwind’s spacing scale and ensures a consistent rhythm across breakpoints.*  

## Buttons  

| State | Background | Text | Border | Shadow |
|-------|------------|------|--------|--------|
| **Default** | Primary (`#0D6EFD`) | White | — | subtle `0 1px 2px rgba(0,0,0,0.05)` |
| **Hover** | Darken 10 % (`#0B5ED7`) | White | — | `0 2px 4px rgba(0,0,0,0.1)` |
| **Focus** | Primary | White | `2px solid #66B2FF` (focus ring) | — |
| **Active** | Darken 15 % (`#0A58CA`) | White | — | `0 1px 2px rgba(0,0,0,0.2)` |
| **Disabled** | `#E9ECEF` | `#6C757D` | — | — |

All button states respect the accessibility focus outline requirement (NFR‑1) [2].

## Form Elements  

* Inputs, selects, and the search box use a light `gray-100` background, `gray-900` text, `1px solid #CED4DA` border, and a focus ring matching the primary colour.  
* Error state border turns **danger** (`#DC3545`).  

---