# DES Simulator (Data Encryption Standard)

Sebuah simulator interaktif berbasis web untuk algoritma kriptografi **Data Encryption Standard (DES)**. Aplikasi ini memungkinkan Anda untuk melakukan proses enkripsi dan dekripsi dengan visualisasi penyelesaian langkah demi langkah (step-by-step), mencakup 16 ronde jaringan Feistel. Sangat cocok untuk keperluan pembelajaran atau tugas kuliah.

## 🚀 Fitur Utama
- **Enkripsi & Dekripsi:** Mendukung proses penuh dari 64-bit plaintext/ciphertext menggunakan 64-bit kunci.
- **Format Input Fleksibel:** Mendukung input dalam format **Hexadecimal** (16 digit) maupun **Binary** (64-bit).
- **Step-by-Step Visualization:** Menampilkan secara detail setiap proses internal algoritma DES, meliputi:
  - Initial Permutation (IP)
  - Key Schedule (PC-1, Left Shifts, PC-2) untuk menghasilkan 16 Subkeys
  - Proses setiap ronde (Ekspansi E, XOR dengan Subkey, S-Box substitusi, Permutasi P)
  - Final Permutation / Inverse Initial Permutation (IP⁻¹)
- **Round Trip Test:** Fitur pengujian otomatis sekali klik untuk memastikan hasil enkripsi dapat dikembalikan (dekripsi) ke plaintext awal dengan sempurna.
- **Export Log & Copy:** Hasil dan langkah-langkah dapat disalin atau diekspor ke dalam file untuk keperluan analisis laporan.

## 📁 Struktur Direktori
- `index.html` - Halaman utama dan antarmuka (UI).
- `css/` - Styling antarmuka web (desain yang responsif dan modern).
- `js/` - Logika utama aplikasi:
  - `des.js` - Core logic algoritma DES.
  - `keySchedule.js` - Pembangkitan kunci (Key Generation).
  - `permutations.js` - Tabel-tabel permutasi.
  - `sboxes.js` - Tabel S-Box (1-8).
  - `ui.js` & `utils.js` - Pengaturan antarmuka dan fungsi konversi basis angka.
- `server.js` & `package.json` - File pendukung untuk *deployment* sebagai Node.js Web Service (di Render.com, Heroku, dll).

## 💻 Cara Menjalankan Secara Lokal

Karena aplikasi ini berjalan sepenuhnya di sisi klien (Client-Side), cara termudah untuk membukanya adalah:
1. Unduh atau *clone* repository ini.
2. Klik ganda pada file `index.html` untuk membukanya di browser pilihan Anda (Chrome, Firefox, Edge, Safari).

**Opsional (Menggunakan Local Server Node.js):**
1. Pastikan [Node.js](https://nodejs.org/) sudah terinstal di komputer.
2. Buka terminal di dalam direktori folder ini.
3. Jalankan perintah: `npm install`
4. Jalankan perintah: `npm start`
5. Buka browser dan akses `http://localhost:3000`

## 🌐 Panduan Deployment (Render.com)

Proyek ini telah dikonfigurasi agar siap di-hosting secara gratis menggunakan layanan [Render.com](https://render.com).

**Opsi 1: Sebagai Static Site (Rekomendasi)**
1. Login ke Render, buat layanan baru dengan memilih **Static Site**.
2. Hubungkan akun GitHub Anda dan pilih repository ini.
3. **Build Command**: *Kosongkan saja*
4. **Publish Directory**: `.` (tulis sebuah tanda titik)
5. Simpan dan tunggu proses *deploy* selesai.

**Opsi 2: Sebagai Web Service (Node.js)**
1. Login ke Render, pilih layanan **Web Service**.
2. Hubungkan repository GitHub ini.
3. **Environment**: Pilih `Node`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Simpan dan deploy.

---
*Dibuat untuk tugas/pembelajaran Kriptografi / Ethical Hacking.*
