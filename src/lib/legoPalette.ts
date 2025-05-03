// LEGO color palettes and utilities for color restriction
// Source: http://www.brickjournal.com/files/PDFs/2010LEGOcolorpalette.pdf

export type LegoPaletteName = 'solid' | 'transparent' | 'effects' | 'mono' | 'all';

export const LEGOS: Record<LegoPaletteName, Record<string, [number, number, number]>> = {
  solid: {
    '024': [0xfe, 0xc4, 0x01],
    '106': [0xe7, 0x64, 0x19],
    '021': [0xde, 0x01, 0x0e],
    '221': [0xde, 0x38, 0x8b],
    '023': [0x01, 0x58, 0xa8],
    '028': [0x01, 0x7c, 0x29],
    '119': [0x95, 0xb9, 0x0c],
    '192': [0x5c, 0x1d, 0x0d],
    '018': [0xd6, 0x73, 0x41],
    '001': [0xf4, 0xf4, 0xf4],
    '026': [0x02, 0x02, 0x02],
    '226': [0xff, 0xff, 0x99],
    '222': [0xee, 0x9d, 0xc3],
    '212': [0x87, 0xc0, 0xea],
    '037': [0x01, 0x96, 0x25],
    '005': [0xd9, 0xbb, 0x7c],
    '283': [0xf5, 0xc1, 0x89],
    '208': [0xe4, 0xe4, 0xda],
    '191': [0xf4, 0x9b, 0x01],
    '124': [0x9c, 0x01, 0xc6],
    '102': [0x48, 0x8c, 0xc6],
    '135': [0x5f, 0x75, 0x8c],
    '151': [0x60, 0x82, 0x66],
    '138': [0x8d, 0x75, 0x53],
    '038': [0xa8, 0x3e, 0x16],
    '194': [0x9c, 0x92, 0x91],
    '154': [0x80, 0x09, 0x1c],
    '268': [0x2d, 0x16, 0x78],
    '140': [0x01, 0x26, 0x42],
    '141': [0x01, 0x35, 0x17],
    '312': [0xaa, 0x7e, 0x56],
    '199': [0x4d, 0x5e, 0x57],
    '308': [0x31, 0x10, 0x07],
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