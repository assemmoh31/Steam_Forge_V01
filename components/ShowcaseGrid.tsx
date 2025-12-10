import React, { useEffect, useState } from 'react';
import { ExternalLink, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { BackgroundItem } from '../types';
import { VERIFIED_BACKGROUNDS } from '../src/data/backgrounds';

// Fallback data if everything fails
const FALLBACK_BACKGROUNDS: BackgroundItem[] = [
  {
    id: 1,
    title: 'Nebula',
    game: 'Stellaris',
    price: '$0.15',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw'
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
    title: 'Glitch',
    game: 'Hacknet',
    price: '$0.08',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw'
  },
  {
    id: 5,
    title: 'Forest',
    game: 'Don\'t Starve',
    price: '$0.12',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmENW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw'
  },
  {
    id: 6,
    title: 'Red Moon',
    game: 'Terraria',
    price: '$0.10',
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmGNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw'
  }
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

    // Simulate network request
    setTimeout(() => {
      // Just take the first 6 verified items as 'trending' for now
      setBackgrounds(VERIFIED_BACKGROUNDS.slice(0, 6));
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchTrendingBackgrounds();
  }, []);

  const getMarketUrl = (item: BackgroundItem) => {
    if (item.gameId) {
      if (item.tags?.includes('PointsShopReward')) {
        return `https://store.steampowered.com/points/shop/c/backgrounds/reward/${item.gameId}`;
      }
      return `https://store.steampowered.com/app/${item.gameId}`;
    }
    const terms = [item.title, item.game].filter(term =>
      term &&
      term !== 'N/A' &&
      term !== 'Unknown Game'
    );
    const query = terms.join(' ');
    return `https://steamcommunity.com/market/search?q=${encodeURIComponent(query)}&appid=753`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEhfV9WZNmcXgM7OEyvkv64o0tGVqnNQA1rV4ZAPwMTJmKVv4DPkLDqR_rFywUXFk6sNmFNW79u0Eflm8tdeQZ7MkNtFMTsSDW_OAMA39uR1q0_dULsbcoy7r2nvsb28MCBHs5ct6y-1e8rISXw"; // Fallback to reliable Nebula image
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-steam-bg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              Market Trending
            </h2>
            <p className="text-gray-600 dark:text-steam-text">
              Popular community market picks this week
            </p>
          </div>

          <button
            onClick={fetchTrendingBackgrounds}
            disabled={isLoading}
            className="text-sm text-blue-600 dark:text-steam-blue hover:underline disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-steam-card rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-steam-accent animate-pulse">
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
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-20 pointer-events-none">
                    <span className="text-white text-xs flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> View on Market
                    </span>
                  </div>
                  {/* Click overlay */}
                  <a
                    href={getMarketUrl(bg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-30"
                    aria-label={`View ${bg.title} on Steam Market`}
                  >
                  </a>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow relative z-30 pointer-events-none">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight truncate pr-2" title={bg.title}>
                      {bg.title}
                    </h3>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">
                      {bg.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-steam-text/70 mb-3 truncate">{bg.game}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseGrid;