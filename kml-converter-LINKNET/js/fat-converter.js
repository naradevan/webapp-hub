// ============================================
// FAT CONVERTER
// ============================================

export const FAT_CONFIG = {
  name: 'FAT',
  
  // Column mapping (0-indexed)
  columns: {
    poleId: 0,          // Pole ID (New)
    lat: 1,             // Coordinate (Lat) NEW
    lon: 2,             // Coordinate (Long) NEW
    provider: 3,        // Pole Provider (New)
    type: 4,            // Pole Type
    fatId: 5            // FAT ID/NETWORK ID
  },
  
  // Expected headers for validation
  expectedHeaders: [
    'Pole ID (New)',
    'Coordinate (Lat) NEW',
    'Coordinate (Long) NEW',
    'Pole Provider (New)',
    'Pole Type',
    'FAT ID/NETWORK ID'
  ]
};

// Convert CSV row to FAT data object
export function convertFATRow(row, config) {
  const cols = row.split(',').map(c => c.trim());
  
  return {
    poleId: cols[config.columns.poleId] || '',
    lat: cols[config.columns.lat] || '',
    lon: cols[config.columns.lon] || '',
    provider: cols[config.columns.provider] || '',
    type: cols[config.columns.type] || '',
    fatId: cols[config.columns.fatId] || ''
  };
}

// Generate KML placemark for FAT
export function generateFATPlacemark(data) {
  // Conditional styling based on FAT ID length
  const styleUrl = data.fatId.length < 9 
    ? '#pointStyleMapShort'   // White square
    : '#pointStyleMap';        // Green triangle
  
  return `
    <Placemark>
      <name>${data.fatId}</name>
      <styleUrl>${styleUrl}</styleUrl>
      <ExtendedData>
        <SchemaData schemaUrl="#S_BAHAN_FAT">
          <SimpleData name="Pole_ID__New_">${data.poleId}</SimpleData>
          <SimpleData name="Coordinate__Lat__NEW">${data.lat}</SimpleData>
          <SimpleData name="Coordinate__Long__NEW">${data.lon}</SimpleData>
          <SimpleData name="Pole_Provider__New_">${data.provider}</SimpleData>
          <SimpleData name="Pole_Type">${data.type}</SimpleData>
          <SimpleData name="FAT_ID_NETWORK_ID">${data.fatId}</SimpleData>
        </SchemaData>
      </ExtendedData>
      <Point>
        <coordinates>${data.lon},${data.lat},0</coordinates>
      </Point>
    </Placemark>`;
}

// Get FAT KML styles
export function getFATStyles() {
  return `
    <Schema name="BAHAN_FAT" id="S_BAHAN_FAT">
      <SimpleField type="string" name="Pole_ID__New_"><displayName>&lt;b&gt;Pole ID (New)&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Coordinate__Lat__NEW"><displayName>&lt;b&gt;Coordinate (Lat) NEW&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Coordinate__Long__NEW"><displayName>&lt;b&gt;Coordinate (Long) NEW&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Pole_Provider__New_"><displayName>&lt;b&gt;Pole Provider (New)&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Pole_Type"><displayName>&lt;b&gt;Pole Type&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="FAT_ID_NETWORK_ID"><displayName>&lt;b&gt;FAT ID/NETWORK ID&lt;/b&gt;</displayName></SimpleField>
    </Schema>
    
    <Style id="hlightPointStyle">
      <IconStyle>
        <color>ff00ff55</color>
        <scale>1.4</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/triangle.png</href></Icon>
      </IconStyle>
    </Style>
    <Style id="normPointStyle">
      <IconStyle>
        <color>ff00ff55</color>
        <scale>1.2</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/triangle.png</href></Icon>
      </IconStyle>
    </Style>
    <StyleMap id="pointStyleMap">
      <Pair><key>normal</key><styleUrl>#normPointStyle</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle</styleUrl></Pair>
    </StyleMap>
    
    <Style id="hlightPointStyleShort">
      <IconStyle>
        <color>ffffffff</color>
        <scale>1.4</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/square.png</href></Icon>
      </IconStyle>
    </Style>
    <Style id="normPointStyleShort">
      <IconStyle>
        <color>ffffffff</color>
        <scale>1.2</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/square.png</href></Icon>
      </IconStyle>
    </Style>
    <StyleMap id="pointStyleMapShort">
      <Pair><key>normal</key><styleUrl>#normPointStyleShort</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyleShort</styleUrl></Pair>
    </StyleMap>`;
}
