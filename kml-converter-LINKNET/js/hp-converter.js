// ============================================
// HP CONVERTER
// ============================================

export const HP_CONFIG = {
  name: 'HP',
  
  // Column mapping (0-indexed)
  columns: {
    homepassId: 0,
    clusterName: 1,
    prefixAddress: 2,
    streetName: 3,
    houseNumber: 4,
    block: 5,
    floor: 6,
    rt: 7,
    rw: 8,
    district: 9,
    subDistrict: 10,
    fdtCode: 11,
    fatCode: 12,
    lat: 13,
    lon: 14,
    category: 15,
    postCode: 16,
    addressPoleFat: 17,
    ovUg: 18,
    houseComment: 19,
    buildingName: 20,
    tower: 21,
    aptn: 22,
    fiberNode: 23,
    idArea: 24,
    clampHookId: 25,
    deploymentType: 26,
    needSurvey: 27
  },
  
  expectedHeaders: [
    'HOMEPASS_ID', 'CLUSTER_NAME', 'PREFIX_ADDRESS', 'STREET_NAME', 'HOUSE_NUMBER',
    'BLOCK', 'FLOOR', 'RT', 'RW', 'DISTRICT', 'SUB_DISTRICT', 'FDT_CODE', 'FAT_CODE',
    'BUILDING_LATITUDE', 'BUILDING_LONGITUDE', 'Category BizPass', 'POST CODE',
    'ADDRESS POLE / FAT', 'OV_UG', 'HOUSE_COMMENT_', 'BUILDING_NAME', 'TOWER',
    'APTN', 'FIBER_NODE__HFC_', 'ID_Area', 'Clamp_Hook_ID', 'DEPLOYMENT_TYPE', 'NEED_SURVEY'
  ]
};

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
    category: cols[config.columns.category] || 'RESIDENCE',
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

export function generateHPPlacemark(data) {
  const styleUrl = data.category === 'BUSINESS' ? '#pointStyleMap0' : '#pointStyleMap00';
  
  return `
    <Placemark>
      <name>${data.houseNumber}</name>
      <styleUrl>${styleUrl}</styleUrl>
      <ExtendedData>
        <SchemaData schemaUrl="#S_BAHAN_HP_SSSSSSSSSSSSSSSSSSSSSSSSSS">
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

export function getHPStyles() {
  return `
    <Schema name="BAHAN_HP" id="S_BAHAN_HP_SSSSSSSSSSSSSSSSSSSSSSSSSS">
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
    
    <Style id="hlightPointStyle00">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>HOMEPASS_ID</b></td><td>$[BAHAN_HP/HOMEPASS_ID]</td></tr>
  <tr><td><b>CLUSTER_NAME</b></td><td>$[BAHAN_HP/CLUSTER_NAME]</td></tr>
  <tr><td><b>PREFIX_ADDRESS</b></td><td>$[BAHAN_HP/PREFIX_ADDRESS]</td></tr>
  <tr><td><b>STREET_NAME</b></td><td>$[BAHAN_HP/STREET_NAME]</td></tr>
  <tr><td><b>HOUSE_NUMBER</b></td><td>$[BAHAN_HP/HOUSE_NUMBER]</td></tr>
  <tr><td><b>BLOCK</b></td><td>$[BAHAN_HP/BLOCK]</td></tr>
  <tr><td><b>FLOOR</b></td><td>$[BAHAN_HP/FLOOR]</td></tr>
  <tr><td><b>RT</b></td><td>$[BAHAN_HP/RT]</td></tr>
  <tr><td><b>RW</b></td><td>$[BAHAN_HP/RW]</td></tr>
  <tr><td><b>DISTRICT</b></td><td>$[BAHAN_HP/DISTRICT]</td></tr>
  <tr><td><b>SUB_DISTRICT</b></td><td>$[BAHAN_HP/SUB_DISTRICT]</td></tr>
  <tr><td><b>FDT_CODE</b></td><td>$[BAHAN_HP/FDT_CODE]</td></tr>
  <tr><td><b>FAT_CODE</b></td><td>$[BAHAN_HP/FAT_CODE]</td></tr>
  <tr><td><b>BUILDING_LATITUDE</b></td><td>$[BAHAN_HP/BUILDING_LATITUDE]</td></tr>
  <tr><td><b>BUILDING_LONGITUDE</b></td><td>$[BAHAN_HP/BUILDING_LONGITUDE]</td></tr>
  <tr><td><b>Category BizPass</b></td><td>$[BAHAN_HP/Category_BizPass]</td></tr>
  <tr><td><b>POST CODE</b></td><td>$[BAHAN_HP/POST_CODE]</td></tr>
  <tr><td><b>ADDRESS POLE / FAT</b></td><td>$[BAHAN_HP/ADDRESS_POLE___FAT]</td></tr>
  <tr><td><b>OV_UG</b></td><td>$[BAHAN_HP/OV_UG]</td></tr>
  <tr><td><b>HOUSE_COMMENT_</b></td><td>$[BAHAN_HP/HOUSE_COMMENT_]</td></tr>
  <tr><td><b>BUILDING_NAME</b></td><td>$[BAHAN_HP/BUILDING_NAME]</td></tr>
  <tr><td><b>TOWER</b></td><td>$[BAHAN_HP/TOWER]</td></tr>
  <tr><td><b>APTN</b></td><td>$[BAHAN_HP/APTN]</td></tr>
  <tr><td><b>FIBER_NODE__HFC_</b></td><td>$[BAHAN_HP/FIBER_NODE__HFC_]</td></tr>
  <tr><td><b>ID_Area</b></td><td>$[BAHAN_HP/ID_Area]</td></tr>
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_HP/Clamp_Hook_ID]</td></tr>
  <tr><td><b>DEPLOYMENT_TYPE</b></td><td>$[BAHAN_HP/DEPLOYMENT_TYPE]</td></tr>
  <tr><td><b>NEED_SURVEY</b></td><td>$[BAHAN_HP/NEED_SURVEY]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <Style id="normPointStyle00">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>HOMEPASS_ID</b></td><td>$[BAHAN_HP/HOMEPASS_ID]</td></tr>
  <tr><td><b>CLUSTER_NAME</b></td><td>$[BAHAN_HP/CLUSTER_NAME]</td></tr>
  <tr><td><b>PREFIX_ADDRESS</b></td><td>$[BAHAN_HP/PREFIX_ADDRESS]</td></tr>
  <tr><td><b>STREET_NAME</b></td><td>$[BAHAN_HP/STREET_NAME]</td></tr>
  <tr><td><b>HOUSE_NUMBER</b></td><td>$[BAHAN_HP/HOUSE_NUMBER]</td></tr>
  <tr><td><b>BLOCK</b></td><td>$[BAHAN_HP/BLOCK]</td></tr>
  <tr><td><b>FLOOR</b></td><td>$[BAHAN_HP/FLOOR]</td></tr>
  <tr><td><b>RT</b></td><td>$[BAHAN_HP/RT]</td></tr>
  <tr><td><b>RW</b></td><td>$[BAHAN_HP/RW]</td></tr>
  <tr><td><b>DISTRICT</b></td><td>$[BAHAN_HP/DISTRICT]</td></tr>
  <tr><td><b>SUB_DISTRICT</b></td><td>$[BAHAN_HP/SUB_DISTRICT]</td></tr>
  <tr><td><b>FDT_CODE</b></td><td>$[BAHAN_HP/FDT_CODE]</td></tr>
  <tr><td><b>FAT_CODE</b></td><td>$[BAHAN_HP/FAT_CODE]</td></tr>
  <tr><td><b>BUILDING_LATITUDE</b></td><td>$[BAHAN_HP/BUILDING_LATITUDE]</td></tr>
  <tr><td><b>BUILDING_LONGITUDE</b></td><td>$[BAHAN_HP/BUILDING_LONGITUDE]</td></tr>
  <tr><td><b>Category BizPass</b></td><td>$[BAHAN_HP/Category_BizPass]</td></tr>
  <tr><td><b>POST CODE</b></td><td>$[BAHAN_HP/POST_CODE]</td></tr>
  <tr><td><b>ADDRESS POLE / FAT</b></td><td>$[BAHAN_HP/ADDRESS_POLE___FAT]</td></tr>
  <tr><td><b>OV_UG</b></td><td>$[BAHAN_HP/OV_UG]</td></tr>
  <tr><td><b>HOUSE_COMMENT_</b></td><td>$[BAHAN_HP/HOUSE_COMMENT_]</td></tr>
  <tr><td><b>BUILDING_NAME</b></td><td>$[BAHAN_HP/BUILDING_NAME]</td></tr>
  <tr><td><b>TOWER</b></td><td>$[BAHAN_HP/TOWER]</td></tr>
  <tr><td><b>APTN</b></td><td>$[BAHAN_HP/APTN]</td></tr>
  <tr><td><b>FIBER_NODE__HFC_</b></td><td>$[BAHAN_HP/FIBER_NODE__HFC_]</td></tr>
  <tr><td><b>ID_Area</b></td><td>$[BAHAN_HP/ID_Area]</td></tr>
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_HP/Clamp_Hook_ID]</td></tr>
  <tr><td><b>DEPLOYMENT_TYPE</b></td><td>$[BAHAN_HP/DEPLOYMENT_TYPE]</td></tr>
  <tr><td><b>NEED_SURVEY</b></td><td>$[BAHAN_HP/NEED_SURVEY]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <StyleMap id="pointStyleMap00">
      <Pair><key>normal</key><styleUrl>#normPointStyle00</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle00</styleUrl></Pair>
    </StyleMap>
    <Style id="hlightPointStyle0">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>HOMEPASS_ID</b></td><td>$[BAHAN_HP/HOMEPASS_ID]</td></tr>
  <tr><td><b>CLUSTER_NAME</b></td><td>$[BAHAN_HP/CLUSTER_NAME]</td></tr>
  <tr><td><b>PREFIX_ADDRESS</b></td><td>$[BAHAN_HP/PREFIX_ADDRESS]</td></tr>
  <tr><td><b>STREET_NAME</b></td><td>$[BAHAN_HP/STREET_NAME]</td></tr>
  <tr><td><b>HOUSE_NUMBER</b></td><td>$[BAHAN_HP/HOUSE_NUMBER]</td></tr>
  <tr><td><b>BLOCK</b></td><td>$[BAHAN_HP/BLOCK]</td></tr>
  <tr><td><b>FLOOR</b></td><td>$[BAHAN_HP/FLOOR]</td></tr>
  <tr><td><b>RT</b></td><td>$[BAHAN_HP/RT]</td></tr>
  <tr><td><b>RW</b></td><td>$[BAHAN_HP/RW]</td></tr>
  <tr><td><b>DISTRICT</b></td><td>$[BAHAN_HP/DISTRICT]</td></tr>
  <tr><td><b>SUB_DISTRICT</b></td><td>$[BAHAN_HP/SUB_DISTRICT]</td></tr>
  <tr><td><b>FDT_CODE</b></td><td>$[BAHAN_HP/FDT_CODE]</td></tr>
  <tr><td><b>FAT_CODE</b></td><td>$[BAHAN_HP/FAT_CODE]</td></tr>
  <tr><td><b>BUILDING_LATITUDE</b></td><td>$[BAHAN_HP/BUILDING_LATITUDE]</td></tr>
  <tr><td><b>BUILDING_LONGITUDE</b></td><td>$[BAHAN_HP/BUILDING_LONGITUDE]</td></tr>
  <tr><td><b>Category BizPass</b></td><td>$[BAHAN_HP/Category_BizPass]</td></tr>
  <tr><td><b>POST CODE</b></td><td>$[BAHAN_HP/POST_CODE]</td></tr>
  <tr><td><b>ADDRESS POLE / FAT</b></td><td>$[BAHAN_HP/ADDRESS_POLE___FAT]</td></tr>
  <tr><td><b>OV_UG</b></td><td>$[BAHAN_HP/OV_UG]</td></tr>
  <tr><td><b>HOUSE_COMMENT_</b></td><td>$[BAHAN_HP/HOUSE_COMMENT_]</td></tr>
  <tr><td><b>BUILDING_NAME</b></td><td>$[BAHAN_HP/BUILDING_NAME]</td></tr>
  <tr><td><b>TOWER</b></td><td>$[BAHAN_HP/TOWER]</td></tr>
  <tr><td><b>APTN</b></td><td>$[BAHAN_HP/APTN]</td></tr>
  <tr><td><b>FIBER_NODE__HFC_</b></td><td>$[BAHAN_HP/FIBER_NODE__HFC_]</td></tr>
  <tr><td><b>ID_Area</b></td><td>$[BAHAN_HP/ID_Area]</td></tr>
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_HP/Clamp_Hook_ID]</td></tr>
  <tr><td><b>DEPLOYMENT_TYPE</b></td><td>$[BAHAN_HP/DEPLOYMENT_TYPE]</td></tr>
  <tr><td><b>NEED_SURVEY</b></td><td>$[BAHAN_HP/NEED_SURVEY]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <Style id="normPointStyle0">
      <IconStyle>
        <color>ff0000ff</color>
        <Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
      </IconStyle>
      <BalloonStyle>
        <text><![CDATA[<table border="0">
  <tr><td><b>HOMEPASS_ID</b></td><td>$[BAHAN_HP/HOMEPASS_ID]</td></tr>
  <tr><td><b>CLUSTER_NAME</b></td><td>$[BAHAN_HP/CLUSTER_NAME]</td></tr>
  <tr><td><b>PREFIX_ADDRESS</b></td><td>$[BAHAN_HP/PREFIX_ADDRESS]</td></tr>
  <tr><td><b>STREET_NAME</b></td><td>$[BAHAN_HP/STREET_NAME]</td></tr>
  <tr><td><b>HOUSE_NUMBER</b></td><td>$[BAHAN_HP/HOUSE_NUMBER]</td></tr>
  <tr><td><b>BLOCK</b></td><td>$[BAHAN_HP/BLOCK]</td></tr>
  <tr><td><b>FLOOR</b></td><td>$[BAHAN_HP/FLOOR]</td></tr>
  <tr><td><b>RT</b></td><td>$[BAHAN_HP/RT]</td></tr>
  <tr><td><b>RW</b></td><td>$[BAHAN_HP/RW]</td></tr>
  <tr><td><b>DISTRICT</b></td><td>$[BAHAN_HP/DISTRICT]</td></tr>
  <tr><td><b>SUB_DISTRICT</b></td><td>$[BAHAN_HP/SUB_DISTRICT]</td></tr>
  <tr><td><b>FDT_CODE</b></td><td>$[BAHAN_HP/FDT_CODE]</td></tr>
  <tr><td><b>FAT_CODE</b></td><td>$[BAHAN_HP/FAT_CODE]</td></tr>
  <tr><td><b>BUILDING_LATITUDE</b></td><td>$[BAHAN_HP/BUILDING_LATITUDE]</td></tr>
  <tr><td><b>BUILDING_LONGITUDE</b></td><td>$[BAHAN_HP/BUILDING_LONGITUDE]</td></tr>
  <tr><td><b>Category BizPass</b></td><td>$[BAHAN_HP/Category_BizPass]</td></tr>
  <tr><td><b>POST CODE</b></td><td>$[BAHAN_HP/POST_CODE]</td></tr>
  <tr><td><b>ADDRESS POLE / FAT</b></td><td>$[BAHAN_HP/ADDRESS_POLE___FAT]</td></tr>
  <tr><td><b>OV_UG</b></td><td>$[BAHAN_HP/OV_UG]</td></tr>
  <tr><td><b>HOUSE_COMMENT_</b></td><td>$[BAHAN_HP/HOUSE_COMMENT_]</td></tr>
  <tr><td><b>BUILDING_NAME</b></td><td>$[BAHAN_HP/BUILDING_NAME]</td></tr>
  <tr><td><b>TOWER</b></td><td>$[BAHAN_HP/TOWER]</td></tr>
  <tr><td><b>APTN</b></td><td>$[BAHAN_HP/APTN]</td></tr>
  <tr><td><b>FIBER_NODE__HFC_</b></td><td>$[BAHAN_HP/FIBER_NODE__HFC_]</td></tr>
  <tr><td><b>ID_Area</b></td><td>$[BAHAN_HP/ID_Area]</td></tr>
  <tr><td><b>Clamp_Hook_ID</b></td><td>$[BAHAN_HP/Clamp_Hook_ID]</td></tr>
  <tr><td><b>DEPLOYMENT_TYPE</b></td><td>$[BAHAN_HP/DEPLOYMENT_TYPE]</td></tr>
  <tr><td><b>NEED_SURVEY</b></td><td>$[BAHAN_HP/NEED_SURVEY]</td></tr>
</table>]]></text>
      </BalloonStyle>
      <ListStyle></ListStyle>
    </Style>
    <StyleMap id="pointStyleMap0">
      <Pair><key>normal</key><styleUrl>#normPointStyle0</styleUrl></Pair>
      <Pair><key>highlight</key><styleUrl>#hlightPointStyle0</styleUrl></Pair>
    </StyleMap>`;
}

// Separate HP data by category (RESIDENCE vs BUSINESS)
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
