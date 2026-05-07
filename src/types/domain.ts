import type { LucideIcon } from "lucide-react";

export type UserRole = "super_admin" | "admin" | "finance" | "vendor";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  businessName?: string;
  assignedStall?: string;
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export interface MetricCardData {
  label: string;
  value: string;
  delta: string;
  tone?: "positive" | "warning" | "neutral";
}

export interface TableColumn {
  key: string;
  label: string;
}

export type TableRow = Record<string, string>;

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  status: string;
}

export interface ReportSummaryCard {
  label: string;
  value: string;
  note: string;
}
