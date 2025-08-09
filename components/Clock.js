'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Clock({ theme }) {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved24Hour = localStorage.getItem('is24Hour');
    if (saved24Hour !== null) {
      setIs24Hour(JSON.parse(saved24Hour));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('is24Hour', JSON.stringify(is24Hour));
    }
  }, [is24Hour, mounted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour
    };
    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getThemeAccent = () => {
    const accents = {
      blue: 'text-blue-500 dark:text-blue-400',
      green: 'text-green-500 dark:text-green-400',
      orange: 'text-orange-500 dark:text-orange-400',
      pink: 'text-pink-500 dark:text-pink-400',
      cyan: 'text-cyan-500 dark:text-cyan-400'
    };
    return accents[theme] || accents.blue;
  };

  if (!mounted) {
    return (
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 dark:border-gray-600/20 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl md:text-7xl font-bold font-mono tracking-tight text-gray-400 mb-4">
            --:--:--
          </div>
          <div className="text-gray-400 text-lg mb-6">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 dark:border-gray-600/20 shadow-2xl"
    >
      <div className="text-center">
        <motion.div
          key={time.getSeconds()}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.1 }}
          className="mb-4"
        >
          <div className={`text-6xl md:text-7xl font-bold font-mono tracking-tight ${getThemeAccent()}`}>
            {formatTime(time)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 text-lg mb-6"
        >
          {formatDate(time)}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIs24Hour(!is24Hour)}
          className="bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-white/20 dark:border-gray-600/20"
        >
          {is24Hour ? '12-Hour' : '24-Hour'} Format
        </motion.button>
      </div>
    </motion.div>
  );
}