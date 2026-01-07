import { RULES_CLUSTER, RULES_SUBFEEDER, TEXT_SIZE } from './config.js';

export function applyStyles(xmlDoc, mode) {
    const placemarks = xmlDoc.querySelectorAll('Placemark');
    const doc = xmlDoc.querySelector('Document');
    const stylesCreated = new Set();
    
    // Style default untuk Boundary Cluster (Pagar Putih)
    const styleB = xmlDoc.createElement('Style'); styleB.id = 'style_boundary';
    styleB.innerHTML = `<LineStyle><color>4dffffff</color><width>2</width></LineStyle><PolyStyle><color>4dffffff</color></PolyStyle>`;
    doc.appendChild(styleB);

    placemarks.forEach(pm => {
        const name = (pm.querySelector('name')?.textContent || '').toUpperCase();
        const desc = (pm.querySelector('description')?.textContent || '').toUpperCase();
        const fullText = name + ' ' + desc;
        const folderName = pm.parentElement.querySelector('name')?.textContent || '';
        const grandParentName = pm.parentElement.parentElement?.querySelector('name')?.textContent || '';

        if (folderName.includes('BOUNDARY CLUSTER')) { setStyle(pm, 'style_boundary'); return; }
        
        let rule = null;

        // --- 1. CARI RULE (Sama seperti V17) ---
        if (mode === 'cluster') {
            rule = RULES_CLUSTER.find(r => {
                if (r.folder !== '-' && r.folder === folderName) return true;
                if (folderName === 'DISTRIBUTION CABLE' && r.line !== '-' && fullText.includes(r.line)) return true;
                if (r.placemark !== '-' && fullText.includes(r.placemark)) return true;
                return false;
            });
            if (!rule) {
                if (grandParentName.includes('HP COVER') || folderName.includes('HP COVER')) rule = RULES_CLUSTER.find(r => r.folder === 'HP COVER');
                else if (grandParentName.includes('HP UNCOVER') || folderName.includes('HP UNCOVER')) rule = RULES_CLUSTER.find(r => r.folder === 'HP UNCOVER');
            }
        } else {
            // Logic Subfeeder (Sama seperti V17)
            if (folderName === 'CABLE') {
                const coreColors = { '288C': '#FFAA00', '144C': '#AAFF00', '96C': '#FF0000', '48C': '#AA00FF', '24C': '#00FF00' };
                const match = Object.keys(coreColors).find(k => fullText.includes(k));
                rule = { colorCode: match ? coreColors[match] : '#00AAFF', styleLink: '-', placemark: '-' };
            }
            else if (folderName === 'FDT') {
                const coreMatch = fullText.match(/\b(\d+)C\b/);
                const core = coreMatch ? coreMatch[0] : '48C';
                const coreMap = { '288C': '#FFAA00', '144C': '#AAFF00', '96C': '#FF0000', '72C': '#0000FF', '48C': '#AA00FF', '36C': '#FF00FF', '24C': '#00FF00' };
                const color = coreMap[core] || '#AA00FF';
                rule = { colorCode: color, styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png', placemark: 'FDT_' + core };
            }
            else if (folderName === 'JOINT CLOSURE') {
                const coreMatch = fullText.match(/\b(\d+)C\b/);
                const core = coreMatch ? coreMatch[0] : '48C';
                const coreMap = { '288C': '#FFAA00', '144C': '#AAFF00', '96C': '#FF0000', '72C': '#0000FF', '48C': '#AA00FF', '36C': '#FF00FF', '24C': '#00FF00' };
                const color = coreMap[core] || '#AA00FF';
                rule = { colorCode: color, styleLink: 'http://maps.google.com/mapfiles/kml/shapes/forbidden.png', placemark: 'JC_' + core };
            }
            else if (folderName.includes('POLE')) {
                let pColor = '#550000';
                const upperFolder = folderName.toUpperCase();
                if (upperFolder.includes('NEW')) {
                    if (upperFolder.includes('9-')) pColor = '#FF0000';
                    else if (upperFolder.includes('7-5') || upperFolder.includes('7-4')) pColor = '#00FF00';
                    else if (upperFolder.includes('7-3')) pColor = '#00FFFF';
                    else if (upperFolder.includes('7-2.5')) pColor = '#AA00FF';
                }
                rule = { colorCode: pColor, styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png', placemark: '-' };
            }
            else {
                rule = RULES_SUBFEEDER.find(r => r.folder === folderName);
            }
        }

        if (rule) {
            // --- 2. CUSTOM SIZE CONFIG (Area Hardcode Di Sini) ---
            let iconScale = 1.1; // Ukuran Default Icon
            let lineWidth = 2;   // Ukuran Default Garis

            // A. Khusus HP COVER & UNCOVER (Ubah ukuran Icon)
            if (folderName.includes('HP COVER') || folderName.includes('HP UNCOVER') || grandParentName.includes('HP ')) {
                iconScale = 0.6; // <--- GANTI ANGKA INI (Makin kecil makin imut)
            }

            // B. Khusus LINE/KABEL TERTENTU (Ubah tebal Garis)
            // Note: Tambahkan 'SLING WIRE', 'DISTRIBUTION CABLE', 'BOUNDARY FAT'
            if (folderName === 'BOUNDARY FAT' || folderName === 'DISTRIBUTION CABLE' || folderName === 'SLING WIRE') {
                
                if (folderName === 'BOUNDARY FAT') lineWidth = 3;       // Tebal garis Boundary
                if (folderName === 'DISTRIBUTION CABLE') lineWidth = 4; // Tebal kabel Distribusi
                if (folderName === 'SLING WIRE') lineWidth = 4;         // Tebal Sling Wire (tipis aja)
            }

            // --- 3. BUAT ID STYLE UNIK ---
            // Kita tambahkan scale dan width ke ID supaya tidak bentrok dengan style default
            const safeName = rule.placemark !== '-' ? rule.placemark : folderName;
            const styleId = `style_${rule.colorCode.replace('#','')}_${safeName.replace(/[^a-z0-9]/gi,'')}_S${iconScale}_W${lineWidth}`;

            if (!stylesCreated.has(styleId)) {
                const style = xmlDoc.createElement('Style'); style.id = styleId;
                const kmlColor = 'ff' + rule.colorCode.replace('#', '').match(/.{2}/g).reverse().join('');
                
                let styleContent = `<LabelStyle><color>${kmlColor}</color><scale>${TEXT_SIZE}</scale></LabelStyle>`;
                
                // Terapkan Icon Scale Custom
                if (rule.styleLink !== '-') {
                    styleContent += `<IconStyle><color>${kmlColor}</color><scale>${iconScale}</scale><Icon><href>${rule.styleLink}</href></Icon></IconStyle>`;
                }
                
                // Terapkan Line Width Custom
                styleContent += `<LineStyle><color>${kmlColor}</color><width>${lineWidth}</width></LineStyle><PolyStyle><color>66${kmlColor.substring(2)}</color></PolyStyle>`;
                
                style.innerHTML = styleContent;
                doc.appendChild(style);
                stylesCreated.add(styleId);
            }
            setStyle(pm, styleId);
        }
    });
}

function setStyle(pm, id) {
    let oldUrl = pm.querySelector('styleUrl');
    if(oldUrl) oldUrl.remove();

    let url = pm.ownerDocument.createElement('styleUrl'); 
    url.textContent = '#' + id;
    pm.appendChild(url);
}

