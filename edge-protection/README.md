# Panduan Mekanisme Proteksi Password untuk Deployment

Website ini dirancang untuk dibagikan secara privat antara **Navy** dan **Ifa**.

## Mengapa Proteksi Client-Side Saja Tidak Cukup?
Jika verifikasi password hanya ditaruh di JavaScript/browser (`if (password === 'xxx')`), maka:
1. Siapa pun yang membuka browser dapat melihat password melalui menu "View Source", "Inspect Network", atau file bundle JS.
2. File gambar di folder `public/images/` tetap dapat diakses publik melalui URL langsung jika tidak ada gate di level web server / edge.

---

## Solusi Proteksi Deployment yang Benar

### Opsi 1: Cloudflare Pages (Gratis & Sangat Direkomendasikan)
Gunakan **Cloudflare Access** (Zero Trust) atau Cloudflare Pages Middleware Functions:
1. Buat file `functions/_middleware.js` di root project:
```javascript
export async function onRequest(context) {
  const { request, next, env } = context;
  const basicAuth = request.headers.get("Authorization");

  // Format: "Basic base64(username:password)"
  // Password disimpan di Environment Variables Cloudflare Dashboard, BUKAN di repo!
  const validUser = env.AUTH_USER || "navy-ifa";
  const validPass = env.AUTH_PASSWORD; // Atur di Cloudflare Dashboard

  if (validPass) {
    const expectedAuth = "Basic " + btoa(`${validUser}:${validPass}`);
    if (basicAuth !== expectedAuth) {
      return new Response("Akses Terbatas: Masukkan autentikasi untuk Our Moment", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Our Moment Private Space"',
        },
      });
    }
  }

  return next();
}
```

### Opsi 2: Vercel (Edge Middleware)
1. Buat file `middleware.ts` di root project:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const sitePassword = process.env.SITE_PASSWORD;

  if (sitePassword) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [, pwd] = atob(authValue).split(':');
      if (pwd === sitePassword) {
        return NextResponse.next();
      }
    }
    return new NextResponse('Autentikasi Diperlukan', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Our Moment"',
      },
    });
  }
  return NextResponse.next();
}
```

### Opsi 3: Proteksi SHA-256 Client-Side (Tersedia Bawaan di Website Ini)
Untuk testing lokal atau deployment cepat tanpa server:
1. Buat file `.env.local`:
   ```bash
   VITE_ENABLE_PASSWORD_PROTECTION=true
   VITE_ACCESS_PASSWORD_HASH="<sha256-hash-kata-sandi-anda>"
   ```
2. Password asli tidak disimpan, hanya hash-nya. Ketika pengunjung memasukkan password, browser menghitung SHA-256 hash secara lokal menggunakan Web Crypto API dan membandingkannya.
