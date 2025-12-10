
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Layout, User, Type, Info, Monitor, GripHorizontal, Eye } from 'lucide-react';

const ProfileMockup: React.FC = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [background, setBackground] = useState<string | null>(null);
    const [frame, setFrame] = useState<string | null>(null);

    // Profile Info
    const [displayName, setDisplayName] = useState('Steam User');
    const [summary, setSummary] = useState('Welcome to my profile! This is a live preview.');
    const [level, setLevel] = useState(100);
    const [themeColor, setThemeColor] = useState('midnight'); // potentially for future theme switching

    // Handlers
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            setter(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-white pb-20 font-sans">

            {/* TOOLBAR */}
            <div className="sticky top-16 z-40 bg-[#1b2838]/95 backdrop-blur-md border-b border-[#2a475e] shadow-2xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                        {/* Title */}
                        <div className="flex items-center gap-3">
                            <Layout className="w-8 h-8 text-blue-500" />
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-wide">Dressing Room</h2>
                                <p className="text-xs text-blue-300 font-medium tracking-wider uppercase">Live Profile Simulator</p>
                            </div>
                        </div>

                        {/* Upload Controls */}
                        <div className="flex items-center gap-3 bg-[#101216] p-2 rounded-xl border border-white/5">
                            <UploadButton icon={<ImageIcon />} label="Background" onChange={(e) => handleUpload(e, setBackground)} />
                            <div className="w-px h-8 bg-white/10 mx-1"></div>
                            <UploadButton icon={<User />} label="Avatar" onChange={(e) => handleUpload(e, setAvatar)} />
                            <div className="w-px h-8 bg-white/10 mx-1"></div>
                            <UploadButton icon={<Monitor />} label="Frame" onChange={(e) => handleUpload(e, setFrame)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDE: EDIT DETAILS */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Profile Data Card */}
                        <div className="bg-[#1b2838] p-5 rounded-2xl border border-[#2a475e] shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Type className="w-4 h-4" /> Edit Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-blue-400 mb-1 block ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-[#101216] border border-[#2a475e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-blue-400 mb-1 block ml-1">Level</label>
                                    <input
                                        type="number"
                                        value={level}
                                        onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
                                        className="w-full bg-[#101216] border border-[#2a475e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-blue-400 mb-1 block ml-1">Summary</label>
                                    <textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        rows={4}
                                        className="w-full bg-[#101216] border border-[#2a475e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20">
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2 text-sm">
                                <Info className="w-4 h-4" /> Pro Tip
                            </h4>
                            <p className="text-xs text-blue-200/80 leading-relaxed">
                                Steam avatar frames often extend slightly outside the avatar box.
                                Use a transparent PNG frame to test the perfect fit.
                                Backgrounds on Steam are usually darkened by 20-40% in the content area.
                            </p>
                        </div>

                    </div>

                    {/* RIGHT SIDE: PREVIEW */}
                    <div className="lg:col-span-9">

                        {/* THE MOCKUP CONTAINER */}
                        <div className="rounded-xl overflow-hidden shadow-2xl bg-[#171a21] relative border border-[#2a475e]/50 ring-4 ring-[#0f1115]">

                            {/* Browser-like Header for flair */}
                            <div className="bg-[#171a21] px-4 py-2 border-b border-[#2a475e]/30 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="flex-1 text-center text-xs text-gray-500 font-mono">
                                    steamcommunity.com/id/{displayName.toLowerCase().replace(/\s/g, '')}
                                </div>
                            </div>

                            {/* STEAM PROFILE AREA */}
                            <div className="relative min-h-[700px] w-full bg-[#1b2838] group">

                                {/* 1. Global Background Image */}
                                <div className="absolute inset-0 z-0 bg-[#1b2838]">
                                    {background ? (
                                        <img src={background} alt="Background" className="w-full h-full object-cover object-top opacity-100" />
                                    ) : (
                                        <div className="w-full h-full bg-[url('https://community.cloudflare.steamstatic.com/public/images/profile/2020/bg_dots.png')] bg-repeat opacity-10"></div>
                                    )}

                                    {/* The "Steam" gradient overlay that fades the background into the dark bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#1b2838] to-transparent"></div>

                                    {/* Main content darken overlay - Steam adds this to make text readable */}
                                    <div className="absolute inset-0 bg-[#1b2838]/80 mix-blend-multiply"></div>
                                </div>

                                {/* 2. Content Column */}
                                <div className="relative z-10 w-full max-w-[960px] mx-auto pt-16 px-4 md:px-0">

                                    {/* TOP PROFILE HEADER */}
                                    <div className="bg-[#1b2838]/60 backdrop-blur-sm p-6 rounded-[5px] flex flex-col md:flex-row gap-6 border border-white/5 shadow-xl animate-fade-in-up">

                                        {/* AVATAR BOX */}
                                        <div className="shrink-0">
                                            <div className="relative w-[166px] h-[166px] mx-auto md:mx-0">
                                                {/* The Avatar Image */}
                                                <div className="absolute inset-1 bg-gradient-to-b from-gray-700 to-gray-900 overflow-hidden shadow-inner">
                                                    {avatar ? (
                                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#222]">
                                                            <span className="text-4xl">?</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* The Frame Overlay */}
                                                {frame && (
                                                    <div className="absolute -inset-[15%] pointer-events-none z-20">
                                                        <img src={frame} alt="Frame" className="w-full h-full object-contain drop-shadow-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* TEXT INFO */}
                                        <div className="flex-1 flex flex-col justify-start pt-2">

                                            {/* Name & Country */}
                                            <h1 className="text-3xl text-white font-extralight mb-2 drop-shadow-md">
                                                {displayName}
                                            </h1>
                                            <div className="text-xs text-[#8f98a0] flex items-center gap-1.5 mb-6">
                                                <img src="https://community.cloudflare.steamstatic.com/public/images/countryflags/us.gif" alt="Flag" className="opacity-80" />
                                                United States
                                            </div>

                                            {/* Summary */}
                                            <div className="text-[#c6d4df] text-[13px] leading-relaxed max-w-2xl font-light mb-8 whitespace-pre-wrap">
                                                {summary}
                                            </div>

                                            {/* Action Link */}
                                            <div className="mt-auto text-xs text-[#66c0f4] hover:underline cursor-pointer">
                                                View more info
                                            </div>
                                        </div>

                                        {/* LEVEL BADGE */}
                                        <div className="w-full md:w-[280px] shrink-0">
                                            <div className="flex items-center justify-end mb-4">
                                                <div className="text-right mr-3">
                                                    <div className="text-lg text-white font-light">Level</div>
                                                </div>
                                                <div className="relative">
                                                    <div
                                                        className={`
                                                    w-14 h-14 rounded-full border-2 
                                                    flex items-center justify-center 
                                                    text-white font-bold text-xl
                                                    shadow-[0_0_10px_rgba(0,0,0,0.5)]
                                                    bg-[#1b2838]
                                                `}
                                                        style={{
                                                            borderColor: getLevelColor(level)
                                                        }}
                                                    >
                                                        {level}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 mt-4">
                                                <button className="px-6 py-2 bg-[#2a475e33] hover:bg-[#3d5a73] text-white/80 rounded-[2px] text-sm border border-transparent hover:border-white/20 transition-all">
                                                    Add Friend
                                                </button>
                                                <div className="px-3 py-2 bg-[#2a475e] text-[#66c0f4] rounded-[2px] text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer hover:bg-[#34536c] transition-colors">
                                                    Edit Profile
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* RECENT ACTIVITY MOCK */}
                                    <div className="mt-8">
                                        <h3 className="text-lg text-white font-normal mb-2 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors inline-block">
                                            Recent Activity
                                        </h3>
                                        <div className="bg-black/20 p-4 border border-black/30 rounded flex items-center gap-4">
                                            <div className="w-16 h-10 bg-[#2a475e] rounded hidden md:block"></div>
                                            <div className="text-sm text-[#8f98a0]">0.0 hours past 2 weeks</div>
                                        </div>
                                    </div>

                                    {/* MAIN CONTENT COLUMNS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                        {/* MAIN COLUMN */}
                                        <div className="md:col-span-2 space-y-8">
                                            <div className="border border-dashed border-[#3d4c5d] bg-[#1b2838]/50 h-64 rounded flex flex-col items-center justify-center text-[#4f5f72] hover:text-[#66c0f4] hover:border-[#66c0f4] hover:bg-[#1b2838]/80 transition-all cursor-pointer group">
                                                <ImageIcon className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                                                <span className="font-bold">Artwork Showcase</span>
                                            </div>
                                        </div>

                                        {/* SIDEBAR */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-[#66c0f4] uppercase text-sm font-bold mb-2">Online</h3>
                                                <div className="text-[#8f98a0] text-xs">Last Online 2 mins ago</div>
                                            </div>
                                            <div>
                                                <h3 className="text-[#66c0f4] text-sm font-normal mb-2 flex justify-between">
                                                    Badges <span className="text-[#8f98a0]">24</span>
                                                </h3>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="aspect-square bg-[#222] rounded border border-gray-800"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* End Steam Profile Area */}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Subcomponent for Upload Buttons
const UploadButton: React.FC<{ icon: React.ReactNode; label: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ icon, label, onChange }) => (
    <label className="flex items-center gap-2 px-4 py-2 bg-[#1b2838] hover:bg-[#2a475e] text-blue-300 hover:text-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-blue-500/30 group">
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
);

// Helper for Level Color
const getLevelColor = (level: number) => {
    if (level >= 500) return '#c0c0c0';
    if (level >= 100) return '#8f46ab';
    if (level >= 50) return '#4e8ddb';
    if (level >= 40) return '#5a9e36';
    if (level >= 30) return '#eecc33';
    if (level >= 20) return '#e38d22';
    if (level >= 10) return '#be3030';
    return '#8e8e8e';
};

export default ProfileMockup;
