// --- MATH & SPATIAL UTILS ---
export function toRad(val) { return val * Math.PI / 180; }

export function haversine(pt1, pt2) {
    const R = 6371000; 
    const dLat = toRad(pt2.lat - pt1.lat);
    const dLon = toRad(pt2.lon - pt1.lon);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(pt1.lat)) * Math.cos(toRad(pt2.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function isPointInPolygon(p, vs) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].lon, yi = vs[i].lat;
        const xj = vs[j].lon, yj = vs[j].lat;
        const intersect = ((yi > p.lat) !== (yj > p.lat)) && (p.lon < (xj - xi) * (p.lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function distToSegment(p, v, w) {
    const l2 = ((v.lon - w.lon)**2 + (v.lat - w.lat)**2);
    if (l2 == 0) return haversine(p, v);
    let t = ((p.lon - v.lon) * (w.lon - v.lon) + (p.lat - v.lat) * (w.lat - v.lat)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projection = { lon: v.lon + t * (w.lon - v.lon), lat: v.lat + t * (w.lat - v.lat) };
    return haversine(p, projection);
}

export function getMinDistToCables(point, cables) {
    let minD = Infinity;
    cables.forEach(cable => {
        for (let i = 0; i < cable.length - 1; i++) {
            const d = distToSegment(point, cable[i], cable[i+1]);
            if (d < minD) minD = d;
        }
    });
    return minD;
}

export function calculateLineLength(coordString) {
    const parts = coordString.trim().split(/\s+/);
    if (parts.length < 2) return 0;
    const points = parts.map(p => { const [lon, lat] = p.split(',').map(Number); return { lon, lat }; });
    let totalDist = 0;
    for (let i = 0; i < points.length - 1; i++) { totalDist += haversine(points[i], points[i+1]); }
    return Math.ceil(totalDist);
}

// --- XML HELPERS ---
export function createName(xml, text) { const n = xml.createElement('name'); n.textContent = text; return n; }
export function createFolder(xml, name, items) { 
    const f = xml.createElement('Folder'); 
    f.appendChild(createName(xml, name)); 
    items.forEach(i => f.appendChild(i)); 
    return f; 
}