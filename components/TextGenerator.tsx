import React, { useState } from 'react';
import { Copy, Check, Type, Sparkles, RotateCcw } from 'lucide-react';
import AdUnit from './AdUnit';

interface FontStyle {
  name: string;
  map?: Record<string, string>;
  generator?: (text: string) => string;
  reverse?: boolean; // For Upside Down
}

// Helper to generate the mapping object from two strings
const createMap = (source: string, target: string): Record<string, string> => {
  const map: Record<string, string> = {};
  const srcChars = source.split('');
  // Handle surrogate pairs or complex chars in target properly by spreading
  const targetChars = Array.from(target); 
  
  srcChars.forEach((char, i) => {
    if (targetChars[i]) {
      map[char] = targetChars[i];
    }
  });
  return map;
};

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMS = '0123456789';
const NORMAL = LOWER + UPPER + NUMS;

const STYLES: FontStyle[] = [
  {
    name: 'Small Caps',
    map: createMap(
      LOWER + UPPER,
      'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'
    )
  },
  {
    name: 'Vaporwave (Full Width)',
    map: createMap(
      NORMAL + ' ',
      'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９　'
    )
  },
  {
    name: 'Monospace',
    map: createMap(
      NORMAL,
      '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
    )
  },
  {
    name: 'Bold Serif',
    map: createMap(
      NORMAL,
      '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
    )
  },
  {
    name: 'Bold Sans',
    map: createMap(
      NORMAL,
      '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝐢𝐣𝐤𝐥𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡Ｏ𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
    )
  },
  {
    name: 'Script (Cursive)',
    map: createMap(
      NORMAL,
      '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789'
    )
  },
  {
    name: 'Fraktur (Gothic)',
    map: createMap(
      NORMAL,
      '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'
    )
  },
  {
    name: 'Double Struck',
    map: createMap(
      NORMAL,
      '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
    )
  },
  {
    name: 'Circles (Dark)',
    map: createMap(
      LOWER + UPPER + NUMS,
      '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩0①②③④⑤⑥⑦⑧⑨'
    )
  },
  {
    name: 'Bubbles (White)',
    map: createMap(
      LOWER + UPPER + NUMS,
      'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨'
    )
  },
  {
    name: 'Squares (Outline)',
    map: createMap(
      LOWER + UPPER,
      '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'
    )
  },
  {
    name: 'Squares (Filled)',
    map: createMap(
      LOWER + UPPER,
      '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉'
    )
  },
  {
    name: 'Superscript',
    map: createMap(
      NORMAL,
      'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹'
    )
  },
  {
    name: 'Upside Down',
    reverse: true,
    map: createMap(
      NORMAL + "?!.,",
      "zʎxʍʌnʇsɹbdouɯlʞɾᴉɥƃɟǝpɔqɐZ⅄XMΛ∩┴SɹQԀONW˥➦ſIHפℲƎpƆq∀0123456789¿¡˙'"
    )
  },
  {
    name: 'Strikethrough',
    generator: (text) => text.split('').map(c => c + '\u0336').join('')
  },
  {
    name: 'Underline',
    generator: (text) => text.split('').map(c => c + '\u0332').join('')
  },
  {
    name: 'Slash',
    generator: (text) => text.split('').map(c => c + '\u0338').join('')
  }
];

const TextGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('SteamProfileForge');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const transformText = (text: string, style: FontStyle) => {
    let result = text;
    
    // Apply generator if exists, otherwise map
    if (style.generator) {
        result = style.generator(text);
    } else if (style.map) {
        result = text.split('').map(char => style.map![char] || char).join('');
    }

    // Apply reversal if needed (for Upside Down)
    if (style.reverse) {
        result = result.split('').reverse().join('');
    }
    
    return result;
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-steam-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Type className="w-10 h-10 text-blue-500" />
            Fancy Text Generator
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl mx-auto text-lg">
            Type your text below to generate stylish unicode fonts. Perfect for your Steam profile name, summary, or info box.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-4xl mx-auto mb-8 sticky top-20 z-40">
           <div className="bg-white dark:bg-steam-card p-2 rounded-2xl shadow-xl border border-blue-100 dark:border-steam-accent ring-4 ring-blue-500/10 dark:ring-black/20">
              <div className="relative">
                 <input
                   type="text"
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Type something here..."
                   className="w-full px-6 py-4 bg-gray-50 dark:bg-steam-bg border-none rounded-xl text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    {inputText && (
                        <button 
                          onClick={() => setInputText('')}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Clear text"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Ad Space */}
        <div className="max-w-4xl mx-auto mb-12">
          <AdUnit type="banner" />
        </div>

        {/* Styles Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {STYLES.map((style, index) => {
            const result = transformText(inputText || 'Preview Text', style);
            const isCopied = copiedIndex === index;

            return (
              <div 
                key={style.name}
                className="group bg-white dark:bg-steam-card rounded-xl p-4 border border-gray-200 dark:border-steam-accent hover:border-blue-500 dark:hover:border-steam-blue shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-steam-text/60">
                        {style.name}
                    </span>
                    {isCopied && (
                        <span className="text-xs font-bold text-green-500 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1">
                            <Check className="w-3 h-3" /> Copied!
                        </span>
                    )}
                </div>
                
                <div className="flex gap-4 items-center justify-between">
                    <div className="text-lg md:text-xl text-gray-900 dark:text-white font-medium break-all font-sans">
                        {result}
                    </div>
                    
                    <button
                        onClick={() => handleCopy(result, index)}
                        className={`p-2 rounded-lg transition-all shrink-0 ${
                            isCopied 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-steam-bg text-gray-500 dark:text-steam-text hover:bg-blue-100 dark:hover:bg-steam-accent hover:text-blue-600 dark:hover:text-white'
                        }`}
                        title="Copy to clipboard"
                    >
                        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-blue-50 dark:bg-steam-accent/20 border border-blue-100 dark:border-steam-accent rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 mb-3">
                <Sparkles className="w-5 h-5" />
                Pro Tip
            </h3>
            <p className="text-blue-800 dark:text-steam-text text-sm leading-relaxed">
                Some games or platforms may not display all unicode characters correctly. If you see boxes (□□□) instead of text, try a different style like "Bold Sans" or "Small Caps", which are widely supported. Steam typically supports most of these styles in profile names, summaries, and artwork descriptions.
            </p>
        </div>

      </div>
    </section>
  );
};

export default TextGenerator;