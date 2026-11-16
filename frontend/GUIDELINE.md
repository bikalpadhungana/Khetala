# GUIDELINE.md — Think Tank Freelancing Hub

> **Engineering Reference Document v1.0**
> This is NOT a README. This is a living architectural guide for developers and AI coding agents working on the Think Tank Freelancing Hub codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Vision & Engineering Philosophy](#2-vision--engineering-philosophy)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure Breakdown](#4-folder-structure-breakdown)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Routing Strategy](#7-routing-strategy)
8. [Component System](#8-component-system)
9. [State Management Strategy](#9-state-management-strategy)
10. [API Layer & Services Architecture](#10-api-layer--services-architecture)
11. [Styling & Design System](#11-styling--design-system)
12. [Reusable UI Patterns](#12-reusable-ui-patterns)
13. [Naming Conventions](#13-naming-conventions)
14. [Feature Module Organization](#14-feature-module-organization)
15. [Authentication Flow](#15-authentication-flow)
16. [Data Flow Architecture](#16-data-flow-architecture)
17. [Performance Optimization Strategy](#17-performance-optimization-strategy)
18. [Scalability Principles](#18-scalability-principles)
19. [Code Quality Rules](#19-code-quality-rules)
20. [Development Workflow](#20-development-workflow)
21. [Git Workflow](#21-git-workflow)
22. [Environment Configuration](#22-environment-configuration)
23. [Deployment Notes](#23-deployment-notes)
24. [Future Expansion Strategy](#24-future-expansion-strategy)
25. [Important Engineering Rules](#25-important-engineering-rules)
26. [AI Agent Development Rules](#26-ai-agent-development-rules)
27. [Contribution Guidelines](#27-contribution-guidelines)
28. [Documentation Quality Requirements](#28-documentation-quality-requirements)

---

## 1. Project Overview

**Think Tank Freelancing Hub** is Nepal's premier multi-service affiliate and lead management platform. The application connects affiliate partners with specialized service departments — enabling affiliates to submit qualified leads, track lead lifecycle, and earn commissions upon conversion.

### Core Business Domains

| Domain | Purpose |
|---|---|
| **Affiliate Portal** | Dashboard, lead submission, commission tracking, notifications, profile, support |
| **Admin Panel** | Platform-wide oversight of affiliates, leads, analytics, department routing |
| **Department Management** | Per-sector lead queues with routing, verification, and assignment |
| **Public Marketing** | Landing page, service catalog, contact form, legal/info pages |
| **Authentication** | Login, registration (multi-step), password recovery |

### Service Departments (8 Active)

The platform operates across **8 service departments**, each with its own sub-services:

1. **Abroad Study Services** — Education consulting, visa docs, scholarship
2. **IT & Digital Services** — Web/mobile dev, UI/UX, SEO, digital marketing
3. **Writing Services** — SOP, CV, business proposals, research
4. **Tourism & Travel Services** — Tour packages, trekking, hotel/vehicle booking
5. **Real Estate Services** — Property listing, buying, selling, valuation
6. **Automobile Services** — Second-hand marketplace, inspection, financing
7. **Others** — HR, recruitment, staffing, compliance
8. **Accounting & Financial Services** — Bookkeeping, tax, audit

All departments are defined in a centralized **service registry** (`app/lib/constants.js`), which drives navigation, forms, routing, and UI rendering.

---

## 2. Vision & Engineering Philosophy

### Core Principles

| Principle | Implementation |
|---|---|
| **Data-driven UI** | All service sectors, navigation, statuses, and form options are derived from centralized constants — never hardcoded in components. |
| **Server-first rendering** | Every route uses a `page.jsx` (server component) that exports metadata and delegates interactivity to a `page.client.jsx` (client component). |
| **Design token theming** | Colors, shadows, transitions, radii, and typography are defined as CSS custom properties — not as inline values. |
| **Component-first architecture** | A shared UI library in `app/components/common/` provides all primitive and composite components. |
| **Progressive disclosure** | Multi-step forms (registration, lead submission) break complex flows into digestible stages. |
| **Mock-first development** | Realistic mock data enables full UI development without a backend dependency. |
| **Role-based layouts** | Different user roles (affiliate, admin, department) get distinct layout shells and navigation sets. |

### Design Philosophy

- **Enterprise-grade aesthetic**: Navy + blue accent palette, Inter font, shadow elevation system, subtle micro-animations.
- **Information density**: KPI cards, data tables, and status badges surface critical metrics without overwhelming users.
- **Accessibility**: Focus-visible outlines, semantic HTML, proper label associations, ARIA labels on interactive elements.
- **Mobile-responsive**: Sidebar collapses to hamburger menu on mobile; grids adapt from multi-column to single-column.

---

## 3. Tech Stack

### Core Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `16.2.6` | App Router framework (latest with breaking changes — see AGENTS.md) |
| **React** | `19.2.4` | UI library |
| **React DOM** | `19.2.4` | DOM renderer |
| **Tailwind CSS** | `4.x` | Utility-first CSS framework |
| **Framer Motion** | `12.40.0` | Declarative animations (landing page) |
| **Axios** | `1.16.1` | HTTP client (prepared for backend integration) |
| **clsx** | `2.1.1` | Conditional class name composition |
| **react-icons** | `5.6.0` | Icon library (Lucide icon set via `lu` prefix) |

### Dev Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **@tailwindcss/postcss** | `4.x` | PostCSS integration for Tailwind v4 |
| **ESLint** | `9.x` | Linting with Next.js core-web-vitals config |

### Build & Tooling

| Tool | Configuration |
|---|---|
| **PostCSS** | `@tailwindcss/postcss` plugin (`postcss.config.mjs`) |
| **ESLint** | Flat config with `eslint-config-next/core-web-vitals` |
| **Path Aliases** | `@/*` maps to project root (`jsconfig.json`) |
| **Font Loading** | Google Fonts CDN (Inter with weights 300–700) |

> **⚠️ CRITICAL**: This project runs **Next.js 16**, which has breaking changes from prior versions. Always consult `node_modules/next/dist/docs/` before using any Next.js API. Heed deprecation notices.

---

## 4. Folder Structure Breakdown

```
think-tank/
├── app/                              # Next.js App Router root
│   ├── layout.jsx                    # Root layout (imports styles, html/body shell)
│   ├── page.jsx                      # Homepage (renders LandingPage)
│   ├── metadata.jsx                  # Global metadata export
│   │
│   ├── components/                   # 🔧 Shared component library
│   │   ├── common/                   # Primitive & composite UI components
│   │   │   ├── AuthLayout.jsx        # Split-panel auth page wrapper
│   │   │   ├── Button.jsx            # Variant-based button (primary/secondary/outline/ghost/destructive)
│   │   │   ├── Card.jsx              # Card + CardHeader + CardContent + CardTitle
│   │   │   ├── CustomDropdown.jsx    # Rich dropdown with icons and descriptions
│   │   │   ├── DataTable.jsx         # Generic table with column definitions and row actions
│   │   │   ├── Input.jsx             # Form input with label, error, helper text
│   │   │   ├── KpiCard.jsx           # Metric card with icon, value, trend indicator
│   │   │   ├── Logo.jsx              # Brand logo with size/variant/text control
│   │   │   ├── Modal.jsx             # Modal + ConfirmModal with escape/backdrop close
│   │   │   ├── PageHeader.jsx        # Page title + description + breadcrumbs + actions
│   │   │   ├── Select.jsx            # Native select with label and styling
│   │   │   ├── Sidebar.jsx           # Collapsible sidebar with role-based nav
│   │   │   └── StatusBadge.jsx       # Status pill with semantic colors
│   │   ├── affiliate/               # (Reserved) Affiliate-specific components
│   │   └── landing/                  # Landing page components
│   │       └── LandingPage.jsx       # Full public landing page (hero, features, CTA)
│   │
│   ├── features/                     # 🧩 Feature-scoped modules
│   │   └── leads/
│   │       └── components/
│   │           ├── DepartmentBadge.jsx   # Color-coded department tag
│   │           ├── LeadStatusBadge.jsx   # Thin wrapper over StatusBadge
│   │           └── leadUi.js             # Department tone/accent maps + icon registry
│   │
│   ├── lib/                          # 📚 Shared utilities & data
│   │   ├── constants.js              # Service registry, nav configs, status enums, districts
│   │   ├── mockData.js               # Realistic mock leads, affiliates, transactions, notifications
│   │   └── utils.js                  # cn(), formatNPR(), formatDate(), timeAgo(), etc.
│   │
│   ├── hooks/                        # 🪝 Custom React hooks
│   │   └── useSEO.js                 # Dynamic document title & meta description
│   │
│   ├── styles/                       # 🎨 Global styling system
│   │   ├── index.css                 # Entry point: imports fonts → tailwind → theme → globals
│   │   ├── fonts.css                 # Google Fonts import (Inter)
│   │   ├── theme.css                 # Design tokens (CSS custom properties) + Tailwind v4 @theme
│   │   └── globals.css               # Scrollbar, animations, interactive states
│   │
│   ├── config/                       # (Reserved) App configuration
│   ├── contexts/                     # (Reserved) React Context providers
│   ├── services/                     # Dynamic service catalog pages
│   │   └── [sector]/
│   │       ├── page.jsx              # Server component with generateStaticParams + metadata
│   │       └── page.client.jsx       # Client-rendered service detail view
│   ├── store/                        # (Reserved) Global state management
│   ├── utils/                        # (Reserved) Additional utilities
│   │
│   ├── admin/                        # 🛡️ Admin route group
│   │   ├── layout.jsx                # Admin shell (Sidebar role="admin")
│   │   ├── dashboard.jsx             # (Placeholder)
│   │   ├── contexts/                 # (Reserved) Admin-specific context
│   │   ├── leads/                    # (Reserved) Admin lead management
│   │   └── panel/
│   │       ├── page.jsx              # Server component with Suspense fallback
│   │       └── page.client.jsx       # Tabbed admin panel (overview + affiliate mgmt)
│   │
│   ├── affiliate/                    # 👤 Affiliate route group
│   │   ├── layout.jsx                # Affiliate shell (Sidebar role="affiliate")
│   │   ├── dashboard/
│   │   │   ├── page.jsx              # Server metadata + client delegation
│   │   │   └── page.client.jsx       # KPI grid + recent leads table
│   │   ├── submit-lead/
│   │   │   ├── page.jsx
│   │   │   └── page.client.jsx       # 4-step lead submission wizard
│   │   ├── my-leads/
│   │   │   ├── page.jsx
│   │   │   └── page.client.jsx       # Filterable lead list + detail modal
│   │   ├── commission/
│   │   │   ├── page.jsx
│   │   │   └── page.client.jsx       # Placeholder (coming soon)
│   │   ├── notifications/
│   │   │   ├── page.jsx
│   │   │   └── page.client.jsx       # Notification feed with type filters
│   │   ├── profile/
│   │   │   ├── page.jsx
│   │   │   └── page.client.jsx       # Profile + payment details form
│   │   └── support/
│   │       ├── page.jsx
│   │       └── page.client.jsx       # FAQ accordion + ticket submission
│   │
│   ├── department/                   # 🏢 Department route group
│   │   ├── layout.jsx                # Department shell (Sidebar role="admin")
│   │   └── [sector]/
│   │       ├── page.jsx              # Dynamic metadata per sector
│   │       └── page.client.jsx       # Department-scoped lead dashboard
│   │
│   ├── login/                        # 🔐 Auth: Sign in
│   │   ├── page.jsx                  # Server metadata
│   │   └── page.client.jsx           # Login form with demo admin shortcut
│   ├── register/                     # 🔐 Auth: Registration
│   │   ├── page.jsx
│   │   └── page.client.jsx           # 3-step registration wizard
│   ├── forgot-password/              # 🔐 Auth: Password recovery
│   │   ├── page.jsx
│   │   └── page.client.jsx           # Email reset flow
│   │
│   ├── contact/                      # 📞 Public contact page
│   │   ├── page.jsx
│   │   └── page.client.jsx           # Contact form + office info + process cards
│   │
│   └── info/                         # ℹ️ Static content pages
│       └── [slug]/
│           ├── page.jsx              # generateStaticParams for all info slugs
│           └── page.client.jsx       # Slug-based content renderer
│
├── public/
│   └── logo.ico                      # Brand logo asset
│
├── AGENTS.md                         # AI agent rules (Next.js 16 warning)
├── CLAUDE.md                         # Claude reference → AGENTS.md
├── GUIDELINE.md                      # ← This document
├── README.md                         # Default Next.js README
├── eslint.config.mjs                 # ESLint flat config
├── jsconfig.json                     # Path alias (@/*)
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Dependencies & scripts
├── postcss.config.mjs                # PostCSS with Tailwind v4
└── .env                              # Environment variables (empty, .gitignored)
```

### Directory Purpose Matrix

| Directory | Type | Purpose | Status |
|---|---|---|---|
| `app/components/common/` | Shared | Primitive UI library | ✅ Active |
| `app/components/landing/` | Shared | Landing page feature component | ✅ Active |
| `app/components/affiliate/` | Shared | Affiliate-specific components | 📋 Reserved |
| `app/features/leads/` | Feature | Lead-specific business components | ✅ Active |
| `app/lib/` | Shared | Constants, mock data, utilities | ✅ Active |
| `app/hooks/` | Shared | Custom React hooks | ✅ Active |
| `app/styles/` | Shared | Design tokens and global styles | ✅ Active |
| `app/config/` | Shared | App configuration | 📋 Reserved |
| `app/contexts/` | Shared | React Context providers | 📋 Reserved |
| `app/store/` | Shared | Global state (Zustand/Redux) | 📋 Reserved |
| `app/utils/` | Shared | Additional utility functions | 📋 Reserved |
| `app/api/` | Backend | API route handlers | 📋 Reserved |
| `app/admin/contexts/` | Admin | Admin-scoped context | 📋 Reserved |

---

## 5. Frontend Architecture

### Server / Client Component Split

The project enforces a strict **server-first rendering pattern**:

```
page.jsx (Server Component)
├── exports `metadata` object (SEO)
├── optionally uses `generateStaticParams()` for dynamic routes
├── optionally wraps in `<Suspense>` with skeleton fallback
└── renders page.client.jsx (Client Component)
    └── 'use client' directive at top
    └── all interactivity, state, and event handlers
```

**Why this pattern exists**: Next.js App Router renders components on the server by default. By splitting the server-level `metadata` export and the client-level interactive UI into separate files, the codebase achieves:

1. Automatic SEO metadata generation without client-side JavaScript
2. Clear separation of concerns between data/metadata and interactivity
3. Smaller client-side JavaScript bundles
4. Compatibility with Next.js 16 App Router conventions

### Layout Hierarchy

```
RootLayout (app/layout.jsx)
├── Imports global styles (index.css)
├── Sets <html lang="en"> and <body> with base classes
│
├── /affiliate/* → AffiliateLayout
│   └── Sidebar(role="affiliate") + main content area
│
├── /admin/* → AdminLayout
│   └── Sidebar(role="admin") + main content area
│
├── /department/* → DepartmentLayout
│   └── Sidebar(role="admin") + main content area
│
└── /login, /register, /forgot-password, /contact, /info/*
    └── No nested layout (full-page experiences)
```

### Shell Layout Pattern

All dashboard layouts follow an identical shell pattern:

```jsx
<div className="min-h-screen bg-background flex">
  <Sidebar role={role} />
  <main className="flex-1 min-w-0 overflow-y-auto">
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      {children}
    </div>
  </main>
</div>
```

**Key design decisions**:
- `min-w-0` prevents flex children from overflowing
- `max-w-7xl` constrains content width for readability
- `animate-fade-in` provides a smooth page transition
- Padding is responsive: `p-4` on mobile, `p-8` on desktop

---

## 6. Backend Architecture

### Current State: Mock-First

The backend is currently represented by:

| Layer | File | Purpose |
|---|---|---|
| Mock Data | `app/lib/mockData.js` | Realistic lead, affiliate, transaction, notification data |
| Constants Registry | `app/lib/constants.js` | Service departments, statuses, navigation configs |
| API Directory | `app/api/` | Reserved (empty) for Next.js API Route Handlers |

### Prepared Integrations

- **Axios** is installed and ready for HTTP client usage
- **API directory** (`app/api/`) exists for Next.js Route Handlers
- **Services directory** (`app/services/`) is structured for service-layer abstraction

### Planned Backend Architecture

When integrating a real backend, follow this pattern:

```
app/
├── api/                    # Next.js Route Handlers (BFF layer)
│   ├── auth/
│   │   └── route.js        # POST /api/auth (login, register, refresh)
│   ├── leads/
│   │   └── route.js        # CRUD /api/leads
│   ├── affiliates/
│   │   └── route.js        # CRUD /api/affiliates
│   └── commissions/
│       └── route.js        # GET /api/commissions
│
├── services/               # Client-side service layer (Axios wrappers)
│   ├── api.js              # Axios instance with base URL, interceptors
│   ├── authService.js      # login(), register(), forgotPassword()
│   ├── leadService.js      # getLeads(), submitLead(), updateLead()
│   ├── affiliateService.js # getProfile(), updateProfile()
│   └── commissionService.js
```

---

## 7. Routing Strategy

### Route Architecture

| Route | Type | Layout | Purpose |
|---|---|---|---|
| `/` | Static | None | Landing page |
| `/login` | Static | None | Sign in |
| `/register` | Static | None | Multi-step registration |
| `/forgot-password` | Static | None | Password recovery |
| `/contact` | Static | None | Contact form + office info |
| `/info/[slug]` | Dynamic (SSG) | None | Legal/company info pages |
| `/services/[sector]` | Dynamic (SSG) | None | Public service catalog |
| `/affiliate/dashboard` | Static | AffiliateLayout | Affiliate home |
| `/affiliate/submit-lead` | Static | AffiliateLayout | Lead submission wizard |
| `/affiliate/my-leads` | Static | AffiliateLayout | Lead tracking + detail |
| `/affiliate/commission` | Static | AffiliateLayout | Commission tracking (WIP) |
| `/affiliate/notifications` | Static | AffiliateLayout | Notification center |
| `/affiliate/profile` | Static | AffiliateLayout | Profile management |
| `/affiliate/support` | Static | AffiliateLayout | FAQ + ticket system |
| `/admin/panel` | Static | AdminLayout | Admin overview + affiliate mgmt |
| `/department/[sector]` | Dynamic | DepartmentLayout | Department lead dashboard |

### Dynamic Route Patterns

Dynamic routes use Next.js conventions:

- **`[slug]`** — Named parameters (`/info/[slug]`, `/services/[sector]`)
- **`generateStaticParams()`** — Pre-generates pages at build time for known slugs
- **`generateMetadata()`** — Dynamic SEO metadata based on route parameters

```js
// Example: app/info/[slug]/page.jsx
export function generateStaticParams() {
  return [
    { slug: 'about' },
    { slug: 'privacy' },
    { slug: 'terms' },
    // ...
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return { title: `${title} | Think Tank` };
}
```

### Navigation Configuration

Navigation is driven by centralized constants, not hardcoded in components:

```js
// app/lib/constants.js
export const AFFILIATE_NAV = [
  { label: 'Dashboard', href: '/affiliate/dashboard', icon: 'LuLayoutDashboard' },
  { label: 'Submit Lead', href: '/affiliate/submit-lead', icon: 'LuPlus' },
  // ...
];

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/panel', icon: 'LuLayoutDashboard' },
  // ...
];
```

---

## 8. Component System

### Architecture Principles

1. **Single responsibility**: Each component does one thing well
2. **Composition over configuration**: Card + CardHeader + CardContent vs a monolithic Card
3. **Variant pattern**: Components accept `variant`, `size`, `loading` props for flexibility
4. **Forward ref support**: Form inputs use `forwardRef` for external ref access
5. **Consistent API**: All components accept `className` for override styling

### Component Catalog

#### Primitive Components

| Component | Props | Features |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `disabled` | 5 variants, 3 sizes, spinner animation |
| `Input` | `label`, `error`, `helper`, `ref` | Auto-generated ID from label, error/helper states |
| `Select` | `options[]`, `label`, `placeholder` | Native select with consistent styling |
| `Card` | `interactive`, `className` | Shadow elevation, optional hover lift |
| `Modal` | `open`, `onClose`, `title` | Escape key close, backdrop click, body scroll lock |
| `StatusBadge` | `status`, `size` | Semantic color mapping from STATUS_STYLES constant |

#### Composite Components

| Component | Composed Of | Purpose |
|---|---|---|
| `AuthLayout` | Logo, decorative panels | Split-panel auth page wrapper |
| `Sidebar` | Link, icon registry | Collapsible role-based navigation |
| `PageHeader` | breadcrumbs, title, actions | Standard page title pattern |
| `KpiCard` | icon, trend indicator | Dashboard metric display |
| `DataTable` | columns config, row renderer | Generic tabular data display |
| `CustomDropdown` | icon map, SERVICE_DEPARTMENTS | Rich sector selection dropdown |
| `ConfirmModal` | Modal, Button | Confirmation dialog pattern |

#### Feature Components

| Component | Location | Purpose |
|---|---|---|
| `DepartmentBadge` | `features/leads/` | Color-coded department tag with icon |
| `LeadStatusBadge` | `features/leads/` | Thin wrapper over StatusBadge for domain context |

### Icon System

Icons are sourced from **react-icons/lu** (Lucide icon set). String-based icon references in constants are resolved via **icon maps**:

```js
// Pattern: Icon map in component that needs to render dynamic icons
const iconMap = {
  LuLayoutDashboard,
  LuPlus,
  LuFileText,
  // ...
};

// Usage
const Icon = iconMap[link.icon];
return <Icon className="w-5 h-5" />;
```

**Why**: Constants store icon names as strings (JSON-serializable). Components resolve these strings to actual React components through lookup maps. This keeps the data layer free of JSX dependencies.

---

## 9. State Management Strategy

### Current Approach: Local State + Props

The application currently uses:

| Mechanism | Scope | Example |
|---|---|---|
| `useState` | Component-local | Form data, loading states, UI toggles |
| Props drilling | Parent → Child | Lead data passed to modals, table columns |
| URL search params | Cross-page | Admin tab selection via `?tab=affiliates` |
| `usePathname` | Navigation | Active link highlighting in Sidebar |

### Reserved Infrastructure

| Directory | Intended Use |
|---|---|
| `app/contexts/` | React Context for auth state, theme, user preferences |
| `app/store/` | Global state management (Zustand recommended) |
| `app/admin/contexts/` | Admin-scoped context providers |

### Recommended Scaling Strategy

```
Phase 1 (Current): Local useState + props
Phase 2: React Context for auth/user state
Phase 3: Zustand for complex shared state (lead cache, notifications)
Phase 4: React Query / SWR for server state management
```

---

## 10. API Layer & Services Architecture

### HTTP Client: Axios

Axios is installed but not yet configured. When implementing:

```js
// Recommended: app/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 redirects
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Layer Pattern

```js
// Recommended: app/services/leadService.js
import api from '@/app/lib/api';

export const leadService = {
  getAll: (filters) => api.get('/leads', { params: filters }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.patch(`/leads/${id}`, data),
};
```

---

## 11. Styling & Design System

### CSS Architecture

The styling system uses a **layered import strategy**:

```css
/* app/styles/index.css — ENTRY POINT */
@import "./fonts.css";      /* 1. Font face declarations (Inter) */
@import "tailwindcss";      /* 2. Tailwind v4 base/utilities */
@import "./theme.css";      /* 3. Design tokens + Tailwind theme binding */
@import "./globals.css";    /* 4. Global styles + animations */
```

**Import order matters**: Fonts must load before Tailwind processes; theme tokens must bind to Tailwind's `@theme` before globals reference them.

### Design Token System

All tokens are defined as CSS custom properties in `:root` and bridged to Tailwind via `@theme inline`:

#### Color Tokens

| Token Group | Examples | Purpose |
|---|---|---|
| Core Palette | `--background`, `--foreground`, `--card`, `--primary`, `--accent` | Base UI colors |
| Navy Scale | `--navy-950` through `--navy-500` | Sidebar and dark panel backgrounds |
| Semantic Status | `--success`, `--warning`, `--info`, `--danger` + `-light` + `-border` | Status indicators |
| Chart Colors | `--chart-1` through `--chart-5` | Data visualization |
| Sidebar | `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent` | Sidebar-specific tokens |

#### Effect Tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px...` | Minimal elevation |
| `--shadow-card` | `0 1px 3px...` | Card default |
| `--shadow-elevated` | `0 4px 6px...` | Hover states, dropdowns |
| `--shadow-modal` | `0 20px 25px...` | Modal overlays |
| `--transition-fast` | `150ms ease` | Micro-interactions |
| `--transition-base` | `200ms ease` | Standard transitions |
| `--transition-slow` | `300ms ease` | Layout animations |
| `--radius` | `0.5rem` | Base border radius |

#### Typography

| Element | Size | Weight | Letter Spacing |
|---|---|---|---|
| `h1` | `--text-2xl` | Semibold (600) | `-0.01em` |
| `h2` | `--text-xl` | Semibold (600) | `-0.005em` |
| `h3` | `--text-lg` | Medium (500) | — |
| `h4` / `label` / `button` | `--text-base` / `--text-sm` | Medium (500) | — |
| `input` | `--text-sm` | Normal (400) | — |

#### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Animation Library

| Class | Effect | Duration |
|---|---|---|
| `.animate-fade-in` | Fade up from 8px | 0.4s ease-out |
| `.animate-slide-in` | Slide from left 16px | 0.3s ease-out |
| `.animate-subtle-pulse` | Opacity pulse | 2s infinite |
| `.animate-count-up` | Count-up reveal | 0.6s ease-out |
| `.card-interactive` | Translate-Y lift on hover | var(--transition-base) |
| `.table-row-interactive` | Background highlight on hover | var(--transition-fast) |

### Tailwind v4 Integration

Tailwind v4 uses `@theme inline` instead of `tailwind.config.js`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  /* ... bridges all CSS variables to Tailwind utilities */
}
```

This means you can use `bg-accent`, `text-foreground`, `border-border` etc. in Tailwind classes.

---

## 12. Reusable UI Patterns

### Pattern: Variant-Based Components

```jsx
// Button variants map
const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-border bg-background hover:bg-secondary text-foreground',
  ghost: 'hover:bg-secondary text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};
```

### Pattern: Status → Style Mapping

```jsx
// All status strings map to Tailwind classes
export const STATUS_STYLES = {
  New: 'bg-info-light text-info border-info/20',
  Converted: 'bg-success-light text-success border-success/20',
  Rejected: 'bg-danger-light text-danger border-danger/20',
  // ...
};
```

### Pattern: Column Definition Tables

```jsx
const columns = [
  { key: 'id', header: 'Lead ID', className: 'font-mono text-muted-foreground' },
  {
    key: 'client',
    header: 'Client',
    render: (lead) => (
      <div>
        <div className="font-medium">{lead.clientName}</div>
        <div className="text-xs text-muted-foreground">{lead.email}</div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (lead) => <StatusBadge status={lead.status} />,
  },
];
```

### Pattern: Multi-Step Forms

Both registration and lead submission use a step-based wizard:

```jsx
const [step, setStep] = useState(0);
const steps = [
  { label: 'Client Info' },
  { label: 'Service Details' },
  { label: 'Additional Info' },
  { label: 'Review' },
];
```

### Pattern: Detail Modal

List views use click-to-expand modals for detail:

```jsx
const [selectedItem, setSelectedItem] = useState(null);

<DataTable onRowClick={setSelectedItem} ... />
<Modal open={!!selectedItem} onClose={() => setSelectedItem(null)}>
  {/* Detail view */}
</Modal>
```

### Pattern: Skeleton Fallback

Server components wrap client components in `<Suspense>` with skeleton UI:

```jsx
export default function AdminPanelPage() {
  return (
    <Suspense fallback={<AdminPanelFallback />}>
      <AdminPanelClient />
    </Suspense>
  );
}
```

---

## 13. Naming Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| Route pages (server) | `page.jsx` | `app/login/page.jsx` |
| Route pages (client) | `page.client.jsx` | `app/login/page.client.jsx` |
| Layouts | `layout.jsx` | `app/affiliate/layout.jsx` |
| Components | `PascalCase.jsx` | `StatusBadge.jsx` |
| Utilities | `camelCase.js` | `utils.js` |
| Constants | `camelCase.js` | `constants.js` |
| Feature UI helpers | `camelCase.js` | `leadUi.js` |
| Styles | `kebab-case.css` | `globals.css` |
| Hook files | `useCamelCase.js` | `useSEO.js` |

### Code Naming

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `KpiCard`, `StatusBadge` |
| Functions | camelCase | `formatNPR()`, `getInitials()` |
| Constants (arrays/objects) | SCREAMING_SNAKE | `SERVICE_DEPARTMENTS`, `LEAD_STATUSES` |
| CSS variables | `--kebab-case` | `--sidebar-foreground` |
| Route params | `[camelCase]` | `[sector]`, `[slug]` |
| Props | camelCase | `iconColor`, `showFeatures` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleChange` |

### Import Conventions

```jsx
// 1. React / framework imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 2. Third-party libraries
import { LuPlus, LuFileText } from 'react-icons/lu';

// 3. Internal components (absolute path via @/ alias)
import Button from '@/app/components/common/Button';
import Card, { CardHeader, CardContent } from '@/app/components/common/Card';

// 4. Feature-specific imports
import DepartmentBadge from '@/app/features/leads/components/DepartmentBadge';

// 5. Utilities and data
import { mockLeads } from '@/app/lib/mockData';
import { formatNPR, cn } from '@/app/lib/utils';
import { LEAD_STATUSES } from '@/app/lib/constants';
```

---

## 14. Feature Module Organization

### Feature Directory Pattern

Feature-specific business logic and components live under `app/features/`:

```
app/features/
└── leads/
    └── components/
        ├── DepartmentBadge.jsx    # UI: department-colored badge
        ├── LeadStatusBadge.jsx    # UI: status badge wrapper
        └── leadUi.js              # Data: tone maps, accent maps, icon registry
```

### When to Use `features/` vs `components/common/`

| Criteria | Location |
|---|---|
| Used across multiple features or route groups | `components/common/` |
| Specific to one business domain | `features/{domain}/components/` |
| Pure UI primitive (Button, Input, Card) | `components/common/` |
| Domain-aware (DepartmentBadge uses SERVICE_DEPARTMENTS) | `features/{domain}/` |

### Future Feature Modules

```
app/features/
├── leads/         ✅ Active
├── commissions/   📋 Planned (commission tracking, withdrawal UI)
├── analytics/     📋 Planned (charts, conversion funnels)
├── affiliates/    📋 Planned (affiliate management components)
└── departments/   📋 Planned (department queue management)
```

---

## 15. Authentication Flow

### Current State: Mock Authentication

Authentication is currently simulated with `setTimeout` delays:

```jsx
// Login: routes to /affiliate/dashboard after delay
const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    router.push('/affiliate/dashboard');
  }, 1000);
};
```

### Auth Page Pattern

All auth pages use the shared `AuthLayout` component:

```
AuthLayout
├── Left Panel (desktop only): Navy branded panel with logo, title, features
├── Right Panel: Form area with mobile logo fallback
│   ├── Login form
│   ├── Register wizard (3 steps)
│   └── Forgot password flow
```

### Registration Flow

```
Step 1: Personal Info (name, email, phone, address)
Step 2: Business Info (business name, PAN, experience)
Step 3: Security (password, confirm, terms agreement)
→ Success state: Confirmation message + return to home
```

### Planned Authentication Architecture

```
1. JWT-based auth via /api/auth route handlers
2. AuthContext provider wrapping app layout
3. Protected route middleware (Next.js middleware.js)
4. Token refresh via Axios interceptor
5. Role-based route guards (affiliate vs admin vs department)
```

---

## 16. Data Flow Architecture

### Service Registry Pattern

The central data source is `SERVICE_DEPARTMENTS` in `app/lib/constants.js`:

```
SERVICE_DEPARTMENTS (source of truth)
├── Drives → SERVICE_SECTORS (dropdown options)
├── Drives → AFFILIATE_NAV, ADMIN_NAV, DEPARTMENT_NAV
├── Drives → Lead submission form options
├── Drives → Department routing logic
├── Drives → DepartmentBadge rendering
├── Drives → Landing page service cards
└── Drives → Service catalog pages (/services/[sector])
```

### Mock Data Flow

```
constants.js (SERVICE_DEPARTMENTS, statuses, enums)
    ↓
mockData.js (generates realistic leads, affiliates using constants)
    ↓
page.client.jsx (imports mock data, renders with components)
    ↓
UI Components (DataTable, StatusBadge, KpiCard render data)
```

### Status Lifecycle

```
Lead:    New → Verified → Assigned → In Progress → Proposal Sent → Converted → Closed
                                                                        ↓
Verification: Unverified → Contact Verified → Documents Pending → Qualified | Rejected
                                                                        ↓
Commission:                                                    Projected → Pending → Completed
```

---

## 17. Performance Optimization Strategy

### Current Optimizations

| Optimization | Implementation |
|---|---|
| **Server Components** | All `page.jsx` files are server components (zero JS shipped) |
| **Code Splitting** | Client components are auto-code-split by Next.js |
| **Static Generation** | `generateStaticParams()` pre-renders known routes |
| **Font Optimization** | Inter loaded via Google Fonts CDN with `display=swap` |
| **Suspense Fallbacks** | Admin panel uses skeleton loading UI |
| **CSS-based animations** | Keyframe animations avoid JS overhead |
| **Memoization** | `useMemo` for computed data (e.g., selectedDepartment) |
| **Smooth scrolling** | CSS `scroll-behavior: smooth` on html element |

### Recommended Next Steps

```
1. Image optimization via next/image (when adding images)
2. Dynamic imports for heavy components (Framer Motion lazy loading)
3. React Query for server state caching and deduplication
4. Virtualized lists for large data tables (react-virtual)
5. Bundle analysis via @next/bundle-analyzer
```

---

## 18. Scalability Principles

### Horizontal Scaling: Feature Modules

New features should follow the established patterns:

```
1. Add constants to app/lib/constants.js
2. Add mock data to app/lib/mockData.js
3. Create feature components in app/features/{feature}/components/
4. Create route in app/{route-group}/
5. Add navigation entry to the relevant NAV constant
```

### Vertical Scaling: Backend Integration

```
Phase 1 (Current):  Frontend-only with mock data
Phase 2:            Next.js API Routes as BFF (Backend-for-Frontend)
Phase 3:            External API services (Node.js/Python backend)
Phase 4:            Microservices per department
```

### Data Layer Scaling

```
Phase 1 (Current):  Static mock data in JS files
Phase 2:            Axios service layer with REST API
Phase 3:            React Query for caching + optimistic updates
Phase 4:            Real-time updates via WebSocket/SSE
```

---

## 19. Code Quality Rules

### Mandatory Rules

1. **Every route page must have a server component** (`page.jsx`) that exports `metadata`.
2. **Client components must have `'use client'`** directive on the first line.
3. **Use `cn()` for class merging** — never concatenate class strings manually.
4. **Import from `@/app/lib/utils`** — not from `clsx` directly.
5. **Status colors come from `STATUS_STYLES`** — never hardcode status colors.
6. **Navigation comes from constants** — never hardcode nav links in components.
7. **Icons come from `react-icons/lu`** — maintain icon consistency.
8. **Forms must handle loading state** — show spinner via `Button loading` prop.
9. **All interactive elements must have accessible labels** — `aria-label`, `htmlFor`, etc.
10. **Use design tokens** — never use raw color values like `#2563eb`; use `var(--accent)` or `bg-accent`.

### Component Checklist

Before creating a new component:

- [ ] Does a similar component exist in `components/common/`?
- [ ] Can the existing component be extended with a new variant instead?
- [ ] Does the component accept `className` for override styling?
- [ ] Does the component use `cn()` for class composition?
- [ ] Are all hardcoded values extracted to props or constants?
- [ ] Is the component documented with JSDoc if complex?

---

## 20. Development Workflow

### Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd think-tank

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Configure required variables

# 4. Start development server
npm run dev

# 5. Open browser
# → http://localhost:3000
```

### Available Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev | `npm run dev` | Start Next.js dev server with hot reload |
| Build | `npm run build` | Production build |
| Start | `npm start` | Run production build |
| Lint | `npm run lint` | Run ESLint |

### Development Conventions

1. **Start with `page.jsx`** — create server component with metadata first
2. **Create `page.client.jsx`** — add interactivity in a separate client file
3. **Use existing components** — check `components/common/` before creating new ones
4. **Test responsively** — verify at mobile (375px), tablet (768px), and desktop (1280px+)
5. **Follow the import order** — React → third-party → internal components → utils → constants

---

## 21. Git Workflow

### Branch Strategy (Recommended)

```
main            ← production-ready code
├── develop     ← integration branch
│   ├── feature/lead-detail-redesign
│   ├── feature/commission-tracking
│   ├── fix/sidebar-mobile-overlay
│   └── chore/update-dependencies
```

### Commit Convention

```
feat: add commission tracking page
fix: resolve sidebar collapse on mobile
refactor: extract MetricTile component
style: update KPI card spacing
docs: update GUIDELINE.md with auth flow
chore: update Next.js to 16.3
```

### .gitignore Highlights

```
.env*           # All environment files
.next/          # Build output
node_modules/   # Dependencies
.vscode         # Editor config
.vercel         # Deployment config
```

---

## 22. Environment Configuration

### Current State

The `.env` file exists but is empty. All environment files are `.gitignored`.

### Recommended Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Auth
NEXT_PUBLIC_AUTH_TOKEN_KEY=tt_auth_token

# Platform
NEXT_PUBLIC_SITE_URL=https://thinktank.com.np
NEXT_PUBLIC_SITE_NAME=Think Tank Freelancing Hub

# Analytics (future)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Server-only
DATABASE_URL=postgresql://...
JWT_SECRET=...
SMTP_HOST=...
```

---

## 23. Deployment Notes

### Target Platform: Vercel

The project is bootstrapped with `create-next-app` and is optimized for Vercel deployment:

```bash
# Build command
npm run build

# Output
.next/          # Server & static assets

# Start
npm start       # Node.js production server
```

### Pre-Deployment Checklist

- [ ] All `page.jsx` files export valid `metadata`
- [ ] `generateStaticParams()` covers all dynamic routes
- [ ] Environment variables are set in the deployment platform
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes

---

## 24. Future Expansion Strategy

### Planned Features

| Feature | Priority | Dependencies |
|---|---|---|
| Commission & Payouts page | 🔴 High | Backend API, payment gateway |
| Real authentication (JWT) | 🔴 High | Backend API, AuthContext |
| Department lead queue management | 🔴 High | Backend API, real-time updates |
| Analytics dashboard with charts | 🟡 Medium | Chart library (Recharts/Nivo) |
| Real-time notifications (WebSocket) | 🟡 Medium | WebSocket server |
| File upload for lead documents | 🟡 Medium | Object storage (S3/Cloudinary) |
| Dark mode theme | 🟢 Low | CSS variable overrides |
| Multi-language support (i18n) | 🟢 Low | next-intl or similar |
| PWA support | 🟢 Low | Service worker, manifest |
| E2E testing | 🟡 Medium | Playwright/Cypress |

### Architecture Evolution Path

```
Current:    Next.js 16 Monolith (frontend-only, mock data)
     ↓
Phase 2:    Next.js Full-Stack (API routes + database)
     ↓
Phase 3:    Next.js Frontend + Separate Backend API
     ↓
Phase 4:    Micro-frontend per role (affiliate/admin/department)
```

---

## 25. Important Engineering Rules

> These rules are non-negotiable and must be followed by all contributors.

### 🔴 Critical Rules

1. **Never import from `next/router`** — use `next/navigation` (App Router).
2. **Never use `getServerSideProps` or `getStaticProps`** — use App Router conventions.
3. **Read `node_modules/next/dist/docs/`** before using any Next.js API (Next.js 16 has breaking changes).
4. **Await `params`** in dynamic routes — `const { slug } = await params;`.
5. **Never put `'use client'`** in `page.jsx` — always in `page.client.jsx`.
6. **Never hardcode service departments** — always derive from `SERVICE_DEPARTMENTS`.

### 🟡 Important Rules

7. **Use `cn()` for all class merging** — it handles conditional classes cleanly.
8. **Use semantic color tokens** — `text-foreground` not `text-gray-900`.
9. **Every page needs metadata** — export `metadata` or `generateMetadata()`.
10. **Keep components pure** — no side effects in render; use `useEffect` for side effects.
11. **Preserve existing comments and docstrings** — don't remove documentation unless explicitly asked.

### 🟢 Best Practices

12. **Prefer composition** — compose with Card+CardHeader+CardContent rather than monolithic components.
13. **Colocate mock data with constants** — keep mock data generators close to the schema definitions.
14. **Use descriptive variable names** — `selectedDepartment` not `dept`.
15. **Extract inline components** — if a render function exceeds 15 lines, extract it.

---

## 26. AI Agent Development Rules

> Rules specifically for AI coding agents (GitHub Copilot, Claude, Gemini, etc.)

### Before Writing Any Code

1. **Check `AGENTS.md`** — it contains critical Next.js 16 compatibility warnings.
2. **Read `node_modules/next/dist/docs/`** for the relevant API you plan to use.
3. **Check existing components** in `app/components/common/` before creating new ones.
4. **Check existing constants** in `app/lib/constants.js` before hardcoding values.
5. **Check existing utilities** in `app/lib/utils.js` before writing helper functions.

### Code Generation Rules

6. **Follow the `page.jsx` + `page.client.jsx` split** — never put client logic in server components.
7. **Use the `@/app/` import alias** — never use relative paths like `../../../`.
8. **Match existing component APIs** — if Button uses `variant` and `size`, new components should too.
9. **Use design tokens from `theme.css`** — never introduce raw hex colors.
10. **Use `react-icons/lu`** — never introduce another icon library.
11. **Add mock data** to `app/lib/mockData.js` when building new features.
12. **Add constants** to `app/lib/constants.js` for any new enums, configs, or registry data.

### Testing Changes

13. **Verify `npm run build` succeeds** after making changes.
14. **Check responsive behavior** at mobile and desktop breakpoints.
15. **Verify navigation** — ensure new pages are reachable from the sidebar.

---

## 27. Contribution Guidelines

### Adding a New Page

```
1. Create app/{route}/page.jsx
   - Export metadata object
   - Import and render the client component

2. Create app/{route}/page.client.jsx
   - Add 'use client' directive
   - Import shared components from components/common/
   - Use PageHeader for consistent page titles

3. If dashboard page:
   - Ensure the route is under a layout with Sidebar
   - Add nav entry to the appropriate NAV constant in constants.js

4. If public page:
   - Include header and footer (see ContactClient for pattern)
```

### Adding a New Component

```
1. Check if an existing component can be extended
2. Create in app/components/common/ for shared, or app/features/{domain}/
3. Accept className prop for override styling
4. Use cn() for class composition
5. Support variants via object maps if multiple visual styles exist
6. Add 'use client' only if component uses hooks or event handlers
7. Export as default export
```

### Adding a New Service Department

```
1. Add department object to SERVICE_DEPARTMENTS in constants.js
   - Include: id, slug, title, icon, color, description, subServices[]

2. The following will automatically update:
   - SERVICE_SECTORS dropdown options
   - Lead submission CustomDropdown
   - Landing page service cards
   - Navigation (if derived from DEPARTMENT_NAV)
   - Services catalog page (via generateStaticParams)
```

---

## 28. Documentation Quality Requirements

### Code Documentation

- **JSDoc on all utility functions** in `app/lib/utils.js`
- **Component purpose comments** when the component name isn't self-explanatory
- **Pattern explanations** in comments for non-obvious architectural decisions
- **TODO comments** for placeholder/WIP features (e.g., `// Show toast in real app`)

### File-Level Documentation

- **Every `page.jsx`** should clearly indicate what the page does via its metadata
- **Every `layout.jsx`** should document which routes it wraps
- **Feature directories** should have a brief comment at the top of the main file explaining the feature scope

### This Document

This `GUIDELINE.md` should be updated whenever:

1. A new architectural pattern is introduced
2. A new directory convention is established
3. A major dependency is added or removed
4. The deployment or build strategy changes
5. New engineering rules are agreed upon

---

## Quick Reference Card

| Need | Go To |
|---|---|
| Add a button | `app/components/common/Button.jsx` |
| Add a form input | `app/components/common/Input.jsx` |
| Display tabular data | `app/components/common/DataTable.jsx` |
| Show a status pill | `app/components/common/StatusBadge.jsx` |
| Format currency (NPR) | `app/lib/utils.js → formatNPR()` |
| Get all departments | `app/lib/constants.js → SERVICE_DEPARTMENTS` |
| Get mock lead data | `app/lib/mockData.js → mockLeads` |
| Merge CSS classes | `app/lib/utils.js → cn()` |
| Create a page with SEO | `page.jsx` (server) + `page.client.jsx` (client) |
| Add navigation item | `app/lib/constants.js → AFFILIATE_NAV / ADMIN_NAV` |
| Design tokens | `app/styles/theme.css` |
| Global animations | `app/styles/globals.css` |
| Dynamic icon rendering | Use icon map pattern (see Sidebar, CustomDropdown) |
| Auth page layout | `app/components/common/AuthLayout.jsx` |
| Dashboard page layout | Use `PageHeader` + `KpiCard` grid + `Card > DataTable` |

---

> **© Think Tank Freelancing Hub** — Engineering Documentation
> Last updated: June 2026
