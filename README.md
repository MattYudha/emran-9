# Emran Design & Printing Services

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Deno](https://img.shields.io/badge/Built%20with-Deno-lightblue)](https://deno.land/)
[![Powered by React](https://img.shields.io/badge/Powered%20by-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Backend by Supabase](https://img.shields.io/badge/Backend%20by-Supabase-007FFF?logo=supabase&logoColor=white)](https://supabase.com/)
[![AI by Google Gemini](https://img.shields.io/badge/AI%20by-Google%20Gemini-orange?logo=google-gemini&logoColor=white)](https://ai.google.dev/models/gemini)

Emran Design & Printing Services adalah aplikasi web *full-stack* yang modern dan interaktif, dirancang untuk memudahkan pelanggan dalam mendapatkan layanan desain grafis dan percetakan. Aplikasi ini didukung oleh teknologi terkini seperti React, TypeScript, Tailwind CSS untuk *frontend*, serta Deno dan Supabase untuk *backend*. Fitur unggulan termasuk sistem *Request for Quote* (RFQ) yang canggih dan *chatbot* berbasis AI yang didukung oleh Google Gemini.

## Daftar Isi

1.  [Fitur Utama](#fitur-utama)
2.  [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3.  [Struktur Proyek](#struktur-proyek)
4.  [Cara Kerja Fitur Kompleks](#cara-kerja-fitur-kompleks)
    * [Request for Quote (RFQ) System](#request-for-quote-rfq-system)
    * [Chatbot Interaktif dengan AI Gemini](#chatbot-interaktif-dengan-ai-gemini)
5.  [Instalasi dan Setup Proyek](#instalasi-dan-setup-proyek)
    * [Prasyarat](#prasyarat)
    * [Langkah-langkah Instalasi](#langkah-langkah-instalasi)
6.  [Penggunaan Aplikasi](#penggunaan-aplikasi)
7.  [Pengembangan (Development)](#pengembangan-development)
8.  [Deployment](#deployment)
9.  [Kontribusi](#kontribusi)
10. [Lisensi](#lisensi)

---

## 1. Fitur Utama

Aplikasi ini menyediakan berbagai fitur untuk memberikan pengalaman terbaik bagi pengguna dan efisiensi dalam pengelolaan layanan:

* **Layanan Percetakan & Desain**: Halaman khusus untuk berbagai layanan seperti Brosur, Kartu Nama, Flyer, Ilustrasi, Desain Logo, Kemasan, Poster, Spanduk, dan Identitas Merek.
* **Sistem Request for Quote (RFQ)**: Memungkinkan pengguna untuk mengajukan permintaan penawaran harga secara detail untuk proyek mereka.
* **Chatbot Interaktif**: Asisten virtual yang didukung oleh Google Gemini untuk menjawab pertanyaan umum dan membantu pengguna.
* **Autentikasi Pengguna**: Sistem pendaftaran dan login aman melalui Supabase.
* **Profil Pengguna & Dashboard**: Pengguna dapat mengelola informasi profil dan melihat riwayat RFQ mereka.
* **Dashboard Admin**: Antarmuka untuk administrator mengelola RFQ, pengguna, dan memantau aktivitas.
* **Notifikasi Real-time**: Pengguna akan menerima notifikasi terkait status RFQ mereka.
* **Dukungan Multi-Bahasa**: Aplikasi dapat dialihkan antara bahasa yang berbeda (`id` dan `en`).
* **Progressive Web App (PWA)**: Dapat diinstal di perangkat pengguna dan bekerja secara *offline*.
* **Desain Responsif**: Antarmuka yang adaptif dan optimal di berbagai ukuran layar (desktop, tablet, mobile) menggunakan Tailwind CSS.
* **Analitik Pengguna**: Mengumpulkan data penggunaan untuk analisis dan peningkatan layanan.
* **Sistem Feedback**: Tombol dan mekanisme untuk pengguna memberikan umpan balik.

## 2. Teknologi yang Digunakan

* **Frontend**:
    * **React**: Pustaka JavaScript untuk membangun antarmuka pengguna.
    * **TypeScript**: Superset JavaScript yang menambahkan *static typing* untuk kode yang lebih kokoh.
    * **Tailwind CSS**: *Framework* CSS utility-first untuk *styling* yang cepat dan kustomisasi tinggi.
    * **Vite**: *Build tool* dan *dev server* yang cepat untuk proyek *frontend*.
    * **React Router DOM**: Untuk *routing* navigasi dalam aplikasi *single-page*.
* **Backend & Database**:
    * **Supabase**: Backend-as-a-Service yang menyediakan database PostgreSQL, otentikasi, dan *Edge Functions*.
    * **Deno**: *Runtime* JavaScript/TypeScript yang aman dan berkinerja tinggi, digunakan untuk *Supabase Edge Functions*.
* **AI**:
    * **Google Gemini API**: Digunakan untuk menggerakkan *chatbot* interaktif.
* **Lain-lain**:
    * **ESLint**: Alat *linting* untuk menjaga kualitas dan konsistensi kode.
    * **PostCSS**: Alat untuk memproses CSS dengan *plugin* (digunakan oleh Tailwind CSS).

## 3. Struktur Proyek

Struktur direktori proyek dirancang untuk modularitas dan kemudahan pemeliharaan:

.
├── public/                 # File statis (manifest.json, robots.txt)
├── src/
│   ├── api/                # Konfigurasi klien API (Supabase)
│   ├── components/         # Komponen UI yang dapat digunakan kembali
│   │   └── ui/             # Komponen UI dasar (LoadingSpinner, ToastContainer, MapComponent)
│   ├── contexts/           # Konteks React untuk manajemen status global (Language, Theme)
│   ├── data/               # Data statis atau konfigurasi aplikasi
│   ├── hooks/              # Custom React Hooks untuk logika reusable
│   ├── pages/              # Komponen halaman utama aplikasi (Home, AdminDashboard, Layanan, dll.)
│   ├── reducers/           # Reducer untuk manajemen status kompleks (misalnya, chatbotReducer)
│   ├── services/           # Logika bisnis dan interaksi dengan API eksternal (Gemini, RFQ, Analytics)
│   ├── types/              # Definisi tipe TypeScript global (interface, type aliases)
│   ├── utils/              # Fungsi utilitas umum (helpers, validation, translations)
│   ├── App.tsx             # Komponen utama aplikasi, mengatur routing
│   ├── index.css           # Styling CSS utama (termasuk Tailwind CSS)
│   └── main.tsx            # Entry point aplikasi React
├── supabase/
│   ├── functions/          # Deno Edge Functions (rfq-notification, send-email)
│   ├── migrations/         # Skema database Supabase
│   └── config.toml         # Konfigurasi Supabase CLI
├── dev-dist/               # Output build untuk pengembangan
├── dist/                   # Output build untuk produksi
├── .env.example            # Contoh variabel lingkungan
├── deno.json               # Konfigurasi Deno
├── eslint.config.js        # Konfigurasi ESLint
├── package.json            # Dependencies dan scripts proyek
├── postcss.config.js       # Konfigurasi PostCSS
├── README.md               # Dokumentasi proyek (file ini)
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── tsconfig.json           # Konfigurasi TypeScript
├── vite.config.ts          # Konfigurasi Vite
└── ...


## 4. Cara Kerja Fitur Kompleks

### Request for Quote (RFQ) System

Sistem RFQ memungkinkan pengguna untuk mengajukan permintaan penawaran harga yang disesuaikan dengan kebutuhan proyek desain atau percetakan mereka.

**Cara Kerja:**

1.  **Pengajuan RFQ (Frontend: `src/components/RFQForm.tsx`)**:
    * Pengguna mengakses halaman layanan atau formulir RFQ.
    * Mereka mengisi detail proyek seperti jenis layanan, spesifikasi, jumlah, *deadline*, dan informasi kontak.
    * Data formulir divalidasi di *frontend* menggunakan `src/utils/validation.ts` sebelum pengiriman.
    * Formulir mengirimkan data ke fungsi `rfqService.ts` yang bertanggung jawab untuk berinteraksi dengan Supabase.

2.  **Penyimpanan Data (Backend: Supabase Database)**:
    * `src/services/rfqService.ts` menggunakan `supabaseClient.ts` untuk menyisipkan data RFQ ke tabel `rfq_requests` di database Supabase.
    * Skema database RFQ dikelola melalui migrasi SQL Supabase (misalnya, `supabase/migrations/20250526104834_late_oasis.sql`).

3.  **Notifikasi Real-time (Supabase Edge Function: `supabase/functions/rfq-notification/index.ts`)**:
    * Supabase dikonfigurasi untuk memicu *webhook* atau *trigger* database ketika entri baru ditambahkan ke tabel `rfq_requests`.
    * *Trigger* ini akan memanggil *Supabase Edge Function* `rfq-notification` yang ditulis dalam Deno.
    * Fungsi ini bertanggung jawab untuk:
        * Mengambil detail RFQ yang baru.
        * Mengirim notifikasi ke admin (misalnya, melalui email atau *dashboard* admin) bahwa ada RFQ baru.
        * Mungkin juga mengirim notifikasi konfirmasi ke pengguna yang mengajukan RFQ.
    * Notifikasi di *frontend* dikelola oleh `src/components/NotificationCenter.tsx`.

4.  **Manajemen Admin (Frontend: `src/pages/AdminDashboard.tsx`)**:
    * Administrator dapat masuk ke `AdminDashboard` mereka.
    * *Dashboard* ini akan menampilkan daftar RFQ yang masuk, memungkinkan admin untuk melihat detail, mengubah status (misalnya, "Pending", "Reviewed", "Completed"), dan berkomunikasi dengan pelanggan.
    * Admin dapat menggunakan fitur *user management* (`src/components/UserProfileManager.tsx`) untuk mengelola pengguna terkait RFQ.

**Cara Menggunakan RFQ System:**

1.  **Sebagai Pelanggan**:
    * Navigasi ke halaman layanan (`/services`) atau halaman RFQ (`/rfq`).
    * Isi formulir dengan detail proyek Anda. Pastikan semua informasi yang diperlukan terisi dengan benar.
    * Klik tombol "Submit" atau "Ajukan Penawaran".
    * Anda akan menerima konfirmasi pengajuan dan notifikasi status RFQ Anda di dalam aplikasi (jika Anda login) atau melalui email.
2.  **Sebagai Administrator**:
    * Login sebagai administrator.
    * Akses `/admin/dashboard`.
    * Di dasbor, Anda akan melihat daftar RFQ yang masuk. Klik pada RFQ tertentu untuk melihat detailnya, mengubah status, dan mengambil tindakan yang diperlukan.

### Chatbot Interaktif dengan AI Gemini

*Chatbot* ini dirancang untuk memberikan jawaban instan atas pertanyaan umum pengguna tentang layanan percetakan dan desain, membantu navigasi, atau bahkan memberikan estimasi awal.

**Cara Kerja:**

1.  **Antarmuka Chatbot (Frontend: `src/components/Chatbot.tsx`)**:
    * Komponen `Chatbot.tsx` menyediakan antarmuka pengguna untuk interaksi dengan *chatbot*.
    * Ini menampilkan riwayat percakapan (`src/components/ChatbotMessage.tsx`) dan *input field* untuk pengguna.
    * Logika utama *chatbot* dikelola oleh *custom hook* `src/hooks/useChatbotLogic.ts`.

2.  **Manajemen Status Chatbot (Frontend: `src/reducers/chatbotReducer.ts`)**:
    * `chatbotReducer.ts` mengelola status percakapan *chatbot*, termasuk riwayat pesan, status *loading*, dan potensi error. Ini memastikan aliran data yang terprediksi.

3.  **Interaksi dengan Gemini API (Frontend: `src/services/geminiService.ts`)**:
    * Ketika pengguna mengirim pesan, `useChatbotLogic.ts` akan memanggil `src/services/geminiService.ts`.
    * `geminiService.ts` bertanggung jawab untuk mengirim permintaan ke Google Gemini API dengan pesan pengguna.
    * Respons dari Gemini API kemudian akan diterima dan diproses. Konfigurasi AI (model, parameter) dapat diatur melalui `src/services/aiConfigService.ts` dan `src/utils/gemini.ts`.

4.  **Pemrosesan dan Tampilan Respons**:
    * Respons dari Gemini API kemudian dikirim kembali ke `useChatbotLogic.ts` dan `chatbotReducer` untuk memperbarui status percakapan.
    * Pesan respons dari *chatbot* akan ditampilkan di antarmuka `Chatbot.tsx`.

5.  **Umpan Balik AI (Frontend: `src/services/aiFeedbackService.ts`)**:
    * Pengguna dapat memberikan umpan balik (suka/tidak suka) terhadap respons *chatbot*.
    * Umpan balik ini dikirimkan melalui `aiFeedbackService.ts` ke *backend* (misalnya, Supabase) untuk tujuan peningkatan model AI di masa mendatang.

**Cara Menggunakan Chatbot:**

1.  **Mengakses Chatbot**:
    * Cari ikon *chatbot* (biasanya di sudut bawah halaman). Klik ikon tersebut untuk membuka jendela *chatbot*.
2.  **Memulai Percakapan**:
    * Ketik pertanyaan Anda di *input field* yang tersedia dan tekan Enter atau tombol kirim.
    * Contoh pertanyaan: "Apa saja layanan desain yang tersedia?", "Bagaimana cara mengajukan RFQ?", "Berapa lama proses pencetakan brosur?".
3.  **Memberikan Umpan Balik**:
    * Setelah *chatbot* memberikan respons, Anda mungkin melihat ikon "suka" atau "tidak suka". Klik ikon tersebut untuk memberikan umpan balik tentang kualitas jawaban.

## 5. Instalasi dan Setup Proyek

### Prasyarat

Sebelum memulai, pastikan Anda telah menginstal yang berikut ini:

* [Node.js](https://nodejs.org/) (versi terbaru yang stabil, disarankan v18+)
* [npm](https://www.npmjs.com/) atau [Yarn](https://yarnpkg.com/) (npm biasanya sudah terinstal dengan Node.js)
* [Deno](https://deno.land/) (versi terbaru yang stabil)
* [Supabase CLI](https://supabase.com/docs/guides/cli)
* Akun Google Cloud Platform untuk akses [Google Gemini API](https://ai.google.dev/models/gemini)
* Akun Supabase.

### Langkah-langkah Instalasi

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/emran-9/emran-9.git](https://github.com/emran-9/emran-9.git)
    cd emran-9
    ```

2.  **Instal Dependencies Frontend:**
    ```bash
    npm install
    # atau yarn install
    ```

3.  **Konfigurasi Variabel Lingkungan:**
    Buat file `.env.local` di root proyek Anda berdasarkan `.env.example`.
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    * `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dapat Anda temukan di *Project Settings* Supabase Anda (API Settings).
    * `VITE_GEMINI_API_KEY` adalah kunci API dari Google Gemini Anda.

4.  **Setup Supabase Lokal (Opsional, untuk Pengembangan Lokal):**
    Jika Anda ingin mengembangkan fungsi Supabase secara lokal:
    ```bash
    supabase init
    supabase start
    supabase migration list # Pastikan migrasi sudah diterapkan
    supabase functions serve --watch # Untuk menjalankan Edge Functions secara lokal
    ```
    Pastikan database Supabase Anda terisi dengan skema dari `supabase/migrations/`. Anda mungkin perlu menjalankan migrasi secara manual jika belum terotomatisasi.

## 6. Penggunaan Aplikasi

Setelah instalasi selesai:

1.  **Jalankan Aplikasi Frontend:**
    ```bash
    npm run dev
    # atau yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

2.  **Akses Aplikasi:**
    Buka *browser* Anda dan navigasikan ke alamat yang ditampilkan di konsol.

## 7. Pengembangan (Development)

* **Menjalankan Linter:**
    ```bash
    npm run lint
    ```
* **Menjalankan Pengujian (jika ada):**
    ```bash
    npm run test # Asumsi ada script test di package.json
    ```
* **Menulis Kode:**
    Ikuti struktur proyek dan konvensi penamaan. Manfaatkan TypeScript untuk *type safety* dan Tailwind CSS untuk *styling*.

## 8. Deployment

Proyek ini dirancang untuk dapat di-deploy ke berbagai platform *hosting*.

* **Frontend Deployment**:
    * Untuk menghasilkan *build* produksi:
        ```bash
        npm run build
        ```
    * Output akan berada di direktori `dist/`. Anda bisa me-*deploy* direktori ini ke *static site hosting* seperti Netlify, Vercel, Firebase Hosting, atau GitHub Pages.

* **Supabase Backend**:
    * Database dan otentikasi di-host oleh Supabase secara otomatis.
    * *Supabase Edge Functions* (Deno) perlu di-*deploy* ke Supabase:
        ```bash
        supabase functions deploy rfq-notification
        supabase functions deploy send-email
        # Deploy semua fungsi secara manual atau gunakan CI/CD
        ```

## 9. Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti langkah-langkah berikut:

1.  *Fork* repositori ini.
2.  Buat *branch* baru untuk fitur atau *bugfix* Anda (`git checkout -b feature/nama-fitur-baru`).
3.  Lakukan perubahan Anda.
4.  Pastikan semua *linting* dan pengujian lulus.
5.  *Commit* perubahan Anda (`git commit -m 'feat: menambahkan fitur baru'`).
6.  *Push* ke *branch* Anda (`git push origin feature/nama-fitur-baru`).
7.  Buat *Pull Request* baru.

## 10. Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

---
