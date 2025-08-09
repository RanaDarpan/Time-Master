'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RotateCcw, Plus, Trash2 } from 'lucide-react';

export default function Stopwatch({ theme }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Load saved state
    const savedTime = localStorage.getItem('stopwatchTime');
    const savedLaps = localStorage.getItem('stopwatchLaps');
    const savedSound = localStorage.getItem('soundEnabled');
    
    if (savedTime) setTime(parseInt(savedTime));
    if (savedLaps) setLaps(JSON.parse(savedLaps));
    if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('stopwatchTime', time.toString());
    }
  }, [time, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('stopwatchLaps', JSON.stringify(laps));
    }
  }, [laps, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
    }
  }, [soundEnabled, mounted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleStopwatch();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      } else if (e.code === 'KeyL' && isRunning) {
        e.preventDefault();
        recordLap();
      }
    };

    if (mounted) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isRunning, time, mounted]);

  const playBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 200);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const toggleStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      playBeep();
    } else {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
      setIsRunning(true);
      playBeep();
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    playBeep();
  };

  const recordLap = () => {
    if (isRunning && time > 0) {
      const lapTime = time;
      const lapNumber = laps.length + 1;
      const previousLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
      const splitTime = lapTime - previousLapTime;
      
      setLaps(prev => [...prev, { 
        number: lapNumber, 
        time: lapTime, 
        split: splitTime 
      }]);
      playBeep();
    }
  };

  const deleteLap = (index) => {
    setLaps(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getThemeColors = () => {
    const colors = {
      blue: {
        primary: 'from-blue-500 to-blue-600',
        accent: 'text-blue-500 dark:text-blue-400',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      green: {
        primary: 'from-green-500 to-green-600',
        accent: 'text-green-500 dark:text-green-400',
        button: 'bg-green-500 hover:bg-green-600'
      },
      orange: {
        primary: 'from-orange-500 to-orange-600',
        accent: 'text-orange-500 dark:text-orange-400',
        button: 'bg-orange-500 hover:bg-orange-600'
      },
      pink: {
        primary: 'from-pink-500 to-pink-600',
        accent: 'text-pink-500 dark:text-pink-400',
        button: 'bg-pink-500 hover:bg-pink-600'
      },
      cyan: {
        primary: 'from-cyan-500 to-cyan-600',
        accent: 'text-cyan-500 dark:text-cyan-400',
        button: 'bg-cyan-500 hover:bg-cyan-600'
      }
    };
    return colors[theme] || colors.blue;
  };

  const themeColors = getThemeColors();

  if (!mounted) {
    return (
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 dark:border-gray-600/20 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl md:text-7xl font-bold font-mono tracking-tight text-gray-400 mb-4">
            00:00.00
          </div>
          <div className="text-gray-400 text-lg">
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
      {/* Stopwatch Display */}
      <div className="text-center mb-8">
        <motion.div
          key={Math.floor(time / 10)}
          animate={isRunning ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 0.1 }}
          className={`text-6xl md:text-7xl font-bold font-mono tracking-tight mb-4 ${themeColors.accent}`}
        >
          {formatTime(time)}
        </motion.div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleStopwatch}
            className={`p-4 rounded-full text-white shadow-lg transition-all duration-200 bg-gradient-to-r ${themeColors.primary}`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={reset}
            className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-lg transition-all duration-200"
          >
            <RotateCcw size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={recordLap}
            disabled={!isRunning || time === 0}
            className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
              isRunning && time > 0
                ? `bg-gradient-to-r ${themeColors.primary} text-white`
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            soundEnabled
              ? 'bg-white/20 dark:bg-white/10 text-gray-700 dark:text-gray-300'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
          } border border-white/20 dark:border-gray-600/20`}
        >
          Sound {soundEnabled ? 'On' : 'Off'}
        </motion.button>
      </div>

      {/* Lap Times */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 dark:bg-black/5 rounded-2xl p-4 max-h-64 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Lap Times ({laps.length})
            </h3>
            <div className="space-y-2">
              {laps.map((lap, index) => (
                <motion.div
                  key={lap.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index % 2 === 0
                      ? 'bg-white/10 dark:bg-white/5'
                      : 'bg-white/5 dark:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400 w-8">
                      #{lap.number}
                    </span>
                    <span className="font-mono text-gray-800 dark:text-white">
                      {formatTime(lap.time)}
                    </span>
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                      (+{formatTime(lap.split)})
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteLap(index)}
                    className="p-1 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}