import React, { useState } from 'react';
import { Moon, Sun, Menu, X, Gamepad2 } from 'lucide-react';
import { NavItem } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (path: string) => void;
  currentPage: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Theme Finder', href: '/themes' },
  { label: 'Level Calculator', href: '/calculator' },
  { label: 'Avatar Borders', href: '/avatar-borders' },
  { label: 'Text Generator', href: '/text-generator' },
  { label: 'Artwork Splitter', href: '/splitter' },
  { label: 'Video to GIF', href: '/video-gif' },
  { label: 'GIF Optimizer', href: '/optimizer' },
  { label: 'Trending', href: '#backgrounds' },
];

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-steam-bg/95 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <a 
          href="/" 
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-2 mr-8 group"
        >
          <div className="bg-gradient-to-tr from-steam-blue to-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block dark:text-white">
            Steam<span className="text-steam-blue">Forge</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 mr-auto">
          {NAV_ITEMS.map((item) => {
            // Determine if active
            const isActive = 
              (item.href === '/' && currentPage === 'home') ||
              (item.href === '/themes' && currentPage === 'themes') ||
              (item.href === '/calculator' && currentPage === 'calculator') ||
              (item.href === '/avatar-borders' && currentPage === 'avatar-borders') ||
              (item.href === '/text-generator' && currentPage === 'text-generator') ||
              (item.href === '/splitter' && currentPage === 'splitter') ||
              (item.href === '/video-gif' && currentPage === 'video-gif') ||
              (item.href === '/optimizer' && currentPage === 'optimizer');

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-white font-bold' 
                    : 'text-gray-600 dark:text-steam-text hover:text-steam-blue dark:hover:text-white'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        
        {/* Simple Mobile/Tablet Nav Hint */}
        <div className="xl:hidden flex-1 flex justify-end mr-4">
           {/* Placeholder for spacer if needed */}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-steam-accent transition-colors text-gray-600 dark:text-steam-text"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 text-gray-600 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t dark:border-steam-accent bg-white dark:bg-steam-card p-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-base font-medium text-gray-700 dark:text-steam-text hover:text-steam-blue"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;