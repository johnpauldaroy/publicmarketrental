import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppUser, UserRole } from "@/types/domain";

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readRole(value: unknown): UserRole {
  return value === "super_admin" || value === "admin" || value === "finance" || value === "vendor"
    ? value
    : "vendor";
}

function metadata(user: User) {
  return (user.user_metadata ?? {}) as Record<string, unknown>;
}

function appMetadata(user: User) {
  return (user.app_metadata ?? {}) as Record<string, unknown>;
}

async function ensureProfileRows(user: User) {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const userMeta = metadata(user);
  const role = readRole(appMetadata(user).role ?? userMeta.role);

  if (role !== "vendor") {
    throw new Error("Privileged accounts must be provisioned through the server-side admin flow.");
  }

  const profilePayload = {
    id: user.id,
    full_name: readString(userMeta.full_name, user.email?.split("@")[0] ?? "User"),
    email: user.email ?? "",
    phone: readString(userMeta.phone),
    role,
  };

  const { error: profileError } = await supabase.from("profiles").upsert(profilePayload);

  if (profileError) {
    throw profileError;
  }

  if (role === "vendor") {
    const { error: vendorError } = await supabase.from("vendors").upsert({
      profile_id: user.id,
      business_name: readString(userMeta.business_name, "New Vendor"),
      business_type: readString(userMeta.business_type),
      address: readString(userMeta.address),
    });

    if (vendorError) {
      throw vendorError;
    }
  }
}

export async function fetchAppUser(userId: string): Promise<AppUser> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    throw new Error("Profile record was not found for this account.");
  }

  const appUser: AppUser = {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? "",
    role: profile.role as UserRole,
  };

  if (profile.role === "vendor") {
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("business_name")
      .eq("profile_id", userId)
      .maybeSingle();

    if (vendorError) {
      throw vendorError;
    }

    appUser.businessName = vendor?.business_name ?? "";
  }

  return appUser;
}

export async function resolveAppUserFromAuth(user: User): Promise<AppUser> {
  try {
    return await fetchAppUser(user.id);
  } catch (error) {
    await ensureProfileRows(user);
    return fetchAppUser(user.id);
  }
}
