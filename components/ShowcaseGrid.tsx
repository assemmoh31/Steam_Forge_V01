import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, AlertCircle, Loader2, ShoppingCart, TrendingUp } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BackgroundItem } from '../types';
import AdUnit from './AdUnit';

// Real popular market items for fallback
const FALLBACK_BACKGROUNDS: BackgroundItem[] = [
  { 
    id: 1, 
    title: 'Clouds', 
    game: 'Zup! Zero 2', 
    price: '$2.45',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmA9W79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
  { 
    id: 2, 
    title: 'Space 1', 
    game: 'Zup! 8', 
    price: '$1.80',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmBNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
  { 
    id: 3, 
    title: 'The Commander', 
    game: 'NieR:Automata', 
    price: '$0.15',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmCNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
  { 
    id: 4, 
    title: 'Night City', 
    game: 'Cyberpunk 2077', 
    price: '$0.12',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmDNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
  { 
    id: 5, 
    title: 'Geralt of Rivia', 
    game: 'The Witcher 3: Wild Hunt', 
    price: '$0.10',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmENW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
  { 
    id: 6, 
    title: 'Universe', 
    game: 'Wallpaper Engine', 
    price: '$0.25',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw' 
  },
];

interface Source {
  title: string;
  uri: string;
}

const ShowcaseGrid: React.FC = () => {
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);

  const fetchTrendingBackgrounds = async () => {
    setIsLoading(true);
    setError(null);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find 6 currently trending or popular Steam Profile Backgrounds on the Steam Community Market.
        Focus on categories like: Anime, Vaporwave, Aesthetic, or Dark.
        
        For each background, you MUST provide:
        1. The exact Item Name (Market Hash Name).
        2. The Game Name.
        3. The current approximate Price (e.g. $0.15).
        4. A direct image URL (preferably Steam Community/Economy or a wiki).

        Format your response strictly as a list where each line follows this pattern:
        Name || Game || Price || ImageURL

        Example:
        Clouds || Zup! Zero 2 || $2.45 || https://community.cloudflare.steamstatic.com/economy/image/...
        
        Do not use markdown tables or code blocks.`,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      let text = response.text || '';
      
      // Cleanup: Remove markdown code blocks if present
      text = text.replace(/```/g, '').trim();

      const lines = text.split('\n');
      const parsedItems: BackgroundItem[] = [];

      lines.forEach((line, index) => {
        const cleanLine = line.trim();
        if (!cleanLine) return;
        // Skip header lines like "--- | ---"
        if (cleanLine.match(/^[-| ]+$/)) return;

        let parts: string[] = [];

        // Try strict delimiter first
        if (cleanLine.includes('||')) {
          parts = cleanLine.split('||');
        } 
        // Fallback to table style delimiter
        else if (cleanLine.includes('|')) {
          parts = cleanLine.split('|').filter(p => p.trim() !== '');
        }

        parts = parts.map(p => p.replace(/\*\*/g, '').trim());

        if (parts.length >= 3) {
            const title = parts[0];
            const game = parts[1];
            const price = parts[2];
            let imageUrl = parts[3];

            // Cleanup URL if it came as a markdown link [Text](url)
            if (imageUrl) {
               const linkMatch = imageUrl.match(/\((https?:\/\/[^)]+)\)/);
               if (linkMatch) imageUrl = linkMatch[1];
            }

            // Validate URL or use fallback
            if (!imageUrl || imageUrl === 'N/A' || !imageUrl.startsWith('http')) {
              imageUrl = FALLBACK_BACKGROUNDS[index % FALLBACK_BACKGROUNDS.length].imageUrl;
            }

            parsedItems.push({
              id: index + 100,
              title,
              game,
              price,
              imageUrl
            });
        }
      });

      // Extract sources
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedSources = chunks
        .filter((c: any) => c.web?.uri && c.web?.title)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

      if (parsedItems.length > 0) {
        setBackgrounds(parsedItems.slice(0, 6));
        setSources(extractedSources);
      } else {
        // Silently fallback instead of erroring
        console.warn("No data parsed from AI response, using fallback data.");
        setBackgrounds(FALLBACK_BACKGROUNDS);
      }

    } catch (err) {
      console.error("Failed to fetch trending backgrounds:", err);
      // Graceful fallback on API error
      setBackgrounds(FALLBACK_BACKGROUNDS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingBackgrounds();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    // Prevent infinite loop if fallback also fails
    if (!img.getAttribute('data-failed')) {
       img.setAttribute('data-failed', 'true');
       const randomFallback = FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)].imageUrl;
       img.src = randomFallback;
    }
  };

  const getMarketUrl = (item: BackgroundItem) => {
    const query = `${item.title} ${item.game}`;
    return `https://steamcommunity.com/market/search?q=${encodeURIComponent(query)}&appid=753`;
  };

  return (
    <section id="backgrounds" className="py-20 bg-gray-100 dark:bg-[#1b2838] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              Market Trending
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-steam-blue" />}
            </h2>
            <p className="text-gray-600 dark:text-steam-text flex items-center gap-2">
              {error ? (
                <span className="flex items-center gap-1 text-orange-500">
                  <AlertCircle className="w-4 h-4" /> {error}
                </span>
              ) : (
                "Live prices and trends from the Steam Community Market"
              )}
            </p>
          </div>
          
          <button 
            onClick={fetchTrendingBackgrounds}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-steam-card hover:bg-gray-50 dark:hover:bg-steam-accent text-sm font-medium text-gray-700 dark:text-steam-text rounded-lg border border-gray-200 dark:border-steam-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Market
          </button>
        </div>

        {/* Ad Placement */}
        <div className="mb-10">
          <AdUnit type="banner" />
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && backgrounds.length === 0 ? (
            // Skeleton Loading State
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white dark:bg-steam-card border border-gray-200 dark:border-white/5 h-[280px] animate-pulse">
                <div className="h-[180px] bg-gray-200 dark:bg-white/5"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            backgrounds.map((bg) => (
              <div key={bg.id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-steam-card border border-gray-200 dark:border-steam-accent flex flex-col">
                {/* Image */}
                <div className="aspect-video w-full overflow-hidden bg-gray-800 relative">
                  <img 
                    src={bg.imageUrl} 
                    alt={bg.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Price Tag Overlay */}
                  {bg.price && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-green-400 font-bold px-3 py-1 rounded-lg border border-green-500/30 shadow-lg text-sm">
                      {bg.price}
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight mb-1 truncate" title={bg.title}>
                    {bg.title}
                  </h3>
                  <p className="text-blue-600 dark:text-steam-blue text-sm mb-4 truncate">
                    {bg.game}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                     <a 
                       href={getMarketUrl(bg)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 rounded transition-colors"
                     >
                       <ShoppingCart className="w-4 h-4" />
                       Buy on Market
                     </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Sources Footer */}
        {sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5">
            <p className="text-xs font-semibold text-gray-500 dark:text-steam-text mb-3 uppercase tracking-wider">
              Data sourced from:
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {source.title} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowcaseGrid;