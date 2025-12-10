
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X, ChevronDown, Monitor, Palette, Wand2, Calculator, Image as ImageIcon, Video, Scissors, Type } from 'lucide-react';
import logoDark from '@/assets/logo-v3.png';
import logoLight from '@/assets/logo-light-v2.png';

// Interface defined in types.ts or implicitly here if not exported
interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (path: string) => void;
  currentPage: string;
}

// Grouped Navigation for cleaner UI
const NAV_GROUPS = [
  {
    title: 'Tools',
    icon: <Wand2 className="w-4 h-4" />,
    items: [
      { label: 'Theme Finder', href: '/themes', icon: <Palette className="w-4 h-4" /> },
      { label: 'Color Matcher', href: '/color-match', icon: <Palette className="w-4 h-4" /> },
      { label: 'Dressing Room', href: '/mockup', icon: <Monitor className="w-4 h-4" /> },
      { label: 'Level Calculator', href: '/calculator', icon: <Calculator className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Assets',
    icon: <ImageIcon className="w-4 h-4" />,
    items: [
      { label: 'Avatar Borders', href: '/avatar-borders', icon: <ImageIcon className="w-4 h-4" /> },
      { label: 'Text Generator', href: '/text-generator', icon: <Type className="w-4 h-4" /> },
      { label: 'Artwork Splitter', href: '/splitter', icon: <Scissors className="w-4 h-4" /> },
      { label: 'Long Images', href: '/long-images', icon: <ImageIcon className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Media',
    icon: <Video className="w-4 h-4" />,
    items: [
      { label: 'Video to GIF', href: '/video-gif', icon: <Video className="w-4 h-4" /> },
      { label: 'GIF Optimizer', href: '/optimizer', icon: <Monitor className="w-4 h-4" /> }, // Reused monitor icon for optimizer
    ]
  }
];

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-[#171a21]/95 dark:border-white/5 transition-colors duration-300 font-sans shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between" ref={dropdownRef}>

        {/* LOGO AREA */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-3 mr-12 group shrink-0"
        >
          <img
            src={isDarkMode ? logoDark : logoLight}
            alt="SteamForge"
            className={`w-12 h-12 object-contain group-hover:scale-105 transition-transform ${isDarkMode ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
          />
          <span className="font-bold text-2xl tracking-tight hidden sm:block dark:text-white group-hover:text-blue-500 transition-colors">
            Steam<span className="text-[#66c0f4]">Forge</span>
          </span>
        </a>

        {/* DESKTOP NAVIGATION (DROPDOWNS) */}
        <nav className="hidden xl:flex items-center gap-2 mr-auto">
          {/* Home Link */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${currentPage === 'home' ? 'text-[#66c0f4] bg-blue-500/10' : 'text-gray-600 dark:text-[#c6d4df] hover:text-white hover:bg-white/5'}`}
          >
            Home
          </a>

          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="relative group">
              <button
                onClick={() => toggleDropdown(group.title)}
                onMouseEnter={() => setActiveDropdown(group.title)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeDropdown === group.title || group.items.some(i => i.href.includes(currentPage) && currentPage !== 'home')
                  ? 'text-[#66c0f4] bg-blue-500/10'
                  : 'text-gray-600 dark:text-[#c6d4df] hover:text-white hover:bg-white/5'
                  }`}
              >
                {group.icon}
                {group.title}
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === group.title ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {(activeDropdown === group.title) && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1b2838] border border-gray-200 dark:border-[#2a475e] rounded-lg shadow-2xl overflow-hidden animate-fade-in-up"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="p-2 space-y-1">
                    {group.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${(item.href === '/' + currentPage) || (currentPage === 'home' && item.href === '/')
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-700 dark:text-[#c6d4df] hover:bg-gray-100 dark:hover:bg-[#2a475e] hover:text-blue-500 dark:hover:text-[#66c0f4]'
                          }`}
                      >
                        <div className={`p-1 rounded ${(item.href === '/' + currentPage) ? 'bg-white/20' : 'bg-gray-200 dark:bg-black/20'
                          }`}>
                          {item.icon}
                        </div>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-4">

          <a href="#trending" className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg transition-all hover:scale-105" onClick={(e) => isMobileMenuOpen || handleNavClick(e, '#backgrounds')}>
            Get Trending
          </a>

          <div className="w-px h-8 bg-gray-300 dark:bg-white/10 hidden sm:block"></div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1b2838] hover:bg-gray-200 dark:hover:bg-[#2a475e] text-gray-600 dark:text-[#66c0f4] transition-all border border-transparent dark:border-[#2a475e]"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 text-gray-600 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU FULLSCREEN OVERLAY */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-white dark:bg-[#171a21] border-t border-gray-200 dark:border-white/10 overflow-y-auto z-50 p-6 animate-fade-in">
          <nav className="flex flex-col gap-6">
            <a href="/" onClick={(e) => handleNavClick(e, '/')} className="text-xl font-bold dark:text-white">Home</a>

            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider border-b border-gray-700 pb-2">{group.title}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {group.items.map(item => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`flex items-center gap-3 p-3 rounded-lg ${(item.href === '/' + currentPage)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-[#1b2838] text-gray-700 dark:text-[#c6d4df]'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;