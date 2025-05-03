import { NextRequest } from 'next/server'
import { createCanvas, loadImage, Image as CanvasImage, Canvas, CanvasRenderingContext2D, ImageData } from 'canvas'
import Busboy from 'busboy'
import { promises as fs } from 'fs'
import path from 'path'
import { restrictColorToPalette } from '@/lib/legoPalette'

export const config = {
  api: { bodyParser: false }
}

function overlayEffect(color: number, overlay: number): number {
  if (color < 33) return overlay - 100
  if (color > 233) return overlay + 100
  return overlay - 133 + color
}

function applyColorOverlay(imageData: ImageData, color: [number, number, number]): ImageData {
  const [overlayRed, overlayGreen, overlayBlue] = color
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = overlayEffect(data[i], overlayRed)
    data[i + 1] = overlayEffect(data[i + 1], overlayGreen)
    data[i + 2] = overlayEffect(data[i + 2], overlayBlue)
  }
  return imageData
}

async function makeLegoImage(sourceImg: CanvasImage, brickImg: CanvasImage, maxThumbSize: number = 30): Promise<Buffer> {
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
  const thumbCanvas: Canvas = createCanvas(thumbWidth, thumbHeight);
  const thumbCtx: CanvasRenderingContext2D = thumbCanvas.getContext('2d');
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
  
  const legoCanvas: Canvas = createCanvas(baseWidth * brickWidth, baseHeight * brickHeight);
  const legoCtx: CanvasRenderingContext2D = legoCanvas.getContext('2d');
  legoCtx.fillStyle = 'white';
  legoCtx.fillRect(0, 0, legoCanvas.width, legoCanvas.height);
  const srcCanvas: Canvas = createCanvas(baseWidth, baseHeight);
  const srcCtx: CanvasRenderingContext2D = srcCanvas.getContext('2d');
  srcCtx.drawImage(thumbCanvas, 0, 0, baseWidth, baseHeight);
  const srcData: ImageData = srcCtx.getImageData(0, 0, baseWidth, baseHeight);
  const brickCanvas: Canvas = createCanvas(brickWidth, brickHeight);
  const brickCtx: CanvasRenderingContext2D = brickCanvas.getContext('2d');
  for (let x = 0; x < baseWidth; x++) {
    for (let y = 0; y < baseHeight; y++) {
      const idx = (y * baseWidth + x) * 4;
      let color: [number, number, number] = [
        srcData.data[idx],
        srcData.data[idx + 1],
        srcData.data[idx + 2]
      ];
      // Restrict color to closest LEGO palette color
      color = restrictColorToPalette(color, 'solid');
      brickCtx.clearRect(0, 0, brickWidth, brickHeight);
      brickCtx.drawImage(brickImg, 0, 0, brickWidth, brickHeight);
      let brickData: ImageData = brickCtx.getImageData(0, 0, brickWidth, brickHeight);
      brickData = applyColorOverlay(brickData, color);
      brickCtx.putImageData(brickData, 0, 0);
      legoCtx.drawImage(brickCanvas, x * brickWidth, y * brickHeight);
    }
  }
  return legoCanvas.toBuffer('image/png');
}

function parseForm(req: NextRequest): Promise<{ image: Buffer; brickSize?: number }> {
  return new Promise((resolve, reject) => {
    console.log('[legofy] Starting parseForm');
    const busboy = Busboy({
      headers: Object.fromEntries(req.headers.entries()),
    })
    const files: { [key: string]: Buffer[] } = {}
    const fields: { [key: string]: string } = {}
    
    busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream) => {
      console.log(`[legofy] Receiving file: ${fieldname}`);
      const chunks: Buffer[] = []
      file.on('data', (data: Buffer) => {
        console.log(`[legofy] Received chunk for ${fieldname}, size: ${data.length}`);
        chunks.push(data)
      })
      file.on('end', () => {
        files[fieldname] = [Buffer.concat(chunks)]
        console.log(`[legofy] Finished receiving file: ${fieldname}, total size: ${files[fieldname][0].length}`);
      })
    })
    
    busboy.on('field', (fieldname: string, val: string) => {
      console.log(`[legofy] Received field: ${fieldname} = ${val}`);
      fields[fieldname] = val;
    })
    
    busboy.on('finish', () => {
      console.log('[legofy] Busboy finished parsing form');
      if (!files.image) {
        console.error('[legofy] Missing image file:', Object.keys(files));
        return reject(new Error('Missing image file'))
      }
      
      // Parse brickSize if provided
      let brickSize: number | undefined = undefined;
      if (fields.brickSize) {
        const parsedSize = parseInt(fields.brickSize, 10);
        if (!isNaN(parsedSize) && parsedSize > 0) {
          brickSize = parsedSize;
        }
      }
      
      resolve({
        image: files.image[0],
        brickSize
      })
    })
    busboy.on('error', (err) => {
      console.error('[legofy] Busboy error:', err);
      reject(err)
    })
    // req.body is ReadableStream<Uint8Array>
    const reader = (req.body as ReadableStream<Uint8Array>).getReader()
    function read() {
      reader.read().then(({ value, done }) => {
        if (done) {
          busboy.end()
          console.log('[legofy] Done reading request body');
        } else {
          busboy.write(Buffer.from(value))
          read()
        }
      })
    }
    read()
  })
}

export async function POST(req: NextRequest) {
  console.log('[legofy] POST handler called');
  try {
    const { image, brickSize } = await parseForm(req)
    console.log('[legofy] File parsed. Image size:', image.length, 'Brick size:', brickSize);
    // Load brick image from file system (public/1x1.png)
    const brickPath = path.join(process.cwd(), 'public', '1x1.png');
    const brickBuffer = await fs.readFile(brickPath);
    const [sourceImg, brickImg] = await Promise.all([
      loadImage(image),
      loadImage(brickBuffer)
    ])
    console.log('[legofy] Images loaded');
    // Use the provided brickSize or fall back to default of 30
    const maxThumbSize = brickSize || 30;
    const buffer = await makeLegoImage(sourceImg, brickImg, maxThumbSize)
    console.log('[legofy] Lego image created, size:', buffer.length);
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="lego.png"'
      }
    })
  } catch (error) {
    console.error('[legofy] Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 