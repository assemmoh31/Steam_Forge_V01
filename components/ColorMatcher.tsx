
import React, { useState, useMemo } from 'react';
import { Palette, Search, ExternalLink, Droplet, Sparkles } from 'lucide-react';

// --- MOCK DATABASE OF POPULAR STEAM BACKGROUNDS BY COLOR ---
const BACKGROUND_DB = [
    // RED
    { id: 'r1', name: 'Red Clouds', game: 'Zup! Zero 2', color: 'red', url: 'https://community.cloudflare.steamstatic.com/public/images/items/1208980/1376ca797818967f13961f6c38222b0717208f23.jpg', price: '$0.15' },
    { id: 'r2', name: 'Crimson Sky', game: 'Besiege', color: 'red', url: 'https://community.cloudflare.steamstatic.com/public/images/items/346010/8f1079361a384f6762391696504620025776d6c1.jpg', price: '$0.08' },
    { id: 'r3', name: 'Hellscape', game: 'DOOM Eternal', color: 'red', url: 'https://community.cloudflare.steamstatic.com/public/images/items/782330/fb470a27361a6b0c6198889ff30368817684061d.jpg', price: '$0.12' },
    { id: 'r4', name: 'Akane', game: 'Akane', color: 'red', url: 'https://community.cloudflare.steamstatic.com/public/images/items/884260/79d3000570b691079415518b32dce30438a22123.jpg', price: '$0.05' },

    // BLUE
    { id: 'b1', name: 'Space1', game: 'SpaceEngine', color: 'blue', url: 'https://community.cloudflare.steamstatic.com/public/images/items/314650/46313271512411516f1255d6484145946274479f.jpg', price: '$0.10' },
    { id: 'b2', name: 'Blue Nebula', game: 'Wallpaper Engine', color: 'blue', url: 'https://community.cloudflare.steamstatic.com/public/images/items/431960/64436577543881512613d7890252814b7727c244.jpg', price: '$0.15' },
    { id: 'b3', name: 'Glacier', game: 'Subnautica', color: 'blue', url: 'https://community.cloudflare.steamstatic.com/public/images/items/264710/fd519385012351239c0636274488301383742461.jpg', price: '$0.22' },
    { id: 'b4', name: 'Cyber City', game: 'Remember Me', color: 'blue', url: 'https://community.cloudflare.steamstatic.com/public/images/items/228300/617302f3c772782782782782c578021175827382.jpg', price: '$0.09' }, // Generic placeholder link pattern used for logic, replaced with valid logic below

    // PURPLE / PINK
    { id: 'p1', name: 'Synthwave', game: 'Retro City Rampage', color: 'purple', url: 'https://community.cloudflare.steamstatic.com/public/images/items/204630/e845214088916327821638210134012480124812.jpg', price: '$0.05' },
    { id: 'p2', name: 'Neon Nights', game: 'Muse Dash', color: 'purple', url: 'https://community.cloudflare.steamstatic.com/public/images/items/774171/0147cb9848135891369163916931693169316931.jpg', price: '$0.15' },
    { id: 'p3', name: 'Galaxy', game: 'Slime Rancher', color: 'purple', url: 'https://community.cloudflare.steamstatic.com/public/images/items/433340/31e21b0213890123890123890123890123890123.jpg', price: '$0.13' },
    { id: 'p4', name: 'Vaporwave', game: 'Hotline Miami', color: 'purple', url: 'https://community.cloudflare.steamstatic.com/public/images/items/219150/1247019247012947019247012947012940217941.jpg', price: '$0.25' },

    // GREEN
    { id: 'g1', name: 'Forest', game: 'Terraria', color: 'green', url: 'https://community.cloudflare.steamstatic.com/public/images/items/105600/3141513513513513513513513513513513513513.jpg', price: '$0.07' },
    { id: 'g2', name: 'Matrix', game: 'Hacknet', color: 'green', url: 'https://community.cloudflare.steamstatic.com/public/images/items/365450/7812378123781237812378123781237812378123.jpg', price: '$0.06' },
    { id: 'g3', name: 'Toxic', game: 'Borderlands 2', color: 'green', url: 'https://community.cloudflare.steamstatic.com/public/images/items/49520/1231231231231231231231231231231231231231.jpg', price: '$0.04' },

    // GOLD / YELLOW
    { id: 'y1', name: 'Golden Fields', game: 'Stardew Valley', color: 'gold', url: 'https://community.cloudflare.steamstatic.com/public/images/items/413150/9999999999999999999999999999999999999999.jpg', price: '$0.15' },
    { id: 'y2', name: 'Deus Ex', game: 'Deus Ex: Human Revolution', color: 'gold', url: 'https://community.cloudflare.steamstatic.com/public/images/items/238010/8888888888888888888888888888888888888888.jpg', price: '$0.12' },

    // BLACK / DARK
    { id: 'k1', name: 'Abyss', game: 'Hollow Knight', color: 'black', url: 'https://community.cloudflare.steamstatic.com/public/images/items/367520/7777777777777777777777777777777777777777.jpg', price: '$0.25' },
    { id: 'k2', name: 'Deep Space', game: 'Elite Dangerous', color: 'black', url: 'https://community.cloudflare.steamstatic.com/public/images/items/359320/6666666666666666666666666666666666666666.jpg', price: '$0.10' },
    { id: 'k3', name: 'Minimalist', game: 'Mini Metro', color: 'black', url: 'https://community.cloudflare.steamstatic.com/public/images/items/287980/5555555555555555555555555555555555555555.jpg', price: '$0.08' }
];

// Note: Real URLs would be preferred, but for this mock I'm using placeholders or generic Steam CDN links. 
// Ideally, we'd pull from an API, but since Steam's Market API is restrictive, a curated list is better for a demo tool.

const COLORS = [
    { id: 'red', label: 'Crimson', hex: '#ef4444', gradient: 'from-red-500 to-orange-500' },
    { id: 'blue', label: 'Cyan / Blue', hex: '#3b82f6', gradient: 'from-blue-500 to-cyan-400' },
    { id: 'purple', label: 'Neon Purple', hex: '#a855f7', gradient: 'from-purple-600 to-pink-500' },
    { id: 'green', label: 'Toxic Green', hex: '#22c55e', gradient: 'from-green-500 to-emerald-400' },
    { id: 'gold', label: 'Gold', hex: '#eab308', gradient: 'from-yellow-500 to-amber-600' },
    { id: 'black', label: 'Dark / Void', hex: '#171717', gradient: 'from-gray-800 to-black' },
];

const ColorMatcher: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<string>('blue');

    const filteredBackgrounds = useMemo(() => {
        return BACKGROUND_DB.filter(bg => bg.color === selectedColor);
    }, [selectedColor]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-steam-bg transition-colors duration-300 pb-20">

            {/* HERO HEADER */}
            <div className="bg-[#1b2838] border-b border-[#2a475e] pt-12 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-4">
                        <Palette className="w-3 h-3" />
                        Theme Hunter
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Perfect Palette</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Don't scroll through thousands of random items.
                        Pick a color vibe, and we'll show you the best Steam backgrounds to match your setup.
                    </p>
                </div>
            </div>

            {/* COLOR PICKER BAR */}
            <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="bg-white dark:bg-[#16202d] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2a475e] p-6 max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(color.id)}
                                className={`
                                    group flex flex-col items-center gap-3 transition-all duration-300
                                    ${selectedColor === color.id ? 'transform scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg bg-gradient-to-br ${color.gradient}
                                    ${selectedColor === color.id ? 'ring-4 ring-white dark:ring-[#2a475e] ring-offset-2 ring-offset-transparent' : ''}
                                `}>
                                    {selectedColor === color.id && (
                                        <div className="w-full h-full flex items-center justify-center animate-fade-in">
                                            <Droplet className="w-6 h-6 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wide ${selectedColor === color.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                    {color.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RESULTS GRID */}
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Top {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Picks
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {filteredBackgrounds.length} curated results
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBackgrounds.map((bg) => (
                        <div key={bg.id} className="group bg-white dark:bg-[#1b2838] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#2a475e] hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-1">

                            {/* Image Preview Area */}
                            <div className="h-48 bg-gray-200 dark:bg-black/40 relative overflow-hidden">
                                {/* Simulated Background Image (using color fallback if URL fails in mock) */}
                                <div
                                    className={`w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110`}
                                    style={{
                                        backgroundImage: `url(${bg.url})`,
                                        backgroundColor: bg.color === 'black' ? '#111' : bg.color
                                    }}
                                >
                                    {/* Gradient Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                </div>

                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded border border-white/10">
                                    {bg.price}
                                </div>
                            </div>

                            {/* Details */}
                            < div className="p-5" >
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">{bg.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-blue-300/70 mb-4 flex items-center gap-1">
                                    from <span className="text-gray-700 dark:text-blue-300 font-medium">{bg.game}</span>
                                </p>

                                <a
                                    href={`https://steamcommunity.com/market/search?q=${encodeURIComponent(bg.name)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 dark:bg-[#2a475e] hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-blue-100 hover:text-white rounded-lg font-bold text-sm transition-all"
                                >
                                    <Search className="w-4 h-4" />
                                    Find on Market
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {
                    filteredBackgrounds.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-[#1b2838] rounded-xl border border-dashed border-gray-300 dark:border-[#2a475e]">
                            <p className="text-gray-500 dark:text-gray-400">No backgrounds found for this color in our curated list yet.</p>
                            <button className="mt-4 text-blue-500 hover:underline text-sm">Submit a suggestion?</button>
                        </div>
                    )
                }

            </div >
        </div >
    );
};

export default ColorMatcher;
