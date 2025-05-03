"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { FileUpload } from "@/components/ui/file-upload";
import { Download, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LegoBrickPreview } from "@/components/LegoBrickPreview";
import { Separator } from "@/components/ui/separator";

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
    link.download = `brickified-image-${new Date().getTime()}.png`;
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
    <Container>
      <div className="flex flex-col items-center gap-12 py-12">
        <h1 className="text-4xl font-bold">Welcome to Lego Pic</h1>
        <p className="text-xl text-center max-w-2xl">
          Transform your photos into Lego-style images with our easy-to-use tool.
        </p>
        
        <div className="w-full max-w-md">
          {!imagePreview ? (
            <div className="mb-6">
              <FileUpload 
                onFileSelect={handleFileSelect}
                accept="image/*"
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="text-sm"
              >
                {legoImage ? "Brickify another image" : "Choose Different Image"}
              </Button>
            </div>
          )}
          
          {imagePreview && !legoImage && (
            <div className="flex flex-col my-6 gap-6">
              <div className="flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Selected preview"
                  className="rounded shadow-lg border object-contain max-w-full"
                  width={300}
                  height={200}
                  style={{ width: 'auto', height: 'auto', maxHeight: '200px' }}
                />
              </div>
              
              {imageStats && (
                <div className="text-sm text-gray-600 space-y-4 w-full">
                  <div className="flex justify-between items-center px-1">
                    <div>
                      <p className="font-medium">Image Stats</p>
                      <p className="text-gray-500">{imageStats.width} × {imageStats.height} px · {(imageStats.width / imageStats.height).toFixed(2)} ratio</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">
                        {brickSize}×{Math.round(brickSize / (imageStats.width / imageStats.height))}px bricks
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="brick-size">Brick Width: {brickSize}px</Label>
                          <div className="flex gap-1">
                            <Button
                              variant="outline" 
                              size="icon"
                              onClick={() => setBrickSize(Math.max(10, brickSize - 5))}
                              className="h-7 w-7"
                            >
                              <ZoomOut className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setBrickSize(Math.min(50, brickSize + 5))}
                              className="h-7 w-7"
                            >
                              <ZoomIn className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <Slider
                          id="brick-size"
                          min={10}
                          max={50}
                          step={1}
                          value={[brickSize]}
                          onValueChange={(values) => setBrickSize(values[0])}
                        />
                        <p className="text-xs text-gray-500">
                          Smaller value = more detail, larger final image
                        </p>
                        
                        {imageStats && (
                          <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2 border">
                            <div className="flex justify-between">
                              <span>Brick Width:</span>
                              <span className="font-medium">{brickSize}px</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Brick Height:</span>
                              <span className="font-medium">{Math.round(brickSize / (imageStats.width / imageStats.height))}px</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleUpload}
                        disabled={loading || !image}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? "Brickifying..." : "Brickify!"}
                      </Button>
                    </div>
                    
                    <div className="flex justify-center">
                      <LegoBrickPreview 
                        brickWidth={brickSize}
                        brickHeight={imageStats ? Math.round(brickSize / (imageStats.width / imageStats.height)) : brickSize}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
          
          {showSuccess && (
            <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 text-center bg-green-100 text-green-800 p-2 px-4 rounded-md border border-green-200 shadow-md animate-in fade-in slide-in-from-top duration-500 z-50">
              Successfully brickified your image!
            </div>
          )}
          
          {legoImage && (
            <div className="flex flex-col items-center mt-8 gap-4">
              <Image
                src={legoImage}
                alt="Lego-fied"
                className="max-w-xs max-h-96 rounded shadow-lg border"
                width={400}
                height={300}
              />
              <Button 
                onClick={handleDownload}
                className="mt-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            </div>
          )}
        </div>
          
        {!imagePreview && (
          <div className="mt-12 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center" id="how-it-works">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
                <p className="text-gray-600">Select any photo from your device to convert.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Choose Your Style</h3>
                <p className="text-gray-600">Select from different Lego brick styles and colors.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Download Result</h3>
                <p className="text-gray-600">Get your Lego-style image and share it with friends.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
