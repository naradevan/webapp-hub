// ============================================
// CLAMP/HOOK CONVERTER
// ============================================

export const CH_CONFIG = {
  name: 'CLAMP_HOOK',
  
  columns: {
    clampHookId: 0,
    lat: 1,
    lon: 2
  },
  
  expectedHeaders: [
    'Clamp_Hook_ID',
    'Clamp_Hook_LATITUDE',
    'Clamp_Hook_LONGITUDE'
  ]
};

export function convertCHRow(row, config) {
  const cols = row.split(',').map(c => c.trim());
  
  return {
    clampHookId: cols[config.columns.clampHookId] || '',
    lat: cols[config.columns.lat] || '',
    lon: cols[config.columns.lon] || ''
  };
}

export function generateCHPlacemark(data) {
  return `
    <Placemark>
      <name>${data.clampHookId}</name>
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

export function getCHStyles() {
  return `
    <Schema name="BAHAN_CH" id="S_BAHAN_CH_SSS">
      <SimpleField type="string" name="Clamp_Hook_ID"><displayName>&lt;b&gt;Clamp_Hook_ID&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Clamp_Hook_LATITUDE"><displayName>&lt;b&gt;Clamp_Hook_LATITUDE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Clamp_Hook_LONGITUDE"><displayName>&lt;b&gt;Clamp_Hook_LONGITUDE&lt;/b&gt;</displayName></SimpleField>
    </Schema>
    
    <Style id="hlightPointStyle">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_square.png</href></Icon>
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
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_square.png</href></Icon>
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
