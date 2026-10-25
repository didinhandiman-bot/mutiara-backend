# AGENTS.md

API auth/CRUD Express 5 + MySQL (backend saja). CommonJS, tanpa build, tanpa tes, tanpa linter.

## Perintah

- `npm start` — menjalankan `server.js` (port `PORT`, default 5000).
- `npm run dev` — memakai nodemon, tetapi **nodemon tidak ada di `dependencies`/`devDependencies`**; jalankan `npm i -D nodemon` dulu atau pakai `node server.js`.
- `npm test` hanya placeholder yang `exit 1`. Tidak ada suite tes, framework, lint, format, maupun typecheck; verifikasi perubahan dengan memanggil API langsung.
- Server wajib terhubung MySQL saat start: `server.js` memanggil `db.getConnection()` dan `process.exit(1)` jika gagal, jadi server tidak akan hidup tanpa database.

## Environment

`.env` di-gitignore tetapi ada di mesin lokal. Variabel yang dibaca kode: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (default `bppmhkp_db`), `JWT_SECRET`, `JWT_EXPIRES_IN` (default `1d`), `CLIENT_URL`. `JWT_SECRET` dipakai tanpa guard di `jwt.sign`/`jwt.verify`; jika kosong error baru muncul saat login, bukan saat boot.

## Skema database

Tidak ada migrasi atau file SQL di repo ini. Kode mengasumsikan tabel `users` dengan kolom `id, nama, email, password, role, created_at`; skema dikelola di luar repository. Jangan mengarang alur migrasi.

## Struktur

Lapisan: `src/routes` → `src/controllers` → `src/services` → `src/repositories` → `src/config/database.js` (pool mysql2, `connectionLimit: 10`). Fitur baru ikuti urutan itu; `authController.getUsers` satu-satunya tempat yang query langsung ke pool untuk pagination.

Entrypoint: `server.js` (dotenv + cek DB + listen) dan `src/app.js` (middleware + pemasangan route, di-export agar bisa dipakai ulang).

## Konvensi API

- Route dipasang di **`/auth`**, bukan `/api/auth` (`POST /auth/login`, `GET /auth/users`, ...).
- Autentikasi hanya lewat **Bearer token di header `Authorization`** (`Authorization: Bearer <jwt>`); `cookie-parser` terpasang tetapi cookie tidak dipakai untuk auth.
- `verifyToken` hanya mengautentikasi, **tidak** mengotorisasi: semua user yang login, termasuk `viewer`, bisa create/update/delete user. Tambahkan cek role jika perubahan memang butuh.
- Allowlist CORS di-hardcode di `src/app.js` (plus `CLIENT_URL`); `credentials: true`, jadi tambahkan origin eksplisit, jangan pakai `*`.
- Semua respons memakai bentuk `{ success, message?, data? }` dengan pesan berbahasa Indonesia. Pertahankan bentuk dan bahasanya.
- Role valid: `admin | operator | viewer` (divalidasi di `authController`). `userRepository.create` default-nya `'user'` yang bukan role valid — selalu kirim role eksplisit.

## Bug yang perlu diketahui

`db.query` mysql2 menghasilkan `[rows, fields]`, tetapi `userRepository.create/update/delete` membaca `result.insertId` / `result.affectedRows` dari array tersebut. Akibatnya: `POST /auth/register` tetap menyimpan baris tapi tidak mengembalikan id user, pengecekan `affectedRows` pada update/delete tidak andal, dan `DELETE /auth/users/:id` membalas 404 padahal penghapusan berhasil. Perbaiki dengan destructuring (`const [result] = await db.query(...)`), bukan dengan mengubah pemanggilnya.

Kondisi repo: hanya branch `main`, satu commit awal; tidak ada CI atau konfigurasi deploy di dalam repo.
