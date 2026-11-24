-- ====================================================================
-- SKEMA DATABASE, KEAMANAN RLS & PRIVATE STORAGE UNTUK "OUR MOMENT"
-- ====================================================================
-- PENTING: Jalankan seluruh script ini di SQL Editor dashboard Supabase Anda.
-- Skrip ini idempotent dan aman dijalankan pada proyek baru maupun migrasi.

-- ====================================================================
-- 1. TABEL COUPLE_MEMBERS (Tabel Otorisasi Anggota Pasangan)
-- ====================================================================
-- Tabel ini adalah 'Single Source of Truth' untuk identitas resmi Navy & Ifa.
create table if not exists public.couple_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('navy', 'ifa')),
  display_name text not null check (display_name in ('Navy', 'Ifa')),
  created_at timestamptz default now() not null
);

alter table public.couple_members enable row level security;

-- ====================================================================
-- 2. FUNGSI HELPER KEAMANAN: SEARCH_PATH KOSONG & HAK EXECUTE TERBATAS
-- ====================================================================
-- Menggunakan set search_path = '' dan nama objek yang sepenuhnya dikualifikasi
-- untuk mencegah segala bentuk privilege escalation / search_path poisoning.
-- Versi tanpa parameter: setiap pengguna hanya dapat memeriksa identitasnya sendiri.
-- SECURITY DEFINER memungkinkan fungsi membaca couple_members tanpa rekursi RLS.
create or replace function public.is_couple_member()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.couple_members
    where user_id = auth.uid()
  );
$$;

create or replace function public.get_member_role()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select role
  from public.couple_members
  where user_id = auth.uid()
  limit 1;
$$;

-- Hanya authenticated dan service_role yang dapat menjalankan helper baru.
revoke all on function public.is_couple_member() from public, anon;
grant execute on function public.is_couple_member() to authenticated, service_role;

revoke all on function public.get_member_role() from public, anon;
grant execute on function public.get_member_role() to authenticated, service_role;

-- Kebijakan RLS Couple Members:
drop policy if exists "Couple members can view members" on public.couple_members;
create policy "Couple members can view members"
  on public.couple_members
  for select
  to authenticated
  using (public.is_couple_member());

-- Pembatasan Privilege Tabel couple_members:
-- Pengguna hanya boleh membaca, tidak boleh INSERT/UPDATE/DELETE melalui API client.
revoke all on table public.couple_members from public, anon, authenticated;
grant select on table public.couple_members to authenticated;
grant all on table public.couple_members to service_role;


-- ====================================================================
-- 3. TABEL MEMORIES (Foto Galeri Bersama Privat)
-- ====================================================================
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  storage_path text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  uploader_name text not null,
  created_at timestamptz default now() not null
);

alter table public.memories enable row level security;

-- Trigger untuk menjamin keaslian user_id dan uploader_name dari server
create or replace function public.handle_memory_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  new.created_at := pg_catalog.now();
  select display_name into new.uploader_name
  from public.couple_members
  where user_id = auth.uid();
  return new;
end;
$$;

revoke all on function public.handle_memory_insert() from public;
grant execute on function public.handle_memory_insert() to authenticated, service_role;

drop trigger if exists trg_enforce_memory_uploader on public.memories;
create trigger trg_enforce_memory_uploader
  before insert on public.memories
  for each row
  execute function public.handle_memory_insert();

-- RLS Memories:
-- a. Baca: Hanya Navy dan Ifa yang terdaftar di couple_members yang dapat melihat foto
drop policy if exists "Authenticated users can view memories" on public.memories;
drop policy if exists "Couple members can view memories" on public.memories;
create policy "Couple members can view memories"
  on public.memories
  for select
  to authenticated
  using (public.is_couple_member());

-- b. Tambah: Hanya anggota pasangan yang login, wajib user_id sendiri
drop policy if exists "Authenticated users can insert memories" on public.memories;
drop policy if exists "Couple members can insert their own memories" on public.memories;
create policy "Couple members can insert their own memories"
  on public.memories
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.is_couple_member()
  );

-- c. Hapus: Hanya pemilik foto yang dapat menghapus fotonya sendiri
drop policy if exists "Users can delete their own memories" on public.memories;
create policy "Users can delete their own memories"
  on public.memories
  for delete
  to authenticated
  using (
    auth.uid() = user_id
    and public.is_couple_member()
  );

-- Pembatasan Privilege Tabel memories:
-- Pengguna hanya boleh SELECT, INSERT, DELETE. UPDATE tidak diizinkan.
revoke all on table public.memories from public, anon, authenticated;
grant select, insert, delete on table public.memories to authenticated;
grant all on table public.memories to service_role;


-- ====================================================================
-- 4. TABEL LETTERS (Surat Digital Pasangan)
-- ====================================================================
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  letter_key text unique not null check (letter_key in ('letter_navy', 'letter_ifa')),
  title text not null,
  subtitle text,
  content text default '',
  author_role text not null check (author_role in ('navy', 'ifa')),
  author_name text not null,
  recipient_name text not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz default now() not null
);

alter table public.letters enable row level security;

-- Trigger Proteksi Total Metadata Surat:
-- Memastikan metadata (title, subtitle, letter_key, author_role, author_name, recipient_name)
-- TIDAK PERNAH berubah dari nilai aslinya, serta updated_at & updated_by
-- hanya dan wajib diatur oleh database di server.
create or replace function public.handle_letter_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Pertahankan seluruh metadata asli tanpa kompromi
  new.id := old.id;
  new.letter_key := old.letter_key;
  new.title := old.title;
  new.subtitle := old.subtitle;
  new.author_role := old.author_role;
  new.author_name := old.author_name;
  new.recipient_name := old.recipient_name;

  -- Nilai waktu dan pengubah hanya ditentukan oleh database di server
  new.updated_at := pg_catalog.now();
  new.updated_by := auth.uid();

  return new;
end;
$$;

revoke all on function public.handle_letter_update() from public;
grant execute on function public.handle_letter_update() to authenticated, service_role;

drop trigger if exists trg_protect_letter_metadata on public.letters;
create trigger trg_protect_letter_metadata
  before update on public.letters
  for each row
  execute function public.handle_letter_update();

-- RLS Letters:
-- a. Baca: Kedua anggota pasangan yang login dapat membaca seluruh surat
drop policy if exists "Authenticated users can read all letters" on public.letters;
drop policy if exists "Couple members can read letters" on public.letters;
create policy "Couple members can read letters"
  on public.letters
  for select
  to authenticated
  using (public.is_couple_member());

-- b. Update: Navy hanya dapat mengedit letter_navy, dan Ifa hanya dapat mengedit letter_ifa
drop policy if exists "Only designated author can update their letter" on public.letters;
drop policy if exists "Designated author can update their own letter" on public.letters;
create policy "Designated author can update their own letter"
  on public.letters
  for update
  to authenticated
  using (
    public.get_member_role() = author_role
  )
  with check (
    public.get_member_role() = author_role
  );

-- Hapus kebijakan insert untuk letters agar API tidak bisa membuat baris sembarangan
drop policy if exists "Authenticated users can insert letters" on public.letters;

-- PEMBATASAN PRIVILEGE KOLOM TABEL LETTERS:
-- Pengguna authenticated hanya memiliki hak UPDATE pada kolom (content) saja.
-- Kolom lain (title, subtitle, letter_key, author_role, author_name, recipient_name, updated_at, updated_by)
-- tidak dapat disentuh oleh client.
revoke all on table public.letters from public, anon, authenticated;
grant select on table public.letters to authenticated;
grant update (content) on table public.letters to authenticated;
grant all on table public.letters to service_role;


-- ====================================================================
-- 5. INITIAL SEED UNTUK 2 SURAT RESMI
-- ====================================================================
-- on conflict (letter_key) do nothing memastikan isi surat yang sudah ada
-- TIDAK PERNAH terhapus atau tertimpa jika skrip ini dijalankan ulang.
insert into public.letters (letter_key, title, subtitle, content, author_role, author_name, recipient_name)
values
  ('letter_navy', 'Buat Pacarku', 'Ditulis oleh Navy untuk Ifa', '', 'navy', 'Navy', 'Ifa'),
  ('letter_ifa', 'A Letter for You', 'Ditulis oleh Ifa untuk Navy', '', 'ifa', 'Ifa', 'Navy')
on conflict (letter_key) do nothing;


-- ====================================================================
-- Hapus helper versi lama (berparameter UUID), jika pernah dibuat.
-- Semua policy di atas sudah menggunakan helper tanpa parameter.
drop function if exists public.is_couple_member(uuid);
drop function if exists public.get_member_role(uuid);

-- 6. STORAGE PRIVATE: BUCKET 'memories' (public = false)
-- ====================================================================
insert into storage.buckets (id, name, public)
values ('memories', 'memories', false)
on conflict (id) do update set public = false;

drop policy if exists "Public and authenticated can read memories images" on storage.objects;
drop policy if exists "Couple members can view memories storage" on storage.objects;
create policy "Couple members can view memories storage"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'memories'
    and public.is_couple_member()
  );

drop policy if exists "Authenticated users can upload memories images" on storage.objects;
drop policy if exists "Couple members can upload to their own folder" on storage.objects;
create policy "Couple members can upload to their own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'memories'
    and public.is_couple_member()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own uploaded images" on storage.objects;
drop policy if exists "Couple members can delete from their own folder" on storage.objects;
create policy "Couple members can delete from their own folder"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'memories'
    and public.is_couple_member()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Hapus helper versi lama (berparameter UUID), jika pernah dibuat.
-- Seluruh policy sudah diganti menggunakan helper tanpa parameter.
drop function if exists public.is_couple_member(uuid);
drop function if exists public.get_member_role(uuid);

