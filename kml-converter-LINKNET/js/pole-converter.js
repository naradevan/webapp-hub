// ============================================
// POLE CONVERTER
// ============================================

export const POLE_CONFIG = {
  name: 'POLE',
  
  // Column mapping (0-indexed)
  columns: {
    poleId: 0,          // Pole ID (New)
    lat: 1,             // Coordinate (Lat) NEW
    lon: 2,             // Coordinate (Long) NEW
    provider: 3,        // Pole Provider (New)
    type: 4             // Pole Type
  },
  
  // Expected headers for validation
  expectedHeaders: [
    'Pole ID (New)',
    'Coordinate (Lat) NEW',
    'Coordinate (Long) NEW',
    'Pole Provider (New)',
    'Pole Type'
  ]
};

// Convert CSV row to POLE data object
export function convertPOLERow(row, config) {
  const cols = row.split(',').map(c => c.trim());
  
  return {
    poleId: cols[config.columns.poleId] || '',
    lat: cols[config.columns.lat] || '',
    lon: cols[config.columns.lon] || '',
    provider: cols[config.columns.provider] || '',
    type: cols[config.columns.type] || ''
  };
}

// Generate KML placemark for POLE
export function generatePOLEPlacemark(data) {
  return `
    <Placemark>
      <n>${data.poleId}</n>
      <styleUrl>#pointStyleMap1</styleUrl>
      <ExtendedData>
        <SchemaData schemaUrl="#S_BAHAN_POLE_SSSSS">
          <SimpleData name="Pole_ID__New_">${data.poleId}</SimpleData>
          <SimpleData name="Coordinate__Lat__NEW">${data.lat}</SimpleData>
          <SimpleData name="Coordinate__Long__NEW">${data.lon}</SimpleData>
          <SimpleData name="Pole_Provider__New_">${data.provider}</SimpleData>
          <SimpleData name="Pole_Type">${data.type}</SimpleData>
        </SchemaData>
      </ExtendedData>
      <Point>
        <coordinates>${data.lon},${data.lat},0</coordinates>
      </Point>
    </Placemark>`;
}

// Get POLE KML styles
export function getPOLEStyles() {
  return `
    <Schema name="BAHAN_POLE" id="S_BAHAN_POLE_SSSSS">
      <SimpleField type="string" name="Pole_ID__New_"><displayName>&lt;b&gt;Pole ID (New)&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Coordinate__Lat__NEW"><displayName>&lt;b&gt;Coordinate (Lat) NEW&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Coordinate__Long__NEW"><displayName>&lt;b&gt;Coordinate (Long) NEW&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Pole_Provider__New_"><displayName>&lt;b&gt;Pole Provider (New)&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Pole_Type"><displayName>&lt;b&gt;Pole Type&lt;/b&gt;</displayName></SimpleField>
    </Schema>
    
    <Style id="hlightPointStyle1">
      <IconStyle>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>Pole ID (New)</b></td><td>$[BAHAN_POLE/Pole_ID__New_]</td></tr>
  <tr><td><b>Coordinate (Lat) NEW</b></td><td>$[BAHAN_POLE/Coordinate__Lat__NEW]</td></tr>
  <tr><td><b>Coordinate (Long) NEW</b></td><td>$[BAHAN_POLE/Coordinate__Long__NEW]</td></tr>
  <tr><td><b>Pole Provider (New)</b></td><td>$[BAHAN_POLE/Pole_Provider__New_]</td></tr>
  <tr><td><b>Pole Type</b></td><td>$[BAHAN_POLE/Pole_Type]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <Style id="normPointStyle1">
      <IconStyle>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>Pole ID (New)</b></td><td>$[BAHAN_POLE/Pole_ID__New_]</td></tr>
  <tr><td><b>Coordinate (Lat) NEW</b></td><td>$[BAHAN_POLE/Coordinate__Lat__NEW]</td></tr>
  <tr><td><b>Coordinate (Long) NEW</b></td><td>$[BAHAN_POLE/Coordinate__Long__NEW]</td></tr>
  <tr><td><b>Pole Provider (New)</b></td><td>$[BAHAN_POLE/Pole_Provider__New_]</td></tr>
  <tr><td><b>Pole Type</b></td><td>$[BAHAN_POLE/Pole_Type]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <StyleMap id="pointStyleMap1">
      <Pair><key>normal</key><styleUrl>#normPointStyle1</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle1</styleUrl></Pair>
    </StyleMap>`;
}
