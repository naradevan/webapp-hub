import { restructureKML, organizeHpByBoundary, autoRepositionPoints, injectDescriptionsAndCalc } from './core.js';
import { applyStyles } from './styler.js';
import { generateHPDB } from './hpdb.js';
import { STRUCTURE_SUBFEEDER } from './config.js';

// --- STATE ---
let CURRENT_MODE = 'cluster'; 
let kmzFile = null;
let processedKMZ = null;
let processedHPDB = null;

// --- ELEMENTS ---
const kmzInput = document.getElementById('kmzFile');
const processBtn = document.getElementById('processBtn');
const statusDiv = document.getElementById('status');
const fileLabel = document.getElementById('fileLabel');
const dropArea = document.getElementById('dropArea');
const btnCluster = document.getElementById('btn-cluster');
const btnSubfeeder = document.getElementById('btn-subfeeder');

// --- MODE SELECTION ---
function setMode(mode) {
    CURRENT_MODE = mode;
    document.querySelectorAll('.mode-option').forEach(el => el.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');
}

btnCluster.addEventListener('click', () => setMode('cluster'));
btnSubfeeder.addEventListener('click', () => setMode('subfeeder'));

// --- FILE HANDLING ---
dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('active'); });
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('active'));
dropArea.addEventListener('drop', (e) => { e.preventDefault(); dropArea.classList.remove('active'); if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); });
kmzInput.addEventListener('change', (e) => { if (e.target.files.length) handleFile(e.target.files[0]); });

function handleFile(file) {
    if(!file.name.toLowerCase().endsWith('.kmz') && !file.name.toLowerCase().endsWith('.kml')) { alert('File harus .KMZ atau .KML'); return; }
    kmzFile = file;
    fileLabel.textContent = `${file.name} (${(file.size/1024).toFixed(1)} KB)`;
    fileLabel.style.color = 'var(--primary)';
    processBtn.disabled = false;
}

// --- MAIN PROCESS ---
processBtn.addEventListener('click', async () => {
    if (!kmzFile) return;
    processBtn.disabled = true;
    statusDiv.innerHTML = '<span class="loading-spinner"></span>Processing...';

    try {
        let xmlDoc;
        if (kmzFile.name.toLowerCase().endsWith('.kmz')) {
            const zip = new JSZip();
            const contents = await zip.loadAsync(kmzFile);
            const kmlName = Object.keys(contents.files).find(n => n.endsWith('.kml'));
            const kmlString = await contents.files[kmlName].async('string');
            xmlDoc = new DOMParser().parseFromString(kmlString, 'text/xml');
        } else {
            const kmlString = await kmzFile.text();
            xmlDoc = new DOMParser().parseFromString(kmlString, 'text/xml');
        }

        // 1. Core Logic
        const tree = restructureKML(xmlDoc, CURRENT_MODE);
        
        if (CURRENT_MODE === 'cluster') {
            organizeHpByBoundary(xmlDoc);
            autoRepositionPoints(xmlDoc);
        }

        // Ambil status checkbox (true/false)
        const enableCalc = document.getElementById('calcOption').checked;

        // 2. Styling & Calc
        applyStyles(xmlDoc, CURRENT_MODE);
        
        // Kirim parameter enableCalc ke fungsi core
        injectDescriptionsAndCalc(xmlDoc, CURRENT_MODE, enableCalc)
        
        // 3. UI Update
        displayTree(tree);

        // 4. Generate Outputs
        if (CURRENT_MODE === 'cluster') {
            processedHPDB = generateHPDB(xmlDoc, tree.rootName);
        }

        const serializer = new XMLSerializer();
        const newKml = serializer.serializeToString(xmlDoc);
        const zipOut = new JSZip();
        zipOut.file("doc.kml", newKml);
        processedKMZ = await zipOut.generateAsync({ type: 'blob' });

        // 5. Create Buttons
        statusDiv.innerHTML = '<span style="color:var(--success)">✅ Done!</span>';
        
        const dlBtn = document.createElement('button');
        dlBtn.className = 'success';
        dlBtn.textContent = `Download KMZ Result`;
        dlBtn.onclick = () => {
            const url = URL.createObjectURL(processedKMZ);
            const a = document.createElement('a');
            a.href = url;
            a.download = `STYLED_${CURRENT_MODE.toUpperCase()}_${kmzFile.name.replace(/\.kml$/i, '.kmz')}`;
            a.click();
        };

        const btnGroup = document.querySelector('.btn-group');
        const oldBtns = btnGroup.querySelectorAll('.success');
        oldBtns.forEach(b => b.remove());
        btnGroup.appendChild(dlBtn);

        if (processedHPDB) {
            const csvBtn = document.createElement('button');
            csvBtn.className = 'success';
            csvBtn.style.background = '#8b5cf6';
            csvBtn.textContent = `Download HPDB Result (CSV)`;
            csvBtn.onclick = () => {
                const blob = new Blob([processedHPDB], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HPDB_${kmzFile.name.replace(/\.k?mz|\.kml/i, '')}.csv`;
                a.click();
            };
            btnGroup.appendChild(csvBtn);
        }

    } catch (err) {
        statusDiv.innerHTML = `<span style="color:var(--error)">Error: ${err.message}</span>`;
        console.error(err);
    } finally {
        processBtn.disabled = false;
    }
});

document.getElementById('resetBtn').addEventListener('click', () => location.reload());

// --- UI HELPER ---
function displayTree(result) {
    const list = document.getElementById('folderList');
    const mode = result.mode;
    let html = `<div class="tree-item"><span class="tree-folder" style="color:#aaa">BOUNDARY CLUSTER</span></div>`;
    if (result.lines.includes('FDT') || mode === 'cluster') html += `<div class="tree-item"><span class="tree-folder">FDT</span></div>`;
    
    html += `<div class="tree-item"><span class="tree-folder" style="color:#fff; border-bottom:1px solid #333; display:inline-block; margin-bottom:5px;">ROOT: ${result.rootName}</span></div>`;
    
    if (mode === 'subfeeder') {
        STRUCTURE_SUBFEEDER.forEach(f => { html += `<div class="tree-item" style="margin-left:20px; font-size:0.9em; color:#888">${f}</div>`; });
    } else {
        result.lines.forEach(l => { 
            if (l !== 'FDT' && l !== 'MAIN') {
                html += `<div class="tree-item"><span class="tree-folder">${l}</span></div>`; 
            }
        });
    }
    
    list.innerHTML = html;
    document.getElementById('preview').classList.remove('hidden');
}

// --- README MODAL LOGIC (Global Export needed for HTML onclick) ---
let readmeLoaded = false;
window.openReadme = async function() {
    toggleModal(true);
    if (readmeLoaded) return;
    const container = document.getElementById('mdContainer');
    try {
        const response = await fetch('README.md');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const markdownText = await response.text();
        container.innerHTML = marked.parse(markdownText);
        readmeLoaded = true;
    } catch (error) {
        console.error("Gagal load README:", error);
        container.innerHTML = `
            <div style="text-align:center; color: var(--error); padding: 20px;">
                <p><strong>Gagal memuat dokumentasi.</strong></p>
                <p style="font-size:0.9em; color:#888;">Pastikan file <code>README.md</code> ada.</p>
                <p style="font-size:0.8em; margin-top:10px;">Error: ${error.message}</p>
            </div>
        `;
    }
}

function toggleModal(show) {
    const modal = document.getElementById('readmeModal');
    if (show) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; } 
    else { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

document.getElementById('closeModalBtn').addEventListener('click', () => toggleModal(false));
document.getElementById('readmeModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('readmeModal')) toggleModal(false);
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleModal(false); });
