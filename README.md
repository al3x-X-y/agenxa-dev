# <div align="center"><img src="public/assets/agenxa-logo.svg" width="100" height="100" alt="Agenxa Logo" /><br/> Agenxa</div>

<div align="center">

**Next-Generation Multi-Tenant Agency SaaS, Kanban CRM & Visual Funnel Engine**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe_Connect-Supported-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-F472B6?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Application Showcase](#-live-application-showcase)
- [System Architecture](#-system-architecture)
- [Custom Design System & Icons](#-custom-design-system--icons)
- [Core Features](#-core-features)
  - [1. Multi-Tenant Organization & Subdomains](#1-multi-tenant-organization--subdomain-routing)
  - [2. Drag-and-Drop Visual Funnel Builder](#2-drag-and-drop-visual-funnel-builder)
  - [3. Interactive Kanban CRM & Sales Pipelines](#3-interactive-kanban-crm--sales-pipelines)
  - [4. Stripe Connect & Platform Monetization](#4-stripe-connect--billing-engine)
  - [5. Role-Based Access Control (RBAC)](#5-role-based-access-control-rbac)
  - [6. Cloud Media Vault (UploadThing)](#6-cloud-media-vault)
- [Database Schema & Data Models](#-database-schema--data-models)
- [End-to-End Automated Testing Suite](#-end-to-end-automated-testing-suite)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Authors & Contributors](#-authors--contributors)

---

## 🚀 Overview

**Agenxa** is a comprehensive, production-grade **B2B Multi-Tenant SaaS platform** designed for digital agencies, software teams, and service providers. 

Modern agency workflows typically suffer from extreme tool fragmentation: project management is isolated in Trello/Jira, client communications live in Slack/Email, billing is on Stripe invoices, client landing pages require Webflow/WordPress, and lead tracking requires an external CRM. Switching across disconnected platforms causes lost updates, high software overhead, and fragmented data.

**Agenxa consolidates the entire agency lifecycle into one unified system:**
- **Agency Executive Control**: Onboard client companies into isolated subaccounts, invite team members, configure global agency branding, and track aggregate income and lead metrics.
- **Client (Subaccount) Workspaces**: Fully partitioned client environments with custom dashboards, contact books, media storage, and dedicated funnel pages.
- **Native Website & Funnel Builder**: In-browser drag-and-drop editor allowing agencies to design and publish high-converting responsive landing pages directly to custom subdomains without third-party page builders.
- **Kanban Sales Pipeline CRM**: Multi-stage deal flow tracking with smooth drag-and-drop ticket reordering, customer association, and tag categorization.
- **Stripe Connect Monetization**: Support for agency tier subscriptions, rebilling, and connected accounts with platform fee cuts.

---

## 🖥️ Live Application Showcase

Below is the live **Agenxa Subaccount Executive Dashboard** running in dark mode, demonstrating real-time metrics, pipeline analytics, interactive checkout volume charts, and transaction history:

<div align="center">
  <img src="public/assets/preview.png" alt="Agenxa Dashboard Running" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);" />
</div>

### Dashboard Highlights:
- **Financial Performance Cards**: Real-time calculations of Net Income, Potential Revenue, and Active Pipeline Value with closing percentages.
- **Conversion Analytics Ring**: Interactive conversion rate breakdown (Won Carts vs. Abandoned Carts).
- **Funnel Performance Breakdown**: Page visit distribution across funnel steps (VBL, Case Study, Thank You, Payment Pages).
- **Checkout Activity Chart**: Area/line visualizer tracking chronological revenue spikes and sales events.
- **Live Transaction History**: Tabulated order ledger displaying customer email, status badges, timestamp, and transaction amounts.
- **Collapsible Navigation Bar**: Instant switcher between Agency and Subaccount workspaces, Settings, Media Vault, Pipelines, Contacts, Funnels, and Launchpad Onboarding.

---

## 🏛️ System Architecture

Agenxa is engineered with a high-performance multi-tenant architecture utilizing Next.js Edge Middleware for zero-latency subdomain and path rewriting.

<div align="center">
  <img src="public/assets/architecture.svg" alt="Agenxa System Architecture" width="100%" style="border-radius: 12px;" />
</div>

### Architectural Mechanics:
1. **Edge Middleware Ingress (`src/proxy.ts`)**:
   - Inspects incoming host headers to detect custom subdomains (e.g. `client.agenxa.com`).
   - Rewrites request paths dynamically to the corresponding tenant funnel without URL redirects.
   - Enforces Clerk authentication and route protection before requests reach server components.
2. **Multi-Tenant Scoping**:
   - Agencies act as the top-level tenant (`Agency` model).
   - Subaccounts are strict isolation boundaries (`SubAccount` model) owning Funnels, Pipelines, Contacts, Media, and Automation triggers.
   - Foreign-key cascade rules ensure clean data isolation and lifecycle integrity.
3. **Data Access Layer**:
   - Type-safe queries through Prisma Client with MariaDB/MySQL drivers.
   - Granular permission resolution (`Permissions` model) controlling staff access per subaccount.

---

## 🎨 Custom Design System & Icons

To deliver a distinct, cohesive, high-performance UI without depending on generic iconography, Agenxa features a **custom-crafted SVG design system**. All 31 icons are built as native React/TypeScript components with optimized paths, two-tone color fills, and responsive sizing:

<div align="center">
  <img src="public/assets/icons-showcase.svg" alt="Agenxa Custom Design System Icons" width="100%" style="border-radius: 12px; margin-top: 10px; margin-bottom: 20px;" />
</div>

### Included Design System Components:
| Category | Icons Included |
| :--- | :--- |
| **Analytics & Financials** | `BarChart`, `Wallet`, `Payment`, `Receipt`, `Pipelines` |
| **Workspace Navigation** | `Home`, `Compass`, `Categories`, `Clipboard`, `Settings` |
| **Security & System** | `Shield`, `Lock`, `Chip`, `Power`, `Database`, `Tune` |
| **Communication & Alert** | `Messages`, `Mail`, `Send`, `Notification`, `Info`, `Warning` |
| **Funnels & Media** | `FunnelPage`, `VideoRecorder`, `Link`, `Calendar`, `Headphone`, `Star`, `CheckCircled` |

---

## ⚡ Core Features

### 1. Multi-Tenant Organization & Subdomain Routing
- **White-Labeling**: Agencies can upload custom logos, configure brand colors, and whitelabel the entire dashboard.
- **Subdomain Funnel Hosting**: Publish client websites to `[subdomain].yourdomain.com` or custom CNAME records effortlessly.
- **Unified Switcher**: Switch seamlessly between managing agency-wide staff and diving into specific client accounts.

### 2. Drag-and-Drop Visual Funnel Builder
- **Component Palette**: Drag-and-drop structural elements including Sections, Containers, Text blocks, Contact Forms, Payment Forms, Multi-Column grids (2-Col, 3-Col), Video embeds, and Images.
- **Live Style Inspector**: Real-time CSS property manipulation (margins, paddings, typography, backgrounds, opacity, border radiuses, and flex alignments).
- **Responsive Preview Modes**: Live toggle between Desktop, Tablet, and Mobile viewports with live responsive styling.
- **Funnel Steps Workflow**: Link funnel pages into multi-step conversion journeys (Opt-in $\rightarrow$ VSL $\rightarrow$ Checkout $\rightarrow$ Thank You).

### 3. Interactive Kanban CRM & Sales Pipelines
- **Pipeline Management**: Create custom sales funnels (e.g., "Lead Inbound", "Meeting Scheduled", "Proposal Sent", "Contract Closed").
- **Drag-and-Drop Tickets**: Powered by `@hello-pangea/dnd` for smooth, zero-latency drag-and-drop reordering across lanes.
- **Ticket Valuation & Contact Linking**: Assign monetary values, assign team members, and link tickets to contacts.
- **Color-Coded Tags**: Tag leads for fast filtering and pipeline sorting.

### 4. Stripe Connect & Billing Engine
- **Platform Subscription Tiers**:
  - `Starter`: Free tier with basic subaccounts and pipeline limits.
  - `Basic ($49/mo)`: Unlimited subaccounts and team members.
  - `Unlimited SaaS ($199/mo)`: Rebilling, priority support, and enterprise features.
- **Stripe Connect Onboarding**: Direct Stripe account connection for subaccounts to collect client payments while the agency automatically collects platform fees.
- **Customer Portal & Add-Ons**: Integrated Stripe customer portal for card management, invoice downloads, and priority support add-ons.

### 5. Role-Based Access Control (RBAC)
- **Role Hierarchy**:
  - `AGENCY_OWNER`: Full administrative, billing, and subaccount management authority.
  - `AGENCY_ADMIN`: Team and operations management without financial billing override.
  - `SUBACCOUNT_USER`: Operates within explicitly assigned client workspaces.
  - `SUBACCOUNT_GUEST`: Read/review permissions within assigned client workspaces.
- **Staff Invitation System**: Email-based invitations with acceptance token tracking.

### 6. Cloud Media Vault
- **UploadThing Integration**: Secure direct-to-cloud asset uploads with S3-backed CDN acceleration.
- **Asset Management**: Centralized media library per subaccount for images, logos, and funnel assets with instant clipboard copying.

---

## 🗄️ Database Schema & Data Models

Agenxa uses **Prisma ORM** with MariaDB / MySQL. Below is an overview of the core entities and their relationships:

```mermaid
erDiagram
    Agency ||--o{ User : "employs"
    Agency ||--o{ SubAccount : "manages"
    Agency ||--o{ Invitation : "issues"
    Agency ||--o| Subscription : "subscribes"
    
    SubAccount ||--o{ Funnel : "hosts"
    SubAccount ||--o{ Pipeline : "tracks"
    SubAccount ||--o{ Contact : "maintains"
    SubAccount ||--o{ Media : "stores"
    SubAccount ||--o{ Permissions : "scopes"

    Funnel ||--o{ FunnelPage : "contains"
    Pipeline ||--o{ Lane : "organizes"
    Lane ||--o{ Ticket : "contains"
    Ticket }o--o| Contact : "assigned to"
    Ticket }o--o{ Tag : "tagged with"
```

### Key Models in `prisma/schema.prisma`:
- **`Agency`**: Name, logo, address, Stripe customer/connect ID, goal target.
- **`SubAccount`**: Client company data, connect account ID, contact info, goal metrics.
- **`User`**: Profile information, Clerk authentication ID, system role (`Role` enum).
- **`Permissions`**: Scopes which users can access which specific subaccounts.
- **`Funnel` & `FunnelPage`**: Landing page structure, visits counter, JSON content tree, custom domain names.
- **`Pipeline`, `Lane`, `Ticket`**: Kanban board entities with decimal valuation and ordering indexes.
- **`Contact`**: Customer relationship records linked to tickets and automations.
- **`Subscription`**: Active Stripe subscription, plan IDs, current period tracking.

---

## 🧪 End-to-End Automated Testing Suite

The repository includes a standalone automated test suite located in [`e2e-tests/`](e2e-tests/):
- **Python Automation (`agenxa_selenium_tester.py`)**: Selenium WebDriver test runner with support for headless mode, automated form filling, subaccount creation, filtering, and inspection.
- **Node Automation (`agenxa_selenium.js`)**: JavaScript Selenium script for cross-runtime CI validation.

### Running the E2E Tests:
```bash
# 1. Install Selenium dependencies
pip3 install selenium webdriver-manager

# 2. Run tests across all agency workflows in headless mode
python3 e2e-tests/agenxa_selenium_tester.py \
  --url http://localhost:3000 \
  --agency-id <YOUR_AGENCY_ID> \
  --action all \
  --headless
```

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Edge Middleware) |
| **Frontend UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Tremor](https://tremor.so/) |
| **Drag & Drop** | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (Kanban & Editor) |
| **Authentication** | [Clerk](https://clerk.com/) (Organizations, Multi-role sessions, Invitations) |
| **Database & ORM** | [Prisma ORM 7.9](https://www.prisma.io/), [MariaDB](https://mariadb.org/) / MySQL |
| **Payments** | [Stripe](https://stripe.com/) & Stripe Connect (Subscriptions, Checkout, Webhooks) |
| **Media Storage** | [UploadThing](https://uploadthing.com/) (Direct S3 CDN uploads) |
| **Data Viz** | [Recharts](https://recharts.org/), Custom SVG Components |
| **Runtime & Bundler** | [Bun](https://bun.sh/) |
| **Testing** | Selenium WebDriver (Python / JS) |

---

## 🛠️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (v1.1+) or Node.js (v20+)
- MySQL or MariaDB instance (local or hosted via PlanetScale / Supabase / Aiven)
- Clerk account for auth keys
- Stripe account for billing keys
- UploadThing account for media storage

### Environment Configuration
Copy the sample environment variables:
```bash
cp .env.example .env
```

Populate the `.env` file with your credentials:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/agency/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/agency/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Domain Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http://

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_CLIENT_ID=ca_...
NEXT_AGENXA_PRODUCT_ID=prod_...

# Database Connection
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/agenxa"
```

### Database Setup
```bash
# Install dependencies
bun install

# Generate Prisma Client
bunx prisma generate

# Push schema tables to database
bunx prisma db push
```

### Running Locally
```bash
# Start development server
bun dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page and pricing tiers, or navigate to [http://localhost:3000/agency](http://localhost:3000/agency) to sign in to the agency management portal.

---

## 👥 Authors & Contributors

- **SK. MAHTABUL ISLAM (Alexy)** ([@al3x-X-y](https://github.com/al3x-X-y))
  - **Personal Email:** [alexd2d.01@gmail.com](mailto:alexd2d.01@gmail.com)
  - **Business / Agency Email:** [thewatchtimestudio@gmail.com](mailto:thewatchtimestudio@gmail.com)
  - **GitHub:** [https://github.com/al3x-X-y](https://github.com/al3x-X-y)
  - **Role & Code Contributions:**
    - **Database Architecture**: Initialized and configured the Prisma ORM schema, MariaDB/MySQL relational models, and database connection pools (`prisma/schema.prisma`, `src/lib/db.ts`).
    - **Agency Management & Storage**: Developed agency management routes, onboarding flows, server actions, dashboard logic, and UploadThing media upload integration.
    - **Stripe Billing & Connect**: Built the Stripe monetization infrastructure, including customer creation, subscription endpoints, locked feature package tiers, and Connect OAuth callback verification.
    - **Funnel Enhancements & Testing**: Implemented funnel editor updates, video URL processing form components, and authored the Selenium WebDriver automated E2E test suite (`e2e-tests/`).
    - **Core Bugfixes & Stability**: Resolved agency upsert payload crashes with safe fallback defaults, fixed image host wildcard resolution, and overhauled responsive viewport scaling for subaccounts.
    - **Design System & Custom Icons**: Crafted the 31 custom SVG design system icons and plan tier aura badge styling.

- **Asikur Rahman** ([@AsikurRahaman](https://github.com/AsikurRahaman))
  - **Email:** [asikujjaman5555@gmail.com](mailto:asikujjaman5555@gmail.com)
  - **GitHub:** [https://github.com/AsikurRahaman](https://github.com/AsikurRahaman)
  - **Role & Code Contributions:**
    - **Authentication & Authorization**: Integrated Clerk authentication, sign-in/sign-up components, redirection handling, and role-based access checks (Agency Owner, Admin, Subaccount User/Guest).
    - **Proxy Routing**: Configured edge proxy middleware (`src/proxy.ts`) for path filtering and route security.
    - **Team & Permissions**: Built team member invitation workflows, permission assignment queries, user update forms, and toast alert handling.
    - **Subaccount Media & Workspaces**: Built subaccount media storage integration, subaccount creation workflows, and sidebar navigation menus.
    - **Kanban Pipelines & CRM**: Developed the sales pipeline view, resolved pipeline card overlapping issues, built the contacts page, and implemented global state management for the visual builder.

- **Moshraf Jahan Ena** ([@MJahanEna](https://github.com/MJahanEna))
  - **Email:** [mjahanena1@gmail.com](mailto:mjahanena1@gmail.com)
  - **GitHub:** [https://github.com/MJahanEna](https://github.com/MJahanEna)
  - **Role & Code Contributions:**
    - **Public Landing Page UI**: Built the public-facing landing page components — top navbar, dark/light theme dropdown toggle, preview hero banner, and pricing cards.
    - **Agency Dashboard UI**: Developed dashboard views for connected vs. unconnected Stripe account states.
    - **Funnel Creation & Steps**: Created funnel setup modals, step navigation flow, and product linking interfaces via Stripe.
    - **Checkout & Navigation Components**: Built the Stripe checkout form component for visual funnels and sidebar layout structure.
    - **Infrastructure & Connection Fixes**: Configured CDN image domains and resolved Prisma adapter connection pool leaks.

- **Sanjina Rahaman Awdri** ([@sanjinaawdri](https://github.com/sanjinaawdri))
  - **Email:** [sawdri2330747@bscse.uiu.ac.bd](mailto:sawdri2330747@bscse.uiu.ac.bd)
  - **GitHub:** [https://github.com/sanjinaawdri](https://github.com/sanjinaawdri)
  - **Role & Code Contributions:**
    - **Subdomain Middleware Routing**: Implemented subdomain extraction logic within middleware for dynamic tenant page rewrites.
    - **Subaccount Dashboard & Metrics**: Built the subaccount dashboard layout, pipeline value metric card, and Stripe financial analytics display.
    - **Settings & User Management**: Created Agency Settings and User Settings pages with Clerk v7 role management.
    - **Notifications System**: Built the activity notification drawer and subaccount-specific notification filtering UI.
    - **Launchpad Onboarding**: Implemented the agency launchpad onboarding checklist UI and create subaccount workflow.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Prisma, Stripe Connect, and Tailwind CSS.</sub>
</div>
