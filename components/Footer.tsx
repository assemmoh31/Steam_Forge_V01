import React from 'react';

const TOOL_GUIDES: Record<string, { title: string; steps: string[] }> = {
    'home': {
        title: 'Welcome to SteamProfileForge',
        steps: [
            'Choose a tool from the navigation menu above.',
            'Customize your background, avatar, or profile text.',
            'Download the results and upload them to Steam.',
            'Check specific tool pages for detailed guides.'
        ]
    },
    'splitter': {
        title: 'How to use Artwork Splitter',
        steps: [
            'Upload your background image.',
            'Adjust the crop area or choose "Standard" for default Steam size.',
            'Click "Download Pieces" to save your cropped images.',
            'Go to your Steam Profile -> Edit Profile -> Featured Showcase -> Artwork Showcase.'
        ]
    },
    'video-gif': {
        title: 'How to Convert Video to GIF',
        steps: [
            'Upload a video file (MP4, WEBM).',
            'Select the start and end time for your GIF.',
            'Adjust dimensions and frame rate for optimal file size (Steam limit is 8MB).',
            'Click "Generate GIF" and wait for processing.',
            'Download and upload to your Steam Artwork.'
        ]
    },
    'optimizer': {
        title: 'How to Optimize GIFs',
        steps: [
            'Upload a GIF file that is too large for Steam.',
            'Adjust the quality slider or resize the dimensions.',
            'Watch the file size estimate turn green (under 8MB).',
            'Download the optimized GIF.'
        ]
    },
    'themes': {
        title: 'How to Find Themes',
        steps: [
            'Enter a keyword (e.g. "Space", "Anime") or pick a color.',
            'Set your maximum budget (optional).',
            'Click "Find Themes" to search the Steam Community Market.',
            'Click on a result to view it on the Steam Market.'
        ]
    },
    'mockup': {
        title: 'How to use Dressing Room',
        steps: [
            'Upload a Background image you want to test.',
            'Upload your Avatar image.',
            'Add a transparent Frame (optional).',
            'Preview the full profile look before buying items.'
        ]
    },
    'text-generator': {
        title: 'How to use Fancy Text',
        steps: [
            'Type your profile name or bio in the input box.',
            'Browse the generated styles below.',
            'Click the "Copy" button next to the style you like.',
            'Paste it into your Steam Profile Edit page.'
        ]
    },
    'long-images': {
        title: 'How to use Long Images',
        steps: [
            'Go to the Steam Artwork Upload page.',
            'Select your file but DO NOT click upload yet.',
            'Open Console (F12) and copy/paste our code.',
            'Press Enter, then click Upload.'
        ]
    },
    'avatar-borders': {
        title: 'How to add Avatar Borders',
        steps: [
            'Upload your current avatar image.',
            'Select a border style from the list.',
            'Download the combined image.',
            'Upload it as your new Avatar on Steam.'
        ]
    },
    'calculator': {
        title: 'How to Calculate Levels',
        steps: [
            'Enter your current steam level.',
            'Enter your desired target level.',
            'The calculator will show how many card sets (badges) you need.',
            'It estimates the cost based on average card prices.'
        ]
    }
};

interface FooterProps {
    currentPage: string;
    onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
    return (
        <footer className="py-8 bg-white dark:bg-steam-card border-t dark:border-steam-accent transition-colors duration-300">
            <div className="container mx-auto px-4">

                {/* Dynamic Tool Instructions */}
                {TOOL_GUIDES[currentPage] && (
                    <div className="mb-12 max-w-3xl mx-auto bg-blue-50 dark:bg-steam-bg/50 border border-blue-100 dark:border-steam-accent rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                            <span className="text-xl">💡</span>
                            {TOOL_GUIDES[currentPage].title}
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-steam-text text-sm max-w-2xl mx-auto">
                            {TOOL_GUIDES[currentPage].steps.map((step, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="font-bold text-blue-500">{idx + 1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Disclaimer & Legal Notice */}
                <div className="mb-12 border-t border-gray-200 dark:border-steam-accent pt-8">
                    <div className="max-w-4xl mx-auto text-xs text-gray-500 dark:text-gray-400 space-y-6">
                        <div className="text-center mb-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Disclaimer & Legal Notice</h4>
                            <p className="max-w-2xl mx-auto">
                                SteamProfileForge is an independent, fan-made platform created to help users explore their Steam profile information, badge progress, and trading-card data in a convenient way. This website is not owned by, affiliated with, sponsored by, or officially supported by Valve Corporation or Steam.
                                All trademarks, logos, and copyrights related to Steam, Valve, games, game cards, and digital items belong to their respective owners.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">1. No Official Association with Valve or Steam</h5>
                                <p>
                                    SteamProfileForge uses Steam’s public OpenID login system purely to allow users to view their own public or permitted profile information on this site.
                                    We do not represent Valve, Steam, or any official service, and nothing on this website should be interpreted as an official Steam tool.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">2. No Automated Trading or Market Actions</h5>
                                <p>
                                    SteamProfileForge does not: Access user passwords, Log into user accounts, Automate Steam Market purchases, Trade items, Modify inventories, or Craft badges.
                                    All Steam interactions happen only through official Steam interfaces. We only display information and help users understand what items or cards they may need to progress.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">3. Informational & Educational Purpose Only</h5>
                                <p>
                                    All site features, level-up guidance, badge tracking, and card suggestions are provided strictly for informational, educational, and convenience purposes.
                                    SteamProfileForge does not guarantee the accuracy of Steam data, price changes, or market availability. All data is based on what Steam provides publicly.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">4. User Responsibility</h5>
                                <p>
                                    By using SteamProfileForge, you agree that you are responsible for your own Steam account security and should never share your login credentials with anyone.
                                    You understand all purchases must be made directly through Steam, never through this site. You use this website at your own risk.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">5. Intellectual Property</h5>
                                <p>
                                    All Steam-related images, names, and assets are the property of Valve or their respective owners.
                                    The design, branding, and code of SteamProfileForge belong to the site creators and may not be copied or redistributed without permission.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1">6. External Links & "As-Is" Service</h5>
                                <p>
                                    The site may include links to third-party pages (Steam Market, etc.). SteamProfileForge is not responsible for the content or safety of external websites.
                                    This service is provided "as is," without warranties. Functionality and data accuracy may change at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Standard Footer Links */}
                <div className="text-center pt-8 border-t border-gray-200 dark:border-steam-accent/50">
                    <p className="text-gray-500 dark:text-steam-text text-sm mb-4">
                        © {new Date().getFullYear()} SteamProfileForge. Not affiliated with Valve Corporation.
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-medium">
                        <button onClick={() => onNavigate('/')} className="text-gray-500 hover:text-blue-600 dark:text-steam-text dark:hover:text-white transition-colors">
                            Home
                        </button>
                        <button onClick={() => onNavigate('/privacy')} className="text-gray-500 hover:text-blue-600 dark:text-steam-text dark:hover:text-white transition-colors">
                            Privacy Policy
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
