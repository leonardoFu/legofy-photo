import { restrictColorToPalette, getLegoPalettes, type LegoPaletteName } from './legoPalette';

/**
 * Applies a color overlay effect to a pixel
 */
function overlayEffect(color: number, overlay: number): number {
  if (color < 33) return overlay - 100;
  if (color > 233) return overlay + 100;
  return overlay - 133 + color;
}

/**
 * Applies a color overlay to an ImageData object
 */
function applyColorOverlay(imageData: ImageData, color: [number, number, number]): ImageData {
  const [overlayRed, overlayGreen, overlayBlue] = color;
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = overlayEffect(data[i], overlayRed);
    data[i + 1] = overlayEffect(data[i + 1], overlayGreen);
    data[i + 2] = overlayEffect(data[i + 2], overlayBlue);
  }
  return imageData;
}

export interface LegoResult {
  image: Blob;
  stats: {
    totalBricks: number;
    colors: {
      colorId: string;
      color: [number, number, number];
      count: number;
      percentage: number;
    }[];
  };
}

/**
 * Creates a Legoified image from a source image and a brick image
 */
export async function makeLegoImage(
  sourceImg: HTMLImageElement,
  brickImg: HTMLImageElement,
  maxThumbSize: number = 30,
  paletteName: LegoPaletteName = 'solid'
): Promise<LegoResult> {
  // Create canvases for processing
  const createCanvas = (width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    // Just use regular canvas for consistent behavior across browsers
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    return [canvas, ctx];
  };

  // Resize sourceImg to a thumbnail (maintain aspect ratio)
  let thumbWidth = sourceImg.width;
  let thumbHeight = sourceImg.height;
  const aspectRatio = thumbWidth / thumbHeight;
  
  if (thumbWidth > maxThumbSize || thumbHeight > maxThumbSize) {
    if (aspectRatio > 1) {
      // Landscape image - width is the controlling dimension
      thumbWidth = maxThumbSize;
      thumbHeight = Math.round(maxThumbSize / aspectRatio);
    } else {
      // Portrait image - height is the controlling dimension
      const brickHeight = Math.round(maxThumbSize / aspectRatio);
      thumbHeight = brickHeight;
      thumbWidth = Math.round(brickHeight * aspectRatio);
    }
  }
  
  // Draw thumbnail
  const [thumbCanvas, thumbCtx] = createCanvas(thumbWidth, thumbHeight);
  thumbCtx.drawImage(sourceImg, 0, 0, thumbWidth, thumbHeight);
  
  // Use the thumbnail as the new sourceImg
  const baseWidth = thumbWidth;
  const baseHeight = thumbHeight;
  const brickWidth = brickImg.width;
  const brickHeight = brickImg.height;
  
  console.log('baseWidth', baseWidth);
  console.log('baseHeight', baseHeight);
  console.log('brickWidth', brickWidth);
  console.log('brickHeight', brickHeight);
  console.log('aspectRatio', aspectRatio);
  console.log('maxThumbSize (brick width)', maxThumbSize);
  
  const [legoCanvas, legoCtx] = createCanvas(baseWidth * brickWidth, baseHeight * brickHeight);
  legoCtx.fillStyle = 'white';
  legoCtx.fillRect(0, 0, legoCanvas.width, legoCanvas.height);
  
  const [, srcCtx] = createCanvas(baseWidth, baseHeight);
  srcCtx.drawImage(thumbCanvas, 0, 0, baseWidth, baseHeight);
  const srcData = srcCtx.getImageData(0, 0, baseWidth, baseHeight);
  
  const [brickCanvas, brickCtx] = createCanvas(brickWidth, brickHeight);
  
  // Track color usage
  const colorCounts: Record<string, number> = {};
  const colorMap: Record<string, [number, number, number]> = {};
  const palettes = getLegoPalettes();
  const totalBricks = baseWidth * baseHeight;
  
  for (let x = 0; x < baseWidth; x++) {
    for (let y = 0; y < baseHeight; y++) {
      const idx = (y * baseWidth + x) * 4;
      let color: [number, number, number] = [
        srcData.data[idx],
        srcData.data[idx + 1],
        srcData.data[idx + 2]
      ];
      // Restrict color to closest LEGO palette color
      color = restrictColorToPalette(color, paletteName);
      
      // Track color usage
      const colorKey = color.join(',');
      if (!colorCounts[colorKey]) {
        colorCounts[colorKey] = 0;
        colorMap[colorKey] = color;
      }
      colorCounts[colorKey]++;
      
      brickCtx.clearRect(0, 0, brickWidth, brickHeight);
      brickCtx.drawImage(brickImg, 0, 0, brickWidth, brickHeight);
      let brickData = brickCtx.getImageData(0, 0, brickWidth, brickHeight);
      brickData = applyColorOverlay(brickData, color);
      brickCtx.putImageData(brickData, 0, 0);
      legoCtx.drawImage(brickCanvas, x * brickWidth, y * brickHeight);
    }
  }

  // Find the matching color IDs for each RGB value
  const colorStats = Object.entries(colorCounts).map(([colorKey, count]) => {
    const color = colorMap[colorKey];
    // Find the color ID by comparing RGB values
    let colorId = '';
    for (const palette in palettes) {
      if (palette === 'all') continue;
      for (const id in palettes[palette as LegoPaletteName]) {
        const paletteColor = palettes[palette as LegoPaletteName][id];
        if (
          paletteColor[0] === color[0] &&
          paletteColor[1] === color[1] &&
          paletteColor[2] === color[2]
        ) {
          colorId = id;
          break;
        }
      }
      if (colorId) break;
    }
    
    return {
      colorId,
      color,
      count,
      percentage: (count / totalBricks) * 100
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending

  return new Promise<LegoResult>((resolve) => {
    legoCanvas.toBlob((blob) => {
      resolve({
        image: blob!,
        stats: {
          totalBricks,
          colors: colorStats
        }
      });
    }, 'image/png');
  });
}

/**
 * Loads an image from a File or Blob
 */
export function loadImage(imageFile: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Loads an image from a URL
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
    img.crossOrigin = 'anonymous';
  });
}

/**
 * Main function to legofy an image
 */
export async function legofyImage(
  imageFile: File | Blob,
  brickSize: number = 30,
  paletteName: LegoPaletteName = 'solid'
): Promise<LegoResult> {
  try {
    // Load source image from file
    const sourceImg = await loadImage(imageFile);
    
    // Load brick image
    const brickImg = await loadImageFromUrl('/1x1.png');
    
    // Generate lego image
    return await makeLegoImage(sourceImg, brickImg, brickSize, paletteName);
  } catch (error) {
    console.error('Error during client-side legofying:', error);
    throw error;
  }
} 