-- =============================================================
-- Seed: test users for each application role
-- Password for all accounts: culasi123
-- Run via: supabase db seed OR paste directly in SQL Editor
-- =============================================================

with seed_accounts as (
  select *
  from (
    values
      ('superadmin@culasi.gov.ph', 'super_admin', 'Marilou Ramos', '0917 800 0001', null, null, null),
      ('admin@culasi.gov.ph', 'admin', 'Arvin Estrellado', '0917 800 0002', null, null, null),
      ('finance@culasi.gov.ph', 'finance', 'Jocelyn Pineda', '0917 800 0003', null, null, null),
      ('vendor@culasi.gov.ph', 'vendor', 'Leah Fernandez', '0917 800 0004', 'Leah''s Native Produce', 'Vegetables', 'Culasi, Antique')
  ) as t(email, app_role, full_name, phone, business_name, business_type, address)
)
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
select
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  a.email,
  crypt('culasi123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'provider', 'email',
    'providers', jsonb_build_array('email'),
    'role', a.app_role
  ),
  jsonb_strip_nulls(
    jsonb_build_object(
      'full_name', a.full_name,
      'phone', a.phone,
      'business_name', a.business_name,
      'business_type', a.business_type,
      'address', a.address
    )
  ),
  now(),
  now(),
  '', '', '', ''
from seed_accounts a
where not exists (
  select 1
  from auth.users u
  where u.email = a.email
);

-- Ensure app-domain rows exist even when auth.users inserts are skipped
-- during reseeding (trigger on_auth_user_created only fires on INSERT).
with seeded_auth_users as (
  select
    u.id,
    u.email,
    coalesce(u.raw_app_meta_data, '{}'::jsonb) as app_meta,
    coalesce(u.raw_user_meta_data, '{}'::jsonb) as user_meta
  from auth.users u
  where u.email in (
    'superadmin@culasi.gov.ph',
    'admin@culasi.gov.ph',
    'finance@culasi.gov.ph',
    'vendor@culasi.gov.ph'
  )
),
prepared_profiles as (
  select
    s.id,
    coalesce(s.user_meta ->> 'full_name', split_part(s.email, '@', 1)) as full_name,
    s.email,
    s.user_meta ->> 'phone' as phone,
    case
      when coalesce(s.app_meta ->> 'role', '') in ('super_admin', 'admin', 'finance', 'vendor') then
        (s.app_meta ->> 'role')::public.user_role
      else
        'vendor'::public.user_role
    end as role,
    s.user_meta
  from seeded_auth_users s
)
insert into public.profiles (id, full_name, email, phone, role)
select id, full_name, email, phone, role
from prepared_profiles
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  role = excluded.role;

insert into public.staff (profile_id)
select p.id
from public.profiles p
where p.email in ('superadmin@culasi.gov.ph', 'admin@culasi.gov.ph', 'finance@culasi.gov.ph')
on conflict (profile_id) do nothing;

with vendor_profile as (
  select
    p.id,
    coalesce(u.raw_user_meta_data, '{}'::jsonb) as user_meta
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.email = 'vendor@culasi.gov.ph'
)
insert into public.vendors (profile_id, business_name, business_type, address)
select
  v.id,
  coalesce(v.user_meta ->> 'business_name', 'New Vendor'),
  nullif(v.user_meta ->> 'business_type', ''),
  nullif(v.user_meta ->> 'address', '')
from vendor_profile v
on conflict (profile_id) do update
set
  business_name = excluded.business_name,
  business_type = coalesce(excluded.business_type, public.vendors.business_type),
  address = coalesce(excluded.address, public.vendors.address);
