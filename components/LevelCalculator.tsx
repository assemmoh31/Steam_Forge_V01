import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, ShoppingCart, ArrowRight, Award, Zap, ExternalLink } from 'lucide-react';
import AdUnit from './AdUnit';

const LevelCalculator: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | string>(0);
  const [targetLevel, setTargetLevel] = useState<number | string>(10);
  
  const [xpRequired, setXpRequired] = useState(0);
  const [setsRequired, setSetsRequired] = useState(0);

  // Steam XP Formula:
  // Level 1-10: 100xp per level
  // Level 11-20: 200xp per level
  // Level 21-30: 300xp per level
  // etc.
  const calculateTotalXpForLevel = (level: number) => {
    let totalXp = 0;
    let lvl = 0;
    
    while (lvl < level) {
      const currentTier = Math.floor(lvl / 10);
      const xpPerLevel = (currentTier + 1) * 100;
      const nextTierStart = (currentTier + 1) * 10;
      
      // How many levels to calculate in this tier
      const levelsInTier = Math.min(level, nextTierStart) - lvl;
      
      totalXp += levelsInTier * xpPerLevel;
      lvl += levelsInTier;
    }
    
    return totalXp;
  };

  useEffect(() => {
    // Sanitize inputs for calculation (treat empty or invalid as 0)
    const startLvl = typeof currentLevel === 'string' ? parseInt(currentLevel) || 0 : currentLevel;
    const endLvl = typeof targetLevel === 'string' ? parseInt(targetLevel) || 0 : targetLevel;

    // Ensure target is never lower than current for the calculation result
    if (endLvl < startLvl) {
        setXpRequired(0);
        setSetsRequired(0);
        return;
    }

    const startXp = calculateTotalXpForLevel(startLvl);
    const endXp = calculateTotalXpForLevel(endLvl);
    
    const diff = endXp - startXp;
    setXpRequired(diff);
    // Standard badge is 100xp
    setSetsRequired(Math.ceil(diff / 100));

  }, [currentLevel, targetLevel]);

  const handleLevelChange = (value: string, setter: (val: number | string) => void) => {
    if (value === '') {
      setter('');
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num)) {
      setter(Math.max(0, num));
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-steam-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10 text-blue-500" />
            Steam Level Calculator
          </h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl mx-auto text-lg">
            Calculate exactly how much XP and how many trading card sets you need to reach your dream Steam level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Calculator Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-steam-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-steam-accent">
               
               <div className="space-y-8">
                  {/* Current Level */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-steam-text uppercase tracking-wider mb-3">
                        Current Level
                    </label>
                    <div className="relative flex items-center">
                        <input 
                            type="number" 
                            min="0"
                            max="5000"
                            value={currentLevel}
                            onChange={(e) => handleLevelChange(e.target.value, setCurrentLevel)}
                            className="w-full pl-6 pr-4 py-4 bg-gray-100 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 rounded-xl text-3xl font-bold text-gray-900 dark:text-white focus:outline-none transition-all"
                        />
                        <div className="absolute right-6 text-gray-400 dark:text-white/20 font-bold text-xl pointer-events-none">
                            LVL
                        </div>
                    </div>
                  </div>

                  {/* Divider Arrow */}
                  <div className="flex justify-center -my-2 relative z-10">
                      <div className="bg-blue-100 dark:bg-steam-accent p-2 rounded-full text-blue-600 dark:text-white border-4 border-white dark:border-steam-card">
                          <ArrowRight className="w-6 h-6 rotate-90 sm:rotate-0" />
                      </div>
                  </div>

                  {/* Target Level */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-steam-text uppercase tracking-wider mb-3">
                        Target Level
                    </label>
                    <div className="relative flex items-center">
                        <input 
                            type="number" 
                            min="0"
                            max="5000"
                            value={targetLevel}
                            onChange={(e) => handleLevelChange(e.target.value, setTargetLevel)}
                            className="w-full pl-6 pr-4 py-4 bg-gray-100 dark:bg-black/20 border-2 border-transparent focus:border-green-500 rounded-xl text-3xl font-bold text-gray-900 dark:text-white focus:outline-none transition-all"
                        />
                         <div className="absolute right-6 text-gray-400 dark:text-white/20 font-bold text-xl pointer-events-none">
                            LVL
                        </div>
                    </div>
                  </div>
               </div>

               {/* Results Box */}
               <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 text-center">
                      <span className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">XP Needed</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{xpRequired.toLocaleString()}</span>
                  </div>
                   <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-500/20 text-center">
                      <span className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Sets Needed</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{setsRequired.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <AdUnit type="banner" label="Advertisement" />
          </div>

          {/* Right Column: Recommendations */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1b2838] dark:to-[#171a21] rounded-2xl p-6 border border-gray-700 dark:border-steam-accent text-white shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Recommended Services
                </h3>
                
                <p className="text-gray-300 text-sm mb-6 relative z-10">
                    Level up instantly using these trusted automated bot services. They trade complete card sets for keys or gems.
                </p>

                <div className="space-y-4 relative z-10">
                    {/* SteamLevelUp */}
                    <a 
                      href="https://steamlevelup.com/r/76561199401459158"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                                    SL
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-blue-300 group-hover:text-blue-200 transition-colors">SteamLevelUp</h4>
                                    <p className="text-xs text-gray-400">Popular & Reliable</p>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                    </a>

                    {/* DuoBot */}
                    <a 
                      href="https://duobot.com/p/cATrf5ggs7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                                    DB
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-purple-300 group-hover:text-purple-200 transition-colors">DuoBot</h4>
                                    <p className="text-xs text-gray-400">Fast & Automated</p>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                    </a>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Trusted by thousands of Steam users</span>
                    </p>
                </div>
             </div>

             <div className="bg-blue-50 dark:bg-steam-accent/20 border border-blue-100 dark:border-steam-accent rounded-xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-yellow-500" /> Why Level Up?
                </h4>
                <ul className="text-sm text-gray-600 dark:text-steam-text space-y-2">
                   <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Increase your Friends List limit (+5 per level).</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Unlock more Profile Showcases (every 10 levels).</span>
                   </li>
                   <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Gain higher trust and reputation in the community.</span>
                   </li>
                </ul>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LevelCalculator;