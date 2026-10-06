# 📊 Panduan Menghubungkan Google Sheets sebagai Database Komentar / RSVP

Dengan mengikuti panduan 3 menit ini, setiap ucapan doa dan konfirmasi kehadiran yang dikirim oleh tamu undangan akan **otomatis tersimpan di Google Spreadsheet Anda secara gratis dan real-time**.

---

## 🛠️ Langkah-Langkah Pemasangan (Hanya 3 Menit)

### Langkah 1: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.google.com) lalu buat Spreadsheet kosong baru (misal beri judul *"Database Undangan Digital"*).
2. Pada baris pertama (Baris 1), ketikkan 4 judul kolom berikut:
   * **Kolom A1**: `Timestamp`
   * **Kolom B1**: `Nama`
   * **Kolom C1**: `Kehadiran`
   * **Kolom D1**: `Ucapan`

---

### Langkah 2: Buka Apps Script
1. Pada menu bagian atas Google Sheets, klik **Ekstensi** (*Extensions*) > **Apps Script**.
2. Hapus seluruh teks kode bawaan yang ada di editor.
3. Buka file [`google-sheets-script.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/undangan-digital-bali/google-sheets-script.js) di folder proyek ini, lalu **salin (copy) seluruh kodenya** dan **tempel (paste)** ke editor Apps Script tersebut.
4. Klik ikon **Simpan** (💾 / Ctrl+S).

---

### Langkah 3: Terapkan Sebagai Aplikasi Web (Deploy)
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan** (*Deploy*) > **Deployment baru** (*New deployment*).
2. Klik ikon gerigi ⚙️ di samping *"Pilih jenis"*, lalu pilih **Aplikasi Web** (*Web app*).
3. Atur pengaturannya seperti berikut:
   * **Deskripsi**: `API Komentar Undangan`
   * **Jalankan sebagai** (*Execute as*): `Saya (email Anda)`
   * **Yang memiliki akses** (*Who has access*): **`Siapa saja` (*Anyone*)**  ⚠️ *(PENTING: Jangan pilih "Hanya saya", pilih "Siapa saja" agar tamu bisa mengirim data).*
4. Klik tombol **Terapkan** (*Deploy*).
5. Jika muncul permintaan izin (*Authorization required*):
   * Klik *Tinjau Izin* (*Review Permissions*).
   * Pilih akun Google Anda.
   * Klik *Lanjutan* (*Advanced*) di bagian bawah, lalu klik *Buka API Komentar (tidak aman)* (*Go to ... unsafe*).
   * Klik *Izinkan* (*Allow*).
6. Salin **URL Aplikasi Web** yang berakhiran `/exec` (Contoh: `https://script.google.com/macros/s/AKfycby.../exec`).

---

### Langkah 4: Hubungkan ke File `config.js`
1. Buka file [`config.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/undangan-digital-bali/config.js) di folder proyek Anda.
2. Tempelkan URL yang sudah Anda salin tadi ke bagian `database.googleSheetsUrl`:

```javascript
const UNDANGAN_CONFIG = {
    // 📊 Konfigurasi Database Online (Google Sheets)
    database: {
        googleSheetsUrl: "https://script.google.com/macros/s/AKfycby.../exec", 
    },
    // ...
};
```
3. Simpan file `config.js`. Selesai! 🎉

---

## ✨ Uji Coba

1. Buka file `index.html` di browser Anda.
2. Isi form RSVP pada bagian *"Mohon Doa Restu & RSVP"*, lalu klik **Kirim Doa & Ucapan**.
3. Buka Google Spreadsheet Anda, data ucapan baru akan langsung masuk seketika pada baris berikutnya!
