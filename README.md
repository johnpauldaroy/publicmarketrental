# Culasi Public Market System

Frontend foundation for the **Public Market Stall Rental and Monitoring System** described in `master_prompt.md`.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- React Router
- TanStack Query
- React Hook Form + Zod
- Chart.js
- Supabase client scaffold

## Current status

This repository now includes:

- a complete Vite migration from the original CRA scaffold
- responsive admin and vendor portals
- route protection for `super_admin`, `admin`, `finance`, and `vendor`
- seeded dashboards with Chart.js analytics
- module shells for applications, documents, stalls, leases, billing, payments, violations, reports, notifications, staff, and settings
- typed auth, registration, password reset, and stall application forms
- `.env.example` and a Supabase client entry point

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Demo accounts

- `superadmin@culasi.gov.ph` / `culasi123`
- `admin@culasi.gov.ph` / `culasi123`
- `finance@culasi.gov.ph` / `culasi123`
- `vendor@culasi.gov.ph` / `culasi123`

## Environment variables

Copy values from `.env.example`:

```env
VITE_APP_NAME="Culasi Public Market System"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

## Project notes

- Architecture notes and route map: `docs/architecture.md`
- The current implementation uses seeded data for fast iteration.
- Supabase auth, storage, SQL schema, and RLS are the next integration step.
