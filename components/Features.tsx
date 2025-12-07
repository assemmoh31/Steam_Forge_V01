import React from 'react';
import { Crop, Type, Image, Palette, Film, Zap, Calculator } from 'lucide-react';
import { ToolFeature } from '../types';

interface FeaturesProps {
  onNavigate: (path: string) => void;
}

const features: ToolFeature[] = [
  {
    title: 'Artwork Cropper',
    description: 'Automatically slice your background images to fit your Steam artwork showcase slots perfectly.',
    icon: Crop,
    popular: true,
    path: '/splitter',
  },
  {
    title: 'Steam Level Calculator',
    description: 'Calculate exactly how much XP and how many trading card sets you need to reach your dream Steam level.',
    icon: Calculator,
    path: '/calculator',
  },
  {
    title: 'Theme Finder',
    description: 'Search through thousands of steam backgrounds by color, popularity, or game price.',
    icon: Palette,
    path: '/themes',
  },
  {
    title: 'Avatar Borders',
    description: 'Test how different avatar frames look with your current profile picture.',
    icon: Image,
    path: '/avatar-borders',
  },
  {
    title: 'Text Generator',
    description: 'Convert normal text into various stylish unicode fonts to make your name or info box stand out.',
    icon: Type,
    path: '/text-generator',
  },
  {
    title: 'Video to GIF',
    description: 'Convert MP4 or WebM clips into optimized animated GIFs for your profile showcases.',
    icon: Film,
    path: '/video-gif',
  },
  {
    title: 'GIF Optimizer',
    description: 'Compress and resize GIF animations to fit within Steam\'s 8MB file size limit without losing quality.',
    icon: Zap,
    path: '/optimizer',
  },
];

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-steam-bg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Powerful Tools</h2>
          <p className="text-gray-600 dark:text-steam-text max-w-2xl mx-auto">
            Everything you need to create a stunning profile without needing Photoshop or complex software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => onNavigate(feature.path)}
              className="cursor-pointer group relative p-6 bg-gray-50 dark:bg-steam-card rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-steam-blue transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {feature.popular && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-steam-green text-xs font-bold text-white rounded uppercase tracking-wider">
                  Popular
                </span>
              )}
              
              <div className="w-12 h-12 bg-blue-100 dark:bg-steam-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-steam-blue" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-steam-blue transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-steam-text/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;