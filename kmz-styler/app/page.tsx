'use client';

import { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, FileText, Loader2, FileDown } from 'lucide-react';
import { FolderStructure } from '@/lib/types';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [preview, setPreview] = useState<FolderStructure[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);

  const handleProcess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setLogs([]);
    setProcessedFile(null);
    setPreview([]);

    const formData = new FormData(e.currentTarget);
    const csvFile = formData.get('csv_file') as File;
    
    if(csvFile) {
        const text = await csvFile.text();
        formData.append('csv', text);
    }

    try {
      const res = await fetch('/api/process', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setLogs(data.logs);
        setPreview(data.previewStructure);
        setProcessedFile(data.downloadData);
      } else {
        setLogs(['Critical Error: ' + data.error]);
      }
    } catch (err) {
      setLogs(['Network Error.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;
    const link = document.createElement('a');
    link.href = `data:application/vnd.google-earth.kmz;base64,${processedFile}`;
    link.download = 'styled_output.kmz';
    link.click();
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* --- HEADER BARU DENGAN TOMBOL DOWNLOAD --- */}
        <header className="border-b border-zinc-200 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">KMZ Styler</h1>
              <p className="text-zinc-500 mt-1">Minimalist Automated Styling Utility</p>
            </div>
            
            <div className="flex gap-3">
              <a 
                href="/template_structure.kmz" 
                download
                className="text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-2 rounded-md flex items-center gap-2 transition border border-zinc-200"
              >
                <FileDown className="w-3 h-3" />
                Template KMZ
              </a>
              <a 
                href="/template_rules.csv" 
                download
                className="text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-2 rounded-md flex items-center gap-2 transition border border-zinc-200"
              >
                <FileDown className="w-3 h-3" />
                Template CSV
              </a>
            </div>
          </div>
        </header>
        {/* ------------------------------------------ */}

        <form onSubmit={handleProcess} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group border-2 border-zinc-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center hover:border-zinc-400 hover:bg-zinc-100 transition cursor-pointer relative">
            <input name="kmz" type="file" accept=".kmz" required className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload className="w-10 h-10 mb-3 text-zinc-400 group-hover:text-zinc-600" />
            <span className="text-sm font-medium">Upload KMZ File</span>
          </div>

          <div className="group border-2 border-zinc-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center hover:border-zinc-400 hover:bg-zinc-100 transition cursor-pointer relative">
            <input name="csv_file" type="file" accept=".csv" required className="absolute inset-0 opacity-0 cursor-pointer" />
            <FileText className="w-10 h-10 mb-3 text-zinc-400 group-hover:text-zinc-600" />
            <span className="text-sm font-medium">Upload CSV Config</span>
          </div>
          
          <div className="md:col-span-2">
            <button 
              disabled={isProcessing}
              type="submit" 
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isProcessing ? 'Processing...' : 'Run Validation & Style'}
            </button>
          </div>
        </form>

        {(preview.length > 0 || logs.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-zinc-200 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Live Preview
              </h2>
              <ul className="space-y-2 text-sm font-mono max-h-60 overflow-y-auto">
                {preview.map((f, i) => (
                  <li key={i} className="flex justify-between border-b border-zinc-100 pb-1 last:border-0">
                    <span>📁 {f.name}</span>
                    <span className="text-zinc-400">{f.itemCount} items</span>
                  </li>
                ))}
                {preview.length === 0 && <li className="text-zinc-400 italic">No folder structure found.</li>}
              </ul>
            </div>

            <div className="bg-zinc-900 text-zinc-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> System Logs
              </h2>
              <div className="text-xs font-mono max-h-60 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={log.includes('Error') ? 'text-red-400' : log.includes('Action') ? 'text-blue-400' : 'text-zinc-400'}>
                    <span className="opacity-50 mr-2">{i+1}.</span>{log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {processedFile && (
          <div className="flex justify-center pt-4">
            <button 
              onClick={downloadFile}
              className="flex items-center gap-2 bg-white border-2 border-zinc-900 text-zinc-900 px-8 py-3 rounded-xl font-bold hover:bg-zinc-50 transition shadow-lg"
            >
              <Download className="w-5 h-5" /> Download Result
            </button>
          </div>
        )}
      </div>
    </main>
  );
}