import React, { useState } from 'react';
import { Download, Search, Tag, ExternalLink, Image as ImageIcon, Heart } from 'lucide-react';

interface FreeShowcaseItem {
    id: string;
    title: string;
    author: string;
    description: string;
    imageUrl: string; // Preview image or GIF
    downloadUrl: string; // Direct download link or linking to Google Drive/etc
    tags: string[];
    likes: number;
}

// !!! USER: ADD YOUR NEW SHOWCASES HERE !!!
const showcaseDatabase: FreeShowcaseItem[] = [
    {
        id: 'neon-city-v1',
        title: 'Cyberpunk Neon City',
        author: 'SteamForge',
        description: 'A vibrant, glitch-art style showcase perfect for synthwave lovers.',
        imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop', // Placeholder
        downloadUrl: '#',
        tags: ['Neon', 'Cyberpunk', 'Purple'],
        likes: 124
    },
    {
        id: 'forest-calm',
        title: 'Misty Forest Calm',
        author: 'SteamForge',
        description: 'Serene green forest vibes for a relaxed profile aesthetic.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-dfd8f3793371?q=80&w=2070&auto=format&fit=crop', // Placeholder
        downloadUrl: '#',
        tags: ['Nature', 'Green', 'Peaceful'],
        likes: 89
    },
    {
        id: 'anime-sky-clouds',
        title: 'Anime Sky & Clouds',
        author: 'Community',
        description: 'Beautiful day sky with fluffy clouds in anime art style.',
        imageUrl: 'https://images.unsplash.com/photo-1596708688849-0add3e32e578?q=80&w=2070&auto=format&fit=crop', // Placeholder
        downloadUrl: '#',
        tags: ['Anime', 'Sky', 'Blue'],
        likes: 256
    },
    {
        id: 'luffy-gear-5',
        title: 'One Piece - Luffy Gear 5',
        author: 'Community',
        description: 'Epic split artwork featuring Monkey D. Luffy. Includes all 5 animated GIF parts.',
        imageUrl: './showcases/luffy_preview.png',
        downloadUrl: './downloads/one_piece_luffy.zip',
        tags: ['Anime', 'One Piece', 'Luffy', 'Red', 'Fire', 'Animated'],
        likes: 42
    }
];

const FreeShowcases: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get unique tags
    const allTags = Array.from(new Set(showcaseDatabase.flatMap(item => item.tags)));

    const filteredShowcases = showcaseDatabase.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1b2838] transition-colors duration-300 pb-20">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-[#171a21] to-blue-900 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://store.cloudflare.steamstatic.com/public/images/v6/home/header_bg.jpg')] bg-cover opacity-20 bg-center"></div>
                <div className="relative container mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Free Community Showcases
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        Browse and download high-quality, pre-made Steam profile showcases.
                        Completely free to use.
                    </p>

                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search showcases (e.g., 'Cyberpunk', 'Nature')..."
                            className="w-full py-4 pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-lg shadow-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedTag ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-[#2a475e] text-gray-600 dark:text-blue-100 hover:bg-gray-100 dark:hover:bg-[#3d5a73]'}`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${tag === selectedTag ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-[#2a475e] text-gray-600 dark:text-blue-100 hover:bg-gray-100 dark:hover:bg-[#3d5a73]'}`}
                        >
                            <Tag className="w-3 h-3" />
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredShowcases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredShowcases.map((item) => (
                            <div key={item.id} className="group bg-white dark:bg-[#171a21] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-[#2a475e] flex flex-col hover:-translate-y-1">

                                {/* Image Area */}
                                <div className="relative h-48 overflow-hidden bg-gray-800">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                                        <Heart className="w-3 h-3 fill-current text-pink-500" />
                                        {item.likes}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-grow relative z-20">
                                    {/* Author Badge */}
                                    <div className="absolute -top-5 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border-2 border-white dark:border-[#171a21]">
                                        by {item.author}
                                    </div>

                                    <div className="pt-2 mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors line-clamp-1">{item.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#2a475e] flex items-center justify-between gap-4">
                                        <div className="flex gap-2 overflow-hidden items-center masked-overflow">
                                            {item.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs bg-gray-100 dark:bg-[#2a475e] text-gray-600 dark:text-blue-200 px-2 py-1 rounded">#{tag}</span>
                                            ))}
                                            {item.tags.length > 2 && <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>}
                                        </div>

                                        <a
                                            href={item.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-60">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No showcases found matching your search.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedTag(null); }}
                            className="mt-4 text-blue-500 underline hover:text-blue-400"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FreeShowcases;
