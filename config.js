/**
 * ====================================================================
 * KONFIGURASI UNDANGAN DIGITAL BALI (ANONYMOUS TEMPLATE)
 * ====================================================================
 * Anda dapat dengan mudah mengubah teks, tanggal, lokasi, peserta acara,
 * musik, nomor rekening, dan database pada file ini tanpa harus mengedit kode HTML!
 */

const UNDANGAN_CONFIG = {
    // 📊 Konfigurasi Database Online (Google Sheets)
    database: {
        // URL Web App Google Apps Script Anda (Aktif & Terhubung)
        googleSheetsUrl: "https://script.google.com/macros/s/AKfycbzr40H8Fgq6yn_VoE8yybP8Y-1SSaI9dI2aMYgMzwPuWMrRJpMJl2bnfPlQ-0Ov0Ov9/exec", 
    },

    // Info Utama Acara
    acara: {
        jenis: "Pawiwahan & Mepandes", 
        subJudul: "Upacara Manusa Yadnya Pawiwahan & Mepandes",
        tanggalAcara: "2026-10-16T13:00:00+08:00", // Format ISO: YYYY-MM-DDTHH:mm:ss+08:00 (WITA)
        hariTanggalTeks: "Jumat, 16 Oktober 2026",
        waktuTeks: "13.00 WITA - Selesai",
        tempat: "Gg. Arjuna, Wanasari, Kec. Tabanan, Kabupaten Tabanan, Bali 82181",
        mapsUrl: "https://maps.app.goo.gl/uCp737N8D53aaCRa6",
        mapsEmbedUrl: "https://maps.google.com/maps?q=-8.4874452,115.1352804&hl=id&z=17&output=embed",
        deskripsi: "Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir memberikan doa restu kepada kami.",
        salamPembuka: "Om Swastyastu",
        pesanPembuka: "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa / Tuhan Yang Maha Esa, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada Upacara Manusa Yadnya Pawiwahan lan Mepandes Putra dan Putri kami:",
        salamPenutup: "Om Shanti Shanti Shanti Om",
        pesanPenutup: "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Atas kehadiran dan doa restunya kami ucapkan terima kasih."
    },

    // Sloka Suci / Kutipan Kitab Suci
    sloka: {
        teks: "Devan bhavayatanena te deva bhavayantu vah parasparam bhavayantah sreyah param avapsyatha",
        sumber: "Bhagavad Gita 3:11",
        arti: "Dengan ini (Yadnya), kami berbakti kepada Hyang Widhi dan dengan ini pula Hyang Widhi memelihara dan mengasihi kamu. Dengan saling memelihara satu sama lain, kamu akan mencapai kebaikan yang maha tinggi."
    },

    // Daftar Peserta Acara Terbagi dalam Kategori (Pawiwahan & Mepandes)
    pesertaGroups: [
        {
            kategori: "Pawiwahan",
            peserta: [
                {
                    nama: "Ida Bagus Yogi Adnyana Putra, S.Pd",
                    keterangan: "Putra dari Pasangan Ida Bagus Swabhawa & Anak Agung Rai Puspawati",
                    foto: "assets/images/photos/NAS_7268.JPEG"
                },
                {
                    nama: "Ida Ayu Intan Kartika Dewi, S.Pd",
                    keterangan: "Putri dari Pasangan Ida Bagus Swastika, S.E & Ida Ayu Putu Asrami",
                    foto: "assets/images/photos/NAS_7262.JPEG"
                }
            ]
        },
        {
            kategori: "Mepandes",
            peserta: [
                {
                    nama: "Ida Bagus Dwipayana, S.Tr.Sn",
                    keterangan: "Putra dari Pasangan Ida Bagus Swabhawa & Anak Agung Rai Puspawati",
                    foto: "assets/images/photos/NAS_7221.JPEG"
                },
                {
                    nama: "Ida Bagus Gd Pradnya Arinanta",
                    keterangan: "Putra dari Pasangan Ida Bagus Ketut Sutawijaya, S.E & Dra. Ida Ayu Nyoman Sari",
                    foto: "assets/images/photos/edit-7224.JPEG"
                }
            ]
        }
    ],

    // Foto Cover / Thumbnail Utama (Foto 7478)
    coverFoto: "assets/images/photos/edit-7478.JPEG",

    // Foto Background Tipis Hero Header (Foto 7364)
    heroBackgroundFoto: "assets/images/photos/NAS_7364.JPEG",

    // Musik Latar
    musik: {
        src: "assets/audio/undangan digital jikogik.wav",
        judul: "Undangan Digital Jikogik",
        autoPlayOnOpen: true
    },

    // Video Dokumentasi / Cinematic (Link YouTube Acara)
    video: {
        aktif: true,
        tipe: "youtube",
        src: "https://youtu.be/vcYeqqPk7vs",
        poster: "assets/images/photos/NAS_7364.JPEG",
        judul: "Video Momen Pawiwahan & Mepandes"
    },

    // Galeri Foto (Semua Momen Dokumentasi Upacara, Klasik, & Kasual)
    galeri: [
        // Koleksi Utama
        { src: "assets/images/photos/edit-7600.JPEG", caption: "Kebersamaan Keluarga - Upacara Yadnya" },
        { src: "assets/images/photos/NAS_7404.JPEG", caption: "Momen Bahagia Mempelai" },
        { src: "assets/images/photos/edit-7417.JPEG", caption: "Dokumentasi Upacara Pawiwahan" },
        { src: "assets/images/photos/edit-7411.JPEG", caption: "Prosesi Adat Bali" },
        { src: "assets/images/photos/edit-7375.JPEG", caption: "Kehangatan Upacara Mepandes" },
        { src: "assets/images/photos/edit-7304.JPEG", caption: "Potret Khidmat Upacara" },
        { src: "assets/images/photos/edit-7453.JPEG", caption: "Dokumentasi Yadnya" },
        { src: "assets/images/photos/edit-7455.JPEG", caption: "Pesona Busana Tradisional Bali" },
        { src: "assets/images/photos/edit-7465.JPEG", caption: "Momen Sakral Upacara" },
        { src: "assets/images/photos/edit-7506.JPEG", caption: "Doa & Restu Keluarga" },
        { src: "assets/images/photos/edit-7219.JPEG", caption: "Potret Tradisional Bali" },
        { src: "assets/images/photos/NAS_7241.JPEG", caption: "Dokumentasi Acara" },
        { src: "assets/images/photos/NAS_7323.JPEG", caption: "Momen Bahagia" },
        { src: "assets/images/photos/NAS_7434.JPEG", caption: "Rangkaian Prosesi Yadnya" },
        { src: "assets/images/photos/NAS_7219.JPEG", caption: "Tradisi & Budaya Bali" },

        // Tambahan Klasik
        { src: "assets/images/photos/TAMBAHAN KLASIK/edit-7356.jpeg", caption: "Momen Klasik Tradisional" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/edit-7399.jpeg", caption: "Potret Busana Adat Bali" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/edit-7550.jpeg", caption: "Kehangatan Upacara Yadnya" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7228.jpg", caption: "Rangkaian Mepandes" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7364.jpg", caption: "Pesona Adat Bali" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7370.jpg", caption: "Potret Kebersamaan" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7434.jpg", caption: "Dokumentasi Prosesi" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7496.jpg", caption: "Momen Sakral Tradisional" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7539.jpg", caption: "Kebersamaan Mempelai" },
        { src: "assets/images/photos/TAMBAHAN KLASIK/NAS_7545.jpg", caption: "Doa & Restu Tradisional" },

        // Tambahan Casual
        { src: "assets/images/photos/CASUAL/GNP09341.jpg", caption: "Momen Kasual Bahagia" },
        { src: "assets/images/photos/CASUAL/GNP09390.jpg", caption: "Potret Kasual Mempelai" },
        { src: "assets/images/photos/CASUAL/GNP09418.jpg", caption: "Keceriaan Bersama" },
        { src: "assets/images/photos/CASUAL/GNP09476.jpg", caption: "Momen Kasual Romantis" },
        { src: "assets/images/photos/CASUAL/GNP09499.jpg", caption: "Potret Kasual Bersama" },
        { src: "assets/images/photos/CASUAL/GNP09519.jpg", caption: "Senyum Bahagia" },
        { src: "assets/images/photos/CASUAL/GNP09524.jpg", caption: "Momen Manis Mempelai" },
        { src: "assets/images/photos/CASUAL/GNP09535.jpg", caption: "Potret Kasual Bahagia" },
        { src: "assets/images/photos/CASUAL/GNP09548.jpg", caption: "Kenangan Kasual Terindah" }
    ],

    // Rekening Amplop Digital / Tanda Kasih (1 Rekening Mandiri)
    rekening: [
        {
            bank: "Bank Mandiri",
            nomor: "1750002619608",
            atasNama: "IDA AYU INTAN KARTIKA DEWI"
        }
    ],

    // Tautan Media Sosial & Kontak (Instagram & WhatsApp)
    sosialMedia: {
        instagram: "https://instagram.com",
        whatsapp: "https://wa.me/"
    },

    // Ucapan Bawaan Pertama (Jika belum ada ucapan di database)
    ucapanDefault: [
        {
            nama: "Keluarga Besar & Sahabat",
            kehadiran: "Hadir",
            waktu: "1 jam yang lalu",
            pesan: "Selamat menempuh upacara Manusa Yadnya Pawiwahan & Mepandes. Semoga dilimpahi kerahayuan, kebijaksanaan, dan kelancaran acara."
        },
        {
            nama: "Sahabat & Kerabat",
            kehadiran: "Hadir",
            waktu: "3 jam yang lalu",
            pesan: "Rahajeng Mepandes semeton sami, dumogi memargi antar labda karya lan ngemolihang kerahayuan."
        },
        {
            nama: "Tamu Undangan",
            kehadiran: "Masih Ragu",
            waktu: "5 jam yang lalu",
            pesan: "Dumogi acaranya berjalan lancar dan sukses tanpa halangan suatu apapun. Astungkara."
        }
    ]
};

// Export konfigurasi
if (typeof window !== 'undefined') {
    window.UNDANGAN_CONFIG = UNDANGAN_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UNDANGAN_CONFIG;
}
