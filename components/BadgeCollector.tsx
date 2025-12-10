import React, { useState } from 'react';
import { Search, Loader, Shield, AlertTriangle } from 'lucide-react';

interface Badge {
    badgeid: number;
    level: number;
    completion_time: number;
    xp: number;
    scarcity: number;
    appid: number;
    // Enhanced properties we might try to infer
    name?: string;
    gameName?: string;
    imageUrl?: string;
}

interface PlayerSummary {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatarfull: string;
    timecreated?: number;
}

const BadgeCollector: React.FC = () => {
    const [steamId, setSteamId] = useState('');
    const [player, setPlayer] = useState<PlayerSummary | null>(null);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        if (!steamId) return;
        setIsLoading(true);
        setError(null);
        setPlayer(null);
        setBadges([]);

        try {
            // 1. Fetch Player Summary
            const summaryRes = await fetch(`/api/steam/player/${steamId}`);
            if (!summaryRes.ok) throw new Error('Failed to fetch player summary');
            const summaryData = await summaryRes.json();

            const userData = summaryData.response?.players?.[0];
            if (!userData) {
                throw new Error('User not found. Check Steam ID.');
            }
            setPlayer(userData);

            // 2. Fetch Badges
            const badgesRes = await fetch(`/api/steam/badges/${steamId}`);
            if (badgesRes.ok) {
                const badgesData = await badgesRes.json();
                const userBadges = badgesData.response?.badges || [];

                // Sort by scarcity (rarity) or level
                // Note: scarcity is random-ish from API, usually simply number of owners.
                // Let's sort by Completion Time (newest first)
                const sortedBadges = userBadges.sort((a: Badge, b: Badge) => b.completion_time - a.completion_time);

                setBadges(sortedBadges);
            } else {
                console.warn('Failed to fetch badges, maybe private profile?');
                // Don't error out completely, just show no badges
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred fetching data.');
        } finally {
            setIsLoading(false);
        }
    };

    const getBadgeUrl = (appid: number, badgeid: number) => {
        // Direct link to the badge page on Steam Community
        return `https://steamcommunity.com/profiles/${steamId}/gamecards/${appid}`;
    };

    return (
        <section className="bg-gray-100 dark:bg-[#1b2838] min-h-screen py-10 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
                        <Shield className="w-10 h-10 text-blue-500" />
                        Badge Collector
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        View your entire Steam badge collection, sorted by newest first.
                    </p>
                </div>

                {/* Search Input */}
                <div className="bg-white dark:bg-[#171a21] p-6 rounded-xl shadow-lg mb-8 max-w-2xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter Steam ID (64-bit e.g., 76561198...)"
                            value={steamId}
                            onChange={(e) => setSteamId(e.target.value)}
                            className="flex-grow p-3 bg-gray-50 dark:bg-[#2a475e] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={fetchProfile}
                            disabled={isLoading || !steamId}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader className="animate-spin" /> : <Search className="w-5 h-5" />}
                            Fetch Badges
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Make sure your profile and game details are set to <strong>Public</strong>.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-8 text-center flex items-center justify-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Simple Profile Header */}
                {player && (
                    <div className="flex items-center gap-4 mb-8 bg-white dark:bg-[#171a21] p-4 rounded-lg shadow w-fit mx-auto">
                        <img src={player.avatarfull} alt={player.personaname} className="w-16 h-16 rounded border-2 border-blue-500" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{player.personaname}</h3>
                            <a href={player.profileurl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                                View Steam Profile
                            </a>
                        </div>
                        <div className="ml-8 text-right hidden sm:block">
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{badges.length}</div>
                            <div className="text-xs uppercase text-gray-500 tracking-wider">Total Badges</div>
                        </div>
                    </div>
                )}

                {/* Badge Grid */}
                {badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {badges.map((badge) => (
                            <a
                                key={`${badge.appid}-${badge.badgeid}`}
                                href={getBadgeUrl(badge.appid, badge.badgeid)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white dark:bg-[#171a21] p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-between h-40 group relative overflow-hidden"
                            >
                                <div className="absolute top-2 right-2 flex flex-col items-end">
                                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-mono">
                                        Lvl {badge.level}
                                    </span>
                                </div>

                                {/* Icon Placeholder - Since we don't have images without scraping, we use AppID to show a generic Game Icon style or similar */}
                                <div className="flex-grow flex items-center justify-center text-center">
                                    {/* We can try to use Steam's CDN for app capsule as a fallback visual? */}
                                    <img
                                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${badge.appid}/header.jpg`}
                                        alt={`App ${badge.appid}`}
                                        className="w-full h-auto max-h-20 object-contain rounded opacity-80 group-hover:opacity-100 transition-opacity"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://store.steampowered.com/public/shared/images/header/placeholder_75x75.png';
                                            e.currentTarget.className = "w-12 h-12 opacity-30";
                                        }}
                                    />
                                </div>

                                <div className="w-full mt-3 text-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                                        App {badge.appid}
                                    </div>
                                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                        XP: {badge.xp}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    !isLoading && player && (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <p>No badges found (or profile is private).</p>
                        </div>
                    )
                )}

            </div>
        </section>
    );
};

export default BadgeCollector;
