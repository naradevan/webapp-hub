// ============================================
// POLE CONVERTER
// ============================================

export const POLE_CONFIG = {
  name: 'POLE',
  
  columns: {
    poleId: 0,
    lat: 1,
    lon: 2,
    provider: 3,
    type: 4
  },
  
  expectedHeaders: [
    'Pole ID (New)',
    'Coordinate (Lat) NEW',
    'Coordinate (Long) NEW',
    'Pole Provider (New)',
    'Pole Type'
  ]
};

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

export function generatePOLEPlacemark(data) {
  return `
    <Placemark>
      <name>${data.poleId}</name>
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
        <color>ffffffff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-blank.png</href></Icon>
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
        <color>ffffffff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-blank.png</href></Icon>
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
