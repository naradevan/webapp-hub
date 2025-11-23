# Unified KML Converter

Convert CSV/KML/KMZ files for FTTH network infrastructure into organized KML/KMZ output.

## Features

- ✅ **Multi-format Support**: CSV, KML, and KMZ inputs
- ✅ **4 Data Types**: Homepass (HP), FAT/FDT, POLE, and Clamp/Hook (CH)
- ✅ **Smart Coordinate Formatting**: Auto-format to 9 chars (lat) and 10 chars (lon)
- ✅ **Header Validation**: Warns if CSV headers don't match expected format
- ✅ **Path Generation**: Create HP→FAT connection paths based on FAT_CODE matching
- ✅ **Modular Architecture**: Easy to extend with new fields
- ✅ **Export Options**: KML or KMZ output
- ✅ **Dark Theme**: Professional monochrome interface

## Quick Start

### Local Usage
1. Open `index.html` in a modern web browser
2. Upload your CSV/KML/KMZ files to the appropriate slots
3. Enable path generation if needed (requires HP + FAT data)
4. Click "Generate KML" or "Generate KMZ"

### Deployment to Vercel/GitHub Pages
1. Upload all files maintaining the folder structure
2. Set `index.html` as the entry point
3. Deploy!

## File Structure

```
kml-converter/
├── index.html              # Main UI and orchestrator
├── js/
│   ├── hp-converter.js    # Homepass converter (27 fields)
│   ├── fat-converter.js   # FAT converter (conditional styling)
│   ├── pole-converter.js  # POLE converter
│   ├── ch-converter.js    # Clamp/Hook converter
│   └── path-generator.js  # HP→FAT path generator
└── README.md
```

## Adding New Fields

### Example: Adding "Height" field to FAT

**Edit `js/fat-converter.js`:**

1. Update column mapping:
```javascript
columns: {
  // ... existing columns
  height: 6  // NEW: Column G (index 6)
}
```

2. Update expected headers:
```javascript
expectedHeaders: [
  // ... existing headers
  'Ketinggian Lokasi'  // NEW
]
```

3. Update converter function:
```javascript
const data = {
  // ... existing fields
  height: cols[config.columns.height]  // NEW
};
```

4. Update placemark generation:
```javascript
<SimpleData name="Height">${data.height}</SimpleData>  <!-- NEW -->
```

That's it! No need to touch `index.html`.

## CSV Format Requirements

### HP (Homepass) - 28 columns
| Index | Header | Example |
|-------|--------|---------|
| 0 | HOMEPASS_ID | HP001 |
| 1 | CLUSTER_NAME | PETUNGSEWU |
| ... | ... | ... |
| 13 | BUILDING_LATITUDE | -6.226252 |
| 14 | BUILDING_LONGITUDE | 107.294075 |
| 12 | FAT_CODE | FV5012S02B03 |

### FAT - 6 columns
| Index | Header | Example |
|-------|--------|---------|
| 0 | Pole ID (New) | P001 |
| 1 | Coordinate (Lat) NEW | -6.226252 |
| 2 | Coordinate (Long) NEW | 107.294075 |
| 3 | Pole Provider (New) | PLN |
| 4 | Pole Type | Concrete |
| 5 | FAT ID/NETWORK ID | FV5012S02B03 |

**Conditional Styling:**
- FAT ID length < 9 chars → White square icon
- FAT ID length >= 9 chars → Green triangle icon

### POLE - 5 columns
| Index | Header | Example |
|-------|--------|---------|
| 0 | Pole ID (New) | P001 |
| 1 | Coordinate (Lat) NEW | -6.226252 |
| 2 | Coordinate (Long) NEW | 107.294075 |
| 3 | Pole Provider (New) | PLN |
| 4 | Pole Type | Concrete |

### Clamp/Hook - 3 columns
| Index | Header | Example |
|-------|--------|---------|
| 0 | Clamp_Hook_ID | CH001 |
| 1 | Clamp_Hook_LATITUDE | -6.226252 |
| 2 | Clamp_Hook_LONGITUDE | 107.294075 |

## Coordinate Formatting

Input coordinates are auto-formatted to:
- **Latitude**: 9 characters (e.g., `-6.226252`)
- **Longitude**: 10 characters (e.g., `107.294000`)

Supports multiple input formats:
- Separate columns: `"-6.226252"`, `"107.294075"`
- Space-separated: `"-6.226252 107.294075"`
- Comma-separated: `"-6.226252,107.294075"`

## Path Generation

When enabled, the tool generates LineString paths from HP to FAT based on FAT_CODE matching:
1. Reads `FAT_CODE` from HP data
2. Finds matching `FAT_ID` in FAT data
3. Creates yellow path line between coordinates
4. Exports in "HP_TO_FAT_PATHS" folder

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires ES6 module support.

## Technologies

- Pure HTML5 + CSS3 + JavaScript (ES6 modules)
- No backend required
- JSZip for KMZ handling (loaded from CDN)
- Works 100% offline after first load

## License

MIT License - Free to use and modify

## Support

For issues or questions, create an issue on GitHub.
