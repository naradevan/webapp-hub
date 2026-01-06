import { haversine } from './utils.js';

export function generateHPDB(xmlDoc, rootNameRaw) {
    const headers = [
        'Pole ID', 'Pole Latitude', 'Pole Longitude', 'FAT Address', 'Province', 
        'regency_city', 'district', 'subdistrict', 'postalcode', 'Roll_Out_ID', 
        'acquisition_class', 'acquisition_tier', 'competition', 'project_id', 'Area', 
        'Complex_name', 'Clustername', 'Commercial_name', 'Rw', 'Rt', 'address_prefix', 
        'street', 'address_suffix', 'sub_address_prefix', 'sub_address', 'sub_address_suffix', 
        'block', 'homenumber', 'dwelling_type', 'building_type', 'building_property_name', 
        'building_property_location', 'floor', 'unit', 'homepass_source', 'oltcode', 
        'fdtcode', 'fatcode', 'RFSDate', 'Latitude_homepass', 'Longitude_homepass', 'residential_service_ready'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    const rootFolder = Array.from(xmlDoc.querySelectorAll('Folder')).find(f => {
        const n = f.querySelector('name');
        return n && n.textContent === rootNameRaw;
    });

    if (!rootFolder) return csvContent; 

    const lineFolders = Array.from(rootFolder.children).filter(child => child.tagName === 'Folder' && child.querySelector('name')?.textContent !== 'OTHERS' && child.querySelector('name')?.textContent !== 'FDT');

    lineFolders.forEach(lineFolder => {
        const lineName = lineFolder.querySelector('name').textContent.trim(); 

        const fatFolder = Array.from(lineFolder.children).find(c => c.tagName === 'Folder' && c.querySelector('name')?.textContent === 'FAT');
        const localFatPoints = [];
        if (fatFolder) {
            fatFolder.querySelectorAll('Placemark').forEach(pm => {
                const pt = pm.querySelector('Point coordinates');
                if(pt) {
                    const name = pm.querySelector('name')?.textContent.trim() || 'FAT';
                    const [lon, lat] = pt.textContent.trim().split(',').map(Number);
                    localFatPoints.push({ name, lon, lat });
                }
            });
        }

        const localPolePoints = [];
        const subFolders = Array.from(lineFolder.querySelectorAll('Folder'));
        subFolders.forEach(f => {
            const n = f.querySelector('name')?.textContent.trim().toUpperCase() || '';
            if (n.includes('POLE') || n.includes('TIANG')) {
                f.querySelectorAll('Placemark').forEach(pm => {
                    const pt = pm.querySelector('Point coordinates');
                    if(pt) {
                        const name = pm.querySelector('name')?.textContent.trim() || 'Unknown';
                        const [lon, lat] = pt.textContent.trim().split(',').map(Number);
                        localPolePoints.push({ name, lon, lat });
                    }
                });
            }
        });

        const hpCoverFolder = Array.from(lineFolder.children).find(c => c.tagName === 'Folder' && c.querySelector('name')?.textContent === 'HP COVER');
        if (hpCoverFolder) {
            const fatSubFolders = Array.from(hpCoverFolder.querySelectorAll('Folder')); 
            
            fatSubFolders.forEach(sub => {
                const subName = sub.querySelector('name').textContent.trim(); 
                const fatCode = subName.slice(-3); 
                
                let anchorFat = localFatPoints.find(f => f.name.toUpperCase().includes(fatCode.toUpperCase()));
                
                let anchorPole = { name: '', lon: '', lat: '' };
                if (anchorFat && localPolePoints.length > 0) {
                    const exactMatch = localPolePoints.find(p => haversine(p, anchorFat) < 0.5);
                    if (exactMatch) { anchorPole = exactMatch; } 
                    else { anchorPole = localPolePoints.sort((a, b) => haversine(a, anchorFat) - haversine(b, anchorFat))[0]; }
                }

                sub.querySelectorAll('Placemark').forEach(hp => {
                    const pt = hp.querySelector('Point coordinates');
                    if (pt) {
                        const hpName = hp.querySelector('name')?.textContent.trim() || '';
                        const [hpLon, hpLat] = pt.textContent.trim().split(',').map(Number);
                        const row = [
                            `"${anchorPole.name}"`, anchorPole.lat, anchorPole.lon, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 
                            'JLN.', '', '', '', '', '', '', `"${hpName}"`, '', '', '', '', '', '', '', '', '', 
                            `"${lineName}"`, `"${fatCode}"`, '', hpLat, hpLon, ''
                        ];
                        csvContent += row.join(',') + '\n';
                    }
                });
            });
        }
    });

    return csvContent;
}