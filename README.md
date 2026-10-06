# 🌺 Template Website Undangan Digital Bali + Sistem Generator Nama Tamu

Template website undangan digital bertema Bali (*Luxury Balinese Ceremony - Resepsi Metatah / Manusa Yadnya / Pernikahan*) lengkap dengan sistem **Generator Nama Tamu** dan pembuat link WhatsApp otomatis.

---

## 📁 Struktur Direktori

```
undangan-digital-bali/
│
├── index.html                      # Halaman utama undangan digital
├── config.js                       # File konfigurasi utama (Ubah info acara di sini!)
│
├── namatamu/
│   └── index.html                  # Dashboard Generator Nama Tamu & Link WhatsApp
│
├── assets/
│   ├── css/
│   │   ├── style.css               # Styling tema Bali mewah, responsif, dan animasi
│   │   └── generator.css           # Styling dashboard generator nama tamu
│   ├── js/
│   │   ├── main.js                 # Logika cover pembuka, musik, timer, gallery, RSVP
│   │   └── generator.js            # Logika pembentukan link, format pesan WA, bulk generator
│   ├── audio/
│   │   └── background-music.mp3    # Musik latar instrumen seruling khas Bali (Gus Teja)
│   └── images/
│       ├── ornaments/              # Ornamen ukiran Bali, dedaunan, mandala
│       └── photos/                 # Galeri foto momen upacara
│
└── README.md                       # Panduan lengkap penggunaan
```

---

## 🚀 Fitur Unggulan

### 1. Template Undangan Digital (`index.html`)
- **Cover Pembuka Personal**: Menampilkan nama tamu dari parameter URL (`?untuk=Nama+Tamu`).
- **Background Music Autoplay**: Musik instrumen Bali otomatis berputar saat tombol "Buka Undangan" ditekan, dilengkapi floating button kontrol musik (putar/jeda).
- **Hero & Sambutan Suci**: Disertai doa restu dan kutipan kitab suci (*Bhagavad Gita*).
- **Profil Peserta / Mempelai**: Frame foto dengan aksen dedaunan tropis khas Bali.
- **Waktu & Lokasi**: Tombol integrasi langsung ke Google Maps dan Google Calendar.
- **Live Countdown Timer**: Hitung mundur hari, jam, menit, dan detik menuju acara.
- **Galeri Foto & Lightbox**: Klik foto untuk melihat tampilan penuh (*fullscreen*).
- **Buku Tamu / RSVP & Doa Restu**: Form kehadiran yang terhubung langsung secara real-time ke **Google Spreadsheet** (gratis tanpa server) dan tersimpan secara offline di browser (`localStorage`).
- **Amplop Digital (Tanda Kasih)**: Kartu rekening dengan tombol salin nomor rekening 1-klik yang interaktif.

---

## 📊 Integrasi Database Google Sheets (Gratis & Realtime)

Template ini telah dilengkapi integrasi database **Google Sheets**. Semua ucapan tamu dan konfirmasi kehadiran akan otomatis masuk ke Google Spreadsheet Anda.
Panduan lengkap langkah demi langkah dapat dilihat pada file:
👉 [`PANDUAN_GOOGLE_SHEETS.md`](./PANDUAN_GOOGLE_SHEETS.md) dan kode script ada pada [`google-sheets-script.js`](./google-sheets-script.js).

### 2. Generator Nama Tamu (`namatamu/index.html`)
- **Single Guest Generator**:
  - Masukkan nama tamu & nomor WA (opsional).
  - Pilih gaya pesan (Bahasa Bali Halus, Bahasa Indonesia Formal, atau Bahasa Santai).
  - Tombol **Kirim via WhatsApp**, **Salin Teks Lengkap**, dan **Salin Link**.
- **Bulk Generator (Banyak Tamu Sekaligus)**:
  - Tempel daftar 10 - 100+ nama tamu sekaligus (1 nama per baris).
  - Otomatis menghasilkan tabel link untuk masing-masing tamu.
  - Fitur **Download CSV / Excel** untuk arsip distribusi undangan.

---

## ⚙️ Cara Mengubah Data Acara (`config.js`)

Cukup buka file `config.js` dan sesuaikan nilainya:

```javascript
const UNDANGAN_CONFIG = {
    acara: {
        jenis: "Resepsi Metatah",
        subJudul: "Upacara Manusa Yadnya Metatah (Potong Gigi)",
        tanggalAcara: "2026-09-07T19:00:00+08:00", // Waktu acara
        hariTanggalTeks: "Senin, 7 September 2026",
        waktuTeks: "19.00 WITA - Selesai",
        tempat: "Jl. Alamat Lokasi Acara No. 123, Denpasar, Bali",
        mapsUrl: "https://maps.google.com",
        // ...
    },
    // Ubah peserta, foto, musik, dan nomor rekening di sini
};
```

---

## 💻 Cara Menjalankan Secara Lokal

Anda dapat membuka file `index.html` langsung di browser, atau menjalankan server lokal menggunakan Python:

```bash
# Buka terminal di folder project
cd C:\Users\ASUS\.gemini\antigravity\scratch\undangan-digital-bali

# Jalankan server lokal
python -m http.server 8000
```

Lalu buka di browser:
- Undangan Utama: `http://localhost:8000/?untuk=Nama+Tamu+%26+Keluarga`
- Generator Nama: `http://localhost:8000/namatamu/`

---

## 🌐 Cara Hosting / Deploy ke Internet

1. **GitHub Pages**:
   - Upload seluruh folder ini ke repository GitHub.
   - Aktifkan GitHub Pages di menu *Settings > Pages* -> pilih branch `main`.
2. **Vercel / Netlify**:
   - Drag & drop folder `undangan-digital-bali` ke dashboard Netlify atau Vercel.
3. **cPanel / Hosting Sendiri**:
   - Upload semua file ke folder `public_html` di cPanel hosting Anda.
