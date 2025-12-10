import React, { useState, useMemo, useEffect } from 'react';
import { Search, Loader2, Palette, DollarSign, ExternalLink, ShoppingCart, AlertCircle, Sparkles, Tag, TrendingUp, Image as ImageIcon, Crop, X, Download } from 'lucide-react';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { BackgroundItem } from '../types';
import AdUnit from './AdUnit';
import { VERIFIED_BACKGROUNDS } from '../src/data/backgrounds';

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
  'Anime', 'Space', 'Cyberpunk', 'Dark', 'Neon', 'Retro', 'Minimalist', 'Fantasy'
];

// Reliable fallback images from Steam CDN
const FALLBACK_THEMES = [
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Nebula
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmBNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Space
  "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmCNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw", // Clouds
];

// Optimized Image Component
const ThemeImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          console.warn('Image failed to load:', src);
          e.currentTarget.onerror = null; // Prevent loop
          // Fallback to specific static image if local fails
          if (!imgSrc.startsWith('http')) {
            setImgSrc(FALLBACK_THEMES[0]);
          }
        }}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
  );
};

import { LOCAL_BACKGROUNDS } from '../src/data/local_loader';

const ThemeFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appIdInput, setAppIdInput] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState('any');
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const cropperRef = React.useRef<ReactCropperElement>(null);

  /* New Reactive Logic */
  const [apiResults, setApiResults] = useState<BackgroundItem[] | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Derived state: Filtered Results
  const filteredResults = useMemo(() => {
    let dataset = [...VERIFIED_BACKGROUNDS, ...LOCAL_BACKGROUNDS];

    // 1. Text Filter
    if (debouncedQuery) {
      const lowerQuery = debouncedQuery.toLowerCase();
      dataset = dataset.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.game.toLowerCase().includes(lowerQuery) ||
        item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // 2. Color Filter
    if (selectedColor) {
      const lowerColor = selectedColor.toLowerCase();
      dataset = dataset.filter(item =>
        item.tags?.some(tag => tag.toLowerCase() === lowerColor)
      );
    }

    // 3. Price Filter
    if (priceRange !== 'any') {
      const maxPrice = parseFloat(priceRange);
      dataset = dataset.filter(item => {
        if (!item.price) return true;
        const priceVal = parseFloat(item.price.replace('$', ''));
        return priceVal <= maxPrice;
      });
    }

    return dataset;
  }, [debouncedQuery, selectedColor, priceRange]);

  // Handle App ID fetching - Effect
  useEffect(() => {
    if (/^\d+$/.test(debouncedQuery) && debouncedQuery.length > 2) {
      fetchSteamGameDetails(debouncedQuery);
    } else {
      setApiResults(null);
    }
  }, [debouncedQuery]);

  /* Finalizing Reactive State */
  const [isLoading, setIsLoading] = useState(false);

  const fetchSteamGameDetails = async (appId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
      const data = await response.json();

      if (data[appId]?.success) {
        const gameData = data[appId].data;
        const screenshots = gameData.screenshots || [];
        const background = gameData.background;

        const foundItems: BackgroundItem[] = screenshots.map((ss: any, idx: number) => ({
          id: `steam-${appId}-${idx}`,
          title: `${gameData.name} Background ${idx + 1}`,
          game: gameData.name,
          gameId: appId,
          imageUrl: ss.path_full,
          price: "N/A",
          tags: [gameData.name]
        }));

        if (background) {
          foundItems.unshift({
            id: `steam-${appId}-main`,
            title: `${gameData.name} Main`,
            game: gameData.name,
            gameId: appId,
            imageUrl: background,
            price: "N/A",
            tags: [gameData.name]
          });
        }
        setApiResults(foundItems);
      } else {
        // Fallback to local filtering if API fails
        const localMatches = VERIFIED_BACKGROUNDS.filter(b => b.gameId?.toString() === appId);
        if (localMatches.length > 0) {
          setApiResults(localMatches);
        } else {
          setApiResults([]);
          // alert('Could not find data for this App ID.'); // Optional: Less intrusive to just show empty
        }
      }
    } catch (err) {
      console.warn("Steam API fetch failed, using fallback.");
      const localMatches = VERIFIED_BACKGROUNDS.filter(b => b.gameId?.toString() === appId);
      setApiResults(localMatches.length > 0 ? localMatches : []);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketUrl = (item: BackgroundItem) => {
    // If gameId exists, link to the Points Shop (more relevant for backgrounds)
    if (item.gameId) {
      // If it's explicitly identified as a Reward ID (from our local loader)
      if (item.tags?.includes('PointsShopReward')) {
        return `https://store.steampowered.com/points/shop/c/backgrounds/reward/${item.gameId}`;
      }
      // Otherwise assume it's a Game App ID
      return `https://store.steampowered.com/points/shop/app/${item.gameId}`;
    }

    // Clean search
    const terms = [item.title, item.game].filter(term =>
      term && term !== 'N/A' && !term.includes('Unknown')
    );
    // Extra cleanup for numbers as requested
    const cleanTerms = terms.map(t => t.replace(/^\d+\.\s*/, '').trim());
    const query = cleanTerms.join(' ');
    return `https://steamcommunity.com/market/search?q=${encodeURIComponent(query)}&appid=753`;
  };

  // Decide what to show: API results take precedence if they exist
  const displayResults = apiResults || filteredResults;

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropped-background.png';
            a.click();
            URL.revokeObjectURL(url);
            setCroppingImage(null);
          }
        });
      }
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-[#1b2838] min-h-screen transition-colors duration-300">

      {/* Top Controller Bar - "Gallery Header" Style */}
      <div className="bg-white dark:bg-[#171a21] border-b border-gray-200 dark:border-black sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-500" />
                Background Gallery
              </h2>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full font-mono">
                {displayResults.length} items
              </span>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-1 max-w-2xl w-full gap-2 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search themes or AppID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#1b2838] border border-gray-200 dark:border-[#2a475e] rounded text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mr-2">Color:</span>
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                className={`w-5 h-5 rounded hover:scale-110 transition-transform ${color.class} ${selectedColor === color.name ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#171a21]' : ''
                  }`}
                title={color.name}
              />
            ))}

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mr-2">Tags:</span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-[#2a475e] text-gray-600 dark:text-blue-300 rounded hover:bg-gray-200 dark:hover:bg-[#66c0f4] dark:hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayResults.map((bg) => (
              <div key={bg.id} className="group relative aspect-video overflow-hidden bg-black cursor-pointer rounded-lg shadow-md hover:z-10 hover:shadow-2xl transition-all duration-200">
                {/* Image */}
                <ThemeImage src={bg.imageUrl} alt={bg.title} />

                {/* Hover Overlay - Gallery Style */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex flex-col items-start justify-end h-full">
                  <h3 className="text-white font-bold text-sm leading-tight truncate w-full shadow-black drop-shadow-md">{bg.title}</h3>
                  <p className="text-blue-300 text-xs truncate w-full mb-1">{bg.game}</p>

                  {/* Debug Tags Display */}
                  <div className="flex flex-wrap gap-1 mb-2 opacity-80">
                    {bg.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-white/20 px-1 rounded text-white backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <a
                      href={getMarketUrl(bg)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-[#66c0f4] hover:bg-[#419bc9] text-white text-xs py-1.5 px-2 rounded text-center font-medium"
                    >
                      View on Steam
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCroppingImage(bg.imageUrl);
                      }}
                      className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded border border-white/20"
                      title="Crop / Preview"
                    >
                      <Crop className="w-3 h-3" />
                    </button>
                    <a
                      href={`https://steamcommunity.com/market/search?q=${encodeURIComponent(bg.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1.5 bg-black/40 hover:bg-black/60 text-white rounded border border-white/20"
                      title="Search Market"
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cropping Modal */}
        {croppingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1b2838] p-6 rounded-lg max-w-4xl w-full flex flex-col gap-4 shadow-2xl border border-gray-700">
              <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Crop className="w-5 h-5 text-blue-400" />
                  Crop Background
                </h3>
                <button
                  onClick={() => setCroppingImage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="h-[60vh] bg-black/50 rounded overflow-hidden">
                <Cropper
                  src={croppingImage}
                  style={{ height: '100%', width: '100%' }}
                  initialAspectRatio={16 / 9}
                  guides={true}
                  ref={cropperRef}
                  viewMode={1}
                  dragMode="move"
                  background={false}
                  responsive={true}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCroppingImage(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onCrop}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 font-medium shadow-lg shadow-blue-900/20"
                >
                  <Download className="w-4 h-4" />
                  Download Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && displayResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <Palette className="w-16 h-16 mb-4 opacity-20" />
            <p>No backgrounds found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThemeFinder;