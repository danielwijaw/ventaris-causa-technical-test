# Architecture Diagram – Mini‑Project Marketplace  

The diagram below captures the full development‑to‑deployment flow that was described in the RFC and the functional / non‑functional requirements.  

```mermaid
graph TD
    %% Development environment
    Vite[Vite dev server<br/>`npm run dev`]
    React[React (TS) UI<br/>Pages, Components, Zustand store]
    Zustand[Zustand – cart & checkout state]
    MSW[MSW mock service worker<br/>/api/products, /api/checkout]

    %% Build & CI pipeline
    Build[Build (`npm run build`)] 
    CI[GitHub Actions CI<br/>• ESLint/Prettier (NFR‑3)<br/>• TypeScript strict check<br/>• Jest/RTL tests (NFR‑4)<br/>• Lint & type‑check (NFR‑5)]
    Deploy[Static host (Vercel / Netlify)<br/>One‑click deployment (NFR‑6)]

    %% Runtime / production flow
    Host[Static CDN edge]
    Browser[User browser (SPA)]

    %% Connections
    Vite --> React
    React --> Zustand
    React --> MSW
    MSW --> Data[Mock data: products.json]

    %% Build pipeline
    Vite --> Build
    Build --> CI
    CI --> Deploy
    Deploy --> Host

    %% Production runtime
    Browser --> Host
    Host --> React
    Browser -.-> MSW[MSW (dev only) / real API (future)]

    %% Styling / design
    style Vite fill:#f9f,stroke:#333,stroke-width:2px
    style React fill:#bbf,stroke:#333,stroke-width:2px
    style Zustand fill:#bfb,stroke:#333,stroke-width:2px
    style MSW fill:#ffb,stroke:#333,stroke-width:2px
    style CI fill:#cfc,stroke:#333,stroke-width:2px
    style Deploy fill:#fc9,stroke:#333,stroke-width:2px
```

### How the diagram maps to the documented sources  

* The **architecture overview** (browser ↔ Vite ↔ React ↔ MSW) is directly taken from the RFC section 5 diagram [4].  
* The **CI pipeline** (ESLint/Prettier, TypeScript strict, Jest/RTL, auto‑deploy) corresponds to the non‑functional requirements NFR‑3, NFR‑4, NFR‑5 and NFR‑6 [2].  
* The **static host** step reflects the “one‑click static hosting” delivery requirement [2].  

This schematic will guide both the Backend Engineer (who may later replace MSW with a real service) and the Frontend Engineer (who will implement the React UI, Zustand store, and CI configuration).