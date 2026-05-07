create unique index if not exists idx_renewal_requests_pending_unique
on public.lease_renewal_requests(lease_id)
where status = 'pending';

create or replace function public.apply_billing_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.amount_due = coalesce(new.amount_due, 0);
  new.amount_paid = coalesce(new.amount_paid, 0);
  new.penalties = coalesce(new.penalties, 0);
  new.status = case
    when new.amount_paid >= new.amount_due then 'paid'::public.billing_status
    when new.amount_paid > 0 then 'partial'::public.billing_status
    when new.due_date < current_date then 'overdue'::public.billing_status
    else 'unpaid'::public.billing_status
  end;

  return new;
end;
$$;

drop trigger if exists apply_billing_status_before_write on public.billings;
create trigger apply_billing_status_before_write
before insert or update on public.billings
for each row execute function public.apply_billing_status();

create or replace function public.sync_billing_totals_from_payments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_billing_id uuid;
  paid_total numeric(12,2);
begin
  target_billing_id := coalesce(new.billing_id, old.billing_id);
  paid_total := coalesce((
    select sum(amount)
    from public.payments
    where billing_id = target_billing_id
  ), 0);

  update public.billings
  set
    amount_paid = paid_total,
    status = case
      when paid_total >= amount_due then 'paid'::public.billing_status
      when paid_total > 0 then 'partial'::public.billing_status
      when due_date < current_date then 'overdue'::public.billing_status
      else 'unpaid'::public.billing_status
    end
  where id = target_billing_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_billing_totals_after_payment_insert on public.payments;
create trigger sync_billing_totals_after_payment_insert
after insert on public.payments
for each row execute function public.sync_billing_totals_from_payments();

drop trigger if exists sync_billing_totals_after_payment_update on public.payments;
create trigger sync_billing_totals_after_payment_update
after update on public.payments
for each row execute function public.sync_billing_totals_from_payments();

drop trigger if exists sync_billing_totals_after_payment_delete on public.payments;
create trigger sync_billing_totals_after_payment_delete
after delete on public.payments
for each row execute function public.sync_billing_totals_from_payments();

create or replace function public.mark_lease_renewal_in_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.leases
  set renewal_status = 'in_progress'::public.renewal_status
  where id = new.lease_id;

  return new;
end;
$$;

drop trigger if exists set_lease_renewal_status_after_request_insert on public.lease_renewal_requests;
create trigger set_lease_renewal_status_after_request_insert
after insert on public.lease_renewal_requests
for each row execute function public.mark_lease_renewal_in_progress();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  assigned_role := case
    when coalesce(new.raw_app_meta_data ->> 'role', '') in ('super_admin', 'admin', 'finance', 'vendor') then
      (new.raw_app_meta_data ->> 'role')::public.user_role
    else
      'vendor'::public.user_role
  end;

  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    assigned_role
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    role = excluded.role;

  if assigned_role = 'vendor' then
    insert into public.vendors (profile_id, business_name, business_type, address)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'business_name', 'New Vendor'),
      new.raw_user_meta_data ->> 'business_type',
      new.raw_user_meta_data ->> 'address'
    )
    on conflict (profile_id) do update
    set
      business_name = excluded.business_name,
      business_type = coalesce(excluded.business_type, public.vendors.business_type),
      address = coalesce(excluded.address, public.vendors.address);
  else
    insert into public.staff (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'super_admin'
$$;

create or replace function public.is_back_office()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('super_admin', 'admin', 'finance')
$$;

create or replace function public.owns_vendor(target_vendor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vendors
    where id = target_vendor_id
      and profile_id = auth.uid()
  )
$$;

create or replace function public.owns_application(target_application_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications a
    join public.vendors v on v.id = a.vendor_id
    where a.id = target_application_id
      and v.profile_id = auth.uid()
  )
$$;

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_super_admin() then
    return new;
  end if;

  if old.id <> auth.uid() then
    raise exception 'You can only update your own profile.';
  end if;

  if new.id <> old.id
    or new.role <> old.role
    or new.created_at <> old.created_at then
    raise exception 'Protected profile fields cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_update_before_write on public.profiles;
create trigger guard_profile_update_before_write
before update on public.profiles
for each row execute function public.guard_profile_update();

create or replace function public.guard_vendor_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if old.profile_id <> auth.uid() then
    raise exception 'You can only update your own vendor record.';
  end if;

  if new.id <> old.id
    or new.profile_id <> old.profile_id
    or new.status <> old.status
    or new.created_at <> old.created_at then
    raise exception 'Protected vendor fields cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_vendor_update_before_write on public.vendors;
create trigger guard_vendor_update_before_write
before update on public.vendors
for each row execute function public.guard_vendor_update();

create or replace function public.guard_application_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if not public.owns_vendor(new.vendor_id) then
    raise exception 'You can only write applications for your own vendor account.';
  end if;

  if tg_op = 'INSERT' then
    if new.status not in ('draft', 'submitted') then
      raise exception 'Invalid application status for vendor submission.';
    end if;

    if new.reviewed_by is not null
      or new.reviewed_at is not null
      or new.rejection_reason is not null
      or new.preferred_stall_id is not null then
      raise exception 'Admin-only application fields cannot be set by vendors.';
    end if;

    return new;
  end if;

  if new.vendor_id <> old.vendor_id
    or new.reviewed_by is distinct from old.reviewed_by
    or new.reviewed_at is distinct from old.reviewed_at
    or new.rejection_reason is distinct from old.rejection_reason
    or new.preferred_stall_id is distinct from old.preferred_stall_id
    or new.created_at <> old.created_at then
    raise exception 'Protected application fields cannot be changed from the client.';
  end if;

  if new.status is distinct from old.status
    and new.status not in ('draft', 'submitted') then
    raise exception 'Vendors can only save drafts or submit applications.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_application_before_write on public.applications;
create trigger guard_application_before_write
before insert or update on public.applications
for each row execute function public.guard_application_write();

create or replace function public.guard_application_document_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if not public.owns_application(new.application_id) then
    raise exception 'You can only manage documents for your own applications.';
  end if;

  if new.verification_status <> 'pending'::public.document_status then
    raise exception 'Vendors can only submit documents with pending verification status.';
  end if;

  if new.verified_by is not null or new.verified_at is not null then
    raise exception 'Verification fields are reserved for back-office staff.';
  end if;

  if tg_op = 'UPDATE' and (
    new.application_id <> old.application_id
    or new.requirement_id <> old.requirement_id
    or new.created_at <> old.created_at
  ) then
    raise exception 'Protected document fields cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_application_document_before_write on public.application_documents;
create trigger guard_application_document_before_write
before insert or update on public.application_documents
for each row execute function public.guard_application_document_write();

create or replace function public.guard_payment_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if not public.owns_vendor(new.vendor_id) then
    raise exception 'You can only record payments for your own vendor account.';
  end if;

  if not exists (
    select 1
    from public.billings b
    join public.leases l on l.id = b.lease_id
    where b.id = new.billing_id
      and l.vendor_id = new.vendor_id
  ) then
    raise exception 'The selected billing record does not belong to your vendor account.';
  end if;

  if new.submitted_by_vendor is not true or new.recorded_by is not null then
    raise exception 'Vendor payment entries must be marked as vendor-submitted only.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_payment_insert_before_write on public.payments;
create trigger guard_payment_insert_before_write
before insert on public.payments
for each row execute function public.guard_payment_insert();

create or replace function public.guard_lease_renewal_request_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if new.requested_by <> auth.uid() or not public.owns_vendor(new.vendor_id) then
    raise exception 'You can only request renewal for your own vendor account.';
  end if;

  if not exists (
    select 1
    from public.leases
    where id = new.lease_id
      and vendor_id = new.vendor_id
  ) then
    raise exception 'The selected lease does not belong to your vendor account.';
  end if;

  if new.status <> 'pending'::public.renewal_request_status
    or new.reviewed_by is not null
    or new.reviewed_at is not null then
    raise exception 'Renewal requests must start as pending and unreviewed.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_lease_renewal_request_insert_before_write on public.lease_renewal_requests;
create trigger guard_lease_renewal_request_insert_before_write
before insert on public.lease_renewal_requests
for each row execute function public.guard_lease_renewal_request_insert();

create or replace function public.guard_stall_support_request_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if not public.owns_vendor(new.vendor_id) then
    raise exception 'You can only manage support requests for your own vendor account.';
  end if;

  if new.status <> 'open'::public.support_request_status
    or new.resolved_by is not null
    or new.resolved_at is not null then
    raise exception 'Support requests from vendors must start as open and unresolved.';
  end if;

  if new.lease_id is not null and not exists (
    select 1
    from public.leases
    where id = new.lease_id
      and vendor_id = new.vendor_id
  ) then
    raise exception 'The selected lease does not belong to your vendor account.';
  end if;

  if new.stall_id is not null and not exists (
    select 1
    from public.leases
    where vendor_id = new.vendor_id
      and stall_id = new.stall_id
      and (new.lease_id is null or id = new.lease_id)
  ) then
    raise exception 'The selected stall is not linked to your vendor account.';
  end if;

  if tg_op = 'UPDATE' and (
    new.vendor_id <> old.vendor_id
    or new.lease_id is distinct from old.lease_id
    or new.stall_id is distinct from old.stall_id
    or new.created_at <> old.created_at
  ) then
    raise exception 'Protected support request fields cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_stall_support_request_before_write on public.stall_support_requests;
create trigger guard_stall_support_request_before_write
before insert or update on public.stall_support_requests
for each row execute function public.guard_stall_support_request_write();

create or replace function public.guard_notification_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.role() = 'service_role' or public.is_back_office() then
    return new;
  end if;

  if old.user_id <> auth.uid() then
    raise exception 'You can only update your own notifications.';
  end if;

  if new.user_id <> old.user_id
    or new.title <> old.title
    or new.message <> old.message
    or new.type <> old.type
    or new.link is distinct from old.link
    or new.created_at <> old.created_at then
    raise exception 'Only the read state of a notification can be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_notification_update_before_write on public.notifications;
create trigger guard_notification_update_before_write
before update on public.notifications
for each row execute function public.guard_notification_update();

drop policy if exists "profiles_update_self_or_super_admin" on public.profiles;
create policy "profiles_update_self_or_super_admin" on public.profiles
for update using (id = auth.uid() or public.is_super_admin())
with check (id = auth.uid() or public.is_super_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
for insert with check (id = auth.uid() and role = 'vendor'::public.user_role);

drop policy if exists "vendors_insert_self" on public.vendors;
create policy "vendors_insert_self" on public.vendors
for insert with check (profile_id = auth.uid() and status = 'active');

drop policy if exists "applications_update_owner_or_admin" on public.applications;
create policy "applications_update_owner_or_admin" on public.applications
for update using (
  vendor_id in (select id from public.vendors where profile_id = auth.uid())
  or public.current_user_role() in ('super_admin', 'admin')
)
with check (
  vendor_id in (select id from public.vendors where profile_id = auth.uid())
  or public.current_user_role() in ('super_admin', 'admin')
);

drop policy if exists "staff_select_self_or_super_admin" on public.staff;
create policy "staff_select_self_or_super_admin" on public.staff
for select using (profile_id = auth.uid() or public.current_user_role() = 'super_admin');

drop policy if exists "lease_renewal_requests_delete_back_office" on public.lease_renewal_requests;
create policy "lease_renewal_requests_delete_back_office" on public.lease_renewal_requests
for delete using (public.is_back_office());

drop policy if exists "stall_support_requests_delete_back_office" on public.stall_support_requests;
create policy "stall_support_requests_delete_back_office" on public.stall_support_requests
for delete using (public.is_back_office());
