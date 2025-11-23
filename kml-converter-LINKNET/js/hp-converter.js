// ============================================
// HP (HOMEPASS) CONVERTER
// ============================================

export const HP_CONFIG = {
  name: 'HOMEPASS',
  
  // Column mapping (0-indexed) - 27 fields total
  columns: {
    homepassId: 0,        // HOMEPASS_ID
    clusterName: 1,       // CLUSTER_NAME
    prefixAddress: 2,     // PREFIX_ADDRESS
    streetName: 3,        // STREET_NAME
    houseNumber: 4,       // HOUSE_NUMBER
    block: 5,             // BLOCK
    floor: 6,             // FLOOR
    rt: 7,                // RT
    rw: 8,                // RW
    district: 9,          // DISTRICT
    subDistrict: 10,      // SUB_DISTRICT
    fdtCode: 11,          // FDT_CODE
    fatCode: 12,          // FAT_CODE
    lat: 13,              // BUILDING_LATITUDE
    lon: 14,              // BUILDING_LONGITUDE
    category: 15,         // Category BizPass
    postCode: 16,         // POST CODE
    addressPoleFat: 17,   // ADDRESS POLE / FAT
    ovUg: 18,             // OV_UG
    houseComment: 19,     // HOUSE_COMMENT_
    buildingName: 20,     // BUILDING_NAME
    tower: 21,            // TOWER
    aptn: 22,             // APTN
    fiberNode: 23,        // FIBER_NODE__HFC_
    idArea: 24,           // ID_Area
    clampHookId: 25,      // Clamp_Hook_ID
    deploymentType: 26,   // DEPLOYMENT_TYPE
    needSurvey: 27        // NEED_SURVEY
  },
  
  // Expected headers for validation
  expectedHeaders: [
    'HOMEPASS_ID',
    'CLUSTER_NAME',
    'PREFIX_ADDRESS',
    'STREET_NAME',
    'HOUSE_NUMBER',
    'BLOCK',
    'FLOOR',
    'RT',
    'RW',
    'DISTRICT',
    'SUB_DISTRICT',
    'FDT_CODE',
    'FAT_CODE',
    'BUILDING_LATITUDE',
    'BUILDING_LONGITUDE',
    'Category BizPass',
    'POST CODE',
    'ADDRESS POLE / FAT',
    'OV_UG',
    'HOUSE_COMMENT_',
    'BUILDING_NAME',
    'TOWER',
    'APTN',
    'FIBER_NODE__HFC_',
    'ID_Area',
    'Clamp_Hook_ID',
    'DEPLOYMENT_TYPE',
    'NEED_SURVEY'
  ]
};

// Convert CSV row to HP data object
export function convertHPRow(row, config) {
  const cols = row.split(',').map(c => c.trim());
  
  return {
    homepassId: cols[config.columns.homepassId] || '',
    clusterName: cols[config.columns.clusterName] || '',
    prefixAddress: cols[config.columns.prefixAddress] || '',
    streetName: cols[config.columns.streetName] || '',
    houseNumber: cols[config.columns.houseNumber] || '',
    block: cols[config.columns.block] || '',
    floor: cols[config.columns.floor] || '',
    rt: cols[config.columns.rt] || '',
    rw: cols[config.columns.rw] || '',
    district: cols[config.columns.district] || '',
    subDistrict: cols[config.columns.subDistrict] || '',
    fdtCode: cols[config.columns.fdtCode] || '',
    fatCode: cols[config.columns.fatCode] || '',
    lat: cols[config.columns.lat] || '',
    lon: cols[config.columns.lon] || '',
    category: cols[config.columns.category] || '',
    postCode: cols[config.columns.postCode] || '',
    addressPoleFat: cols[config.columns.addressPoleFat] || '',
    ovUg: cols[config.columns.ovUg] || '',
    houseComment: cols[config.columns.houseComment] || '',
    buildingName: cols[config.columns.buildingName] || '',
    tower: cols[config.columns.tower] || '',
    aptn: cols[config.columns.aptn] || '',
    fiberNode: cols[config.columns.fiberNode] || '',
    idArea: cols[config.columns.idArea] || '',
    clampHookId: cols[config.columns.clampHookId] || '',
    deploymentType: cols[config.columns.deploymentType] || '',
    needSurvey: cols[config.columns.needSurvey] || ''
  };
}

// Generate KML placemark for HP
export function generateHPPlacemark(data) {
  const category = data.category.trim();
  const clampHook = data.clampHookId.trim();
  
  // Determine style based on category and clamp hook
  let styleUrl, inlineStyle;
  
  if (category === 'RESIDENCE' && clampHook === '-') {
    styleUrl = '#pointStyleMap0';
    inlineStyle = `
      <Style id="inline">
        <IconStyle>
          <color>ff0000ff</color>
          <colorMode>normal</colorMode>
        </IconStyle>
        <LineStyle>
          <color>ff0000ff</color>
          <colorMode>normal</colorMode>
        </LineStyle>
        <PolyStyle>
          <color>ff0000ff</color>
          <colorMode>normal</colorMode>
        </PolyStyle>
      </Style>`;
  } else if (category !== 'RESIDENCE' && clampHook === '-') {
    styleUrl = '#pointStyleMap0';
    inlineStyle = `
      <Style id="inline">
        <IconStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/B.png</href></Icon>
        </IconStyle>
        <LineStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
        </LineStyle>
        <PolyStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
        </PolyStyle>
      </Style>`;
  } else if (category !== 'RESIDENCE' && clampHook !== '-') {
    styleUrl = '#pointStyleMap0';
    inlineStyle = `
      <Style id="inline">
        <IconStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/B.png</href></Icon>
        </IconStyle>
        <LineStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
        </LineStyle>
        <PolyStyle>
          <color>ffffffff</color>
          <colorMode>normal</colorMode>
        </PolyStyle>
      </Style>`;
  } else {
    styleUrl = '#pointStyleMap';
    inlineStyle = '';
  }
  
  return `
    <Placemark>
      <name>${data.houseNumber}</name>
      <styleUrl>${styleUrl}</styleUrl>${inlineStyle}
      <ExtendedData>
        <SchemaData schemaUrl="#S_BAHAN_HP">
          <SimpleData name="HOMEPASS_ID">${data.homepassId}</SimpleData>
          <SimpleData name="CLUSTER_NAME">${data.clusterName}</SimpleData>
          <SimpleData name="PREFIX_ADDRESS">${data.prefixAddress}</SimpleData>
          <SimpleData name="STREET_NAME">${data.streetName}</SimpleData>
          <SimpleData name="HOUSE_NUMBER">${data.houseNumber}</SimpleData>
          <SimpleData name="BLOCK">${data.block}</SimpleData>
          <SimpleData name="FLOOR">${data.floor}</SimpleData>
          <SimpleData name="RT">${data.rt}</SimpleData>
          <SimpleData name="RW">${data.rw}</SimpleData>
          <SimpleData name="DISTRICT">${data.district}</SimpleData>
          <SimpleData name="SUB_DISTRICT">${data.subDistrict}</SimpleData>
          <SimpleData name="FDT_CODE">${data.fdtCode}</SimpleData>
          <SimpleData name="FAT_CODE">${data.fatCode}</SimpleData>
          <SimpleData name="BUILDING_LATITUDE">${data.lat}</SimpleData>
          <SimpleData name="BUILDING_LONGITUDE">${data.lon}</SimpleData>
          <SimpleData name="Category_BizPass">${data.category}</SimpleData>
          <SimpleData name="POST_CODE">${data.postCode}</SimpleData>
          <SimpleData name="ADDRESS_POLE___FAT">${data.addressPoleFat}</SimpleData>
          <SimpleData name="OV_UG">${data.ovUg}</SimpleData>
          <SimpleData name="HOUSE_COMMENT_">${data.houseComment}</SimpleData>
          <SimpleData name="BUILDING_NAME">${data.buildingName}</SimpleData>
          <SimpleData name="TOWER">${data.tower}</SimpleData>
          <SimpleData name="APTN">${data.aptn}</SimpleData>
          <SimpleData name="FIBER_NODE__HFC_">${data.fiberNode}</SimpleData>
          <SimpleData name="ID_Area">${data.idArea}</SimpleData>
          <SimpleData name="Clamp_Hook_ID">${data.clampHookId}</SimpleData>
          <SimpleData name="DEPLOYMENT_TYPE">${data.deploymentType}</SimpleData>
          <SimpleData name="NEED_SURVEY">${data.needSurvey}</SimpleData>
        </SchemaData>
      </ExtendedData>
      <Point>
        <coordinates>${data.lon},${data.lat},0</coordinates>
      </Point>
    </Placemark>`;
}

// Get HP KML styles
export function getHPStyles() {
  return `
    <Schema name="BAHAN_HP" id="S_BAHAN_HP">
      <SimpleField type="string" name="HOMEPASS_ID"><displayName>&lt;b&gt;HOMEPASS_ID&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="CLUSTER_NAME"><displayName>&lt;b&gt;CLUSTER_NAME&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="PREFIX_ADDRESS"><displayName>&lt;b&gt;PREFIX_ADDRESS&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="STREET_NAME"><displayName>&lt;b&gt;STREET_NAME&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="HOUSE_NUMBER"><displayName>&lt;b&gt;HOUSE_NUMBER&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="BLOCK"><displayName>&lt;b&gt;BLOCK&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="FLOOR"><displayName>&lt;b&gt;FLOOR&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="RT"><displayName>&lt;b&gt;RT&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="RW"><displayName>&lt;b&gt;RW&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="DISTRICT"><displayName>&lt;b&gt;DISTRICT&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="SUB_DISTRICT"><displayName>&lt;b&gt;SUB_DISTRICT&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="FDT_CODE"><displayName>&lt;b&gt;FDT_CODE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="FAT_CODE"><displayName>&lt;b&gt;FAT_CODE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="BUILDING_LATITUDE"><displayName>&lt;b&gt;BUILDING_LATITUDE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="BUILDING_LONGITUDE"><displayName>&lt;b&gt;BUILDING_LONGITUDE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Category_BizPass"><displayName>&lt;b&gt;Category BizPass&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="POST_CODE"><displayName>&lt;b&gt;POST CODE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="ADDRESS_POLE___FAT"><displayName>&lt;b&gt;ADDRESS POLE / FAT&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="OV_UG"><displayName>&lt;b&gt;OV_UG&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="HOUSE_COMMENT_"><displayName>&lt;b&gt;HOUSE_COMMENT_&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="BUILDING_NAME"><displayName>&lt;b&gt;BUILDING_NAME&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="TOWER"><displayName>&lt;b&gt;TOWER&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="APTN"><displayName>&lt;b&gt;APTN&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="FIBER_NODE__HFC_"><displayName>&lt;b&gt;FIBER_NODE__HFC_&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="ID_Area"><displayName>&lt;b&gt;ID_Area&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="Clamp_Hook_ID"><displayName>&lt;b&gt;Clamp_Hook_ID&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="DEPLOYMENT_TYPE"><displayName>&lt;b&gt;DEPLOYMENT_TYPE&lt;/b&gt;</displayName></SimpleField>
      <SimpleField type="string" name="NEED_SURVEY"><displayName>&lt;b&gt;NEED_SURVEY&lt;/b&gt;</displayName></SimpleField>
    </Schema>
    
    <Style id="hlightPointStyle">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
    </Style>
    <Style id="normPointStyle">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
    </Style>
    <StyleMap id="pointStyleMap">
      <Pair><key>normal</key><styleUrl>#normPointStyle</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle</styleUrl></Pair>
    </StyleMap>
    <Style id="hlightPointStyle0">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
    </Style>
    <Style id="normPointStyle0">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
    </Style>
    <StyleMap id="pointStyleMap0">
      <Pair><key>normal</key><styleUrl>#normPointStyle0</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle0</styleUrl></Pair>
    </StyleMap>`;
}

// Separate HP data by category (HOME vs HOME-BIZ)
export function separateHPByCategory(hpData) {
  const home = [];
  const homeBiz = [];
  
  for (const hp of hpData) {
    if (hp.category.trim() === 'RESIDENCE') {
      home.push(hp);
    } else {
      homeBiz.push(hp);
    }
  }
  
  return { home, homeBiz };
}
