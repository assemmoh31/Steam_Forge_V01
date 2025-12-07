import React, { useState, useEffect } from 'react';
import { Upload, Download, Loader2, Zap, ArrowRight, Gauge, Layers, Palette, RefreshCw, FileWarning } from 'lucide-react';
// @ts-ignore
import { parseGIF, decompressFrames } from 'gifuct-js';
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

interface OptimizerSettings {
  scale: number; // 0.1 to 1.0
  colors: number; // 2 to 256
  frameSkip: number; // 0 = none, 1 = skip every 2nd, 2 = skip 2 keep 1, etc.
}

const GifOptimizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{w: number, h: number} | null>(null);

  const [optimizedPreview, setOptimizedPreview] = useState<string | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [settings, setSettings] = useState<OptimizerSettings>({
    scale: 1,
    colors: 256,
    frameSkip: 0
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'image/gif') {
      processFile(uploadedFile);
    } else if (uploadedFile) {
      alert("Please upload a valid GIF file.");
    }
  };

  const processFile = (uploadedFile: File) => {
    const url = URL.createObjectURL(uploadedFile);
    setFile(uploadedFile);
    setOriginalPreview(url);
    setOriginalSize(uploadedFile.size);
    setOptimizedPreview(null);
    setOptimizedSize(0);
    
    // Get dimensions
    const img = new Image();
    img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
    };
    img.src = url;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const optimizeGif = async () => {
    if (!originalPreview || !originalDimensions) return;

    setIsOptimizing(true);
    setProgress(0);
    
    try {
      // 1. Fetch and Parse
      const resp = await fetch(originalPreview);
      const buff = await resp.arrayBuffer();
      const gif = parseGIF(buff);
      const frames = decompressFrames(gif, true);

      // 2. Setup Encoder
      const encoder = new GIFEncoder();
      const width = Math.floor(originalDimensions.w * settings.scale);
      const height = Math.floor(originalDimensions.h * settings.scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas context error");

      // Temp canvas for full size rendering before scaling
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = originalDimensions.w;
      tempCanvas.height = originalDimensions.h;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) throw new Error("Temp Canvas error");

      const totalFrames = frames.length;
      let lastYield = performance.now();
      let encodedFrames = 0;

      for (let i = 0; i < totalFrames; i++) {
        const frame = frames[i];
        
        // Render frame to temp canvas (handling disposal/patching)
        const dims = frame.dims;
        const imageData = new ImageData(new Uint8ClampedArray(frame.patch), dims.width, dims.height);
        const bitmap = await createImageBitmap(imageData);
        
        tempCtx.drawImage(bitmap, dims.left, dims.top);
        bitmap.close();

        // Check if we should skip this frame for output
        // Frame skip logic: 0 = keep all. 1 = keep 0, 2, 4. 2 = keep 0, 3, 6.
        if (i % (settings.frameSkip + 1) !== 0) {
            // Even if we skip encoding, we must render to tempCtx to maintain state for next frames
            // But we don't write to encoder.
            if (frame.disposalType === 2) {
                tempCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
            }
            continue;
        }

        // Draw scaled version to main canvas
        ctx.drawImage(tempCanvas, 0, 0, width, height);

        // Get Data
        const finalData = ctx.getImageData(0, 0, width, height).data;
        
        // Quantize
        // Note: gifenc quantize doesn't support 'maxColors' directly in all versions, 
        // but we can pre-process or just rely on the palette generation.
        // If we want to strictly reduce colors, we might need a custom quantization pass,
        // but typically 'quantize' creates a palette of up to 256.
        // We can simulate color reduction by using a smaller palette size request if supported,
        // or just rely on gifenc's default behavior which is usually good.
        // However, the `quantize` function in gifenc usually takes (data, maxColors).
        const palette = quantize(finalData, settings.colors);
        const index = applyPalette(finalData, palette);

        // Add delay (adjust for skipped frames if needed, though simple skipping usually speeds up animation which is often desired for "speed up" or we might need to accumulate delay)
        // For simple size optimization, we usually want to maintain speed, so we add accumulated delay.
        // But for "Frame Skip" in this context, we usually just want to drop frames to reduce size, resulting in a choppier but faster/same-speed gif.
        // Let's accumulate delay to keep original duration roughly sync if user wants specific FPS, but simple skipping is easier.
        // Let's simply multiply delay by (skip + 1) to maintain total duration.
        const adjustedDelay = frame.delay * (settings.frameSkip + 1);

        encoder.writeFrame(index, width, height, {
            palette,
            delay: adjustedDelay
        });

        // Handle Disposal on temp canvas
        if (frame.disposalType === 2) {
            tempCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
        }

        encodedFrames++;

        // UI Updates
        const now = performance.now();
        if (now - lastYield > 50) {
            setProgress(Math.round((i / totalFrames) * 100));
            await new Promise(r => setTimeout(r, 0));
            lastYield = performance.now();
        }
      }

      encoder.finish();
      const buffer = encoder.bytes();
      const blob = new Blob([buffer], { type: 'image/gif' });
      const optimizedUrl = URL.createObjectURL(blob);
      
      setOptimizedPreview(optimizedUrl);
      setOptimizedSize(blob.size);
      setProgress(100);

    } catch (e) {
      console.error(e);
      alert("Error optimizing GIF");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = () => {
    if (optimizedPreview) {
      const link = document.createElement('a');
      link.href = optimizedPreview;
      link.download = `optimized_${file?.name || 'image.gif'}`;
      link.click();
    }
  };

  const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : 0;
  const isBigger = optimizedSize > originalSize;

  return (
    <section className="py-20 bg-gray-50 dark:bg-steam-bg min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            GIF Optimizer
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl">
            Compress your GIFs to fit Steam's 8MB file size limit. Resize, reduce colors, or drop frames.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-steam-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-500" />
                Optimization Settings
              </h3>

              {!file ? (
                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-steam-accent rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload GIF</span>
                    <input type="file" accept="image/gif" className="hidden" onChange={handleFileUpload} />
                 </label>
              ) : (
                <div className="space-y-6">
                    {/* Scale Control */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-steam-text flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 rotate-45" /> Scale
                            </label>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{Math.round(settings.scale * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.05" 
                            value={settings.scale}
                            onChange={(e) => setSettings({...settings, scale: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-gray-200 dark:bg-steam-bg rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Reduces dimensions.</p>
                    </div>

                    {/* Colors Control */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-steam-text flex items-center gap-2">
                                <Palette className="w-4 h-4" /> Colors
                            </label>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{settings.colors}</span>
                        </div>
                        <input 
                            type="range" 
                            min="2" 
                            max="256" 
                            step="2" 
                            value={settings.colors}
                            onChange={(e) => setSettings({...settings, colors: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 dark:bg-steam-bg rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower colors = smaller file, retro look.</p>
                    </div>

                    {/* Frame Skip Control */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-steam-text flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Frame Skipping
                            </label>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {settings.frameSkip === 0 ? 'None' : `Skip ${settings.frameSkip}`}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="4" 
                            step="1" 
                            value={settings.frameSkip}
                            onChange={(e) => setSettings({...settings, frameSkip: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 dark:bg-steam-bg rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                         <p className="text-xs text-gray-500 mt-1">Drops frames to reduce size drastically.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-3">
                        <button
                            onClick={optimizeGif}
                            disabled={isOptimizing}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            {isOptimizing ? 'Compressing...' : 'Optimize GIF'}
                        </button>
                        <button
                             onClick={() => { setFile(null); setOriginalPreview(null); setOptimizedPreview(null); }}
                             disabled={isOptimizing}
                             className="w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            Reset / Upload New
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Preview & Comparison */}
          <div className="lg:col-span-2 space-y-6">
             {!originalPreview ? (
                <div className="h-full min-h-[400px] bg-white dark:bg-steam-card rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent flex flex-col items-center justify-center text-gray-400">
                    <Zap className="w-16 h-16 mb-4 opacity-20" />
                    <p>Upload a GIF to start optimizing</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="bg-white dark:bg-steam-card p-4 rounded-xl border border-gray-200 dark:border-steam-accent">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-gray-700 dark:text-steam-text">Original</span>
                            <span className="text-xs bg-gray-100 dark:bg-black/20 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                {formatSize(originalSize)}
                            </span>
                        </div>
                        <div className="aspect-square bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center overflow-hidden border border-dashed border-gray-300 dark:border-white/10 relative">
                             <img src={originalPreview} alt="Original" className="max-w-full max-h-full object-contain" />
                             {originalDimensions && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                    {originalDimensions.w}x{originalDimensions.h}
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Optimized Result */}
                    <div className="bg-white dark:bg-steam-card p-4 rounded-xl border border-gray-200 dark:border-steam-accent relative overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-gray-700 dark:text-steam-text">Optimized</span>
                            {optimizedSize > 0 && (
                                <span className={`text-xs px-2 py-1 rounded font-bold ${isBigger ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {formatSize(optimizedSize)}
                                </span>
                            )}
                        </div>
                        
                        <div className="aspect-square bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center overflow-hidden border border-dashed border-gray-300 dark:border-white/10 relative">
                             {isOptimizing ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                    <div className="text-xs text-gray-500 font-medium">Processing... {progress}%</div>
                                </div>
                             ) : optimizedPreview ? (
                                <>
                                    <img src={optimizedPreview} alt="Optimized" className="max-w-full max-h-full object-contain" />
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                        {Math.floor((originalDimensions?.w || 0) * settings.scale)}x{Math.floor((originalDimensions?.h || 0) * settings.scale)}
                                    </div>
                                </>
                             ) : (
                                <div className="text-gray-400 text-sm flex flex-col items-center">
                                    <RefreshCw className="w-8 h-8 mb-2 opacity-50" />
                                    Click Optimize
                                </div>
                             )}
                        </div>

                        {optimizedPreview && (
                            <div className="mt-4">
                                {isBigger && (
                                    <div className="mb-2 text-xs text-red-500 flex items-center gap-1">
                                        <FileWarning className="w-3 h-3" />
                                        Result is larger. Try reducing colors or scaling down.
                                    </div>
                                )}
                                {!isBigger && (
                                    <div className="mb-2 text-xs text-green-600 font-bold">
                                        Reduced by {savings}%
                                    </div>
                                )}
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" /> Download Result
                                </button>
                            </div>
                        )}
                    </div>
                </div>
             )}

             {/* Tips Section */}
             <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Optimization Tips</h4>
                <ul className="text-xs text-blue-700 dark:text-steam-text space-y-1 list-disc list-inside">
                    <li><strong>Scale:</strong> Reducing dimensions by 20% can drop file size significantly.</li>
                    <li><strong>Colors:</strong> 128 colors usually looks identical to 256 but saves space.</li>
                    <li><strong>Frame Skip:</strong> Dropping every 2nd frame cuts size in half but speeds up the animation perceived speed unless delays are adjusted (this tool adjusts delay to match total duration).</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GifOptimizer;