"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ZoomIn, ZoomOut, Github, Upload, RefreshCw } from "lucide-react";
import { LegoBrickPreview } from "@/components/LegoBrickPreview";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [legoImage, setLegoImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageStats, setImageStats] = useState<{ width: number; height: number } | null>(null);
  const [brickSize, setBrickSize] = useState(30); // Default value from the API

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showSuccess) {
      timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  function handleFileSelect(file: File) {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      
      // Get image dimensions
      const img = new globalThis.Image();
      img.onload = () => {
        setImageStats({
          width: img.width,
          height: img.height
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }

  function handleReset() {
    setImage(null);
    setImagePreview(null);
    setLegoImage(null);
    setError(null);
    setShowSuccess(false);
    setImageStats(null);
  }

  function handleDownload() {
    if (!legoImage) return;
    
    const link = document.createElement("a");
    link.href = legoImage;
    link.download = `legofied-image-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleUpload() {
    if (!image) {
      setError("Please select an image.");
      return;
    }
    setError(null);
    setLoading(true);
    setLegoImage(null);
    setShowSuccess(false);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("brickSize", brickSize.toString());
      const res = await fetch("/api/legofy", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to legofy image");
      }
      const blob = await res.blob();
      setLegoImage(URL.createObjectURL(blob));
      setShowSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-red-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Legofy Photo</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/leonardoFu/legofy-photo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-blue-700">Transform Your Photos Into LEGO Brick Art!</h2>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Upload any image and watch it transform into a colorful LEGO brick masterpiece. Adjust the brick size to
            create your perfect pixelated creation!
          </p>
        </div>

        {/* Main App Interface */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-600">
          {/* Tabs */}
          <Tabs defaultValue="transform" className="w-full">
            <div className="bg-blue-600 px-0 py-0">
              <TabsList className="grid grid-cols-2 bg-transparent w-full p-0 h-auto">
                <TabsTrigger
                  value="transform"
                  className="text-lg font-medium bg-yellow-400 text-blue-900 rounded-t-lg rounded-b-none border-0 h-12 data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900"
                >
                  Transform
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="text-lg font-medium bg-blue-700 text-white rounded-t-lg rounded-b-none border-0 h-12 data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900 opacity-60"
                  disabled
                >
                  Gallery
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transform" className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Original Image */}
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-md">
                      {!imagePreview ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center">
                            <Upload className="mr-2 h-4 w-4" /> Upload Image
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <Image
                          src={imagePreview}
                          alt="Original image"
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                    {imagePreview && (
                      <div className="w-full">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleReset}
                        >
                          <Upload className="mr-2 h-4 w-4" /> Choose Different Image
                        </Button>
                      </div>
                    )}
                  </div>

                  {imageStats && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-gray-700 mb-2">Image Stats</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Dimensions:</div>
                        <div>{imageStats.width} × {imageStats.height} px</div>
                        <div className="text-gray-600">Ratio:</div>
                        <div>{(imageStats.width / imageStats.height).toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Legofied Image & Controls */}
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 flex flex-col">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-md bg-gray-200">
                      {legoImage ? (
                        <Image
                          src={legoImage}
                          alt="Legofied image"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {loading ? (
                            <div className="flex flex-col items-center text-gray-400">
                              <RefreshCw className="h-10 w-10 animate-spin mb-2" />
                              <p>Processing...</p>
                            </div>
                          ) : imageStats ? (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                              <LegoBrickPreview 
                                brickWidth={brickSize}
                                brickHeight={Math.round(brickSize / (imageStats.width / imageStats.height))}
                              />
                            </div>
                          ) : (
                            <p className="text-gray-400">Legofied image will appear here</p>
                          )}
                        </div>
                      )}
                    </div>
                    {legoImage && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleDownload}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="bg-yellow-100 p-6 rounded-lg border-2 border-yellow-300 shadow-inner">
                    <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                      Brick Settings
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="font-medium text-gray-700">Brick Width: {brickSize}px</label>
                          <span className="text-sm text-gray-500">
                            {brickSize < 20 ? "Low Detail" : brickSize > 40 ? "High Detail" : "Medium Detail"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <ZoomIn className="h-4 w-4 text-gray-500" />
                          <Slider
                            value={[brickSize]}
                            min={10}
                            max={50}
                            step={1}
                            onValueChange={(values) => setBrickSize(values[0])}
                            className="flex-1"
                          />
                          <ZoomOut className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>

                      {imageStats && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Brick Width:</label>
                            <Input
                              type="number"
                              value={brickSize}
                              onChange={(e) => setBrickSize(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Brick Height:</label>
                            <Input
                              type="number"
                              value={Math.round(brickSize / (imageStats.width / imageStats.height))}
                              readOnly
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 font-bold"
                        onClick={handleUpload}
                        disabled={loading || !image}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Legofying...
                          </>
                        ) : (
                          'Legofy!'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="p-6">
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Your Legofied Creations</h3>
                <p className="text-gray-500">Gallery coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                </div>
                <span className="font-bold">Legofy Photo</span>
              </div>
              <p className="text-sm mt-1 text-blue-200">Transform your photos into LEGO-style artwork</p>
            </div>
            <div>
              <p className="text-sm text-blue-200">© {new Date().getFullYear()} Legofy Photo. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {showSuccess && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 text-center bg-green-100 text-green-800 p-2 px-4 rounded-md border border-green-200 shadow-md animate-in fade-in slide-in-from-top duration-500 z-50">
          Successfully legofied your image!
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 text-center bg-red-100 text-red-800 p-2 px-4 rounded-md border border-red-200 shadow-md animate-in fade-in slide-in-from-top duration-500 z-50">
          {error}
        </div>
      )}
    </div>
  );
}
