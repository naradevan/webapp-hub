# KMZ Styler EMR V17 - Dokumentasi Teknis

**KMZ Styler EMR** adalah aplikasi berbasis web (Modular JS) untuk memproses, merestrukturisasi, dan memberikan styling otomatis pada file desain jaringan FTTH (KMZ/KML). Aplikasi ini mendukung dua mode utama: **Cluster Mode** (Jaringan Distribusi/Akses) dan **Subfeeder Mode** (Jaringan Feeder/Backbone).

Versi ini (V17) telah dilengkapi dengan fitur **Smart Snap**, **Auto Slack Generator**, dan **Logic FDT Unik**.

---

## 📖 Panduan Penggunaan (Cara Pakai)

1.  **Buka Aplikasi:**
    Buka file `index.html` menggunakan browser modern (Chrome, Edge, Firefox). Disarankan menggunakan *Live Server* jika menjalankannya dari VS Code, atau hosting statis.

2.  **Pilih Mode:**
    * Klik **CLUSTER MODE** untuk desain distribusi (FAT ke Rumah).
    * Klik **SUBFEEDER MODE** untuk desain feeder (ODC ke ODP/FAT).

3.  **Upload File:**
    * Klik area kotak putus-putus atau *Drag & Drop* file `.kml` atau `.kmz` Anda ke area tersebut.
    * Pastikan ukuran file wajar (< 10MB disarankan agar browser tidak *lag*).

4.  **Proses Data:**
    * Klik tombol biru **Process File**.
    * Tunggu hingga indikator berputar berhenti dan muncul status "✅ Done!".
    * Anda bisa melihat *preview* struktur folder baru di bagian bawah.

5.  **Download Hasil:**
    * Klik **Download KMZ Result** untuk mendapatkan file visual (peta).
    * Klik **Download HPDB Result** (hanya Cluster Mode) untuk mendapatkan laporan data Homepass dalam format CSV.

---

## ⚠️ Aturan Penulisan (Wajib)

Sistem menggunakan *String Matching* yang sensitif terhadap spasi dan angka. Ikuti aturan ini agar styling berhasil:

### 1. Format Kapasitas (Kabel & Perangkat)
Penulisan kapasitas **DILARANG** menggunakan spasi antara angka dan huruf "C".

| ✅ BENAR | ❌ SALAH |
| :--- | :--- |
| `288C` | `288 C` (Spasi), `288Core` |
| `144C` | `144-C` |
| `96C` | `96 c` |
| `48C` | `48 Core` |

### 2. Penamaan Tiang (Pole)
Gunakan format: `STATUS` + `TIPE` + `TINGGI`.
* **Benar:** `NEW POLE 7-4`, `EXISTING POLE EMR 9-4`.
* **Salah:** `Tiang Baru 7m`, `Pole 7m`.

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

## 🛠️ Fitur Otomatisasi (V17 Logic)

### 1. Smart Snap (Pole-Safe)
Fitur ini merapikan titik koordinat yang berantakan.
* **Logika:** Jika ada aset `FAT` atau `SLACK HANGER` yang berjarak **kurang dari 15 meter** dari sebuah `POLE` (Tiang), maka aset tersebut akan **digeser otomatis** menempel persis ke koordinat tiang.
* **Penting:** Sesama Tiang (`POLE`) **TIDAK AKAN** saling menempel/bergeser satu sama lain, menjaga akurasi data lapangan.

### 2. Auto Slack Generator
Jika folder `SLACK HANGER` kosong, sistem akan otomatis membuatnya:
* **Copy FAT:** Semua FAT di dalam Line tersebut di-copy ke folder Slack.
* **Copy FDT:** Sistem mencari FDT Global yang namanya cocok dengan FAT di Line tersebut (misal `ADBL-1.141`), lalu meng-copy-nya ke folder Slack Line tersebut.
* **Clean Description:** Deskripsi/atribut sampah pada hasil copy otomatis dihapus agar bersih.

### 3. Unique FDT (Prioritas Line)
Untuk menghindari duplikasi FDT di banyak folder Line:
* FDT hanya akan dicopy ke **Line Pertama** yang ditemukan (First-Come-First-Serve).
* Contoh: Jika `FDT-01` terhubung ke `LINE A` dan `LINE C`, maka Slack FDT hanya akan muncul di `LINE A`.

### 4. Kalkulasi Material
Menambahkan deskripsi otomatis pada `DISTRIBUTION CABLE`.
* **Rumus:** `(Panjang Drawing + (Total Slack x 20m)) * 1.05`
* **Toleransi:** 5%.
* **Slack:** Menghitung jumlah FAT dan FDT dalam satu jalur kabel.

---

## 📂 Struktur Folder Output

Hasil proses akan merapikan KML Anda menjadi struktur berikut:

```text
📂 CLUSTER ID / ROOT
 ┣ 📂 BOUNDARY CLUSTER
 ┣ 📂 FDT (Global Folder)
 ┣ 📂 LINE A
 ┃  ┣ 📂 BOUNDARY FAT
 ┃  ┣ 📂 FAT
 ┃  ┣ 📂 HP COVER (Dikelompokkan per Boundary)
 ┃  ┣ 📂 HP UNCOVER
 ┃  ┣ 📂 EXISTING POLE ... (Sesuai Ukuran)
 ┃  ┣ 📂 NEW POLE ... (Sesuai Ukuran)
 ┃  ┣ 📂 DISTRIBUTION CABLE (Berisi kalkulasi panjang)
 ┃  ┣ 📂 SLACK HANGER (Auto-generated & Snapped)
 ┃  ┗ 📂 SLING WIRE
 ┣ 📂 LINE B
 ┃  ┗ ... (Struktur serupa)
 ┗ 📂 OTHERS (Item tidak dikenal / Salah format nama)
