// ============================================
// PATH GENERATOR (HP → FAT)
// ============================================

// Generate paths from HP to FAT based on FAT_CODE matching
export function generateHPtoFATPaths(hpData, fatData) {
  const paths = [];
  
  // Create FAT lookup by FAT_ID
  const fatLookup = {};
  for (const fat of fatData) {
    fatLookup[fat.fatId] = fat;
  }
  
  // For each HP, find matching FAT by FAT_CODE
  for (const hp of hpData) {
    const fatCode = hp.fatCode.trim();
    
    if (!fatCode || fatCode === '-' || fatCode === '') {
      continue; // Skip HP without FAT_CODE
    }
    
    const matchingFat = fatLookup[fatCode];
    
    if (matchingFat) {
      paths.push({
        name: `${hp.houseNumber} to ${matchingFat.fatId}`,
        hpLat: hp.lat,
        hpLon: hp.lon,
        fatLat: matchingFat.lat,
        fatLon: matchingFat.lon,
        hpId: hp.houseNumber,
        fatId: matchingFat.fatId
      });
    }
  }
  
  return paths;
}

// Generate KML LineString for a path
export function generatePathPlacemark(path) {
  return `
    <Placemark>
      <name>${path.name}</name>
      <styleUrl>#pathStyle</styleUrl>
      <LineString>
        <coordinates>
          ${path.hpLon},${path.hpLat},0
          ${path.fatLon},${path.fatLat},0
        </coordinates>
      </LineString>
    </Placemark>`;
}

// Get path KML style
export function getPathStyle() {
  return `
    <Style id="pathStyle">
      <LineStyle>
        <color>ffff00ff</color>
        <width>1</width>
      </LineStyle>
    </Style>`;
}

// Calculate distance between two points (Haversine formula)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Generate path statistics
export function generatePathStats(paths) {
  if (paths.length === 0) {
    return {
      totalPaths: 0,
      averageDistance: 0,
      minDistance: 0,
      maxDistance: 0
    };
  }
  
  const distances = paths.map(path => 
    haversineDistance(
      parseFloat(path.hpLat),
      parseFloat(path.hpLon),
      parseFloat(path.fatLat),
      parseFloat(path.fatLon)
    )
  );
  
  return {
    totalPaths: paths.length,
    averageDistance: distances.reduce((a, b) => a + b, 0) / distances.length,
    minDistance: Math.min(...distances),
    maxDistance: Math.max(...distances)
  };
}
