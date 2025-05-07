# Legofy Photo

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://legofy-photo.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Transform your photos into LEGO-style brick art using client-side image processing.

## Features

- **Client-side Image Processing**: All image processing happens in your browser without sending data to a server
- **Custom Brick Size**: Adjust the brick size to create different levels of detail
- **Download Your Creation**: Easily download your LEGO-fied images
- **Mobile-Friendly**: Works on desktop and mobile devices

## How It Works

This application uses browser-based Canvas API to transform your photos into LEGO-style brick art:

1. You upload an image
2. The app downsizes it to a smaller grid based on your selected brick size
3. Each "pixel" in that grid is replaced with a LEGO brick
4. Colors are matched to the official LEGO color palette

All processing happens entirely in your browser - your images are never uploaded to a server.

## Technical Implementation

The app is built with:

- **Next.js** and **React** for the UI framework
- **TypeScript** for type safety
- **Shadcn UI** and **Tailwind CSS** for styling
- **HTML5 Canvas API** for client-side image manipulation

### Recent Refactoring

We recently refactored the application to process images entirely client-side instead of on the server:

- Created a separate `legofy.ts` library with self-contained image processing functions
- Implemented browser-compatible canvas operations to match the original server-side functionality
- Improved performance by moving processing to the client's device

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## License

MIT
