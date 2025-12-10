
import { BackgroundItem } from '../../types';
import { SIMPLE_BACKGROUNDS } from './simple_backgrounds';

const generateTags = (name: string): string[] => {
    const tags = ['Reward', 'Animated', 'PointsShopReward'];
    const lowerName = name.toLowerCase();

    // Color mappings
    const colorMap: Record<string, string[]> = {
        'red': ['red', 'fire', 'blood', 'rose', 'ruby', 'crimson', 'bomb', 'war', 'fight', 'attack', 'heat', 'mars', 'demon', 'hell'],
        'orange': ['orange', 'autumn', 'sunset', 'amber', 'pumpkin', 'halloween', 'rust'],
        'yellow': ['yellow', 'gold', 'sun', 'star', 'spark', 'desert', 'sand', 'light', 'shine', 'electric'],
        'green': ['green', 'forest', 'grass', 'nature', 'jade', 'emerald', 'leaf', 'toxic', 'poison', 'slime', 'vine', 'swamp', 'jungle', 'spring'],
        'cyan': ['cyan', 'turquoise', 'teal', 'diamond'],
        'blue': ['blue', 'water', 'sea', 'ocean', 'sky', 'ice', 'sapphire', 'winter', 'cold', 'frost', 'rain', 'storm', 'thunder', 'river', 'lake'],
        'purple': ['purple', 'violet', 'amethyst', 'lavender', 'void', 'galaxy', 'nebula', 'magic', 'mystery'],
        'pink': ['pink', 'sakura', 'cherry', 'love', 'heart', 'flower', 'cute', 'kawaii'],
        'black': ['black', 'dark', 'night', 'shadow', 'obsidian', 'ink', 'space', 'void', 'galaxy', 'death', 'horror', 'scary', 'midnight'],
        'white': ['white', 'snow', 'cloud', 'light', 'pure', 'angel', 'heaven', 'paper', 'winter'],
        'grey': ['grey', 'gray', 'silver', 'metal', 'ash', 'stone', 'rock', 'steam', 'smoke']
    };

    // Category mappings
    const categoryMap: Record<string, string[]> = {
        'Anime': ['anime', 'waifu', 'neko', 'girl', 'boy', 'school'],
        'Space': ['space', 'galaxy', 'star', 'planet', 'cosmic', 'universe', 'nebula'],
        'Cyberpunk': ['cyber', 'glitch', 'future', 'mech', 'robot', 'tech', 'city'],
        'Dark': ['dark', 'horror', 'scary', 'blood', 'skull', 'ghost', 'nightmare'],
        'Neon': ['neon', 'glow', 'light', 'bright', 'city'],
        'Retro': ['retro', 'pixel', '8-bit', 'arcade', 'vapor'],
        'Fantasy': ['fantasy', 'magic', 'dragon', 'sword', 'castle', 'myth'],
        'Minimalist': ['minimal', 'simple', 'clean', 'line']
    };

    // Check Colors
    Object.entries(colorMap).forEach(([color, keywords]) => {
        if (keywords.some(k => lowerName.includes(k))) {
            tags.push(color.charAt(0).toUpperCase() + color.slice(1)); // Capitalize
        }
    });

    // Check Categories
    Object.entries(categoryMap).forEach(([category, keywords]) => {
        if (keywords.some(k => lowerName.includes(k))) {
            tags.push(category);
        }
    });

    return Array.from(new Set(tags)); // Remove duplicates
};

export const LOCAL_BACKGROUNDS: BackgroundItem[] = SIMPLE_BACKGROUNDS.map((bg, index) => {
    // Try to extract the reward ID from the filename (e.g. ...reward12345.gif)
    const match = bg.image.match(/reward(\d+)/);
    const rewardId = match ? match[1] : undefined;

    return {
        id: `simple-${index}`,
        title: bg.name,
        game: 'Steam Points Shop',
        gameId: rewardId, // Store the Reward ID here
        imageUrl: bg.image,
        price: 'N/A',
        tags: Array.from(new Set([...generateTags(bg.name), ...((bg as any).tags || [])]))
    };
});
