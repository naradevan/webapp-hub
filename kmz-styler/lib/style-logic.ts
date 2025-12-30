import { StyleRule } from './types';

export function applyStyling(kmlObj: any, rules: StyleRule[]) {
  const logs: string[] = [];
  
  // 1. Ambil Root Document
  const doc = kmlObj.kml.Document?.[0];
  if (!doc) {
    logs.push("Error: Invalid KML Structure (No Document found).");
    return { processedKml: kmlObj, logs };
  }

  // Helper find rule
  const findRule = (name: string) => rules.find(r => r.folderName === name);

  // 2. Iterasi Folder Existing
  if (doc.Folder) {
    doc.Folder.forEach((folder: any) => {
      const folderName = folder.name?.[0];
      const rule = findRule(folderName);

      if (rule) {
        logs.push(`Processing Folder: ${folderName}`);
        
        // Apply Style ke Placemarks
        if (folder.Placemark) {
          folder.Placemark.forEach((pm: any) => {
            // Apply StyleURL (Icon)
            if (rule.styleLink) {
              pm.styleUrl = [rule.styleLink];
            }
            // Disini bisa ditambah logic colorCode jika perlu inject InlineStyle
          });
        }
      } else {
        logs.push(`Warning: Folder '${folderName}' tidak ditemukan di CSV.`);
      }
    });
  }

  // 3. Logic Buat Folder Baru (Jika ada di CSV tapi belum ada di KML)
  rules.forEach(rule => {
    const existingFolder = doc.Folder?.find((f: any) => f.name?.[0] === rule.folderName);
    
    if (!existingFolder) {
      logs.push(`Action: Membuat folder baru '${rule.folderName}'`);
      if (!doc.Folder) doc.Folder = [];
      
      doc.Folder.push({
        name: [rule.folderName],
        open: ['1'],
        Placemark: [] // Folder kosong
      });
    }
  });

  return { processedKml: kmlObj, logs };
}