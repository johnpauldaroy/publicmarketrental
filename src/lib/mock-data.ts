import type {
  ActivityItem,
  AppUser,
  MetricCardData,
  ReportSummaryCard,
  TableRow,
  UserRole,
} from "@/types/domain";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoCredentials = [
  {
    role: "super_admin" as UserRole,
    label: "Super Admin",
    email: "superadmin@culasi.gov.ph",
    password: "culasi123",
    name: "Marilou Ramos",
  },
  {
    role: "admin" as UserRole,
    label: "Admin",
    email: "admin@culasi.gov.ph",
    password: "culasi123",
    name: "Arvin Estrellado",
  },
  {
    role: "finance" as UserRole,
    label: "Finance",
    email: "finance@culasi.gov.ph",
    password: "culasi123",
    name: "Jocelyn Pineda",
  },
  {
    role: "vendor" as UserRole,
    label: "Vendor",
    email: "vendor@culasi.gov.ph",
    password: "culasi123",
    name: "Leah Fernandez",
  },
];

export function getDemoUser(role: UserRole): AppUser {
  const account = demoCredentials.find((item) => item.role === role);

  if (!account) {
    throw new Error(`Missing demo user for role: ${role}`);
  }

  return {
    id: `${role}-demo`,
    name: account.name,
    email: account.email,
    role,
    phone: "0917 800 2145",
    businessName: role === "vendor" ? "Leah's Native Produce" : undefined,
    assignedStall: role === "vendor" ? "Dry Goods B-14" : undefined,
  };
}

export const adminMetrics: MetricCardData[] = [
  { label: "Total Stalls", value: "186", delta: "12 newly mapped this quarter" },
  {
    label: "Occupied Stalls",
    value: "142",
    delta: "76.3% occupancy rate",
    tone: "positive",
  },
  {
    label: "Pending Applications",
    value: "18",
    delta: "6 need document resubmission",
    tone: "warning",
  },
  {
    label: "Collections This Month",
    value: "PHP 428,500",
    delta: "Up 8.4% versus February",
    tone: "positive",
  },
  {
    label: "Overdue Accounts",
    value: "13",
    delta: "7 high-priority follow-ups",
    tone: "warning",
  },
  {
    label: "Expiring Leases",
    value: "11",
    delta: "Within the next 45 days",
  },
];

export const vendorMetrics: MetricCardData[] = [
  {
    label: "Application Status",
    value: "Assigned",
    delta: "Lease generated on March 18, 2026",
    tone: "positive",
  },
  {
    label: "Assigned Stall",
    value: "Dry Goods B-14",
    delta: "Ground level near main aisle",
  },
  {
    label: "Current Balance",
    value: "PHP 1,250",
    delta: "Due on April 5, 2026",
    tone: "warning",
  },
  {
    label: "Documents Verified",
    value: "3 / 4",
    delta: "Health clearance expires in 12 days",
    tone: "warning",
  },
];

export const adminActivities: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Application approved for Renato's Seafood Supply",
    detail: "Stall assignment ready for Wet Market A-07.",
    timestamp: "10 minutes ago",
    status: "Approved",
  },
  {
    id: "activity-2",
    title: "March collections posted",
    detail: "Finance verified 14 payment entries before noon.",
    timestamp: "42 minutes ago",
    status: "Paid",
  },
  {
    id: "activity-3",
    title: "Barangay clearance rejected",
    detail: "Applicant needs to upload a clearer scan before review continues.",
    timestamp: "1 hour ago",
    status: "Needs Resubmission",
  },
  {
    id: "activity-4",
    title: "Lease renewal reminder queued",
    detail: "11 vendors will receive in-app alerts this afternoon.",
    timestamp: "2 hours ago",
    status: "Scheduled",
  },
];

export const vendorNotifications: ActivityItem[] = [
  {
    id: "vendor-note-1",
    title: "Lease approved",
    detail: "Your stall assignment for Dry Goods B-14 is now active.",
    timestamp: "March 18, 2026",
    status: "Approved",
  },
  {
    id: "vendor-note-2",
    title: "Billing reminder",
    detail: "Your April billing of PHP 1,250 is due on April 5, 2026.",
    timestamp: "March 21, 2026",
    status: "Due Soon",
  },
  {
    id: "vendor-note-3",
    title: "Health clearance expiring",
    detail: "Upload your renewed clearance to avoid compliance issues.",
    timestamp: "March 22, 2026",
    status: "Action Required",
  },
];

export const occupancyBySection = [
  { section: "Dry Goods", occupied: 48, available: 9 },
  { section: "Wet Market", occupied: 36, available: 5 },
  { section: "Meat Row", occupied: 22, available: 4 },
  { section: "Fish Aisle", occupied: 18, available: 6 },
  { section: "Vegetables", occupied: 18, available: 7 },
];

export const monthlyCollections = [
  { month: "Oct", collected: 352000, target: 360000 },
  { month: "Nov", collected: 368500, target: 365000 },
  { month: "Dec", collected: 389000, target: 380000 },
  { month: "Jan", collected: 401200, target: 392000 },
  { month: "Feb", collected: 395700, target: 400000 },
  { month: "Mar", collected: 428500, target: 410000 },
];

export const vendorPaymentTrend = [
  { month: "Oct", amount: 900 },
  { month: "Nov", amount: 900 },
  { month: "Dec", amount: 950 },
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1200 },
  { month: "Mar", amount: 1250 },
];

export const applicationStatusBreakdown = [
  { label: "Draft", value: 4, color: "#CBD5E1" },
  { label: "Under Review", value: 18, color: "#F59E0B" },
  { label: "Approved", value: 41, color: "#0F766E" },
  { label: "Rejected", value: 6, color: "#DC2626" },
  { label: "Assigned", value: 28, color: "#2563EB" },
];

export const documentStatusBreakdown = [
  { label: "Verified", value: 118, color: "#15803D" },
  { label: "Pending", value: 22, color: "#D97706" },
  { label: "Needs Resubmission", value: 9, color: "#B91C1C" },
];

export const vendorComplianceBreakdown = [
  { label: "Verified", value: 3, color: "#15803D" },
  { label: "Pending", value: 1, color: "#D97706" },
];

export const applicationQueue: TableRow[] = [
  {
    applicant: "Renato's Seafood Supply",
    type: "Walk-in",
    preferred_stall: "Wet Market A-07",
    documents: "4 / 4 uploaded",
    status: "Under Review",
    updated: "Today, 9:12 AM",
  },
  {
    applicant: "Maria's Native Kakanin",
    type: "Online",
    preferred_stall: "Dry Goods C-03",
    documents: "3 / 4 uploaded",
    status: "Needs Resubmission",
    updated: "Today, 8:40 AM",
  },
  {
    applicant: "Belen Vegetable Trader",
    type: "Online",
    preferred_stall: "Vegetables V-09",
    documents: "4 / 4 uploaded",
    status: "Approved",
    updated: "Yesterday",
  },
];

export const documentVerificationQueue: TableRow[] = [
  {
    vendor: "Maria's Native Kakanin",
    document: "Barangay Clearance",
    expiry: "May 30, 2026",
    verifier: "Document Desk",
    status: "Needs Resubmission",
    remarks: "Scan is cropped on the official seal.",
  },
  {
    vendor: "Renato's Seafood Supply",
    document: "Health Clearance",
    expiry: "June 18, 2026",
    verifier: "Pending assignment",
    status: "Pending",
    remarks: "Uploaded today at 8:49 AM.",
  },
  {
    vendor: "Leah's Native Produce",
    document: "DTI Registration",
    expiry: "November 2, 2026",
    verifier: "A. Estrellado",
    status: "Verified",
    remarks: "Valid and archived.",
  },
];

export const stallInventory: TableRow[] = [
  {
    stall: "Dry Goods B-14",
    section: "Dry Goods",
    type: "General Merchandise",
    rate: "PHP 1,250",
    status: "Occupied",
    notes: "Lease active until March 2027",
  },
  {
    stall: "Wet Market A-07",
    section: "Wet Market",
    type: "Fish",
    rate: "PHP 1,650",
    status: "Reserved",
    notes: "Application approved, waiting assignment",
  },
  {
    stall: "Vegetables V-09",
    section: "Vegetables",
    type: "Produce",
    rate: "PHP 1,100",
    status: "Available",
    notes: "Recently vacated",
  },
];

export const assignments: TableRow[] = [
  {
    vendor: "Leah's Native Produce",
    stall: "Dry Goods B-14",
    start_date: "March 18, 2026",
    end_date: "March 17, 2027",
    status: "Active",
    encoded_by: "A. Estrellado",
  },
  {
    vendor: "Belen Vegetable Trader",
    stall: "Vegetables V-09",
    start_date: "April 1, 2026",
    end_date: "March 31, 2027",
    status: "Scheduled",
    encoded_by: "M. Ramos",
  },
];

export const leases: TableRow[] = [
  {
    vendor: "Leah's Native Produce",
    stall: "Dry Goods B-14",
    monthly_rate: "PHP 1,250",
    renewal_status: "Active",
    lease_end: "March 17, 2027",
    reminder: "315 days remaining",
  },
  {
    vendor: "Rogelio Meat House",
    stall: "Meat Row M-04",
    monthly_rate: "PHP 1,850",
    renewal_status: "Expiring",
    lease_end: "April 25, 2026",
    reminder: "34 days remaining",
  },
];

export const billings: TableRow[] = [
  {
    vendor: "Leah's Native Produce",
    billing_month: "April 2026",
    amount_due: "PHP 1,250",
    due_date: "April 5, 2026",
    amount_paid: "PHP 0",
    status: "Unpaid",
  },
  {
    vendor: "Rogelio Meat House",
    billing_month: "March 2026",
    amount_due: "PHP 1,850",
    due_date: "March 5, 2026",
    amount_paid: "PHP 1,000",
    status: "Partial",
  },
  {
    vendor: "Belen Vegetable Trader",
    billing_month: "March 2026",
    amount_due: "PHP 1,100",
    due_date: "March 5, 2026",
    amount_paid: "PHP 1,100",
    status: "Paid",
  },
];

export const payments: TableRow[] = [
  {
    receipt: "OR-2026-0312",
    vendor: "Belen Vegetable Trader",
    amount: "PHP 1,100",
    payment_date: "March 6, 2026",
    method: "Cash",
    recorded_by: "J. Pineda",
  },
  {
    receipt: "OR-2026-0313",
    vendor: "Rogelio Meat House",
    amount: "PHP 1,000",
    payment_date: "March 8, 2026",
    method: "GCash",
    recorded_by: "J. Pineda",
  },
  {
    receipt: "OR-2026-0314",
    vendor: "Leah's Native Produce",
    amount: "PHP 1,250",
    payment_date: "March 18, 2026",
    method: "Cash",
    recorded_by: "J. Pineda",
  },
];

export const violations: TableRow[] = [
  {
    vendor: "Rogelio Meat House",
    category: "Late Payment",
    date: "March 10, 2026",
    penalty: "PHP 150",
    action: "Warning issued",
    status: "Open",
  },
  {
    vendor: "Nilda Fish Retail",
    category: "Unauthorized Stall Extension",
    date: "March 5, 2026",
    penalty: "PHP 500",
    action: "Inspection logged",
    status: "Under Review",
  },
];

export const reportsSummary: ReportSummaryCard[] = [
  {
    label: "Occupancy Report",
    value: "76.3%",
    note: "142 occupied out of 186 total mapped stalls",
  },
  {
    label: "Overdue Balances",
    value: "PHP 37,450",
    note: "Across 13 vendor accounts as of March 22, 2026",
  },
  {
    label: "Expiring Contracts",
    value: "11",
    note: "For leases ending before May 10, 2026",
  },
];

export const reportRows: TableRow[] = [
  {
    report: "Stall Occupancy",
    filter_scope: "All sections",
    generated_at: "March 22, 2026 11:30 AM",
    coverage: "Real-time",
    status: "Ready",
  },
  {
    report: "Payment Collection",
    filter_scope: "March 2026",
    generated_at: "March 22, 2026 11:31 AM",
    coverage: "Month-to-date",
    status: "Ready",
  },
  {
    report: "Lease Expiry",
    filter_scope: "Next 60 days",
    generated_at: "March 22, 2026 11:31 AM",
    coverage: "Forward-looking",
    status: "Ready",
  },
];

export const staffAccounts: TableRow[] = [
  {
    staff: "Marilou Ramos",
    role: "Super Admin",
    email: "superadmin@culasi.gov.ph",
    access: "Full",
    status: "Active",
  },
  {
    staff: "Arvin Estrellado",
    role: "Admin",
    email: "admin@culasi.gov.ph",
    access: "Operations",
    status: "Active",
  },
  {
    staff: "Jocelyn Pineda",
    role: "Finance",
    email: "finance@culasi.gov.ph",
    access: "Billing and payments",
    status: "Active",
  },
];

export const vendorApplications: TableRow[] = [
  {
    application: "New Stall Lease",
    submitted: "March 12, 2026",
    preferred_stall: "Dry Goods B-14",
    documents: "4 / 4",
    status: "Assigned",
  },
];

export const vendorDocuments: TableRow[] = [
  {
    document: "Barangay Clearance",
    uploaded: "March 12, 2026",
    expiry: "June 30, 2026",
    status: "Verified",
    remarks: "No issues found",
  },
  {
    document: "Police Clearance",
    uploaded: "March 12, 2026",
    expiry: "September 12, 2026",
    status: "Verified",
    remarks: "No issues found",
  },
  {
    document: "Health Clearance",
    uploaded: "March 12, 2026",
    expiry: "April 3, 2026",
    status: "Pending",
    remarks: "Renewal required soon",
  },
  {
    document: "DTI Registration",
    uploaded: "March 12, 2026",
    expiry: "November 2, 2026",
    status: "Verified",
    remarks: "No issues found",
  },
];

export const vendorBillingRows: TableRow[] = [
  {
    billing_month: "April 2026",
    amount_due: "PHP 1,250",
    due_date: "April 5, 2026",
    amount_paid: "PHP 0",
    status: "Unpaid",
  },
  {
    billing_month: "March 2026",
    amount_due: "PHP 1,250",
    due_date: "March 5, 2026",
    amount_paid: "PHP 1,250",
    status: "Paid",
  },
];

export const vendorAssignedStall = {
  stall: "Dry Goods B-14",
  section: "Dry Goods",
  type: "General Merchandise",
  rate: "PHP 1,250 / month",
  leaseStart: "March 18, 2026",
  leaseEnd: "March 17, 2027",
  notes: "Adjacent to the eastern loading access and covered drainage line.",
};

export async function getAdminDashboardSnapshot() {
  await delay(320);

  return {
    metrics: adminMetrics,
    activities: adminActivities,
    applicationQueue,
    applicationStatusBreakdown,
    documentStatusBreakdown,
    monthlyCollections,
    occupancyBySection,
  };
}

export async function getVendorDashboardSnapshot() {
  await delay(260);

  return {
    metrics: vendorMetrics,
    notifications: vendorNotifications,
    vendorApplications,
    vendorBillingRows,
    vendorComplianceBreakdown,
    vendorPaymentTrend,
    vendorAssignedStall,
  };
}
