import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { parseStringPromise, Builder } from 'xml2js';
import Papa from 'papaparse';
import { applyStyling } from '@/lib/style-logic';
import { StyleRule } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const kmzFile = formData.get('kmz') as File;
    const csvString = formData.get('csv') as string;

    if (!kmzFile || !csvString) {
      return NextResponse.json({ error: 'Missing files' }, { status: 400 });
    }

    // 1. Parse CSV
    const csvParsed = Papa.parse<StyleRule>(csvString, { 
      header: true, 
      skipEmptyLines: true,
      transformHeader: (h) => {
        // Mapping header CSV "FOLDER" -> "folderName" biar rapi
        const map: Record<string, string> = {
          'FOLDER': 'folderName',
          'COLOR CODE': 'colorCode',
          'STYLE LINK': 'styleLink'
        };
        return map[h.toUpperCase()] || h;
      }
    });
    const rules = csvParsed.data;

    // 2. Handle KMZ Zip
    const arrayBuffer = await kmzFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const zip = new AdmZip(buffer);
    
    // Cari file .kml di dalam zip
    const zipEntries = zip.getEntries();
    const kmlEntry = zipEntries.find(e => e.entryName.endsWith('.kml'));

    if (!kmlEntry) {
      throw new Error('No .kml file found inside KMZ');
    }

    // 3. Parse XML Content
    const kmlContent = zip.readAsText(kmlEntry);
    const kmlJson = await parseStringPromise(kmlContent);

    // 4. Jalankan Logic Styling
    const { processedKml, logs } = applyStyling(kmlJson, rules);

    // 5. Build ulang XML & Update Zip
    const builder = new Builder();
    const newKmlContent = builder.buildObject(processedKml);
    
    zip.updateFile(kmlEntry.entryName, Buffer.from(newKmlContent));
    
    const newZipBuffer = zip.toBuffer();

    // 6. Return Data
    const previewStructure = processedKml.kml.Document[0].Folder?.map((f: any) => ({
      name: f.name[0],
      itemCount: f.Placemark?.length || 0
    })) || [];

    return NextResponse.json({
      success: true,
      logs: logs,
      previewStructure: previewStructure,
      downloadData: newZipBuffer.toString('base64')
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}