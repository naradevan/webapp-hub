// ============================================
// CLAMP/HOOK CONVERTER
// ============================================

export const CH_CONFIG = {
  name: 'CLAMP_HOOK',
  
  // Column mapping (0-indexed)
  columns: {
    clampHookId: 0,     // Clamp_Hook_ID
    lat: 1,             // Clamp_Hook_LATITUDE
    lon: 2              // Clamp_Hook_LONGITUDE
  },
  
  // Expected headers for validation
  expectedHeaders: [
    'Clamp_Hook_ID',
    'Clamp_Hook_LATITUDE',
    'Clamp_Hook_LONGITUDE'
  ]
};

// Convert CSV row to CH data object
export function convertCHRow(row, config) {
  const cols = row.split(',').map(c => c.trim());
  
  return {
    clampHookId: cols[config.columns.clampHookId] || '',
    lat: cols[config.columns.lat] || '',
    lon: cols[config.columns.lon] || ''
  };
}

// Generate KML placemark for Clamp/Hook
export function generateCHPlacemark(data) {
  return `
    <Placemark>
      <n>${data.clampHookId}</n>
      <styleUrl>#pointStyleMap</styleUrl>
      <ExtendedData>
        <SchemaData schemaUrl="#S_BAHAN_CH_SSS">
          <SimpleData name="Clamp_Hook_ID">${data.clampHookId}</SimpleData>
          <SimpleData name="Clamp_Hook_LATITUDE">${data.lat}</SimpleData>
          <SimpleData name="Clamp_Hook_LONGITUDE">${data.lon}</SimpleData>
        </SchemaData>
      </ExtendedData>
      <Point>
        <coordinates>${data.lon},${data.lat},0</coordinates>
      </Point>
    </Placemark>`;
}

// Get Clamp/Hook KML styles
export function getCHStyles() {
  return `
    <Schema name="BAHAN_CH" id="S_BAHAN_CH_SSS">
      <SimpleField type="string" name="Clamp_Hook_ID"><displayName>&lt;b&gt;Clamp_Hook_ID&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Clamp_Hook_LATITUDE"><displayName>&lt;b&gt;Clamp_Hook_LATITUDE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Clamp_Hook_LONGITUDE"><displayName>&lt;b&gt;Clamp_Hook_LONGITUDE&lt;/b&gt;</displayName></SimpleField>
    </Schema>
    
    <Style id="hlightPointStyle">
      <IconStyle>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_CH/Clamp_Hook_ID]</td></tr>
  <tr><td><b>Clamp_Hook_LATITUDE</b></td><td>$[BAHAN_CH/Clamp_Hook_LATITUDE]</td></tr>
  <tr><td><b>Clamp_Hook_LONGITUDE</b></td><td>$[BAHAN_CH/Clamp_Hook_LONGITUDE]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <Style id="normPointStyle">
      <IconStyle>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_CH/Clamp_Hook_ID]</td></tr>
  <tr><td><b>Clamp_Hook_LATITUDE</b></td><td>$[BAHAN_CH/Clamp_Hook_LATITUDE]</td></tr>
  <tr><td><b>Clamp_Hook_LONGITUDE</b></td><td>$[BAHAN_CH/Clamp_Hook_LONGITUDE]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <StyleMap id="pointStyleMap">
      <Pair><key>normal</key><styleUrl>#normPointStyle</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle</styleUrl></Pair>
    </StyleMap>`;
}
