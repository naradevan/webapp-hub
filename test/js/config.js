// --- KONFIGURASI UTAMA ---
export const TEXT_SIZE = 1.0;
export const SNAP_TOLERANCE_METERS = 15;

// --- STRUKTUR FOLDER ---
export const STRUCTURE_CLUSTER = [
    'BOUNDARY FAT', 'FAT', 'HP COVER', 'HP UNCOVER',
    'EXISTING POLE EMR 7-2.5', 'EXISTING POLE EMR 7-3', 'EXISTING POLE EMR 7-4', 'EXISTING POLE EMR 9-4',
    'EXISTING POLE PARTNER 7-4', 'EXISTING POLE PARTNER 9-4',
    'NEW POLE 7-2.5', 'NEW POLE 7-3', 'NEW POLE 7-4', 'NEW POLE 9-4',
    'DISTRIBUTION CABLE', 'SLACK HANGER', 'SLING WIRE'
];

export const STRUCTURE_SUBFEEDER = [
    'FDT', 'JOINT CLOSURE', 'EXISTING POLE EMR 7-2.5', 'EXISTING POLE EMR 7-3', 'EXISTING POLE EMR 7-4', 
    'EXISTING POLE EMR 7-5', 'EXISTING POLE EMR 9-5', 'EXISTING POLE EMR 9-4', 
    'EXISTING POLE PARTNER 7-4', 'EXISTING POLE PARTNER 9-4', 'NEW POLE 7-5', 'NEW POLE 9-5', 
    'NEW POLE 7-4', 'NEW POLE 9-4', 'CABLE', 'SLACK HANGER'
];

// --- RULES & STYLING ---
export const RULES_CLUSTER = [
    { folder: '-', placemark: '288C', line: '-', polygon: '-', colorCode: '#AA0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: '-', placemark: '144C', line: '-', polygon: '-', colorCode: '#AAFF00', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: '-', placemark: '96C', line: '-', polygon: '-', colorCode: '#00FFFF', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: '-', placemark: '72C', line: '-', polygon: '-', colorCode: '#0000FF', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: '-', placemark: '48C', line: '-', polygon: '-', colorCode: '#AA00FF', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: 'BOUNDARY FAT', placemark: '-', line: '-', polygon: '-', colorCode: '#009999', styleLink: '-' },
    { folder: 'FAT', placemark: '-', line: '-', polygon: '-', colorCode: '#FFFF00', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/triangle.png' },
    { folder: 'HP COVER', placemark: '-', line: '-', polygon: '-', colorCode: '#00FF00', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png' },
    { folder: 'HP UNCOVER', placemark: '-', line: '-', polygon: '-', colorCode: '#ff0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png' },
    { folder: 'NEW POLE 9-4', placemark: 'NEW POLE 9-4', line: '-', polygon: '-', colorCode: '#FF0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'NEW POLE 7-4', placemark: 'NEW POLE 7-4', line: '-', polygon: '-', colorCode: '#00FF00', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'NEW POLE 7-3', placemark: 'NEW POLE 7-3', line: '-', polygon: '-', colorCode: '#00FFFF', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'NEW POLE 7-2.5', placemark: 'NEW POLE 7-2.5', line: '-', polygon: '-', colorCode: '#AA00FF', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE EMR 7-2.5', placemark: 'EXISTING POLE EMR 7-2.5', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE EMR 7-3', placemark: 'EXISTING POLE EMR 7-3', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE EMR 7-4', placemark: 'EXISTING POLE EMR 7-4', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE EMR 9-4', placemark: 'EXISTING POLE EMR 9-4', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE PARTNER 7-4', placemark: 'EXISTING POLE PARTNER 7-4', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'EXISTING POLE PARTNER 9-4', placemark: 'EXISTING POLE PARTNER 9-4', line: '-', polygon: '-', colorCode: '#550000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '24C', polygon: '-', colorCode: '#00FF00', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '36C', polygon: '-', colorCode: '#FF00FF', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '48C', polygon: '-', colorCode: '#AA00FF', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '72C', polygon: '-', colorCode: '#550000', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '96C', polygon: '-', colorCode: '#FF0000', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '144C', polygon: '-', colorCode: '#FFFF00', styleLink: '-' },
    { folder: 'DISTRIBUTION CABLE', placemark: '-', line: '288C', polygon: '-', colorCode: '#FFAA00', styleLink: '-' },
    { folder: 'SLING WIRE', placemark: '-', line: '-', polygon: '-', colorCode: '#00FFFF', styleLink: '-' },
    { folder: 'FDT', placemark: 'FDT', line: '-', polygon: '-', colorCode: '#AA0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png' },
    { folder: 'SLACK HANGER', placemark: 'SLACK', line: '-', polygon: '-', colorCode: '#ff0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/target.png' }
];

export const RULES_SUBFEEDER = [
    { folder: 'SLACK HANGER', placemark: 'SLACK', line: '-', polygon: '-', colorCode: '#ff0000', styleLink: 'http://maps.google.com/mapfiles/kml/shapes/target.png' }
];