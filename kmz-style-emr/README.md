# KMZ Styler EMR V17 - Dokumentasi Teknis

**KMZ Styler EMR** adalah aplikasi web modern untuk memproses, merestrukturisasi, dan memberikan styling otomatis pada desain jaringan FTTH (KMZ/KML). Aplikasi ini dirancang untuk mempercepat pekerjaan drafter dengan fitur otomatisasi cerdas.

Versi ini (V17) sudah dilengkapi dengan **Export HPDB**, **Spatial Grouping**, **Auto Count & Sling Wire Calculation**, **Smart Snap (Pole Anchor)**, **Auto Slack Generator**, **Kalkulasi Material Kabel**.

---

## 📖 Panduan Penggunaan

Aplikasi ini sudah berbasis web (Hosted), sehingga Anda tidak perlu instalasi apa pun.

1.  **Buka Aplikasi:** Akses URL web app melalui browser Anda.
2.  **Pilih Mode:**
    * **CLUSTER MODE:** Untuk desain distribusi (FAT ke Rumah).
    * **SUBFEEDER MODE:** Untuk desain feeder/backbone (ODC ke ODP).
3.  **Upload File:** Drag & drop file `.kmz` atau `.kml` ke area upload.
4.  **Proses:** Klik tombol **Process File** dan tunggu hingga selesai.
5.  **Download:**
    * **KMZ Result:** File hasil styling visual.
    * **HPDB Result:** Laporan CSV (Database Homepass).

---

## 🚀 Fitur Unggulan & Otomatisasi

### 1. Export HPDB (FAT-Pole Mapping)
Tidak sekadar export koordinat, fitur ini menghasilkan file CSV yang **Cerdas**:
* **Relasi Otomatis:** Sistem secara otomatis mendeteksi dan memetakan **FAT** mana yang melayani **Tiang (Pole)** mana berdasarkan kedekatan dan struktur jaringan.
* **Data Lengkap:** Output CSV mencakup Pole ID, Koordinat, FAT Name, dan detail lainnya siap pakai.

### 2. Spatial Grouping (Auto Folder HP Cover)
Anda tidak perlu lagi memilah homepass secara manual!
* **Auto-Folder:** Sistem akan membaca polygon yang ada di folder `BOUNDARY FAT`.
* **Logic:** Setiap titik Homepass (HP) akan dicek posisinya. Jika berada di dalam area polygon tertentu, titik tersebut akan **otomatis dipindahkan** ke dalam sub-folder dengan nama yang sama dengan Polygon tersebut.
* **Auto-Description:** Jumlah HP dalam satu area boundary akan dihitung dan ditampilkan di deskripsi polygon.

### 3. Auto Count & Sling Wire Calculation
* **Placemark Counter:** Sistem otomatis menghitung jumlah aset (Tiang, FAT, HP) dalam satu folder dan menuliskannya di deskripsi folder induk (Contoh: *"24 EXT POLE"*).
* **Sling Wire:** Menghitung total panjang jalur `SLING WIRE` secara akumulatif dan menampilkannya di deskripsi.

### 4. Smart Snap (Pole Anchor)
* Jika aset seperti **FAT** atau **SLACK HANGER** berada < 15 meter dari tiang, aset tersebut akan **digeser otomatis (Snap)** agar menempel persis di titik tiang.
* **Pole-Safe:** Sesama tiang tidak akan saling snap/bergeser untuk menjaga akurasi titik survey.

### 5. Auto Slack Generator
* Jika folder `SLACK HANGER` kosong, sistem otomatis membuatnya dengan menyalin titik FAT dan mengambil referensi FDT yang sesuai (Unique Logic).
* Deskripsi sampah pada hasil copy otomatis dibersihkan.

### 6. Kalkulasi Material Kabel
Pada folder `DISTRIBUTION CABLE`, sistem menyuntikkan deskripsi perhitungan:
* **Rumus:** `(Panjang Drawing + (Total Slack x 20m)) * 1.05`
* Menghitung estimasi kebutuhan kabel fisik termasuk toleransi 5% dan slack loop.

---

## ⚠️ Aturan Penulisan (Wajib)

Agar fitur otomatisasi berjalan lancar, pastikan input KMZ mengikuti standar ini:

### 1. Format Kapasitas (Kabel & Perangkat)
Jangan gunakan spasi antara angka dan huruf "C".

| ✅ BENAR | ❌ SALAH |
| :--- | :--- |
| `288C` | `288 C`, `288Core` |
| `144C` | `144-C` |
| `96C` | `96 c` |
| `48C` | `48 Core` |

### 2. Penamaan Tiang (Pole)
Format: `STATUS` + `TIPE` + `TINGGI`.
* **Contoh:** `NEW POLE 7-4`, `EXISTING POLE EMR 9-4`.

### 3. Boundary Polygon
Untuk fitur *Spatial Grouping*, pastikan polygon batas area berada di dalam folder bernama:
* `BOUNDARY FAT` atau `BOUNDARY CLUSTER`

---

## 🎨 Standar Warna & Styling

Sistem menerapkan kode warna heksadesimal secara otomatis. Tidak hanya kabel, warna **FDT (ODC)** dan **Joint Closure (JC)** juga mengikuti kapasitasnya.

### 1. Kabel, FDT, & Joint Closure
Warna ditentukan berdasarkan kapasitas *core* terbesar yang terdeteksi pada nama/deskripsi aset.

| Kapasitas Core | Warna Visual | Hex Code | Penggunaan |
| :--- | :--- | :--- | :--- |
| **288C** | 🟠 Orange | `#FFAA00` | Feeder / Backbone Utama |
| **144C** | 🟡 Kuning | `#FFFF00` | Feeder / Distribusi Padat |
| **96C** | 🔴 Merah | `#FF0000` | Feeder / Distribusi |
| **72C** | 🔵 Biru Tua | `#0000FF` | Distribusi |
| **48C** | 🟣 Ungu | `#AA00FF` | Distribusi / FDT Kecil |
| **24C** | 🟢 Hijau | `#00FF00` | Distribusi Ujung |

> **Catatan:**
> * **FDT/ODC** akan menggunakan ikon *Paddle/Kotak* dengan warna sesuai kapasitas masuk (Input).
> * **Joint Closure (JC)** akan menggunakan ikon *Bulat/Circle* dengan warna sesuai kapasitas sambungan.

### 2. Tiang (Poles)
Warna ikon tiang membedakan tinggi dan jenisnya.

| Tipe Tiang | Warna Icon | Kriteria Nama |
| :--- | :--- | :--- |
| **Tiang 9 Meter** | 🔴 Merah | `9-4`, `9-5` |
| **Tiang 7M (Standard)** | 🟢 Hijau | `7-4`, `7-5` |
| **Tiang 7M (Kecil)** | 🔵 Biru Muda | `7-3` |
| **Tiang 7M (Mini)** | 🟣 Ungu | `7-2.5` |
| **Existing (Semua Ukuran)** | 🟤 Coklat | `EXISTING` |

### 3. Aset Lainnya
* **BOUNDARY:** Garis Putih Transparan.
* **HP COVER:** Ikon Hijau (Rumah dalam area Boundary).
* **HP UNCOVER:** Ikon Merah (Rumah di luar area Boundary).
* **SLACK HANGER:** Ikon Merah (Target/Lingkaran).

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

*Dokumentasi untuk KMZ Styler EMR V17.*


