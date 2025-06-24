"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Download, ZoomIn, ZoomOut, Upload, RefreshCw } from "lucide-react";
import { LegoBrickPreview } from "@/components/LegoBrickPreview";
import { legofyImage, type LegoResult } from "@/lib/legofy";
import { getLegoColorName } from "@/lib/legoPalette";
import { toast } from "sonner";
import { isMobile } from "@/lib/utils";

// Helper function to convert RGB to hexadecimal
function rgbToHex(rgb: number[] | [number, number, number]): string {
  const [r, g, b] = rgb;
  return "#" + 
    ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1);
}

interface LegoImageConverterProps {
  translations: {
    uploadImage: string;
    chooseDifferentImage: string;
    legoPreviewWillAppear: string;
    processing: string;
    download: string;
    brickStats: string;
    totalBricks: string;
    colorDistribution: string;
    brickSettings: string;
    brickWidth: string;
    brickHeight: string;
    lowDetail: string;
    mediumDetail: string;
    moreDetail: string;
    transformToLego: string;
    errorSelectImage: string;
  }
}

export function LegoImageConverter({ translations }: LegoImageConverterProps) {
  // Client-side state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [legoImage, setLegoImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageStats, setImageStats] = useState<{ width: number; height: number } | null>(null);
  const [brickSize, setBrickSize] = useState(50); // Default value from the API
  const [legoStats, setLegoStats] = useState<LegoResult['stats'] | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

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
    setImageStats(null);
    setLegoStats(null);
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
      toast.error(translations.errorSelectImage);
      return;
    }
    setLoading(true);
    setLegoImage(null);
    setLegoStats(null);
    try {
      // Process image client-side only
      const result = await legofyImage(image, brickSize);
      setLegoImage(URL.createObjectURL(result.image));
      setLegoStats(result.stats);
      toast.success("Successfully legofied your image!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {/* Left Column - Original Image */}
      <div className="space-y-3 md:space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-md">
            {!imagePreview ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center">
                  <Upload className="mr-2 h-4 w-4" /> {translations.uploadImage}
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
                <Upload className="mr-2 h-4 w-4" /> {translations.chooseDifferentImage}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Legofied Image & Controls */}
      <div className="space-y-4">
        {/* Only show image block if not mobile, or if mobile and legoImage exists */}
        {( !isMobileDevice || (isMobileDevice && legoImage) ) && (
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 flex flex-col">
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-md bg-gray-200">
              {legoImage ? (
                <Image
                  src={legoImage}
                  alt="Legofied image"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center text-gray-400">
                      <RefreshCw className="h-10 w-10 animate-spin mb-2" />
                      <p>{translations.processing}</p>
                    </div>
                  ) : imageStats ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <LegoBrickPreview 
                        brickWidth={brickSize}
                        brickHeight={Math.round(brickSize / (imageStats.width / imageStats.height))}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400">{translations.legoPreviewWillAppear}</p>
                  )}
                </div>
              )}
            </div>
            {legoImage && (
              <div className="flex justify-between items-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" /> {translations.download}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Brick Stats - New Section */}
        {legoStats && (
          <div className="bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-200 shadow-inner">
            <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4 text-gray-800 flex items-center">
              <div className="w-3 md:w-4 h-3 md:h-4 bg-blue-500 rounded-sm mr-2"></div>
              {translations.brickStats}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">{translations.totalBricks}:</div>
                <div className="font-medium">{legoStats.totalBricks}</div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm md:text-base text-gray-700 mb-2">{translations.colorDistribution}:</h4>
                <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-60 overflow-y-auto pr-2">
                  {legoStats.colors.map((colorStat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-4 md:w-6 h-4 md:h-6 rounded-sm flex-shrink-0"
                        style={{ 
                          backgroundColor: rgbToHex(colorStat.color)
                        }}
                      ></div>
                      <div className="flex-grow text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {getLegoColorName(colorStat.colorId) || rgbToHex(colorStat.color)}
                          </span>
                          <span className="text-gray-600">
                            {colorStat.count} ({colorStat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${colorStat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="bg-yellow-100 p-4 md:p-6 rounded-lg border-2 border-yellow-300 shadow-inner">
          <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4 text-gray-800 flex items-center">
            <div className="w-3 md:w-4 h-3 md:h-4 bg-red-500 rounded-sm mr-2"></div>
            {translations.brickSettings}
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="font-medium text-sm md:text-base text-gray-700">{translations.brickWidth}: {brickSize}px</label>
                <span className="text-xs md:text-sm text-gray-500">
                  {brickSize < 30 ? translations.lowDetail : brickSize > 70 ? translations.moreDetail : translations.mediumDetail}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[brickSize]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(values) => setBrickSize(values[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {imageStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-700 block mb-1">{translations.brickWidth}:</label>
                  <Input
                    type="number"
                    value={brickSize}
                    onChange={(e) => setBrickSize(Number(e.target.value))}
                    className="w-full h-8 md:h-10"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-700 block mb-1">{translations.brickHeight}:</label>
                  <Input
                    type="number"
                    value={Math.round(brickSize / (imageStats.width / imageStats.height))}
                    readOnly
                    className="w-full h-8 md:h-10"
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-base md:text-lg py-4 md:py-6 font-bold"
              onClick={handleUpload}
              disabled={loading || !image}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> {translations.processing}
                </>
              ) : (
                translations.transformToLego
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 