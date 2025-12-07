import React from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-steam-bg border-b dark:border-steam-accent">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/20"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl dark:bg-purple-500/10"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-steam-accent/50 text-blue-600 dark:text-blue-300 text-sm font-medium mb-8 border border-blue-200 dark:border-blue-500/30 backdrop-blur-sm">
          <Wand2 className="w-4 h-4" />
          <span>New: Animated Avatar Maker Available!</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl">
          Craft the Ultimate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-steam-blue dark:to-cyan-400">
            Steam Profile
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-gray-600 dark:text-steam-text mb-10 max-w-2xl leading-relaxed">
          Level up your presence with our suite of customization tools. 
          Crop backgrounds perfectly, generate fancy text, and discover 
          the best themes to showcase your gaming achievements.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate('/splitter')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            Open Artwork Splitter
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('#backgrounds')}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-steam-card hover:bg-gray-50 dark:hover:bg-steam-accent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-semibold transition-all"
          >
            Browse Gallery
          </button>
        </div>

        {/* Floating Stats / Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 dark:border-white/5 pt-8 w-full max-w-4xl">
          {[
            { label: 'Backgrounds', value: '50K+' },
            { label: 'Active Users', value: '12K+' },
            { label: 'Tools', value: '15+' },
            { label: 'Guides', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-sm text-gray-500 dark:text-steam-text/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;