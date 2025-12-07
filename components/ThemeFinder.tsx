import React, { useState, useMemo } from 'react';
import { Search, Loader2, Palette, DollarSign, ExternalLink, ShoppingCart, AlertCircle, Sparkles, Tag, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BackgroundItem } from '../types';
import AdUnit from './AdUnit';

const COLORS = [
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Orange', hex: '#f97316', class: 'bg-orange-500' },
  { name: 'Yellow', hex: '#eab308', class: 'bg-yellow-400' },
  { name: 'Green', hex: '#22c55e', class: 'bg-green-500' },
  { name: 'Cyan', hex: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
  { name: 'Pink', hex: '#ec4899', class: 'bg-pink-500' },
  { name: 'Black', hex: '#111827', class: 'bg-gray-900' },
  { name: 'White', hex: '#ffffff', class: 'bg-white border border-gray-200' },
  { name: 'Grey', hex: '#6b7280', class: 'bg-gray-500' },
];

const PRICE_RANGES = [
  { label: 'Any Price', value: 'any' },
  { label: 'Under $0.10', value: '0.10' },
  { label: 'Under $0.50', value: '0.50' },
  { label: 'Under $1.00', value: '1.00' },
  { label: 'Under $5.00', value: '5.00' },
];

const POPULAR_TAGS = [
  'Anime', 'Pixel Art', 'Vaporwave', 'Space', 'Cyberpunk', 
  'Nature', 'Horror', 'Retro', 'Minimalist', 'Neon', 'Fantasy', 'Dark'
];

// Reliable fallback images from Steam CDN
const FALLBACK_THEMES = [
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Nebula
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmBNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Space
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmCNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Clouds
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmDNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // City
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmENW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Forest/Green
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmGNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw"  // Red/Dark
];

// Optimized Image Component with Skeleton Loading and Fallbacks
const ThemeImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  
  // Safe alt check
  const safeAlt = alt || 'Background';

  // Deterministic fallback based on title hash so the same item always gets the same fallback
  const fallbackSrc = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < safeAlt.length; i++) {
        hash = safeAlt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % FALLBACK_THEMES.length;
    return FALLBACK_THEMES[index];
  }, [safeAlt]);

  // Reset state if src changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setFallbackFailed(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      // First failure: Try the deterministic fallback
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      // Second failure (fallback failed): Show error state
      setFallbackFailed(true);
      setIsLoaded(true); // Stop loading animation
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800 overflow-hidden">
      {/* Loading Placeholder / Skeleton */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 transition-opacity duration-500 z-10 ${
            isLoaded || fallbackFailed ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'
        }`}
      >
        <div className="flex flex-col items-center gap-2 opacity-50">
           <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Actual Image */}
      {!fallbackFailed ? (
        <img 
            src={currentSrc} 
            alt={safeAlt} 
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-all duration-700 ease-out transform ${isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-105'} group-hover:scale-110`}
        />
      ) : (
        /* Fallback Failed State */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-500 p-4 text-center">
            <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">Preview Unavailable</span>
        </div>
      )}
    </div>
  );
};

const ThemeFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState('any');
  
  const [results, setResults] = useState<BackgroundItem[]>([]);
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    
    // Use override query (from tag click) or current state
    const queryToUse = overrideQuery !== undefined ? overrideQuery : searchQuery;
    if (overrideQuery !== undefined) setSearchQuery(overrideQuery);

    if (!queryToUse && !selectedColor && priceRange === 'any') return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setRelatedTags([]); // Clear previous tags while loading new ones
    setHasSearched(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let promptContext = "Find 8 specific Steam Profile Backgrounds on the Community Market matching these criteria:\n";
      if (queryToUse) promptContext += `- Visual Theme/Keywords: ${queryToUse}\n`;
      if (selectedColor) promptContext += `- Dominant Color: ${selectedColor}\n`;
      if (priceRange !== 'any') promptContext += `- Maximum Price: $${priceRange} USD\n`;
      
      const prompt = `${promptContext}
      For each background, you MUST provide:
      1. The exact Market Hash Name (Item Name).
      2. The Game Name.
      3. The approximate Price.
      4. A DIRECT image URL. 
         - PRIORITIZE URLs starting with 'https://community.cloudflare.steamstatic.com/economy/image/...' or 'https://steamcommunity.com/economy/image/...'.
         - Search specifically for 'steam community market image' or 'steamcardexchange'.
         - If a direct image link is not found, use 'N/A'.

      Format strictly as:
      Name || Game || Price || ImageURL

      Example:
      Cloudy Sky || Weather Sim || $0.05 || https://community.cloudflare.steamstatic.com/economy/image/...
      
      Do NOT use markdown formatting (like **bold** or tables).

      At the very end of your response, strictly generate a single line starting with "RELATED:" followed by 5 comma-separated related search keywords or aesthetic tags that a user interested in this search might also like.
      Example end:
      ...
      RELATED: Glitch, Hacker, Matrix, Green, Code`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      let text = response.text || '';
      // Cleanup markdown
      text = text.replace(/```/g, '').trim();

      const lines = text.split('\n');
      const parsedItems: BackgroundItem[] = [];
      let foundTags: string[] = [];

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        // Skip separators
        if (trimmedLine.match(/^[-| ]+$/)) return;

        if (trimmedLine.startsWith('RELATED:')) {
            foundTags = trimmedLine.replace('RELATED:', '').split(',').map(t => t.trim()).filter(t => t.length > 0);
        } else {
          let parts: string[] = [];
          
          if (trimmedLine.includes('||')) {
            parts = trimmedLine.split('||');
          } else if (trimmedLine.includes('|')) {
            parts = trimmedLine.split('|').filter(p => p.trim() !== '');
          }

          parts = parts.map(p => p.replace(/\*\*/g, '').replace(/__/g, '').trim());

          if (parts.length >= 3) {
            let imageUrl = parts[3];
            // Simple validation to ensure it looks like a URL
            if (imageUrl) {
                 const linkMatch = imageUrl.match(/\((https?:\/\/[^)]+)\)/);
                 if (linkMatch) imageUrl = linkMatch[1];
            }

            if (!imageUrl || imageUrl.length < 10 || imageUrl === 'N/A') {
                 // Use a random fallback if AI fails to give a URL entirely
                 imageUrl = FALLBACK_THEMES[Math.floor(Math.random() * FALLBACK_THEMES.length)];
            }

            parsedItems.push({
              id: Date.now() + Math.random(),
              title: parts[0] || 'Unknown Title',
              game: parts[1] || 'Unknown Game',
              price: parts[2] || 'N/A',
              imageUrl: imageUrl
            });
          }
        }
      });

      if (parsedItems.length === 0) {
        setError("No exact matches found. Try broadening your search terms.");
      } else {
        setResults(parsedItems);
        setRelatedTags(foundTags);
      }

    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketUrl = (item: BackgroundItem) => {
    const query = `${item.title} ${item.game}`;
    return `https://steamcommunity.com/market/search?q=${encodeURIComponent(query)}&appid=753`;
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-steam-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Palette className="w-10 h-10 text-blue-500" />
            Steam Theme Finder
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl mx-auto text-lg">
            Search through thousands of backgrounds by color, aesthetics, or budget to find the perfect match for your profile.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white dark:bg-steam-card rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-steam-accent">
                <form onSubmit={(e) => handleSearch(e)} className="space-y-6">
                    
                    {/* Top Row: Search Input */}
                    <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Describe your theme (e.g. 'Cyberpunk City', 'Anime Girl', 'Forest', 'Pixel Art')..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-steam-bg border border-transparent dark:border-steam-accent rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Color Picker */}
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-steam-text uppercase mb-3">
                        Dominant Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none ${color.class} ${
                                selectedColor === color.name 
                                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-steam-card scale-110' 
                                : 'border-transparent dark:border-white/10'
                            }`}
                            title={color.name}
                            aria-label={`Select color ${color.name}`}
                            />
                        ))}
                        {selectedColor && (
                            <button 
                            type="button"
                            onClick={() => setSelectedColor(null)}
                            className="text-xs text-red-500 hover:underline ml-2 self-center"
                            >
                            Clear
                            </button>
                        )}
                        </div>
                    </div>

                    {/* Price Selector */}
                    <div className="w-full md:w-48">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-steam-text uppercase mb-3 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Max Price
                        </label>
                        <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-steam-bg border border-transparent dark:border-steam-accent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                        {PRICE_RANGES.map((range) => (
                            <option key={range.value} value={range.value}>
                            {range.label}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {isLoading ? 'Searching Market...' : 'Find Themes'}
                    </button>
                    </div>
                </form>
            </div>

            {/* Suggestions / Tags Area */}
            <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm font-medium text-gray-500 dark:text-steam-text flex items-center gap-2 mr-2">
                    {hasSearched ? <Sparkles className="w-4 h-4 text-purple-500" /> : <TrendingUp className="w-4 h-4 text-green-500" />}
                    {hasSearched ? 'Related Suggestions:' : 'Popular Themes:'}
                </span>
                
                {(hasSearched && relatedTags.length > 0 ? relatedTags : POPULAR_TAGS).map((tag, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSearch(undefined, tag)}
                        disabled={isLoading}
                        className={`
                            group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                            ${hasSearched 
                                ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/40' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 dark:bg-steam-card dark:text-steam-text dark:border-steam-accent dark:hover:bg-white/5'
                            }
                        `}
                    >
                        <Tag className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        {/* Ad Space */}
        <div className="max-w-4xl mx-auto mb-12">
           <AdUnit type="banner" />
        </div>

        {/* Results Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="bg-white dark:bg-steam-card rounded-xl h-64 border border-gray-200 dark:border-white/5"></div>
                ))}
             </div>
          ) : error ? (
            <div className="text-center py-16 text-gray-500 dark:text-steam-text">
               <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
               <p className="text-lg">{error}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((bg) => (
                <div key={bg.id} className="group relative bg-white dark:bg-steam-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-200 dark:border-steam-accent flex flex-col">
                  {/* Image */}
                  <div className="aspect-video w-full overflow-hidden bg-gray-800 relative">
                    <ThemeImage src={bg.imageUrl} alt={bg.title} />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-20 pointer-events-none">
                       <span className="text-white text-xs flex items-center gap-1">
                         <ExternalLink className="w-3 h-3" /> View Full Size
                       </span>
                    </div>
                    {/* Click overlay for full image */}
                     <a 
                         href={bg.imageUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="absolute inset-0 z-30"
                         aria-label="View full size image"
                       >
                       </a>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-grow relative z-30 pointer-events-none">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight truncate pr-2" title={bg.title}>
                          {bg.title}
                        </h3>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">
                          {bg.price}
                        </span>
                     </div>
                     <p className="text-sm text-blue-600 dark:text-steam-blue mb-4 truncate">{bg.game}</p>
                     
                     <a 
                       href={getMarketUrl(bg)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-gray-100 dark:bg-steam-bg hover:bg-blue-600 hover:text-white dark:hover:bg-steam-accent text-gray-700 dark:text-steam-text rounded-lg transition-colors font-medium text-sm group/btn pointer-events-auto"
                     >
                       <ShoppingCart className="w-4 h-4 group-hover/btn:fill-current" />
                       Find on Market
                     </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !hasSearched && (
              <div className="text-center py-20 opacity-50">
                 <Palette className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-steam-accent" />
                 <p className="text-xl text-gray-500 dark:text-steam-text">
                   Enter a keyword or pick a color to start discovering themes.
                 </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ThemeFinder;