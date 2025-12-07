
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Monitor, Trophy, Layers, AlertCircle, User, Edit3 } from 'lucide-react';
import AdUnit from './AdUnit';

// Standard Steam Status Colors
const PRESETS = [
  { id: 'default', name: 'Offline / Default', class: 'border-gray-500' },
  { id: 'online', name: 'Online (Blue)', class: 'border-[#57cbde] shadow-[0_0_8px_#57cbde]' },
  { id: 'ingame', name: 'In-Game (Green)', class: 'border-[#90ba3c] shadow-[0_0_8px_#90ba3c]' },
  { id: 'golden', name: 'Golden Profile', class: 'border-[#eec966] shadow-[0_0_8px_#eec966]' },
];

const AvatarBorders: React.FC = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('online');

  // Real Data State
  const [profileName, setProfileName] = useState('Steam User');
  const [profileLevel, setProfileLevel] = useState(42);
  const [profileSummary, setProfileSummary] = useState('No information given.');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrame(URL.createObjectURL(file));
      setSelectedPreset('none'); // Clear CSS border if custom frame is used
    }
  };

  // Helper to get Steam-like level badge border color
  const getLevelColor = (level: number) => {
    if (level >= 500) return '#c0c0c0'; // Silver/Chrome
    if (level >= 100) return '#8f46ab'; // Purple
    if (level >= 50) return '#4e8ddb';  // Blue
    if (level >= 40) return '#5a9e36';  // Green
    if (level >= 30) return '#eecc33';  // Yellow
    if (level >= 20) return '#e38d22';  // Orange
    if (level >= 10) return '#be3030';  // Red
    return '#8e8e8e';                   // Grey (0-9)
  };

  const levelColor = getLevelColor(profileLevel);

  return (
    <section className="py-12 bg-gray-50 dark:bg-steam-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Layers className="w-8 h-8 text-blue-500" />
            Avatar Border Tester
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl mx-auto">
            Upload your profile picture and test how it looks with official Steam status borders or Points Shop frames.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Avatar Upload */}
            <div className="bg-white dark:bg-steam-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" /> 1. Upload Avatar
              </h3>
              <div className="flex items-center gap-4">
                 <div className="relative w-20 h-20 bg-gray-200 dark:bg-black/30 rounded-lg overflow-hidden shrink-0 border border-dashed border-gray-400 dark:border-white/20">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                 </div>
                 <div className="flex-1">
                    <label className="block w-full cursor-pointer">
                      <span className="sr-only">Choose profile picture</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="block w-full text-sm text-gray-500 dark:text-steam-text
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          dark:file:bg-steam-accent dark:file:text-white
                          hover:file:bg-blue-100 dark:hover:file:bg-steam-accent/80
                          cursor-pointer
                        "
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-steam-text/60 mt-2">
                      Recommended: 184x184px or larger square image.
                    </p>
                 </div>
              </div>
            </div>

            {/* 2. Choose Border Style */}
            <div className="bg-white dark:bg-steam-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-green-500" /> 2. Status Borders
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => { setSelectedPreset(preset.id); setFrame(null); }}
                    className={`
                      p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-medium
                      ${selectedPreset === preset.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-steam-accent' 
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50 dark:bg-black/20 text-gray-600 dark:text-steam-text'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded border-2 ${preset.class.split(' ')[0]} bg-gray-800`}></div>
                    <span className="text-center text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Custom Frame Upload */}
            <div className="bg-white dark:bg-steam-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> 3. Custom Frames
              </h3>

              <div className="text-sm text-gray-500 dark:text-steam-text mb-6 leading-relaxed">
                  If you have a transparent PNG frame (e.g. downloaded from <a href="https://www.steamcardexchange.net/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">SteamCardExchange</a> or the Points Shop), upload it here to test the look.
              </div>

              {/* Custom Upload */}
              <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                 <label className="flex flex-col items-center justify-center cursor-pointer group w-full">
                    <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                       Upload custom frame
                    </span>
                    <span className="text-xs text-gray-500 dark:text-steam-text/70 mb-4">
                       Supports transparent PNG & GIF
                    </span>
                    <input type="file" accept="image/png,image/gif" onChange={handleFrameUpload} className="hidden" />
                    <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-colors">
                       Select File
                    </span>
                 </label>
              </div>
            </div>

            {/* 4. Profile Details */}
            <div className="bg-white dark:bg-steam-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-steam-accent">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-500" /> 4. Profile Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-steam-text uppercase mb-1">Display Name</label>
                        <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            maxLength={32}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Steam User"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-steam-text uppercase mb-1">Level</label>
                        <input 
                            type="number" 
                            value={profileLevel}
                            onChange={(e) => setProfileLevel(Math.max(0, parseInt(e.target.value) || 0))}
                            min="0"
                            max="5000"
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-3">
                         <label className="block text-xs font-semibold text-gray-500 dark:text-steam-text uppercase mb-1">Summary</label>
                         <textarea
                            value={profileSummary}
                            onChange={(e) => setProfileSummary(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
                            placeholder="Enter your profile bio..."
                         />
                    </div>
                </div>
            </div>

            {/* Ad Space */}
            <AdUnit type="rectangle" />

          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="lg:col-span-5">
             <div className="sticky top-24 space-y-6">
                
                {/* Main Preview Card */}
                <div className="bg-[#1b2838] p-6 rounded-lg shadow-2xl border border-black overflow-hidden relative">
                   {/* Background Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-b from-[#2a475e] to-[#1b2838] h-32 z-0"></div>
                   
                   <div className="relative z-10 flex gap-4 pt-4">
                      {/* Avatar Container */}
                      <div className="relative shrink-0">
                         {/* The Border / Frame Layer */}
                         <div className={`relative w-[164px] h-[164px] p-1 ${frame ? '' : (PRESETS.find(p => p.id === selectedPreset)?.class || '')}`}>
                            {/* The Actual Avatar Image */}
                            <div className="w-full h-full bg-[#1b2838] relative">
                               {avatar ? (
                                 <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                   <ImageIcon className="w-12 h-12 opacity-50" />
                                 </div>
                               )}
                            </div>

                            {/* Frame Overlay (Absolute) */}
                            {frame && (
                              <div className="absolute -top-[16%] -left-[16%] w-[132%] h-[132%] pointer-events-none z-20">
                                 <img src={frame} alt="Frame" className="w-full h-full object-contain" />
                              </div>
                            )}
                         </div>
                      </div>

                      {/* Text Details */}
                      <div className="pt-2 space-y-1 flex-1 min-w-0">
                         {/* Name */}
                         <div className="text-2xl text-white font-medium truncate drop-shadow-md">
                             {profileName || 'Steam User'}
                         </div>
                         
                         {/* Country Mock */}
                         <div className="flex gap-2 text-xs text-[#8f98a0] pb-2">
                            <span className="flex items-center gap-1">
                               <img src="https://community.cloudflare.steamstatic.com/public/images/countryflags/us.gif" alt="flag" className="opacity-50" />
                               United States
                            </span>
                         </div>
                         
                         {/* Summary */}
                         <div className="pt-2 text-[#c6d4df] text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap font-sans">
                            {profileSummary || 'No information given.'}
                         </div>
                         
                         {selectedPreset !== 'default' && selectedPreset !== 'none' && !frame && (
                           <div className={`mt-2 text-xs font-bold ${
                             selectedPreset === 'online' ? 'text-[#57cbde]' :
                             selectedPreset === 'ingame' ? 'text-[#90ba3c]' :
                             'text-[#eec966]'
                           }`}>
                             Currently {selectedPreset === 'golden' ? 'Golden' : selectedPreset === 'ingame' ? 'In-Game' : 'Online'}
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Level Badge - Dynamic Color */}
                   <div className="absolute top-4 right-4">
                      <div 
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-lg bg-black/40 shadow-sm"
                        style={{ borderColor: levelColor }}
                      >
                        {profileLevel}
                      </div>
                   </div>
                </div>

                {/* Instructions / Tips */}
                <div className="bg-blue-50 dark:bg-steam-accent/20 border border-blue-100 dark:border-steam-accent rounded-xl p-5">
                   <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-blue-500" /> How it works
                   </h4>
                   <ul className="text-sm text-gray-600 dark:text-steam-text space-y-2 list-disc list-inside">
                      <li>Official Steam avatars are 184x184px.</li>
                      <li>Avatar Frames typically overlay the image and extend beyond the box by ~15-20%.</li>
                      <li>Use the <strong>Status Borders</strong> to test the default color states.</li>
                      <li>Upload a transparent PNG to test custom Points Shop frames.</li>
                   </ul>
                </div>

             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AvatarBorders;
