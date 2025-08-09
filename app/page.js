'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Clock from '../components/Clock';
import Stopwatch from '../components/Stopwatch';
import ThemeSelector from '../components/ThemeSelector';
import ModeToggle from '../components/ModeToggle';

export default function Home() {
  const [currentView, setCurrentView] = useState('both');
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const getThemeColors = () => {
    const themes = {
      blue: 'from-blue-400/20 to-purple-600/20',
      green: 'from-green-400/20 to-teal-600/20',
      orange: 'from-orange-400/20 to-red-600/20',
      pink: 'from-pink-400/20 to-purple-600/20',
      cyan: 'from-cyan-400/20 to-blue-600/20'
    };
    return themes[theme] || themes.blue;
  };

  // Show loading state until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading Time Master...</div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${getThemeColors()} opacity-50`} />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header Controls */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Time Master
            </h1>
            
            <div className="flex items-center gap-4">
              <ThemeSelector theme={theme} setTheme={setTheme} />
              <ModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </motion.div>

          {/* View Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-full p-1 border border-white/20 dark:border-gray-600/20">
              {['both', 'clock', 'stopwatch'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    currentView === view
                      ? 'bg-white/20 dark:bg-white/10 text-gray-800 dark:text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {view === 'both' ? 'Both' : view}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8"
            >
              {currentView === 'both' && (
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  <Clock theme={theme} />
                  <Stopwatch theme={theme} />
                </div>
              )}
              
              {currentView === 'clock' && (
                <div className="max-w-2xl mx-auto">
                  <Clock theme={theme} />
                </div>
              )}
              
              {currentView === 'stopwatch' && (
                <div className="max-w-2xl mx-auto">
                  <Stopwatch theme={theme} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Instructions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-600/20 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Space</kbd> Start/Stop Stopwatch</div>
                <div><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">R</kbd> Reset Stopwatch</div>
                <div><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">L</kbd> Record Lap</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}