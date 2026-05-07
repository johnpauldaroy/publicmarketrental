# Public Market Stall Rental and Monitoring System

## Architecture overview

- `React + Vite + TypeScript` powers the client shell.
- `Tailwind CSS` and shadcn-style UI primitives define the design system.
- `React Router` handles public, admin, finance, and vendor route segmentation.
- `TanStack Query` is configured for server state and will back Supabase queries.
- `React Hook Form + Zod` is used for typed auth and application forms.
- `Chart.js` powers dashboard analytics and report visuals.
- `Supabase` is the planned backend for auth, PostgreSQL, storage, realtime, and RLS.

## Portal map

### Public
- `/login`
- `/register`
- `/forgot-password`

### Admin / Back Office
- `/admin/dashboard`
- `/admin/vendors`
- `/admin/applications`
- `/admin/documents`
- `/admin/stalls`
- `/admin/assignments`
- `/admin/leases`
- `/admin/billing`
- `/admin/payments`
- `/admin/violations`
- `/admin/reports`
- `/admin/notifications`
- `/admin/staff`
- `/admin/settings`

### Vendor
- `/vendor/dashboard`
- `/vendor/profile`
- `/vendor/applications`
- `/vendor/documents`
- `/vendor/stall`
- `/vendor/billing`
- `/vendor/notifications`

## Frontend folder structure

```txt
src/
  app/
  components/
    layout/
    shared/
    ui/
  features/
    applications/
    auth/
    dashboard/
    reports/
  integrations/
    supabase/
  lib/
  pages/
  types/
```

## Current MVP scope

### Phase 1 foundation completed
- Vite migration from CRA
- TypeScript app shell
- Tailwind styling system
- Admin and vendor layouts
- Demo authentication context with role switching
- Route protection for admin, finance, and vendor paths
- Seeded dashboard analytics
- Application, document, billing, reporting, and settings page shells
- `.env.example` and Supabase client entry point

### Next build targets
- Replace demo auth context with Supabase Auth
- Add normalized PostgreSQL schema and RLS deployment
- Connect page tables and charts to live Supabase queries
- Add storage-backed document uploads
- Add CRUD forms for sections, stalls, leases, billing, and payments
- Add printable report templates and export workflows

## Demo accounts

- `superadmin@culasi.gov.ph` / `culasi123`
- `admin@culasi.gov.ph` / `culasi123`
- `finance@culasi.gov.ph` / `culasi123`
- `vendor@culasi.gov.ph` / `culasi123`
