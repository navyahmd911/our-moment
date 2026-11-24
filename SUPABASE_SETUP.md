# Panduan Pengaturan Supabase & Keamanan — Our Moment

Dokumen ini memandu Anda dalam melakukan setup database, otorisasi berbasis tabel `couple_members`, dan penyimpanan foto privat (*Private Storage*) di **Supabase** secara aman.

---

## 1. Membuat Proyek di Supabase

1. Kunjungi [https://supabase.com/](https://supabase.com/) dan masuk (*Sign In*) atau buat akun baru.
2. Klik tombol **New Project**.
3. Masukkan rincian proyek:
   - **Name**: `Our Moment`
   - **Database Password**: Buat password database yang kuat dan simpan di tempat aman.
   - **Region**: Pilih wilayah terdekat (misalnya *Singapore* untuk performa tercepat di Indonesia).
4. Klik **Create new project** dan tunggu proses inisialisasi selesai (sekitar 1–2 menit).

---

## 2. Mendapatkan Kredensial URL & Anon Key

1. Di dashboard proyek Supabase, klik ikon gerigi **Project Settings** di sudut kiri bawah.
2. Pilih tab **API**.
3. Di bagian **API Settings**, Anda akan melihat:
   - **Project URL**: URL proyek Anda (format: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`).
   - **Project API Keys -> anon (public)**: Kunci anon publik yang aman digunakan di frontend.
4. **PENTING**: **JANGAN PERNAH** menggunakan `service_role` key pada file frontend atau mempublikasikannya ke repositori publik.

---

## 3. Mengatur Berkas `.env.local`

1. Di komputer lokal Anda, salin template `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
2. Buka `.env.local` dan isi kredensial asli Anda:
   ```env
   VITE_SUPABASE_URL="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

   VITE_ENABLE_PASSWORD_PROTECTION="false"
   VITE_ACCESS_PASSWORD_HASH=""
   ```
3. Berkas `.env.local` sudah masuk ke `.gitignore` sehingga aman dari pelacakan git.

---

## 4. Menjalankan Skrip SQL Keamanan

1. Buka menu **SQL Editor** pada bilah sisi kiri dashboard Supabase.
2. Klik tombol **New query**.
3. Salin seluruh isi berkas [supabase/schema.sql](file:///home/navy/our-little-memories/supabase/schema.sql).
4. Tempel ke SQL Editor, lalu klik tombol **Run** (atau tekan `Ctrl+Enter`).
5. Skrip ini secara otomatis mengonfigurasi:
   - **Tabel `couple_members`**: Tabel otoritatif yang memetakan UUID pengguna ke peran `navy` atau `ifa`. Privilege `INSERT/UPDATE/DELETE` dicabut dari client.
   - **Fungsi Helper Anti-Privilege Escalation**: Fungsi `is_couple_member` & `get_member_role` menggunakan `SECURITY DEFINER` dengan `set search_path = public, pg_temp`, serta pembatasan hak `EXECUTE` hanya untuk `authenticated` dan `service_role`.
   - **Tabel `memories`**: Dilengkapi proteksi RLS sehingga hanya pasangan terdaftar yang bisa membaca bersama, mengunggah ke folder miliknya sendiri, dan menghapus foto miliknya.
   - **Tabel `letters` & Proteksi Kolom Ganda**:
     - Column-level privilege: Hanya kolom `content` yang diizinkan untuk di-UPDATE oleh `authenticated`.
     - Database Trigger `trg_protect_letter_metadata`: Mengunci kolom metadata (`title`, `subtitle`, `letter_key`, `author_role`, `author_name`, `recipient_name`) agar tidak dapat diubah, serta memastikan `updated_at` dan `updated_by` hanya diisi oleh server database.
     - Kebijakan RLS: Navy hanya bisa mengubah `letter_navy`, dan Ifa hanya bisa mengubah `letter_ifa`.
   - **Storage Bucket `memories`**: Dibuat dengan status **PRIVATE** (`public = false`) dan kebijakan folder berbasis UUID pengguna.

---

## 5. Membuat Akun & Mendaftarkan ke `couple_members`

### Langkah A: Buat Dua Akun di Supabase Auth
1. Di dashboard Supabase, buka menu **Authentication** -> **Users**.
2. Klik **Add user** -> pilih **Create user**.
3. **Akun Navy**:
   - Email: Masukkan email asli Navy (misal: `navy@ourmoment.love` atau email pribadi).
   - Password: Buat password yang kuat.
   - **Auto Confirm User**: Centang (Yes) agar dapat langsung login.
4. **Akun Ifa**:
   - Email: Masukkan email asli Ifa (misal: `ifa@ourmoment.love` atau email pribadi).
   - Password: Buat password yang kuat.
   - **Auto Confirm User**: Centang (Yes) agar dapat langsung login.

### Langkah B: Ambil UUID Akun Masing-Masing
1. Pada tabel daftar pengguna di menu **Authentication -> Users**, cari kolom **User UID**.
2. Salin UUID milik akun Navy (format 36 karakter, contoh: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
3. Salin UUID milik akun Ifa.

### Langkah C: Daftarkan ke Tabel `couple_members`
Buka **SQL Editor** di Supabase, lalu jalankan query berikut (gantikan `<UUID_AKUN_NAVY>` dan `<UUID_AKUN_IFA>` dengan UUID asli yang Anda salin):

```sql
-- Daftarkan akun Navy
insert into public.couple_members (user_id, role, display_name)
values ('<UUID_AKUN_NAVY>', 'navy', 'Navy')
on conflict (user_id) do update set role = 'navy', display_name = 'Navy';

-- Daftarkan akun Ifa
insert into public.couple_members (user_id, role, display_name)
values ('<UUID_AKUN_IFA>', 'ifa', 'Ifa')
on conflict (user_id) do update set role = 'ifa', display_name = 'Ifa';
```

---

## 6. Verifikasi Storage Private & Pengujian

### Cara Kerja Storage Private
1. Bucket `memories` diatur ke **`public = false`**. URL publik biasa tidak dapat mengakses foto.
2. Ketika Navy atau Ifa membuka galeri, aplikasi React meminta **Signed URL** berdurasi sementara (1 jam) menggunakan kredensial autentikasi aktif.
3. Orang luar yang mencoba mengakses URL gambar langsung tanpa token autentikasi yang valid akan ditolak (*403 Forbidden*).

### Pengujian Akses Bersama
1. Jalankan aplikasi lokal:
   ```bash
   npm run dev
   ```
2. **Uji Coba Navy**:
   - Masuk (*Sign In*) menggunakan email dan password Navy.
   - Status Navbar akan menampilkan *"Hai, Navy"*.
   - Tambah foto di section **Our Memories**: foto akan terunggah ke path private `${auth.uid()}/...` dan tampil menggunakan Signed URL.
   - Buka section **Little Letters**:
     - Surat *"Buat Pacarku"*: Tombol edit aktif, Navy dapat menulis dan menyimpan surat.
     - Surat *"A Letter for You"*: Hanya dapat membaca, tombol edit nonaktif karena surat tersebut hak milik Ifa.
3. **Uji Coba Ifa**:
   - Keluar (*Logout*) akun Navy, lalu masuk menggunakan email dan password Ifa.
   - Status Navbar akan menampilkan *"Hai, Ifa"*.
   - Ifa dapat melihat seluruh foto yang diunggah Navy melalui Signed URL.
   - Pada foto milik Navy, Ifa **tidak** memiliki tombol hapus. Ifa hanya bisa menghapus foto miliknya sendiri.
   - Buka section **Little Letters**:
     - Surat *"Buat Pacarku"*: Ifa dapat membaca surat yang ditulis Navy.
     - Surat *"A Letter for You"*: Tombol edit aktif khusus untuk Ifa, sehingga Ifa dapat menulis dan menyimpan surat balasannya untuk Navy.
