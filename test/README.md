# KMZ Styler EMR V36 - Dokumentasi Teknis

**KMZ Styler EMR V36** adalah aplikasi berbasis web untuk memproses, merestrukturisasi, dan memberikan styling otomatis pada file desain jaringan FTTH (KMZ/KML). Aplikasi ini mendukung dua mode utama: **Cluster Mode** (Jaringan Distribusi/Akses) dan **Subfeeder Mode** (Jaringan Feeder/Backbone), serta mampu menghasilkan output **HPDB (Homepass Database)** dalam format CSV.

---

## ⚠️ Aturan Penulisan (SANGAT PENTING)

Sistem ini menggunakan pencocokan teks (String Matching) dan Regular Expression (Regex) yang **Case-Insensitive** (tidak peduli huruf besar/kecil) TETAPI **sangat sensitif terhadap Spasi dan Format Angka**.

Berikut adalah aturan ketat yang wajib diikuti pada *input* KMZ/KML agar tidak terjadi error atau gagal styling:

### 1. Format Penulisan Kabel (Core Capacity)

Penulisan kapasitas kabel **DILARANG** menggunakan spasi antara angka dan huruf "C".

| ✅ BENAR (Terbaca Sistem) | ❌ SALAH (Gagal Styling/Hitung) |
| --- | --- |
| `288C` | `288 C` (Ada spasi) |
| `144C` | `144Core` |
| `96C` | `96 c` |
| `48C` | `48-C` |
| `24C` | `24 Core` |

> **Catatan:** Untuk kabel distribusi, sistem juga mengenali format spesifikasi lengkap seperti `24C/4T` asalkan format `24C`-nya menyambung.

### 2. Format Penulisan Tiang (Pole)

Nama folder atau placemark tiang harus mengandung kata kunci spesifik agar warna tiang sesuai dengan spesifikasi (Hijau, Merah, Ungu, dll).

* **Format Wajib:** `STATUS` + `TIPE` + `TINGGI`.
* **Contoh Valid:**
* `NEW POLE 7-4` (Otomatis warna Hijau)
* `NEW POLE 9-4` (Otomatis warna Merah)
* `EXISTING POLE EMR 7-3`


* **Contoh Tidak Valid:** `Tiang Baru 7m` (Akan masuk ke kategori default/Unknown).

### 3. Penandaan Line / Jalur

Agar folder terkelompok otomatis ke dalam `LINE A`, `LINE B`, dst., Placemark harus berada di dalam folder yang namanya mengandung:

* `LINE A` atau `LN A`
* `LINE B` atau `LN B`
* **Hindari:** Menamai Line hanya dengan angka (misal: "1", "2") karena bisa tertukar dengan angka pada spesifikasi kabel.

### 4. Polygon Boundary (Untuk Cluster Mode)

Untuk fitur **Spatial Grouping** (Otomatis memasukkan HP ke dalam folder Boundary), nama Folder atau Placemark Polygon harus mengandung kata:

* `BOUNDARY FAT` atau `BOUNDARY CLUSTER`

---

## Fitur Utama

### 1. Mode Proses

* **Cluster Mode:** Fokus pada desain distribusi (FAT, ODP, Tiang, Kabel Distribusi 24C-48C, Homepass).
* **Subfeeder Mode:** Fokus pada desain feeder (Joint Closure, Kabel Kapasitas Besar 96C-288C, Tiang).

### 2. Otomatisasi

* **Restructuring:** Merapikan struktur folder yang berantakan menjadi hierarki standar (`LINE` -> `JENIS ASET`).
* **Styling:** Memberikan warna dan ikon otomatis berdasarkan jenis aset.
* **Auto-Reposition (Snap):** Jika titik tiang dan titik slack berdekatan (<15m), koordinat slack akan disamakan persis dengan tiang (menghindari *dangling points*).
* **Calculation:** Menghitung total panjang kabel + toleransi 5% + Slack Loop.

---

## Standar Warna & Styling

Sistem akan menerapkan kode warna heksadesimal berikut secara otomatis:

### Kabel (LineString)

Warna kabel ditentukan berdasarkan kapasitas core yang terdeteksi dalam nama/deskripsi:

| Kapasitas | Warna | Hex Code |
| --- | --- | --- |
| **288C** | 🟠 Orange | `#FFAA00` |
| **144C** | 🟡 Kuning | `#FFFF00` |
| **96C** | 🔴 Merah | `#FF0000` |
| **72C** | 🔵 Biru Tua | `#0000FF` / `#550000` |
| **48C** | 🟣 Ungu | `#AA00FF` |
| **24C** | 🟢 Hijau | `#00FF00` |

### Tiang (Poles)

Styling tiang didasarkan pada nama tiang/folder:

| Tipe Tiang | Kriteria Nama | Warna Icon |
| --- | --- | --- |
| **Tiang 9m** | `9-4` / `9-5` | 🔴 Merah |
| **Tiang 7m (Standard)** | `7-4` / `7-5` | 🟢 Hijau |
| **Tiang 7m (Kecil)** | `7-3` | 🔵 Cyan/Biru Muda |
| **Tiang 7m (Mini)** | `7-2.5` | 🟣 Ungu |
| **Existing** | `EXISTING` | 🟤 Coklat Gelap |

### Aset Lainnya

* **FAT/ODP:** Ikon Kuning.
* **HP COVER:** Ikon Hijau (Dalam area Boundary).
* **HP UNCOVER:** Ikon Merah (Di luar area Boundary).
* **SLACK:** Ikon Merah (Simbol lingkaran/target).

---

## Kalkulasi Material (Cluster Mode)

Aplikasi akan otomatis menyuntikkan data perhitungan ke dalam **Description** pada setiap segmen kabel `DISTRIBUTION CABLE`.

**Rumus Kalkulasi:**

```text
Total Panjang = (Panjang Drawing + (Jumlah Slack * 20m)) * 105%

```

* **Slack:** Diasumsikan 1 Slack FDT dan 1 Slack FAT (Total 2 titik) per segmen jika terhubung ke folder FAT.
* **Toleransi:** 5% (Faktor pengali 1.05).
* **Output:** Ditulis otomatis di deskripsi KMZ, contoh: `Total Length Cable : 150 + 40 (x 5%) = 199.5 m`.

---

## Panduan Penggunaan

1. **Siapkan File:** Pastikan file Anda berformat `.kml` atau `.kmz`.
2. **Pilih Mode:**
* Klik **CLUSTER MODE** untuk desain distribusi ke rumah.
* Klik **SUBFEEDER MODE** untuk desain jalur utama/backbone.


3. **Upload:** Drag & drop file ke area kotak putus-putus.
4. **Proses:** Klik tombol biru **Process File**.
5. **Review:**
* Lihat "Structure Preview" di bagian bawah untuk memastikan folder `LINE A`, `LINE B`, dll terbentuk.
* Cek status "Done".


6. **Download:**
* **Download KMZ Result:** Untuk file hasil styling.
* **Download HPDB Result:** Untuk file CSV database Homepass (Hanya di Cluster Mode).



---

## Struktur Folder Output (Hasil Restrukturisasi)

Aplikasi akan memaksa struktur folder menjadi seperti ini agar rapi:

### Cluster Mode

```text
📂 CLUSTER ID / JUDUL PROJECT
 ┣ 📂 BOUNDARY CLUSTER
 ┣ 📂 FDT (Global)
 ┣ 📂 LINE A
 ┃  ┣ 📂 BOUNDARY FAT
 ┃  ┣ 📂 FAT
 ┃  ┣ 📂 HP COVER (Berisi subfolder per FAT)
 ┃  ┣ 📂 HP UNCOVER
 ┃  ┣ 📂 EXISTING POLE EMR 7-2.5
 ┃  ┣ 📂 EXISTING POLE EMR 7-3
 ┃  ┣ 📂 EXISTING POLE EMR 7-4
 ┃  ┣ 📂 EXISTING POLE EMR 9-4
 ┃  ┣ 📂 EXISTING POLE PARTNER 7-4
 ┃  ┣ 📂 EXISTING POLE PARTNER 9-4
 ┃  ┣ 📂 NEW POLE 7-2.5
 ┃  ┣ 📂 NEW POLE 7-3
 ┃  ┣ 📂 NEW POLE 7-4
 ┃  ┣ 📂 NEW POLE 9-4
 ┃  ┣ 📂 DISTRIBUTION CABLE
 ┃  ┣ 📂 SLACK HANGER
 ┃  ┗ 📂 SLING WIRE
 ┣ 📂 LINE B
 ┃  ┗ ... (struktur sama)
 ┗ 📂 OTHERS (Item yang tidak dikenali)

```

### Subfeeder Mode

```text
📂 SUBFEEDER ID
 ┣ 📂 JOINT CLOSURE
 ┣ 📂 EXISTING POLE EMR 7-2.5
 ┣ 📂 EXISTING POLE EMR 7-3
 ┣ 📂 EXISTING POLE EMR 7-4
 ┣ 📂 EXISTING POLE EMR 7-5
 ┣ 📂 EXISTING POLE EMR 9-5
 ┣ 📂 EXISTING POLE EMR 9-4
 ┣ 📂 EXISTING POLE PARTNER 7-4
 ┣ 📂 EXISTING POLE PARTNER 9-4
 ┣ 📂 NEW POLE 9-5
 ┣ 📂 NEW POLE 7-4
 ┣ 📂 NEW POLE 9-4
 ┣ 📂 CABLE
 ┗ 📂 SLACK HANGER

```

---

## Troubleshooting

**Q: Mengapa kabel saya masuk ke folder "OTHERS"?**
A: Kemungkinan penulisan kapasitas kabel salah (misal `48 C` pakai spasi), atau tidak terdeteksi sebagai `LineString`.

**Q: Mengapa Homepass (HP) tidak berwarna Hijau?**
A: Pastikan poin HP berada secara geografis **di dalam** area polygon `BOUNDARY FAT`. Jika di luar, akan otomatis menjadi `HP UNCOVER` (Merah).

**Q: Mengapa hasil CSV HPDB kosong atau koordinatnya 0?**
A: CSV Generator membutuhkan folder bernama `FAT` dan `HP COVER`. Pastikan nama folder input Anda sesuai standar.

---

*Dokumentasi diperbarui untuk KMZ Styler V36 (Multi-Line Support).*


