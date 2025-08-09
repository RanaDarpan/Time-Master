'use client';

import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

export default function ThemeSelector({ theme, setTheme }) {
  const themes = [
    { name: 'blue', color: 'bg-blue-500', label: 'Ocean' },
    { name: 'green', color: 'bg-green-500', label: 'Forest' },
    { name: 'orange', color: 'bg-orange-500', label: 'Sunset' },
    { name: 'pink', color: 'bg-pink-500', label: 'Blossom' },
    { name: 'cyan', color: 'bg-cyan-500', label: 'Arctic' }
  ];

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-gray-600/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
      >
        <Palette size={20} />
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50"
      >
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-600/20 shadow-2xl">
          <div className="space-y-2">
            {themes.map((t) => (
              <motion.button
                key={t.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(t.name)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200 ${
                  theme === t.name
                    ? 'bg-white/20 dark:bg-white/10'
                    : 'hover:bg-white/10 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${t.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {t.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}