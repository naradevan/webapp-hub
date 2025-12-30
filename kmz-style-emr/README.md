# KMZ Styler & Restructure Tool (V19)

**Ultimate Edition: Cluster & Subfeeder Support**

Webapp ini adalah tool otomatisasi untuk standarisasi file KMZ/KML perencanaan jaringan Fiber Optik. Versi ini dilengkapi dengan **Dual Mode Logic** yang membedakan penanganan antara jaringan Cluster (Distribusi) dan Subfeeder (Backbone/Feeder).

## 🚀 Fitur Baru di V19

### 1. Dual Mode System
Terdapat tombol Toggle di bagian atas untuk memilih jenis file:
* **CLUSTER MODE:** Untuk jaringan distribusi ke rumah (FAT/FDT/Tiang). Struktur folder dikelompokkan berdasarkan jalur (LINE A, LINE B).
* **SUBFEEDER MODE:** Untuk jaringan utama (Joint Closure/ODC). Struktur folder dibuat rata (Flat) langsung di bawah folder utama.

### 2. Deep Scan Logic (Nama + Deskripsi)
Tool ini sekarang membaca **Nama Placemark** DAN **Deskripsi Placemark**.
* *Contoh:* Jika nama item hanya "Point 1", tapi di deskripsi tertulis "JC 48C", tool akan mendeteksi itu sebagai Joint Closure.

### 3. Smart Joint Closure Grouping (Khusus Subfeeder)
* **Satu Folder, Beda Style:** Item "Joint Closure" (Kotak) dan "Splice Point/FDT" (Bulat) digabung dalam satu folder bernama `JOINT CLOSURE`.
* **Auto-Icon:**
    * Jika terdeteksi kata **"JC"** $\rightarrow$ Icon Kotak.
    * Jika hanya terdeteksi kapasitas **"48C"** $\rightarrow$ Icon Bulat (FDT).

---

## 📖 Cara Penggunaan

1.  Buka webapp di browser.
2.  **Pilih Mode** di bagian atas: Klik **CLUSTER** atau **SUBFEEDER**.
3.  **Drag & Drop** file `.kmz` atau `.kml` ke kotak upload.
4.  Klik tombol **Process File**.
5.  Cek **Preview** di bagian bawah untuk memastikan folder sudah rapi.
6.  Klik **Download Result** (Output otomatis jadi `.kmz`).

---

## ⚙️ Logika Folder & Styling

### A. CLUSTER MODE
Fokus pada pemisahan jalur distribusi.
* **Struktur:** `CLUSTER ID` $\rightarrow$ `LINE A` $\rightarrow$ `[Item Folders]`
* **Folder Khusus:**
    * `FDT`: Terpisah di folder sendiri.
    * `DISTRIBUTION CABLE`: Kabel dengan format `XXC/XXT`.
* **Warna Tiang:** Berwarna-warni (Merah, Hijau, Cyan, Ungu) sesuai tipe.

### B. SUBFEEDER MODE
Fokus pada jalur utama dan sambungan.
* **Struktur:** `SUBFEEDER ID` $\rightarrow$ `[Item Folders]` (Tanpa Line A/B).
* **Folder Khusus:**
    * `JOINT CLOSURE`: Menampung JC murni dan Splice Point.
    * `CABLE`: Menampung kabel feeder (tanpa folder Distribution Cable).
    * `ODC`: Folder khusus ODC.
* **Warna Tiang:** **Semua Coklat Tua (`#550000`)** baik Existing maupun New.

---

## 🎨 Legenda Warna & Ikon

### 1. Joint Closure & FDT (Kapasitas Core)
Berlaku untuk Cluster & Subfeeder.

| Kapasitas | Warna | Kode Hex |
| :--- | :--- | :--- |
| **288C** | 🟠 Oranye/Merah | `#FFAA00` / `#AA0000` |
| **144C** | 🟡 Kuning | `#FFFF00` |
| **96C** | 🔴 Merah Terang | `#FF0000` |
| **72C** | 🔵 Biru Tua/Abu | `#550000` / `#0000FF` |
| **48C** | 🟣 Ungu | `#AA00FF` |
| **36C** | 🌸 Pink | `#FF00FF` |
| **24C** | 🟢 Hijau | `#00FF00` |

### 2. Kabel (Cable)
Format wajib: `AngkaC` (Subfeeder) atau `AngkaC/AngkaT` (Cluster).

| Tipe | Warna |
| :--- | :--- |
| **288 Core** | 🔵 Biru Muda (`#00AAFF` / `#FFAA00`) |
| **144 Core** | 🟡 Kuning |
| **96 Core** | 🔴 Merah |
| **48 Core** | 🟣 Ungu |
| **24 Core** | 🟢 Hijau |

### 3. Tiang (Pole)
| Tipe Tiang (Keyword) | Kategori | Warna (Hex) | Visual | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **NEW POLE 9** | New 9m | `#FF0000` | 🔴 Merah | Tiang Baru 9 Meter (9-4 / 9-5) |
| **NEW POLE 7-4** / **7-5** | New 7m Std | `#00FF00` | 🟢 Hijau | Tiang Baru 7 Meter Standard |
| **NEW POLE 7-3** | New 7m (7-3) | `#00FFFF` | 🔵 Cyan | Tiang Baru 7 Meter (Spek 7-3) |
| **NEW POLE 7-2.5** | New 7m (7-2.5) | `#AA00FF` | 🟣 Ungu | Tiang Baru 7 Meter (Spek 7-2.5) |
| **EXISTING POLE** | Existing | `#550000` | 🟤 Coklat Tua | Semua Tiang Existing / Partner |

> **Catatan:** Logic ini berlaku otomatis. Script akan membaca nama folder atau nama placemark. Jika mengandung kata "NEW" dan angka spesifik (misal "9-4"), warna akan berubah sesuai tabel di atas. Jika hanya tertulis "POLE" tanpa spesifikasi "NEW", akan dianggap Existing (Coklat).

---

## 2. Logic Kabel & Aksesoris (Subfeeder Mode)

Selain tiang, berikut adalah aturan baku untuk komponen lain di mode Subfeeder:

| Komponen | Keyword Deteksi | Warna | Keterangan |
| :--- | :--- | :--- | :--- |
| **Kabel Distribusi** | `CABLE`, `288C`, `144C`, dll | *Dynamic* | Mengikuti warna core (lihat tabel bawah) |
| **Joint Closure (JC)** | `JC`, `JOINT CLOSURE` | *Dynamic* | Icon `5` (Kotak), warna ikut core kabel |
| **Slack Hanger** | `SLACK`, `HANGER` | `#FF0000` | 🔴 Merah (Icon `4`) |

### Tabel Warna Core Kabel (Subfeeder)
Warna ini digunakan untuk Kabel dan Joint Closure (JC):

* **288 Core:** `#FFAA00` (Oranye)
* **144 Core:** `#FFFF00` (Kuning)
* **96 Core:** `#FF0000` (Merah)
* **72 Core:** `#0000FF` (Biru Tua)
* **48 Core:** `#AA00FF` (Ungu)
* **24 Core:** `#00FF00` (Hijau)
* **Default:** `#00AAFF` (Biru Langit - jika core tidak dikenali)

---

## ⚠️ Troubleshooting

1.  **Item masuk ke folder "JOINT CLOSURE" padahal bukan JC?**
    * Cek apakah di *Nama* atau *Deskripsi* item tersebut ada angka kapasitas (misal "48C"). Di mode Subfeeder, angka kapasitas dianggap sebagai titik sambung (Splice) dan dimasukkan ke folder Joint Closure.

2.  **Kabel masuk ke folder Joint Closure?**
    * Pastikan penamaan kabel mengandung kata **"CABLE"** atau format lengkap **"XXC/XXT"** agar diprioritaskan masuk ke folder CABLE.

3.  **Warna Tiang salah di Subfeeder?**
    * Pastikan Anda sudah memilih **SUBFEEDER MODE** sebelum upload. Mode Cluster menggunakan warna-warni, sedangkan Subfeeder menggunakan standar satu warna (Coklat).
