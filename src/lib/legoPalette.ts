// LEGO color palettes and utilities for color restriction
// Source: http://www.brickjournal.com/files/PDFs/2010LEGOcolorpalette.pdf

export type LegoPaletteName = 'solid' | 'transparent' | 'effects' | 'mono' | 'all';

export const LEGO_COLOR_NAMES: Record<string, string> = {
  '001': 'White',
  '194': 'Light Bluish Grey (Medium Stone Grey)',
  '199': 'Dark Bluish Grey (Dark Stone Grey)',
  '026': 'Black',
  '005': 'Tan (Brick Yellow)',
  '138': 'Dark Tan (Sand Yellow)',
  '330': 'Olive Green',
  '151': 'Sand Green',
  '135': 'Sand Blue',
  '353': 'Coral (Vibrant Coral)',
  '021': 'Red (Bright Red)',
  '154': 'Dark Red (New Dark Red)',
  '192': 'Reddish Brown',
  '308': 'Dark Brown',
  '283': 'Light Nougat',
  '223': 'Medium Tan (Warm Tan)',
  '018': 'Nougat',
  '312': 'Medium Nougat',
  '106': 'Orange (Bright Orange)',
  '038': 'Dark Orange',
  '450': 'Medium Brown',
  '226': 'Bright Light Yellow (Cool Yellow)',
  '024': 'Yellow (Bright Yellow)',
  '191': 'Bright Light Orange (Flame Yellowish Orange)',
  '368': 'Neon Yellow (Vibrant Yellow)',
  '326': 'Yellowish Green (Spring Yellowish Green)',
  '119': 'Lime (Bright Yellowish Green)',
  '037': 'Bright Green',
  '028': 'Green (Dark Green)',
  '141': 'Dark Green (Earth Green)',
  '323': 'Light Aqua (Aqua)',
  '107': 'Dark Turquoise (Bright Bluish Green)',
  '322': 'Medium Azure',
  '321': 'Dark Azure',
  '212': 'Bright Light Blue (Light Royal Blue)',
  '102': 'Medium Blue',
  '023': 'Blue (Bright Blue)',
  '140': 'Dark Blue (Earth Blue)',
  '325': 'Lavender',
  '324': 'Medium Lavender',
  '268': 'Dark Purple (Medium Lilac)',
  '222': 'Bright Pink (Light Purple)',
  '221': 'Dark Pink (Bright Purple)',
  '124': 'Magenta (Bright Reddish Violet)',
};

export const LEGOS: Record<LegoPaletteName, Record<string, [number, number, number]>> = {
  solid: {
    '001': [0xF4, 0xF4, 0xF4], // White
    '194': [0xA2, 0xAA, 0xAD], // Light Bluish Grey (Medium Stone Grey)
    '199': [0x63, 0x66, 0x6A], // Dark Bluish Grey (Dark Stone Grey)
    '026': [0x10, 0x18, 0x20], // Black
    '005': [0xEF, 0xDB, 0xB2], // Tan (Brick Yellow)
    '138': [0x9A, 0x7F, 0x62], // Dark Tan (Sand Yellow)
    '330': [0x8D, 0x8B, 0x53], // Olive Green
    '151': [0x81, 0x9E, 0x87], // Sand Green
    '135': [0x68, 0x81, 0x97], // Sand Blue
    '353': [0xFF, 0x58, 0x69], // Coral (Vibrant Coral)
    '021': [0xCD, 0x00, 0x1A], // Red (Bright Red)
    '154': [0x8A, 0x2B, 0x2B], // Dark Red (New Dark Red)
    '192': [0x7C, 0x3A, 0x2D], // Reddish Brown
    '308': [0x3F, 0x20, 0x21], // Dark Brown
    '283': [0xEC, 0xC3, 0xB2], // Light Nougat
    '223': [0xFF, 0xC2, 0x7B], // Medium Tan (Warm Tan)
    '018': [0xE5, 0x9E, 0x6D], // Nougat
    '312': [0xC8, 0x82, 0x42], // Medium Nougat
    '106': [0xFF, 0x82, 0x00], // Orange (Bright Orange)
    '038': [0xBE, 0x54, 0x00], // Dark Orange
    '450': [0x78, 0x51, 0x35], // Medium Brown
    '226': [0xF9, 0xE2, 0x7D], // Bright Light Yellow (Cool Yellow)
    '024': [0xFF, 0xCD, 0x00], // Yellow (Bright Yellow)
    '191': [0xFF, 0xB6, 0x00], // Bright Light Orange (Flame Yellowish Orange)
    '368': [0xFF, 0xFC, 0x00], // Neon Yellow (Vibrant Yellow)
    '326': [0xCD, 0xEA, 0x80], // Yellowish Green (Spring Yellowish Green)
    '119': [0xAE, 0xD0, 0x00], // Lime (Bright Yellowish Green)
    '037': [0x00, 0xAA, 0x15], // Bright Green
    '028': [0x00, 0x89, 0x2F], // Green (Dark Green)
    '141': [0x00, 0x49, 0x1E], // Dark Green (Earth Green)
    '323': [0xB9, 0xDC, 0xD2], // Light Aqua (Aqua)
    '107': [0x00, 0x93, 0x9D], // Dark Turquoise (Bright Bluish Green)
    '322': [0x00, 0xBC, 0xE1], // Medium Azure
    '321': [0x00, 0x94, 0xD5], // Dark Azure
    '212': [0x92, 0xC1, 0xE9], // Bright Light Blue (Light Royal Blue)
    '102': [0x6C, 0xAC, 0xE4], // Medium Blue
    '023': [0x00, 0x6A, 0xC6], // Blue (Bright Blue)
    '140': [0x00, 0x30, 0x57], // Dark Blue (Earth Blue)
    '325': [0xC7, 0xB2, 0xDE], // Lavender
    '324': [0xA7, 0x7B, 0xCA], // Medium Lavender
    '268': [0x56, 0x3D, 0x82], // Dark Purple (Medium Lilac)
    '222': [0xF1, 0xA7, 0xDC], // Bright Pink (Light Purple)
    '221': [0xE5, 0x6D, 0xB1], // Dark Pink (Bright Purple)
    '124': [0xA2, 0x00, 0x67], // Magenta (Bright Reddish Violet)
  },
  transparent: {
    '044': [0xf9, 0xef, 0x69],
    '182': [0xec, 0x76, 0x0e],
    '047': [0xe7, 0x66, 0x48],
    '041': [0xe0, 0x2a, 0x29],
    '113': [0xee, 0x9d, 0xc3],
    '126': [0x9c, 0x95, 0xc7],
    '042': [0xb6, 0xe0, 0xea],
    '043': [0x50, 0xb1, 0xe8],
    '143': [0xce, 0xe3, 0xf6],
    '048': [0x63, 0xb2, 0x6e],
    '311': [0x99, 0xff, 0x66],
    '049': [0xf1, 0xed, 0x5b],
    '111': [0xa6, 0x91, 0x82],
    '040': [0xee, 0xee, 0xee],
  },
  effects: {
    '131': [0x8d, 0x94, 0x96],
    '297': [0xaa, 0x7f, 0x2e],
    '148': [0x49, 0x3f, 0x3b],
    '294': [0xfe, 0xfc, 0xd5],
  },
  mono: {
    '001': [0xf4, 0xf4, 0xf4],
    '026': [0x02, 0x02, 0x02],
  },
  all: {}, // will be filled by mergePalettes
};

function mergePalettes(palettes: typeof LEGOS): typeof LEGOS {
  const unified: Record<string, [number, number, number]> = {};
  for (const palette of Object.keys(palettes) as LegoPaletteName[]) {
    if (palette === 'all') continue;
    for (const item in palettes[palette]) {
      unified[item] = palettes[palette][item];
    }
  }
  return { ...palettes, all: unified };
}

function flattenPalette(palette: Record<string, [number, number, number]>): number[] {
  return Object.values(palette).flat();
}

export function getLegoPalettes() {
  // Returns a copy of all palettes, with 'all' merged
  return mergePalettes(LEGOS);
}

export function getFlattenedPalette(paletteName: LegoPaletteName = 'solid'): number[] {
  const palettes = getLegoPalettes();
  return flattenPalette(palettes[paletteName]);
}

export function restrictColorToPalette(
  color: [number, number, number],
  paletteName: LegoPaletteName = 'solid'
): [number, number, number] {
  // Returns the closest color in the palette to the input color
  const palettes = getLegoPalettes();
  const palette = Object.values(palettes[paletteName]);
  let minDist = Infinity;
  let closest: [number, number, number] = palette[0];
  for (const candidate of palette) {
    const dist =
      Math.pow(color[0] - candidate[0], 2) +
      Math.pow(color[1] - candidate[1], 2) +
      Math.pow(color[2] - candidate[2], 2);
    if (dist < minDist) {
      minDist = dist;
      closest = candidate;
    }
  }
  return closest;
}

/**
 * Returns the name of a LEGO color given its color key
 * @param colorKey The LEGO color key (e.g. '001')
 * @returns The color name or 'Unknown' if not found
 */
export function getLegoColorName(colorKey: string): string {
  return LEGO_COLOR_NAMES[colorKey] || 'Unknown';
}

/**
 * Finds the color key for a given RGB color in the specified palette
 * @param color RGB color as [r, g, b] array
 * @param paletteName The palette to search in
 * @returns The color key or undefined if not found
 */
export function findColorKey(
  color: [number, number, number], 
  paletteName: LegoPaletteName = 'solid'
): string | undefined {
  const palettes = getLegoPalettes();
  const palette = palettes[paletteName];
  
  for (const [key, value] of Object.entries(palette)) {
    if (value[0] === color[0] && value[1] === color[1] && value[2] === color[2]) {
      return key;
    }
  }
  
  return undefined;
} 