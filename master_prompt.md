# Master Prompt — Public Market Stall Rental and Monitoring System

You are a senior full-stack engineer and system architect. Build a production-ready **Public Market Stall Rental and Monitoring System** for the **Municipality of Culasi** using:

- **Frontend:** React + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **Charts:** Chart.js
- **Backend / DB / Auth / Storage:** Supabase

Your task is to generate a complete, clean, modular, scalable web application based on the following requirements.

---

## 1) Project Context

The general objective of this study is to develop a **Public Market Stall Rental and Monitoring System** that improves the management of public market stalls in the Municipality of Culasi through **digital monitoring, automated processes, and data-driven decision-making**.

### Specific Objectives
1. Develop a **web-based system** for:
   - stall application
   - document submission
   - stall assignment
   - payment tracking
   - occupancy monitoring
   - a comprehensive reporting module that allows administrators to **filter, generate, and print real-time reports** on stall occupancy, payments, and vendor compliance
2. Implement:
   - automated notifications for application status, including rejections
   - digital records for document review
   - contract renewal features
   - reporting features to improve operational efficiency

---

## 2) Scope of the System

The system focuses on the design and development of a **Public Market Stall Rental and Monitoring System** exclusively for the **public market of the Municipality of Culasi**.

The system must allow vendors to:
- apply for stalls online
- optionally have records encoded by staff for walk-in applicants
- upload and submit required business permit documents
- view stall availability in real time
- track application status
- receive notifications for approvals, rejections, and renewal reminders
- view billing information and payment history

The system must allow LGU personnel / administrators to:
- review vendor applications
- verify submitted documents
- approve or reject applications with reasons
- assign stalls
- monitor occupancy
- track payments and balances
- manage contract renewals
- record vendor violations
- generate operational and financial reports from a centralized dashboard

### Required business permit / compliance documents
At minimum, support document upload and review for:
- Barangay Clearance
- Police Clearance
- Health Clearance
- DTI Registration

Design the document requirements so they are configurable for future changes.

---

## 3) Limitations / Boundaries

- The system requires a stable internet connection.
- The system only covers **stall rental and monitoring operations**.
- It does **not** cover sanitation, security, or food safety inspections.
- It is designed specifically for the **Municipality of Culasi** and not for other LGUs or private markets.
- Physical stall maintenance and repairs remain manual and outside the scope of the system.

---

## 4) Core Process Flow (IPO-Based)

### Inputs
- Vendor data
- Stall data
- Lease details
- Payment records
- Business permit requirements / compliance documents

### Processes
- Digital stall application and approval workflow
- Document verification
- Automated notification dispatching (approvals / rejections / reminders)
- Payment monitoring and billing
- Stall occupancy monitoring
- Violation tracking
- Reporting and analytics

### Outputs
- Organized digital records
- Real-time monitoring views
- Filterable and printable reports
- Automated reports / summaries
- Improved market operations

---

## 5) User Roles

Implement **role-based access control** with Supabase Auth and database policies.

### Roles
1. **Super Admin**
   - full system access
   - manage staff accounts and system settings
2. **Admin / LGU Personnel**
   - review applications
   - verify documents
   - assign stalls
   - manage billing, renewals, and violations
   - generate reports
3. **Cashier / Finance Staff**
   - record and verify payments
   - view billing and arrears
   - print receipts / payment summaries
4. **Vendor / Applicant**
   - register/login
   - submit applications and documents
   - view stall/application/payment status
   - receive notifications

Optional: add **Market Inspector** if needed for future violation monitoring.

---

## 6) Required Modules

### A. Authentication and Profile Management
- Supabase Auth for login/register/reset password
- role-based redirection after login
- vendor profile management
- admin/staff account management

### B. Vendor Application Module
- online application form
- support walk-in application encoding by staff
- application status timeline: Draft, Submitted, Under Review, Approved, Rejected, Assigned, Active, Expired
- rejection reason field required when rejected
- resubmission flow for incomplete/rejected applications

### C. Document Submission and Verification
- upload required documents to Supabase Storage
- preview/download uploaded files
- verification status per document: Pending, Verified, Rejected, Needs Resubmission
- document remarks field
- configurable list of required documents
- document expiry tracking where applicable

### D. Stall Management and Assignment
- manage market sections / zones / rows / stall numbers
- stall status: Available, Reserved, Occupied, Under Maintenance, Inactive
- stall category/type (e.g. dry goods, meat, fish, vegetables, general merchandise)
- assignment workflow linking vendor to stall and lease record
- occupancy monitoring dashboard
- real-time availability indicators

### E. Lease / Contract Management
- lease start date
- lease end date
- rental rate
- renewal status
- renewal reminders before expiry
- contract history log

### F. Billing and Payment Monitoring
- generate billing records by schedule (monthly or configurable)
- payment status: Unpaid, Partial, Paid, Overdue
- payment entry for staff
- vendor payment history view
- balance and arrears computation
- optional official receipt number field
- downloadable / printable payment summary

### G. Violation Tracking
- log vendor violations with date, category, description, action taken, and status
- optional penalty amount
- repeated violation indicators
- vendor compliance view for admins

### H. Notifications
- in-app notifications at minimum
- optionally structure the code to support email notifications later
- notifications for:
  - application submitted
  - application approved
  - application rejected with reason
  - missing/invalid documents
  - payment due / overdue
  - contract renewal reminder
  - stall reassignment or updates

### I. Dashboard and Reporting
- admin dashboard with KPIs and charts
- vendor dashboard for application/payment/lease overview
- reporting pages with filters and print-friendly output
- real-time reports for:
  - stall occupancy
  - vendor compliance
  - payments collected
  - overdue balances
  - expiring contracts
  - document verification status
  - violations summary

---

## 7) Dashboard Requirements

Use **Chart.js** for analytics visualizations.

### Admin Dashboard Widgets
- total stalls
- occupied stalls
- available stalls
- total vendors
- pending applications
- verified vs pending documents
- total collected payments
- overdue accounts count
- expiring leases count
- recent activities feed

### Suggested Charts
- occupancy by market section
- monthly payment collection trend
- application status distribution
- document verification status distribution
- violations by category
- lease expiry timeline

### Vendor Dashboard Widgets
- application status
- assigned stall details
- current balance
- recent payments
- lease expiry date
- document compliance checklist
- notification panel

---

## 8) Reporting Requirements

Create a comprehensive reporting module.

### Reports must support
- filtering by date range
- filtering by market section / stall type / status
- filtering by vendor
- filtering by payment status
- filtering by compliance / violation status
- export-ready or print-friendly layout

### Minimum report types
1. Stall Occupancy Report
2. Payment Collection Report
3. Outstanding Balances / Arrears Report
4. Vendor Compliance Report
5. Application Status Report
6. Lease Expiry / Renewal Report
7. Violation Report

Add a **Print Report** button and print-optimized layout.

---

## 9) Suggested Database Design (Supabase / PostgreSQL)

Design a normalized schema with timestamps and audit-friendly fields.

### Suggested tables
- `profiles`
- `roles` or role enum
- `vendors`
- `staff`
- `market_sections`
- `stalls`
- `stall_assignments`
- `applications`
- `application_documents`
- `document_requirements`
- `leases`
- `billings`
- `payments`
- `violations`
- `notifications`
- `activity_logs`
- `system_settings`

### Example essential fields

#### profiles
- id (uuid, references auth.users)
- full_name
- email
- phone
- role
- avatar_url
- created_at
- updated_at

#### vendors
- id
- profile_id
- business_name
- business_type
- address
- barangay
- permit_number
- status
- created_at

#### stalls
- id
- section_id
- stall_number
- stall_type
- size
- monthly_rate
- status
- notes

#### applications
- id
- vendor_id
- preferred_stall_id (nullable)
- application_type (online / walk_in)
- status
- submitted_at
- reviewed_by
- reviewed_at
- rejection_reason
- remarks

#### application_documents
- id
- application_id
- requirement_id
- file_url
- file_name
- verification_status
- remarks
- verified_by
- verified_at
- expiry_date

#### leases
- id
- vendor_id
- stall_id
- start_date
- end_date
- monthly_rate
- status
- renewal_status
- created_by

#### billings
- id
- lease_id
- billing_month
- amount_due
- amount_paid
- due_date
- status
- penalties
- notes

#### payments
- id
- billing_id
- vendor_id
- amount
- payment_date
- payment_method
- receipt_number
- recorded_by
- notes

#### violations
- id
- vendor_id
- stall_id
- category
- description
- violation_date
- penalty_amount
- status
- action_taken
- recorded_by

#### notifications
- id
- user_id
- title
- message
- type
- is_read
- link
- created_at

### Database requirements
- use foreign keys and indexes
- add soft-delete where appropriate
- add triggers/functions where helpful
- create views/materialized queries if needed for dashboard performance
- write Row Level Security policies for each role

---

## 10) Supabase Requirements

Use Supabase for:
- authentication
- PostgreSQL database
- storage for document uploads
- row-level security
- optional edge functions for notifications or scheduled reminders
- realtime subscriptions where useful for dashboard updates

### Must include
- SQL schema setup
- RLS policies
- seed data for demo/testing
- storage bucket strategy for documents
- secure file access approach

---

## 11) Frontend Requirements

### Stack
- React + Vite
- TypeScript preferred
- Tailwind CSS
- shadcn/ui components
- Chart.js for charts
- React Router
- React Hook Form + Zod for forms and validation
- TanStack Query recommended for server state

### UI / UX Requirements
- modern, clean, responsive admin dashboard
- accessible form design
- mobile-responsive vendor portal
- reusable components
- loading states, empty states, and error states
- toast notifications
- breadcrumb and sidebar navigation for admin
- table filtering, searching, sorting, and pagination
- confirmation dialogs for destructive actions

### Suggested pages

#### Public / Auth
- login
- register
- forgot password

#### Vendor Pages
- dashboard
- profile
- applications
- application details
- document uploads
- assigned stall
- billing and payment history
- notifications

#### Admin Pages
- dashboard
- vendors
- applications
- document verification queue
- stalls
- assignments
- leases / renewals
- billing
- payments
- violations
- reports
- notifications
- staff / user management
- settings

---

## 12) Development Standards

- Use TypeScript.
- Use feature-based folder structure.
- Keep components modular and reusable.
- Separate UI, business logic, API layer, and hooks.
- Use environment variables for Supabase config.
- Add schema validation with Zod.
- Add form handling with React Hook Form.
- Write clean comments only where necessary.
- Avoid monolithic files.
- Follow consistent naming conventions.

### Suggested folder structure
```txt
src/
  app/
  components/
  features/
    auth/
    dashboard/
    vendors/
    applications/
    documents/
    stalls/
    leases/
    billing/
    payments/
    violations/
    reports/
    notifications/
  hooks/
  lib/
  services/
  integrations/
  pages/
  types/
  utils/
```

---

## 13) Functional Requirements Summary

The finished system must support:
- vendor registration and authentication
- online and staff-encoded stall applications
- document upload and admin verification
- approval/rejection with reasons
- real-time stall availability and assignment
- lease management and renewals
- billing, payments, balances, and arrears monitoring
- violation recording and compliance tracking
- automated in-app notifications
- dashboard analytics using Chart.js
- filtered, printable, real-time reports
- audit-friendly digital records

---

## 14) Non-Functional Requirements

- responsive design
- secure authentication and authorization
- reliable file upload handling
- good performance for dashboards and reports
- maintainable codebase
- scalable schema and modules
- user-friendly interface for non-technical LGU staff

---

## 15) Deliverables to Generate

Generate the project in phases and include:

1. project architecture overview
2. database schema / SQL
3. Supabase setup instructions
4. React app structure
5. reusable UI components
6. authentication flow
7. CRUD modules for all major entities
8. dashboard implementation with Chart.js
9. report filtering and print layout
10. sample seed data
11. route protection and RBAC
12. RLS policies
13. `.env.example`
14. README with setup instructions

---

## 16) Implementation Priorities

Build in this order:

### Phase 1
- project setup
- auth
- RBAC
- profiles
- vendors
- market sections and stalls

### Phase 2
- applications
- document uploads and verification
- stall assignment
- lease creation

### Phase 3
- billing and payments
- notifications
- renewals
- violations

### Phase 4
- dashboards
- chart analytics
- reporting and printing
- audit logs
- polishing and optimization

---

## 17) Acceptance Criteria

The system is acceptable if:
- vendors can submit and track applications online
- staff can review documents and approve/reject applications with reasons
- stalls can be assigned and monitored in real time
- billing and payment records are computed accurately
- overdue and expiring leases are visible in dashboards/reports
- notifications are generated for important events
- admins can generate filtered and printable reports
- data is secured by proper role-based access and RLS
- UI is responsive and usable on desktop and mobile

---

## 18) Code Generation Instruction

Generate the application as if it will be used for a real capstone / thesis prototype and possibly extended to production later.

When generating code:
- prefer maintainability and clarity over shortcuts
- use realistic dummy data where needed
- create reusable hooks, services, and UI components
- provide complete file contents when asked
- ensure compatibility with React + Vite + Tailwind + shadcn/ui + Chart.js + Supabase
- avoid placeholder pseudo-code unless explicitly requested

---

## 19) First Output to Produce

Start by generating these in order:
1. a high-level system architecture
2. the full PostgreSQL / Supabase schema
3. the recommended folder structure
4. the route map for admin and vendor portals
5. the MVP feature breakdown
6. the SQL for core tables and RLS policies
7. the initial Vite + React + Tailwind + shadcn setup steps

---

## 20) Important Domain Notes

- The system is for the **Municipality of Culasi Public Market**.
- Rejection notifications must include reasons.
- Reports must be **filterable, real-time, and printable**.
- Document review must be digitally tracked.
- Contract renewal and payment monitoring are core requirements.
- Occupancy monitoring is a core dashboard/reporting requirement.

Use these requirements as the single source of truth when planning and generating the project.