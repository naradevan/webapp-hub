// Tipe data untuk baris konfigurasi dari CSV
export interface StyleRule {
  folderName: string;       // Sesuai kolom FOLDER
  placemarkName?: string;   // Sesuai kolom PLACEMARK
  lineName?: string;        // Sesuai kolom LINE
  polygonName?: string;     // Sesuai kolom POLYGON
  colorCode?: string;       // Sesuai kolom COLOR CODE
  styleLink?: string;       // Sesuai kolom STYLE LINK
}

// Tipe data untuk Live Preview struktur folder di Frontend
export interface FolderStructure {
  name: string;
  itemCount: number;
}

// Tipe data untuk respon API (Opsional, biar rapi)
export interface ProcessResponse {
  success: boolean;
  logs: string[];
  previewStructure?: FolderStructure[];
  downloadData?: string; // String Base64 dari file KMZ baru
  error?: string;
}