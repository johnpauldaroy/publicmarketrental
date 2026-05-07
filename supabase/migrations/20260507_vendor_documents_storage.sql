-- Create storage bucket for vendor compliance documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vendor-documents',
  'vendor-documents',
  false,
  10485760,
  array['application/pdf','image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Vendors can upload files into their own folder (folder = their profile UUID)
create policy "vendor_documents_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vendor-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Vendors can view and download their own files
create policy "vendor_documents_select_owner"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'vendor-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Back-office staff can view all vendor documents
create policy "vendor_documents_select_staff"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'vendor-documents'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('admin', 'super_admin', 'finance')
    )
  );

-- Vendors can delete their own files (e.g. when replacing a document)
create policy "vendor_documents_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'vendor-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
