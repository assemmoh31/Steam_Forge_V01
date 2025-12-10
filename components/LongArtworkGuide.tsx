
import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Code2, AlertTriangle, Monitor } from 'lucide-react';

const LongArtworkGuide: React.FC = () => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const MAIN_ARTWORK_CODE = `var num= document.getElementsByName("image_width")[0].value = 999999;
var num= document.getElementsByName("image_height")[0].value = 1;`;

    const SCREENSHOT_CODE = `document.getElementsByName("image_width")[0].value = 1000;
document.getElementsByName("image_height")[0].value = 1;`;

    const WORKSHOP_CODE = `window.POST_PARAMS = {
    data: file,
    image_width: 1000,
    image_height: 1000,
    visibility: 0
};`;

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-steam-bg transition-colors duration-300 pb-20">

            {/* HERO SECTION */}
            <div className="bg-[#1b2838] border-b border-[#2a475e] sticky top-16 z-30 shadow-lg">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-900/50 rounded-lg border border-blue-500/30">
                            <Terminal className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Long Artwork Code Generator</h1>
                            <p className="text-blue-300 text-sm max-w-2xl">
                                Enable "Long Images" on Steam by using these simple console commands.
                                This trick forces Steam to uphold the original height of your artwork.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">

                {/* WARNING CARD */}
                <div className="mb-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-yellow-500 font-bold mb-1">Important Requirement</h3>
                        <p className="text-gray-400 text-sm">
                            You must perform these steps in a <strong>Web Browser</strong> (Chrome, Firefox, Edge).
                            This cannot be done inside the Steam Desktop Client.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT: TUTORIAL */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Monitor className="w-6 h-6 text-blue-500" />
                            How to use
                        </h2>

                        <div className="relative border-l-2 border-blue-500/30 pl-8 space-y-12">

                            {/* STEP 1 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-[#0f1115] text-xs font-bold text-white">1</span>
                                <h3 className="text-lg font-bold text-white mb-2">Go to Upload Page</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Open the Steam Artwork upload page in your browser.
                                </p>
                                <a
                                    href="https://steamcommunity.com/sharedfiles/edititem/767/3/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a475e] hover:bg-[#3d5a73] text-blue-300 rounded border border-blue-500/20 transition-all text-sm font-bold"
                                >
                                    Open Artwork Upload Page <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            {/* STEP 2 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-[#0f1115] text-xs font-bold text-white">2</span>
                                <h3 className="text-lg font-bold text-white mb-2">Select Your File</h3>
                                <p className="text-gray-400 text-sm">
                                    Click "Choose File" and select your artwork (Middle or Right piece).
                                    Do <strong>NOT</strong> click "Save and Continue" yet.
                                </p>
                            </div>

                            {/* STEP 3 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-[#0f1115] text-xs font-bold text-white">3</span>
                                <h3 className="text-lg font-bold text-white mb-2">Open Console</h3>
                                <p className="text-gray-400 text-sm mb-2">
                                    Right-click anywhere on the page and select <strong>Inspect</strong> (or press F12).
                                    Then click on the <strong>Console</strong> tab.
                                </p>
                                <div className="bg-black/40 rounded p-3 border border-white/10 text-xs font-mono text-gray-500">
                                    &gt; Console
                                </div>
                            </div>

                            {/* STEP 4 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-[#0f1115] text-xs font-bold text-white">4</span>
                                <h3 className="text-lg font-bold text-white mb-2">Paste the Code</h3>
                                <p className="text-gray-400 text-sm text-balance">
                                    Copy the code from the right panel, paste it into the console, and press <kbd className="bg-gray-800 px-1 rounded border border-gray-600">Enter</kbd>.
                                    You should see the number "999999" (or "1") appear.
                                </p>
                            </div>

                            {/* STEP 5 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-[#0f1115] text-xs font-bold text-white">5</span>
                                <h3 className="text-lg font-bold text-white mb-2">Upload</h3>
                                <p className="text-gray-400 text-sm">
                                    Now verify you have "I certify that I created this artwork" checked, and click <strong>Save and Continue</strong>.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT: CODE SNIPPETS */}
                    <div className="space-y-6">

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Code2 className="w-6 h-6 text-green-500" />
                            The Codes
                        </h2>

                        {/* CARD 1: ARTWORK (Standard) */}
                        <div className="bg-[#1b2838] rounded-xl border border-[#2a475e] overflow-hidden shadow-xl">
                            <div className="p-4 bg-[#2a475e]/30 border-b border-[#2a475e] flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white">Artwork Showcase</h3>
                                    <p className="text-xs text-blue-300">For "Featured Artwork" or "Artwork Showcase"</p>
                                </div>
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30">Recommended</span>
                            </div>
                            <div className="p-4 bg-[#0f1115]">
                                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-all">{MAIN_ARTWORK_CODE}</pre>
                            </div>
                            <div className="p-4 border-t border-[#2a475e] flex justify-end">
                                <button
                                    onClick={() => handleCopy(MAIN_ARTWORK_CODE, 'artwork')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                >
                                    {copiedId === 'artwork' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copiedId === 'artwork' ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>
                        </div>

                        {/* CARD 2: SCREENSHOT */}
                        <div className="bg-[#1b2838] rounded-xl border border-[#2a475e] overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity">
                            <div className="p-4 bg-[#2a475e]/30 border-b border-[#2a475e] flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white">Screenshot Showcase</h3>
                                    <p className="text-xs text-blue-300">If you want to use the "Screenshot Showcase" slot instead</p>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0f1115]">
                                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-all">{SCREENSHOT_CODE}</pre>
                            </div>
                            <div className="p-4 border-t border-[#2a475e] flex justify-end">
                                <button
                                    onClick={() => handleCopy(SCREENSHOT_CODE, 'screenshot')}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#2a475e] hover:bg-[#3d5a73] text-white rounded font-bold text-sm transition-all"
                                >
                                    {copiedId === 'screenshot' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copiedId === 'screenshot' ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>
                        </div>

                        {/* INFO BOX */}
                        <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-xs text-blue-300/60 leading-relaxed">
                            <strong>Why does this work?</strong> <br />
                            Steam automatically resizes generic images to fitting boxes. By setting the width to a huge number (999999), the browser tricks Steam's validator into thinking the image is infinitely wide, causing the layout engine to render it at its original full height instead of cropping it.
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default LongArtworkGuide;
