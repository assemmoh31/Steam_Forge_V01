import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ShowcaseGrid from './components/ShowcaseGrid';
import ArtworkSplitter from './components/ArtworkSplitter';
import VideoToGif from './components/VideoToGif';
import GifOptimizer from './components/GifOptimizer';
import ThemeFinder from './components/ThemeFinder';
import TextGenerator from './components/TextGenerator';
import AvatarBorders from './components/AvatarBorders';
import LevelCalculator from './components/LevelCalculator';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import ProfileMockup from './components/ProfileMockup';
import LongArtworkGuide from './components/LongArtworkGuide';
import BadgeCollector from './components/BadgeCollector';
import ColorMatcher from './components/ColorMatcher';

const App: React.FC = () => {
  // Initialize theme state.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Simple state-based router
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    if (path === '/splitter') {
      setCurrentPage('splitter');
      window.scrollTo(0, 0);
    } else if (path === '/video-gif') {
      setCurrentPage('video-gif');
      window.scrollTo(0, 0);
    } else if (path === '/optimizer') {
      setCurrentPage('optimizer');
      window.scrollTo(0, 0);
    } else if (path === '/themes') {
      setCurrentPage('themes');
      window.scrollTo(0, 0);
    } else if (path === '/text-generator') {
      setCurrentPage('text-generator');
      window.scrollTo(0, 0);
    } else if (path === '/avatar-borders') {
      setCurrentPage('avatar-borders');
      window.scrollTo(0, 0);
    } else if (path === '/calculator') {
      setCurrentPage('calculator');
      window.scrollTo(0, 0);
    } else if (path === '/privacy') {
      setCurrentPage('privacy');
      window.scrollTo(0, 0);
    } else if (path === '/mockup') {
      setCurrentPage('mockup');
      window.scrollTo(0, 0);
    } else if (path === '/long-images') {
      setCurrentPage('long-images');
      window.scrollTo(0, 0);
    } else if (path === '/color-match') {
      setCurrentPage('color-match');
      window.scrollTo(0, 0);
    } else if (path === '/badges') {
      setCurrentPage('badges');
      window.scrollTo(0, 0);
    } else {
      setCurrentPage('home');
      if (path.startsWith('#')) {
        // Allow time for render before scrolling to element
        setTimeout(() => {
          const element = document.getElementById(path.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-steam-bg transition-colors duration-300 font-sans">
      <Header
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <main className="flex-grow">
        {currentPage === 'splitter' ? (
          <ArtworkSplitter />
        ) : currentPage === 'video-gif' ? (
          <VideoToGif />
        ) : currentPage === 'optimizer' ? (
          <GifOptimizer />
        ) : currentPage === 'themes' ? (
          <ThemeFinder />
        ) : currentPage === 'text-generator' ? (
          <TextGenerator />
        ) : currentPage === 'avatar-borders' ? (
          <AvatarBorders />
        ) : currentPage === 'calculator' ? (
          <LevelCalculator />
        ) : currentPage === 'privacy' ? (
          <PrivacyPolicy />
        ) : currentPage === 'mockup' ? (
          <ProfileMockup />
        ) : currentPage === 'long-images' ? (
          <LongArtworkGuide />
        ) : currentPage === 'color-match' ? (
          <ColorMatcher />
        ) : currentPage === 'badges' ? (
          <BadgeCollector />
        ) : (
          <>
            <Hero onNavigate={handleNavigate} />
            <Features onNavigate={handleNavigate} />
            <ShowcaseGrid />
          </>
        )}
      </main>

      <Footer currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;