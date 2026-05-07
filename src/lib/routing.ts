import type { UserRole } from "@/types/domain";

export function isBackOfficeRole(role: UserRole) {
  return role === "super_admin" || role === "admin" || role === "finance";
}

export function getPortalHome(role: UserRole) {
  return isBackOfficeRole(role) ? "/admin/dashboard" : "/vendor/dashboard";
}

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "finance":
      return "Finance";
    case "vendor":
      return "Vendor";
    default:
      return role;
  }
}
