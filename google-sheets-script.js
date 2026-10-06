function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var comments = [];

    // Baca data mulai dari baris ke-2 (mengabaikan judul kolom)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[1] && row[3]) {
        var dateFormatted = formatWaktu(row[0]);
        comments.push({
          waktu: dateFormatted,
          nama: String(row[1]),
          kehadiran: String(row[2] || "Hadir"),
          pesan: String(row[3])
        });
      }
    }

    // Urutkan ucapan terbaru di urutan teratas
    comments.reverse();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: comments
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Buat header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Nama", "Kehadiran", "Ucapan"]);
    }

    var nama = "Tamu Undangan";
    var kehadiran = "Hadir";
    var ucapan = "";

    // 1. Coba baca dari parameter form / URLSearchParams
    if (e && e.parameter) {
      if (e.parameter.nama) nama = e.parameter.nama;
      if (e.parameter.kehadiran) kehadiran = e.parameter.kehadiran;
      if (e.parameter.ucapan) ucapan = e.parameter.ucapan;
      if (e.parameter.pesan) ucapan = e.parameter.pesan;
    }

    // 2. Jika ucapan masih kosong, coba baca dari JSON postData
    if (!ucapan && e && e.postData && e.postData.contents) {
      try {
        var json = JSON.parse(e.postData.contents);
        if (json.nama) nama = json.nama;
        if (json.kehadiran) kehadiran = json.kehadiran;
        if (json.ucapan) ucapan = json.ucapan;
        if (json.pesan) ucapan = json.pesan;
      } catch (err) {
        // Abaikan jika bukan JSON
      }
    }

    if (!ucapan) {
      ucapan = "Doa restu telah tersampaikan.";
    }

    var timestamp = new Date();

    // Tambah baris baru ke sheet
    sheet.appendRow([timestamp, nama, kehadiran, ucapan]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Ucapan berhasil disimpan"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function formatWaktu(dateVal) {
  if (!dateVal) return "Baru saja";
  try {
    var d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Baru saja";

    var now = new Date();
    var diffMs = now - d;
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHour = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return diffMin + " menit yang lalu";
    if (diffHour < 24) return diffHour + " jam yang lalu";
    if (diffDay < 7) return diffDay + " hari yang lalu";

    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    var hours = String(d.getHours()).padStart(2, '0');
    var mins = String(d.getMinutes()).padStart(2, '0');

    return day + "/" + month + "/" + year + " " + hours + ":" + mins;
  } catch (e) {
    return "Baru saja";
  }
}
