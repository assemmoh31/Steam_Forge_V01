import React, { useState, useRef, useEffect } from 'react';
import { Upload, Film, Download, Loader2, Play, AlertCircle, Settings, Clock, CheckCircle2 } from 'lucide-react';
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

const VideoToGif: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoMetaData, setVideoMetaData] = useState<{ width: number, height: number, duration: number } | null>(null);
  const [fileName, setFileName] = useState('');
  
  // Settings
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fps, setFps] = useState(10);
  const [scale, setScale] = useState(0.5); // Scale factor (1 = original, 0.5 = 50%)
  const [quality, setQuality] = useState(10); // Quantization quality (lower is better, but slower)
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);
  const [generatedSize, setGeneratedSize] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setFileName(file.name.split('.')[0]);
    setGeneratedGif(null);
    setVideoMetaData(null);
    
    // Create temporary video to get metadata
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoMetaData({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
      setStartTime(0);
      setEndTime(Math.min(video.duration, 5)); // Default to first 5 seconds
    };
    video.src = url;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const generateGif = async () => {
    if (!videoRef.current || !videoMetaData) return;
    
    setIsProcessing(true);
    setProgress(0);
    setGeneratedGif(null);
    
    try {
      const video = videoRef.current;
      const encoder = new GIFEncoder();
      
      // Calculate dimensions
      const width = Math.floor(videoMetaData.width * scale);
      const height = Math.floor(videoMetaData.height * scale);
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) throw new Error("Canvas context not available");
      
      const durationToCapture = endTime - startTime;
      const interval = 1 / fps;
      const totalFrames = Math.floor(durationToCapture / interval);
      
      let currentTime = startTime;
      let frameCount = 0;
      let lastYieldTime = performance.now();

      setStatus(`Initializing capture (${width}x${height})...`);

      while (currentTime <= endTime) {
        // Seek video
        video.currentTime = currentTime;
        
        // Wait for seek to complete
        await new Promise<void>(resolve => {
          const onSeek = () => {
            video.removeEventListener('seeked', onSeek);
            resolve();
          };
          video.addEventListener('seeked', onSeek);
        });

        // Draw frame
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Quantize
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        
        // Write to encoder
        encoder.writeFrame(index, width, height, { 
          palette, 
          delay: Math.round(interval * 1000) 
        });

        // Update progress
        frameCount++;
        currentTime += interval;
        
        // Yield to UI
        const now = performance.now();
        if (now - lastYieldTime > 50) {
           const pct = Math.min(Math.round((frameCount / totalFrames) * 100), 99);
           setProgress(pct);
           setStatus(`Processing frame ${frameCount}/${totalFrames}`);
           await new Promise(r => setTimeout(r, 0));
           lastYieldTime = performance.now();
        }
      }
      
      setStatus('Finalizing GIF...');
      encoder.finish();
      
      const buffer = encoder.bytes();
      const blob = new Blob([buffer], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);
      
      setGeneratedGif(gifUrl);
      setGeneratedSize((blob.size / 1024 / 1024).toFixed(2));
      setProgress(100);
      setStatus('Done!');

    } catch (error) {
      console.error(error);
      setStatus('Error generating GIF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (generatedGif) {
      const link = document.createElement('a');
      link.href = generatedGif;
      link.download = `${fileName}_animated.gif`;
      link.click();
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-steam-bg border-b dark:border-steam-accent transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Film className="w-8 h-8 text-blue-600 dark:text-steam-blue" />
            Video to GIF Converter
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl">
            Convert MP4, WebM, or MOV files into optimized animated GIFs for your Steam artwork showcase or profile picture.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white dark:bg-steam-card rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-steam-accent">
          <div className="p-8">
            {!videoSrc ? (
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-steam-accent rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-steam-blue transition-colors bg-gray-50 dark:bg-steam-bg/50 group"
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-steam-accent/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-blue-600 dark:text-steam-blue" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Upload Video
                </h3>
                <p className="text-gray-500 dark:text-steam-text mb-8">
                  Supports MP4, WebM, MOV (Max 50MB recommended)
                </p>
                <label className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-colors shadow-lg shadow-blue-600/20 text-lg">
                  Select Video
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Col: Preview & Settings */}
                <div className="space-y-6">
                  {/* Video Player */}
                  <div className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center group">
                    <video 
                      ref={videoRef}
                      src={videoSrc}
                      className="max-w-full max-h-full"
                      controls
                    />
                  </div>

                  {/* Trimming Controls */}
                  {videoMetaData && (
                    <div className="bg-gray-100 dark:bg-steam-bg p-5 rounded-xl border dark:border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Trim Video
                         </h4>
                         <span className="text-xs text-gray-500 dark:text-steam-text">
                           Duration: {formatTime(videoMetaData.duration)}s
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-steam-text uppercase mb-1 block">Start Time</label>
                          <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max={endTime}
                            value={startTime}
                            onChange={(e) => setStartTime(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-steam-card border dark:border-steam-accent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-steam-text uppercase mb-1 block">End Time</label>
                          <input 
                            type="number" 
                            step="0.1"
                            min={startTime}
                            max={videoMetaData.duration}
                            value={endTime}
                            onChange={(e) => setEndTime(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-steam-card border dark:border-steam-accent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-center text-blue-600 dark:text-steam-blue font-medium">
                        Selected: {formatTime(endTime - startTime)}s
                      </div>
                    </div>
                  )}

                  {/* Config */}
                  <div className="bg-gray-100 dark:bg-steam-bg p-5 rounded-xl border dark:border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                         <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Output Settings
                         </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-steam-text uppercase mb-1 block">Framerate (FPS)</label>
                          <select 
                            value={fps}
                            onChange={(e) => setFps(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-steam-card border dark:border-steam-accent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                          >
                            <option value="5">5 FPS</option>
                            <option value="10">10 FPS</option>
                            <option value="15">15 FPS (Balanced)</option>
                            <option value="20">20 FPS</option>
                            <option value="30">30 FPS (Heavy)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-steam-text uppercase mb-1 block">Resolution Scale</label>
                          <select 
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-steam-card border dark:border-steam-accent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                          >
                            <option value="1">Original Size (100%)</option>
                            <option value="0.75">75%</option>
                            <option value="0.5">50%</option>
                            <option value="0.25">25%</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-steam-text/80">
                        Note: Higher FPS and resolution will result in significantly larger file sizes and slower processing. Steam has a 8MB-10MB limit for artworks.
                      </p>
                  </div>

                  <div className="flex gap-3">
                     <button
                        onClick={generateGif}
                        disabled={isProcessing}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                     >
                       {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                       {isProcessing ? 'Converting...' : 'Convert to GIF'}
                     </button>
                     <button
                        onClick={() => setVideoSrc(null)}
                        disabled={isProcessing}
                        className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium transition-colors"
                     >
                       Reset
                     </button>
                  </div>
                </div>

                {/* Right Col: Output */}
                <div className="flex flex-col h-full bg-gray-100 dark:bg-steam-bg rounded-xl border dark:border-white/5 p-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4">Output Preview</h3>
                   
                   <div className="flex-grow flex flex-col items-center justify-center bg-white dark:bg-steam-card rounded-lg border-2 border-dashed border-gray-200 dark:border-steam-accent relative overflow-hidden min-h-[300px]">
                      {isProcessing ? (
                        <div className="text-center p-6">
                           <Loader2 className="w-10 h-10 text-blue-600 dark:text-steam-blue animate-spin mx-auto mb-4" />
                           <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Processing Video</h4>
                           <p className="text-sm text-gray-500 dark:text-steam-text mb-4">{status}</p>
                           <div className="w-64 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mx-auto">
                              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                           </div>
                        </div>
                      ) : generatedGif ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                           <img src={generatedGif} alt="Generated GIF" className="max-w-full max-h-[400px] object-contain shadow-xl rounded" />
                           <div className="mt-4 flex flex-col items-center">
                             <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 mb-2">
                               <CheckCircle2 className="w-4 h-4" /> Conversion Complete
                             </span>
                             <span className="text-xs text-gray-500 dark:text-steam-text mb-4">
                               Size: {generatedSize} MB
                             </span>
                             <button
                               onClick={handleDownload}
                               className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-600/20 transition-transform hover:scale-105"
                             >
                               <Download className="w-4 h-4" /> Download GIF
                             </button>
                           </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 dark:text-steam-text/50">
                           <Film className="w-12 h-12 mx-auto mb-2 opacity-20" />
                           <p>No GIF generated yet</p>
                        </div>
                      )}
                   </div>
                   
                   <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-steam-blue shrink-0" />
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                        <strong>Tip:</strong> Keep your GIF under 8MB to upload it to the "Featured Artwork" showcase on Steam. If the file is too large, try reducing the FPS or Resolution Scale.
                      </p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoToGif;
