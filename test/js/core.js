import { haversine, isPointInPolygon, getMinDistToCables, calculateLineLength, createName, createFolder } from './utils.js';
import { STRUCTURE_CLUSTER, STRUCTURE_SUBFEEDER, SNAP_TOLERANCE_METERS } from './config.js';

// --- MAIN RESTRUCTURE LOGIC ---
export function restructureKML(xmlDoc, mode) {
    const kmlDoc = xmlDoc.querySelector('Document');
    const targetStructure = (mode === 'subfeeder') ? STRUCTURE_SUBFEEDER : STRUCTURE_CLUSTER;

    let boundaryClusterNode = null;
    const allFolders = Array.from(xmlDoc.querySelectorAll('Folder'));
    const boundaryOriginal = allFolders.find(f => f.querySelector('name')?.textContent?.toUpperCase().includes('BOUNDARY CLUSTER'));
    
    let detectedRootName = (mode === 'subfeeder') ? 'SUBFEEDER ID' : 'CLUSTER ID';
    if (boundaryOriginal && boundaryOriginal.parentElement && boundaryOriginal.parentElement.tagName === 'Folder') {
        detectedRootName = boundaryOriginal.parentElement.querySelector('name').textContent.trim();
    } else {
        const fdtOriginal = allFolders.find(f => f.querySelector('name')?.textContent?.trim() === 'FDT');
        if (fdtOriginal && fdtOriginal.parentElement && fdtOriginal.parentElement.tagName === 'Folder') {
            detectedRootName = fdtOriginal.parentElement.querySelector('name').textContent.trim();
        }
    }

    if (boundaryOriginal) boundaryClusterNode = boundaryOriginal.cloneNode(true);

    const allPlacemarks = Array.from(xmlDoc.querySelectorAll('Placemark')).filter(pm => {
        if (boundaryOriginal && boundaryOriginal.contains(pm)) return false;
        return true;
    });

    const fdtBucket = []; 
    const lineBuckets = {}; 
    const othersBucket = [];

    const addToLineBucket = (lineName, folderName, item) => {
        if (!lineBuckets[lineName]) lineBuckets[lineName] = {};
        if (!lineBuckets[lineName][folderName]) lineBuckets[lineName][folderName] = { 'MAIN': [] };
        lineBuckets[lineName][folderName]['MAIN'].push(item);
    };

    const strictCableRegex = /\b\d{2,3}C\/\d{1,2}T\b/i;

    allPlacemarks.forEach(pm => {
        // Clean old style
        const internalStyle = pm.querySelector('Style');
        if(internalStyle) internalStyle.remove();

        const name = (pm.querySelector('name')?.textContent || '').toUpperCase();
        let desc = (pm.querySelector('description')?.textContent || '').toUpperCase();
        const parentFolder = pm.parentElement;
        const parentName = (parentFolder.querySelector('name')?.textContent || '').toUpperCase().trim();
        const grandParentName = (parentFolder.parentElement?.querySelector('name')?.textContent || '').toUpperCase().trim();
        const fullText = name + ' ' + desc;
        const isLine = pm.querySelector('LineString') !== null;
        
        let lineName = 'MAIN';
        if (mode === 'cluster') {
            lineName = determineLineName(pm, detectedRootName, targetStructure);
        }

        let targetType = 'UNKNOWN';
        if (parentName.includes('HP COVER')) { targetType = 'HP COVER'; } 
        else if (parentName.includes('HP UNCOVER')) targetType = 'HP UNCOVER';
        else if (grandParentName.includes('HP COVER')) { targetType = 'HP COVER'; } 
        else if (grandParentName.includes('HP UNCOVER')) { targetType = 'HP UNCOVER'; } 
        
        if (targetType === 'UNKNOWN') {
            if (mode === 'subfeeder') {
                 if (isLine && (strictCableRegex.test(fullText) || name.includes('CABLE'))) targetType = 'CABLE';
                 else if (!isLine && name.includes('JC')) targetType = 'JOINT CLOSURE';
                 else if (/\b(288C|144C|96C|72C|48C)\b/.test(fullText)) targetType = 'FDT';
                 if (targetType === 'UNKNOWN') {
                     const poleMatch = targetStructure.find(type => type.includes('POLE') && (name.includes(type) || parentName.includes(type)));
                     if (poleMatch) targetType = poleMatch;
                 }
            } else {
                if (!isLine && (name.includes('FDT') || parentName.includes('FDT'))) targetType = 'FDT_GLOBAL';
                else if (isLine && (strictCableRegex.test(fullText) || name.includes('CABLE') || parentName.includes('DISTRIBUTION'))) targetType = 'DISTRIBUTION CABLE';
                else {
                     const match = targetStructure.find(type => name.includes(type) || parentName.includes(type));
                     if (match) targetType = match;
                }
            }
        }

        if (targetType === 'UNKNOWN') {
            if (name.includes('SLING')) targetType = (mode === 'subfeeder') ? 'UNKNOWN' : 'SLING WIRE';
            else if (name.includes('SLACK') || parentName.includes('SLACK')) targetType = 'SLACK HANGER';
            else {
                const match = targetStructure.find(type => name.includes(type) || parentName.includes(type));
                if(match) targetType = match;
            }
        }

        const PRESERVE_DESC = ['BOUNDARY FAT', 'DISTRIBUTION CABLE', 'FDT', 'CABLE', 'FDT_GLOBAL'];
        if (!PRESERVE_DESC.includes(targetType)) {
            const descTag = pm.querySelector('description');
            if (descTag) descTag.remove();
        }

        pm.remove();
        if (targetType === 'FDT_GLOBAL' && mode === 'cluster') fdtBucket.push(pm);
        else if (targetType !== 'UNKNOWN') addToLineBucket(lineName, targetType, pm);
        else othersBucket.push(pm);
    });

    // Execute Auto Slack (Unique Priority)
    if (mode === 'cluster') {
        generateAutoSlack(lineBuckets, fdtBucket);
    }

    // Rebuild DOM
    while (kmlDoc.firstChild) kmlDoc.removeChild(kmlDoc.firstChild);
    const root = xmlDoc.createElement('Folder');
    root.appendChild(createName(xmlDoc, detectedRootName)); 

    if (boundaryClusterNode) root.appendChild(boundaryClusterNode);
    if (fdtBucket.length > 0) root.appendChild(createFolder(xmlDoc, 'FDT', fdtBucket));

    if (mode === 'subfeeder') {
        const mainData = lineBuckets['MAIN'] || {};
        targetStructure.forEach(folderName => {
             const subData = mainData[folderName];
             if (subData) {
                 const folder = xmlDoc.createElement('Folder');
                 folder.appendChild(createName(xmlDoc, folderName));
                 if (subData['MAIN']) subData['MAIN'].forEach(i => folder.appendChild(i));
                 root.appendChild(folder);
             } else { root.appendChild(createFolder(xmlDoc, folderName, [])); }
        });
    } else {
        Object.keys(lineBuckets).sort().forEach(ln => {
            let targetContainer = root;
            if (ln !== 'MAIN') {
                const lnFolder = xmlDoc.createElement('Folder');
                lnFolder.appendChild(createName(xmlDoc, ln));
                root.appendChild(lnFolder);
                targetContainer = lnFolder;
            }
            targetStructure.forEach(folderName => {
                const subData = lineBuckets[ln][folderName];
                if (subData) {
                    const folder = xmlDoc.createElement('Folder');
                    folder.appendChild(createName(xmlDoc, folderName));
                    if (subData['MAIN']) subData['MAIN'].forEach(i => folder.appendChild(i));
                    targetContainer.appendChild(folder);
                } else { targetContainer.appendChild(createFolder(xmlDoc, folderName, [])); }
            });
        });
    }
    if (othersBucket.length > 0) root.appendChild(createFolder(xmlDoc, 'OTHERS', othersBucket));
    kmlDoc.appendChild(root);
    return { mode: mode, lines: Object.keys(lineBuckets), rootName: detectedRootName };
}

// --- HELPER LOGIC ---
function determineLineName(pm, rootName, structureList) {
    let curr = pm.parentElement;
    let foundLine = null;
    while (curr && curr.tagName === 'Folder') {
        const name = curr.querySelector('name')?.textContent.trim() || '';
        if (name === rootName) break;
        const isStandard = structureList.includes(name) || name === 'FDT' || name === 'BOUNDARY CLUSTER' || name === 'OTHERS';
        if (!isStandard && name !== '') { foundLine = name; }
        curr = curr.parentElement;
    }
    return foundLine || 'MAIN';
}

export function generateAutoSlack(lineBuckets, fdtBucket) {
    const usedFDTs = new Set();
    const sortedLineKeys = Object.keys(lineBuckets).sort();

    for (const lineName of sortedLineKeys) {
        if (!lineBuckets[lineName]['SLACK HANGER']) lineBuckets[lineName]['SLACK HANGER'] = { 'MAIN': [] };
        
        if (lineBuckets[lineName]['SLACK HANGER']['MAIN'].length === 0) {
            // Copy FATs
            const fats = lineBuckets[lineName]['FAT'] ? lineBuckets[lineName]['FAT']['MAIN'] : [];
            fats.forEach(fat => {
                const clone = fat.cloneNode(true);
                const desc = clone.querySelector('description');
                if (desc) desc.remove();
                lineBuckets[lineName]['SLACK HANGER']['MAIN'].push(clone);
            });

            // Find Unique FDT
            if (fats.length > 0 && fdtBucket.length > 0) {
                const firstFatName = fats[0].querySelector('name')?.textContent.trim() || '';
                const matchKey = firstFatName.replace(/\.[A-Z0-9]+$/i, '').trim();

                if (matchKey.length > 3) { 
                    const matchedFDT = fdtBucket.find(fdt => {
                        const fName = fdt.querySelector('name')?.textContent || '';
                        return fName.includes(matchKey);
                    });

                    if (matchedFDT) {
                        const fdtID = matchedFDT.querySelector('name')?.textContent || matchKey;
                        if (!usedFDTs.has(fdtID)) {
                            const fdtClone = matchedFDT.cloneNode(true);
                            const desc = fdtClone.querySelector('description');
                            if (desc) desc.remove();
                            lineBuckets[lineName]['SLACK HANGER']['MAIN'].push(fdtClone);
                            usedFDTs.add(fdtID);
                        }
                    }
                }
            }
        }
    }
}

export function organizeHpByBoundary(xmlDoc) {
    const boundaryPlacemarks = [];
    const allFolders = Array.from(xmlDoc.querySelectorAll('Folder'));
    const boundaryFolders = allFolders.filter(f => f.querySelector('name')?.textContent.trim().toUpperCase() === 'BOUNDARY FAT');
    
    boundaryFolders.forEach(bf => {
        bf.querySelectorAll('Placemark').forEach(pm => {
            let coordsText = '';
            const polygon = pm.querySelector('Polygon outerBoundaryIs LinearRing coordinates');
            const lineString = pm.querySelector('LineString coordinates');
            if (polygon) coordsText = polygon.textContent;
            else if (lineString) coordsText = lineString.textContent;

            if (coordsText) {
                const coords = coordsText.trim().split(/\s+/).map(pair => {
                    const [lon, lat] = pair.split(',').map(Number);
                    return { lon, lat };
                });
                const bName = pm.querySelector('name')?.textContent.trim() || 'Unknown';
                boundaryPlacemarks.push({ name: bName, polygon: coords, hpCount: 0, element: pm });
            }
        });
    });

    if (boundaryPlacemarks.length === 0) return;

    const hpItems = [];
    allFolders.forEach(f => {
        const fName = f.querySelector('name')?.textContent.trim().toUpperCase() || '';
        if (fName === 'HP COVER') {
                f.querySelectorAll('Placemark').forEach(pm => {
                    const pt = pm.querySelector('Point coordinates');
                    if (pt) {
                        const [lon, lat] = pt.textContent.trim().split(',').map(Number);
                        hpItems.push({ lon, lat, element: pm, parentFolder: f });
                    }
                });
        }
    });

    hpItems.forEach(hp => {
        for (const b of boundaryPlacemarks) {
            if (isPointInPolygon(hp, b.polygon)) {
                b.hpCount++;
                let targetSub = Array.from(hp.parentFolder.children).find(c => c.tagName === 'Folder' && c.querySelector('name')?.textContent === b.name);
                if (!targetSub) {
                    targetSub = xmlDoc.createElement('Folder');
                    targetSub.appendChild(createName(xmlDoc, b.name));
                    hp.parentFolder.appendChild(targetSub);
                }
                targetSub.appendChild(hp.element);
                break; 
            }
        }
    });

    boundaryPlacemarks.forEach(b => {
        let d = b.element.querySelector('description');
        if (d) d.remove();
        d = xmlDoc.createElement('description');
        d.textContent = `${b.hpCount} HP`;
        b.element.appendChild(d);
    });
}

export function autoRepositionPoints(xmlDoc) {
    const anchors = []; 
    const movables = []; 

    const placemarks = xmlDoc.querySelectorAll('Placemark');
    placemarks.forEach(pm => {
        const name = (pm.querySelector('name')?.textContent || '').toUpperCase();
        const parentFolder = pm.parentElement.querySelector('name')?.textContent?.toUpperCase() || '';
        const pt = pm.querySelector('Point coordinates');
        
        if (pt) {
            const [lon, lat] = pt.textContent.trim().split(',').map(Number);
            const item = { element: pt, lon, lat, parent: parentFolder, name: name };

            if (parentFolder.includes('POLE') || name.includes('POLE') || name.includes('TIANG')) {
                anchors.push(item);
            } else if (parentFolder === 'FAT' || parentFolder === 'SLACK HANGER') {
                movables.push(item);
            }
        }
    });

    if (anchors.length === 0 || movables.length === 0) return;

    movables.forEach(mov => {
        let nearestAnchor = null;
        let minDst = Infinity;

        anchors.forEach(anc => {
            const d = haversine(mov, anc);
            if (d < minDst) {
                minDst = d;
                nearestAnchor = anc;
            }
        });

        if (nearestAnchor && minDst <= SNAP_TOLERANCE_METERS) {
            mov.element.textContent = `${nearestAnchor.lon},${nearestAnchor.lat},0`;
        }
    });
}

export function injectDescriptionsAndCalc(xmlDoc, mode) {
    const folders = xmlDoc.querySelectorAll('Folder');
    
    if (mode === 'subfeeder') {
        const cableFolders = Array.from(folders).filter(f => f.querySelector('name')?.textContent.trim() === 'CABLE');
        cableFolders.forEach(cableFolder => {
            const parentLine = cableFolder.parentElement;
            if (!parentLine) return;
            const siblings = Array.from(parentLine.children).filter(c => c.tagName === 'Folder');
            const fdtFolder = siblings.find(f => f.querySelector('name')?.textContent.trim() === 'FDT');
            const jcFolder = siblings.find(f => f.querySelector('name')?.textContent.trim() === 'JOINT CLOSURE');
            const a = fdtFolder ? fdtFolder.getElementsByTagName('Placemark').length : 0;
            const b = jcFolder ? jcFolder.getElementsByTagName('Placemark').length : 0;
            const y = a + b; const c = a + b; const d = y * 20;

            cableFolder.querySelectorAll('Placemark').forEach(pm => {
                const ls = pm.querySelector('LineString coordinates');
                if (ls) {
                    const x = calculateLineLength(ls.textContent);
                    const e = Math.ceil((x + d) * 1.05);
                    let descTag = pm.querySelector('description') || pm.appendChild(xmlDoc.createElement('description'));
                    descTag.textContent = `Deskripsi :\nTotal Route\t: ${x} m\nTotal Slack\t: ${y} unit (${a} FDT, ${b} JC, ${c} NEW) @20 m\nToleransi\t: 5%\nTotal Cable \t: ${x} + ${d} ( x 5%) = ${e} m`;
                    const nameTag = pm.querySelector('name');
                    if (nameTag) {
                        let oldName = nameTag.textContent.trim();
                        oldName = oldName.replace(/\s*-\s*\d+\s*m(eters)?$/i, '');
                        nameTag.textContent = `${oldName} - ${e} m`;
                    }
                }
            });
        });
    }

    if (mode === 'cluster') {
        folders.forEach(folder => {
            let folderName = folder.querySelector('name')?.textContent.trim().toUpperCase() || '';
            if (folderName === 'SLING WIRE') {
                let totalMeters = 0;
                folder.querySelectorAll('Placemark').forEach(pm => {
                    const ls = pm.querySelector('LineString coordinates');
                    if (ls) {
                        const len = calculateLineLength(ls.textContent);
                        totalMeters += len;
                        let nameTag = Array.from(pm.children).find(c => c.tagName === 'name');
                        if (!nameTag) { nameTag = xmlDoc.createElement('name'); pm.appendChild(nameTag); }
                        nameTag.textContent = `LineString — ${len} meters`;
                    }
                });
                if (totalMeters > 0) {
                    let descTag = Array.from(folder.children).find(c => c.tagName === 'description');
                    if (!descTag) { descTag = xmlDoc.createElement('description'); folder.appendChild(descTag); }
                    descTag.textContent = `${totalMeters} m`;
                }
            }
            else if (folderName === 'DISTRIBUTION CABLE') {
                let fatCount = 0;
                const parentFolder = folder.parentElement;
                if (parentFolder) {
                    const siblings = Array.from(parentFolder.children);
                    const fatFolder = siblings.find(el => el.tagName === 'Folder' && el.querySelector('name')?.textContent.trim() === 'FAT');
                    if (fatFolder) fatCount = fatFolder.getElementsByTagName('Placemark').length;
                }
                const b = 1; const c = fatCount; const a = b + c; const d = a * 20;
                folder.querySelectorAll('Placemark').forEach(pm => {
                    const ls = pm.querySelector('LineString coordinates');
                    if (ls) {
                        const x = calculateLineLength(ls.textContent);
                        const e = Math.ceil((x + d) * 1.05);
                        let nameTag = Array.from(pm.children).find(child => child.tagName === 'name');
                        if (nameTag) {
                            const oldName = nameTag.textContent.trim();
                            const regex = /(\d+)(\s*M)$/i;
                            if (regex.test(oldName)) { nameTag.textContent = oldName.replace(regex, e + "$2"); }
                        }
                        const descText = `Deskripsi :\n\nTotal Route \t : ${x} m\nTotal Slack\t : ${a} unit (${b} slack FDT & ${c} slack FAT) @20 m\nToleransi\t : 5%\n\n Total Length Cable  : ${x} + ${d} ( x 5%) = ${e} m`;
                        let descTag = Array.from(pm.children).find(child => child.tagName === 'description');
                        if (!descTag) { descTag = xmlDoc.createElement('description'); pm.appendChild(descTag); }
                        descTag.textContent = descText;
                    }
                });
            }
            else {
                let suffix = null;
                if (folderName === 'FAT') suffix = ' FAT';
                else if (folderName === 'HP COVER') suffix = ' HP';
                else if (folderName === 'HP UNCOVER') suffix = ' HP';
                else if (folderName.includes('EXISTING POLE')) suffix = ' EXT POLE';
                else if (folderName.includes('NEW POLE')) suffix = ' POLE';
                if (suffix) {
                    const count = folder.getElementsByTagName('Placemark').length;
                    if (count > 0) {
                        let descTag = Array.from(folder.children).find(c => c.tagName === 'description');
                        if (!descTag) { descTag = xmlDoc.createElement('description'); folder.appendChild(descTag); }
                        descTag.textContent = `${count}${suffix}`;
                    }
                }
            }
        });
    }
}