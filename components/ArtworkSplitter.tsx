import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Info, CheckCircle2, Film, Loader2, Scissors, Monitor, LayoutGrid, Package } from 'lucide-react';
// @ts-ignore
import { parseGIF, decompressFrames } from 'gifuct-js';
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
// @ts-ignore
import JSZip from 'jszip';
import AdUnit from './AdUnit';

// Define a type for the frame object returned by gifuct-js
interface GifFrame {
    dims: { width: number; height: number; top: number; left: number };
    patch: Uint8ClampedArray;
    delay: number;
    disposalType: number;
}

interface ExtractedFrame {
  url: string; // Blob URL
  delay: number;
}

type CropMode = 'artwork' | 'background' | 'workshop';

const ArtworkSplitter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // GIF Handling
  const [isGif, setIsGif] = useState(false);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [isProcessingGif, setIsProcessingGif] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [isEncoding, setIsEncoding] = useState(false);
  const [keepAnimation, setKeepAnimation] = useState(true);
  
  // Modes
  const [cropMode, setCropMode] = useState<CropMode>('artwork');
  const [workshopCols, setWorkshopCols] = useState<number>(5);
  
  // Steam Artwork Dimensions
  const MAIN_WIDTH = 506;
  const SIDE_WIDTH = 100;
  
  // Clean up blob URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      extractedFrames.forEach(frame => URL.revokeObjectURL(frame.url));
    };
  }, [extractedFrames]);

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    // Reset state
    setExtractedFrames([]);
    setIsGif(false);
    setKeepAnimation(true);
    setProcessingProgress(0);
    setProcessingStatus('');
    
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setImage(url);
      setFileName(file.name.split('.')[0]);
      
      // Auto-detect mode based on width
      if (img.width >= 1920) {
        setCropMode('background');
      } else {
        setCropMode('artwork');
      }
      
      if (file.type === 'image/gif') {
        setIsGif(true);
        processGifFrames(url);
      }
    };
    img.src = url;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const processGifFrames = async (fileUrl: string) => {
    setIsProcessingGif(true);
    setProcessingProgress(0);
    setProcessingStatus('Analyzing GIF structure...');
    
    try {
      const response = await fetch(fileUrl);
      const buffer = await response.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames: GifFrame[] = decompressFrames(gif, true);

      // Canvas to compose frames
      const compositionCanvas = document.createElement('canvas');
      const header = gif.lsd; 
      compositionCanvas.width = header.width;
      compositionCanvas.height = header.height;
      const ctx = compositionCanvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) return;

      const newFrames: ExtractedFrame[] = [];
      const totalFrames = frames.length;
      
      let lastYieldTime = performance.now();
      
      for (let i = 0; i < totalFrames; i++) {
        const frame = frames[i];
        const { width, height, top, left } = frame.dims;
        
        if (width > 0 && height > 0) {
           // Optimization: Use createImageBitmap directly from ImageData
           const imageData = new ImageData(
               new Uint8ClampedArray(frame.patch),
               width,
               height
           );
           
           const bitmap = await createImageBitmap(imageData);
           ctx.drawImage(bitmap, left, top);
           bitmap.close(); 
           
           // Optimization: Use WebP for blobs
           const blob = await new Promise<Blob | null>(resolve => 
             compositionCanvas.toBlob(resolve, 'image/webp', 0.8)
           );

           if (blob) {
             newFrames.push({
               url: URL.createObjectURL(blob),
               delay: frame.delay
             });
           }
           
           // Handle 'Restore to Background' disposal (Type 2)
           if (frame.disposalType === 2) {
               ctx.clearRect(left, top, width, height);
           }
        }
        
        // Time-based yielding
        const now = performance.now();
        if (now - lastYieldTime > 12) {
           setProcessingProgress(Math.round((i / totalFrames) * 100));
           setProcessingStatus(`Extracting frame ${i + 1} of ${totalFrames}...`);
           await new Promise(resolve => setTimeout(resolve, 0));
           lastYieldTime = performance.now();
        }
      }
      
      setExtractedFrames(newFrames);
      setProcessingProgress(100);
      setProcessingStatus('Frames extracted successfully');
    } catch (error) {
      console.error("Error processing GIF:", error);
      setProcessingStatus('Error processing GIF');
    } finally {
      setIsProcessingGif(false);
    }
  };

  /**
   * Helper to get crop coordinates based on current mode or specific override
   */
  const getCropRect = (type: 'main' | 'side' | number): { x: number, y: number, w: number, h: number } | null => {
    if (!imageDimensions) return null;
    const { width: imgW, height: imgH } = imageDimensions;

    if (cropMode === 'workshop' && typeof type === 'number') {
        const index = type;
        const partWidth = imgW / workshopCols;
        return {
            x: Math.floor(partWidth * index),
            y: 0,
            w: Math.floor(partWidth),
            h: imgH
        };
    }

    if (cropMode === 'artwork' || cropMode === 'background') {
        let x = 0;
        let w = MAIN_WIDTH;
        
        if (cropMode === 'background') {
            if (type === 'main') x = 508;
            if (type === 'side') { x = 1022; w = SIDE_WIDTH; }
        } else {
            // Artwork Mode
            if (type === 'main') x = 0;
            if (type === 'side') { 
                x = 506 + 8; // Main width + gap
                w = SIDE_WIDTH; 
                if (imgW < 700) x = imgW - SIDE_WIDTH; // Fallback for smaller images
            }
        }
        return { x, y: 0, w, h: imgH };
    }
    
    return null;
  };

  /**
   * Renders a static PNG blob for a specific crop region
   */
  const renderPngBlob = (rect: {x: number, y: number, w: number, h: number}): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = rect.w;
        canvas.height = rect.h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }

        const sourceUrl = (isGif && extractedFrames.length > 0) ? extractedFrames[0].url : image;
        if (!sourceUrl) { resolve(null); return; }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            ctx.drawImage(img, -rect.x, -rect.y);
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = () => resolve(null);
        img.src = sourceUrl;
    });
  };

  /**
   * Generates an animated GIF blob for a specific crop region
   */
  const renderGifBlob = async (x: number, y: number, width: number, height: number, statusPrefix: string = ''): Promise<Blob | null> => {
    if (!extractedFrames.length) return null;
    
    try {
      const encoder = new GIFEncoder();
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get canvas context");

      const totalFrames = extractedFrames.length;
      let lastYieldTime = performance.now();
      
      for (let i = 0; i < totalFrames; i++) {
        const frame = extractedFrames[i];
        
        // Optimization: Fetch blob and create bitmap directly
        const response = await fetch(frame.url);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        
        const delay = frame.delay || 100;

        ctx.clearRect(0, 0, width, height);
        // Draw the full frame shifted by negative X/Y to crop
        ctx.drawImage(bitmap, -x, -y);
        bitmap.close(); 

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);

        encoder.writeFrame(index, width, height, { 
          palette, 
          delay: Math.round(delay / 10) // ms to centiseconds
        });
        
        // Time-based yielding to update UI
        const now = performance.now();
        if (now - lastYieldTime > 12) {
           setProcessingProgress(Math.round((i / totalFrames) * 100));
           const statusText = statusPrefix ? `${statusPrefix}: Frame ${i + 1}/${totalFrames}` : `Encoding frame ${i + 1}/${totalFrames}...`;
           setProcessingStatus(statusText);
           await new Promise(resolve => setTimeout(resolve, 0));
           lastYieldTime = performance.now();
        }
      }

      encoder.finish();
      const buffer = encoder.bytes();
      return new Blob([buffer], { type: 'image/gif' });

    } catch (err) {
      console.error("Error generating GIF blob", err);
      return null;
    }
  };

  /**
   * Handlers for individual downloads (Wrapper around rendering logic)
   */
  const downloadSegment = async (type: 'main' | 'side' | number) => {
    if (!image) return;
    if (isEncoding) return;

    const rect = getCropRect(type);
    if (!rect) return;
    
    // Determine suffix
    let suffix = '';
    if (typeof type === 'number') suffix = `part_${type + 1}`;
    else suffix = type;

    // Route to Animated GIF generator or PNG
    if (isGif && keepAnimation) {
      setIsEncoding(true);
      const blob = await renderGifBlob(rect.x, rect.y, rect.w, rect.h, `Generating ${suffix}`);
      setIsEncoding(false);
      setProcessingStatus('');
      
      if (blob) {
         saveBlob(blob, `${fileName}_${suffix}.gif`);
      }
    } else {
      const blob = await renderPngBlob(rect);
      if (blob) {
         saveBlob(blob, `${fileName}_${suffix}.png`);
      }
    }
  };

  const saveBlob = (blob: Blob, name: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = name;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadFrame = (frameDataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `${fileName}_frame_${index + 1}.png`;
    link.href = frameDataUrl;
    link.click();
  };

  /**
   * New Batch Download logic using JSZip
   */
  const handleDownloadAll = async () => {
    if (isEncoding || isProcessingGif) return;
    if (isGif && keepAnimation && extractedFrames.length === 0) return;

    setIsEncoding(true);
    setProcessingStatus('Preparing ZIP archive...');
    setProcessingProgress(0);

    const zip = new JSZip();
    
    // Determine which parts to include
    const partsToProcess: Array<{id: string | number, name: string}> = [];
    
    if (cropMode === 'workshop') {
        for (let i = 0; i < workshopCols; i++) {
            partsToProcess.push({ id: i, name: `part_${i + 1}` });
        }
    } else {
        // Updated naming to sequential parts for ZIP download
        partsToProcess.push({ id: 'main', name: 'part_1' });
        partsToProcess.push({ id: 'side', name: 'part_2' });
    }

    try {
        const ext = (isGif && keepAnimation) ? 'gif' : 'png';

        for (let i = 0; i < partsToProcess.length; i++) {
            const part = partsToProcess[i];
            const rect = getCropRect(part.id as any);
            
            if (rect) {
                // Update status for the current part
                const stepPrefix = `Processing ${part.name} (${i + 1}/${partsToProcess.length})`;
                setProcessingStatus(stepPrefix);
                
                let blob: Blob | null = null;
                
                if (isGif && keepAnimation) {
                    blob = await renderGifBlob(rect.x, rect.y, rect.w, rect.h, stepPrefix);
                } else {
                    blob = await renderPngBlob(rect);
                    // Minimal delay for UI updates if purely synchronous
                    await new Promise(r => setTimeout(r, 50)); 
                }

                if (blob) {
                    // Use clean filenames inside the zip (e.g., part_1.gif)
                    zip.file(`${part.name}.${ext}`, blob);
                }
            }
        }

        setProcessingStatus('Compressing archive...');
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveBlob(zipContent, `${fileName}_Showcase.zip`);

    } catch (error) {
        console.error("Batch download failed", error);
        alert("Failed to create ZIP archive.");
    } finally {
        setIsEncoding(false);
        setProcessingStatus('');
        setProcessingProgress(0);
    }
  };

  const previewSource = (isGif && !keepAnimation && extractedFrames.length > 0) 
    ? extractedFrames[0].url 
    : image;

  return (
    <section id="cropper" className="py-20 bg-gray-50 dark:bg-steam-bg border-b dark:border-steam-accent transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-600 dark:text-steam-blue" />
            Steam Artwork Splitter
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl">
            Upload your artwork or background to automatically split it into the "Featured Artwork", "Workshop Showcase", or "Sidebar" slices.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white dark:bg-steam-card rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-steam-accent">
          <div className="p-8">
            {!image ? (
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-steam-accent rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-steam-blue transition-colors bg-gray-50 dark:bg-steam-bg/50 group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-steam-accent/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-blue-600 dark:text-steam-blue" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Drop your image here
                </h3>
                <p className="text-gray-500 dark:text-steam-text mb-8">
                  Supports JPG, PNG, and GIF
                </p>
                <label className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-colors shadow-lg shadow-blue-600/20 text-lg">
                  Select File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Control Bar */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
                   <div className="flex items-center gap-4 w-full xl:w-auto">
                     <div className="p-3 bg-gray-100 dark:bg-steam-bg rounded-lg shrink-0">
                        <ImageIcon className="w-6 h-6 text-gray-500 dark:text-steam-text" />
                     </div>
                     <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                             <h4 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{fileName}</h4>
                             {isGif && <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase rounded border border-purple-200 dark:border-purple-800">GIF</span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-steam-text">
                            {imageDimensions?.width} x {imageDimensions?.height}px
                        </p>
                     </div>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-3 justify-center w-full xl:w-auto">
                     {/* Mode Toggles */}
                     <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-lg overflow-x-auto max-w-full">
                        <button
                          onClick={() => setCropMode('artwork')}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${cropMode === 'artwork' ? 'bg-white dark:bg-steam-accent shadow text-blue-600 dark:text-white' : 'text-gray-500 dark:text-steam-text hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <Scissors className="w-3 h-3" /> Artwork
                        </button>
                        <button
                          onClick={() => setCropMode('background')}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${cropMode === 'background' ? 'bg-white dark:bg-steam-accent shadow text-blue-600 dark:text-white' : 'text-gray-500 dark:text-steam-text hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <Monitor className="w-3 h-3" /> Background
                        </button>
                        <button
                          onClick={() => setCropMode('workshop')}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${cropMode === 'workshop' ? 'bg-white dark:bg-steam-accent shadow text-blue-600 dark:text-white' : 'text-gray-500 dark:text-steam-text hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <LayoutGrid className="w-3 h-3" /> Workshop
                        </button>
                     </div>

                     {/* Workshop Controls */}
                     {cropMode === 'workshop' && (
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-black/20 p-1 rounded-lg px-2">
                           <span className="text-xs text-gray-500 font-medium uppercase">Parts:</span>
                           <select 
                             value={workshopCols}
                             onChange={(e) => setWorkshopCols(Number(e.target.value))}
                             className="bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                           >
                              <option value="2" className="text-gray-900">2</option>
                              <option value="4" className="text-gray-900">4</option>
                              <option value="5" className="text-gray-900">5</option>
                              <option value="6" className="text-gray-900">6</option>
                              <option value="8" className="text-gray-900">8</option>
                           </select>
                        </div>
                     )}

                     {/* Format Toggle for GIFs */}
                     {isGif && (
                       <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                          <button
                            onClick={() => setKeepAnimation(true)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${keepAnimation ? 'bg-white dark:bg-steam-accent shadow text-blue-600 dark:text-white' : 'text-gray-500 dark:text-steam-text'}`}
                          >
                            GIF
                          </button>
                          <button
                            onClick={() => setKeepAnimation(false)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!keepAnimation ? 'bg-white dark:bg-steam-accent shadow text-blue-600 dark:text-white' : 'text-gray-500 dark:text-steam-text'}`}
                          >
                            PNG
                          </button>
                       </div>
                     )}

                     <button
                       onClick={handleDownloadAll}
                       disabled={isEncoding || isProcessingGif || (isGif && keepAnimation && extractedFrames.length === 0)}
                       className={`flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 ${(isEncoding || isProcessingGif) ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                       {(isEncoding || isProcessingGif) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                       Download All (ZIP)
                     </button>
                     
                     <button 
                       onClick={() => setImage(null)}
                       className="px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                     >
                       Reset
                     </button>
                   </div>
                </div>

                {/* Progress Bar & Status */}
                {(isProcessingGif || isEncoding) && (
                   <div className="space-y-2">
                       <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-steam-text font-medium">
                           <span className="flex items-center gap-2">
                               <Loader2 className="w-3 h-3 animate-spin" />
                               {processingStatus}
                           </span>
                           <span>{processingProgress}%</span>
                       </div>
                       <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${processingProgress}%` }}
                          ></div>
                       </div>
                   </div>
                )}

                {/* Preview Area */}
                <div className="relative w-full overflow-x-auto bg-gray-900/50 rounded-xl p-8 custom-scrollbar min-h-[400px] flex items-center">
                  <div className="min-w-[800px] w-full flex justify-center">
                    
                    {/* WORKSHOP GRID PREVIEW */}
                    {cropMode === 'workshop' ? (
                        <div className="flex gap-1">
                            {Array.from({ length: workshopCols }).map((_, i) => {
                                const rect = getCropRect(i);
                                if (!rect) return null;
                                return (
                                    <div key={i} className="relative group">
                                        <div className="absolute -top-8 left-0 text-xs font-mono text-steam-blue bg-steam-card px-2 py-1 rounded border border-steam-accent shadow-sm">
                                            Part {i + 1}
                                        </div>
                                        <div 
                                            className="overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors bg-black/40 shadow-2xl"
                                            style={{ width: `${Math.floor(800 / workshopCols)}px`, height: 'auto' }}
                                        >
                                            <div style={{
                                                position: 'relative',
                                                paddingBottom: `${(rect.h / rect.w) * 100}%`,
                                                width: '100%'
                                            }}>
                                                <img 
                                                    src={previewSource || ''} 
                                                    alt={`Part ${i}`} 
                                                    style={{ 
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        maxWidth: 'none',
                                                        width: `${(imageDimensions!.width / rect.w) * 100}%`,
                                                        height: '100%',
                                                        transform: `translateX(-${(i / workshopCols) * 100}%)` // Shift image
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => downloadSegment(i)}
                                            disabled={isEncoding || isProcessingGif}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm"
                                        >
                                            <div className="flex items-center gap-2 text-white font-semibold px-3 py-2 bg-blue-600 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <Download className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                    /* ARTWORK / BACKGROUND PREVIEW */
                    <div className="relative inline-flex gap-2">
                      {/* Main Column Preview */}
                      <div className="relative group">
                        <div className="absolute -top-8 left-0 text-xs font-mono text-steam-blue bg-steam-card px-2 py-1 rounded border border-steam-accent shadow-sm">
                            Main ({MAIN_WIDTH}px)
                        </div>
                        <div 
                          className="overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors bg-black/40 shadow-2xl"
                          style={{ width: `${MAIN_WIDTH}px`, height: Math.min(imageDimensions?.height || 500, 600) + 'px' }}
                        >
                          <img 
                            src={previewSource || ''} 
                            alt="Main Crop" 
                            style={{ 
                              maxWidth: 'none',
                              height: imageDimensions?.height + 'px',
                              transform: `translateX(-${getCropRect('main')?.x || 0}px)`
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => downloadSegment('main')}
                          disabled={isEncoding || isProcessingGif}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-2 text-white font-semibold px-4 py-2 bg-blue-600 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Download className="w-5 h-5" />
                            <span>Download Main</span>
                          </div>
                        </button>
                      </div>

                      {/* Gap Visual */}
                      <div className="w-[8px] h-full flex flex-col items-center gap-2 opacity-30 pt-10">
                         {Array.from({ length: 8 }).map((_, i) => (
                             <div key={i} className="w-[1px] h-8 bg-gray-500"></div>
                         ))}
                      </div>

                      {/* Side Column Preview */}
                      <div className="relative group">
                        <div className="absolute -top-8 left-0 text-xs font-mono text-steam-blue bg-steam-card px-2 py-1 rounded border border-steam-accent shadow-sm">
                            Side ({SIDE_WIDTH}px)
                        </div>
                        <div 
                          className="overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors bg-black/40 shadow-2xl"
                          style={{ width: `${SIDE_WIDTH}px`, height: Math.min(imageDimensions?.height || 500, 600) + 'px' }}
                        >
                           <img 
                            src={previewSource || ''} 
                            alt="Side Crop" 
                            style={{ 
                              maxWidth: 'none',
                              height: imageDimensions?.height + 'px',
                              transform: `translateX(-${getCropRect('side')?.x || 0}px)`
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => downloadSegment('side')}
                          disabled={isEncoding || isProcessingGif}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm"
                        >
                           <div className="flex flex-col items-center gap-1 text-white font-semibold px-3 py-2 bg-blue-600 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Download className="w-4 h-4" />
                            <span className="text-xs">Side</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-steam-accent/20 border border-blue-100 dark:border-steam-accent rounded-xl p-5 flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 dark:text-steam-blue shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-steam-text space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                        Current Mode: {cropMode === 'background' ? 'Background Crop' : cropMode === 'workshop' ? 'Workshop Showcase' : 'Artwork Showcase'}
                    </p>
                    <p>
                        {cropMode === 'background' && "Optimized for 1920x1080 backgrounds. The preview shows the center alignment used by Steam profiles."}
                        {cropMode === 'artwork' && "Standard mode. Extracts the left 506px and the right 100px strip immediately."}
                        {cropMode === 'workshop' && `Splits the image into ${workshopCols} equal vertical segments. Great for the Workshop Showcase or Screenshot Showcase.`}
                    </p>
                  </div>
                </div>
                
                {/* GIF Frame Extraction Section */}
                {isGif && (
                  <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-purple-500" />
                        Extracted Frames
                        <span className="text-sm font-normal text-gray-500 dark:text-steam-text ml-2">
                          ({extractedFrames.length} frames found)
                        </span>
                      </h3>
                      {isProcessingGif && (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-steam-blue text-sm animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing GIF... {processingProgress}%
                        </div>
                      )}
                    </div>
                    
                    {extractedFrames.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                        {/* Only show first 32 frames to avoid DOM overload if massive, or simple pagination */}
                        {extractedFrames.slice(0, 32).map((frame, index) => (
                          <div key={index} className="group relative bg-gray-100 dark:bg-black/30 rounded-lg p-2 border border-transparent hover:border-blue-500 transition-colors">
                            <div className="aspect-square w-full flex items-center justify-center overflow-hidden mb-2">
                              <img src={frame.url} alt={`Frame ${index + 1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="text-center">
                              <span className="text-xs text-gray-500 dark:text-steam-text block mb-2">Frame {index + 1} ({frame.delay}ms)</span>
                              <button 
                                onClick={() => downloadFrame(frame.url, index)}
                                className="w-full py-1 bg-blue-100 dark:bg-steam-accent hover:bg-blue-600 hover:text-white text-blue-600 dark:text-steam-blue text-xs rounded transition-colors flex items-center justify-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                        {extractedFrames.length > 32 && (
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-steam-text text-sm p-4 bg-gray-100 dark:bg-white/5 rounded-lg">
                                <span className="font-bold">+{extractedFrames.length - 32} more</span>
                                <span>frames available</span>
                            </div>
                        )}
                      </div>
                    ) : (
                      !isProcessingGif && (
                         <div className="text-center py-10 text-gray-500 dark:text-steam-text bg-gray-50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-white/5">
                           Could not extract frames from this GIF.
                         </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Ad Space */}
          <div className="mt-8">
            <AdUnit type="banner" />
          </div>
        </div>
      </div>
      
      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default ArtworkSplitter;