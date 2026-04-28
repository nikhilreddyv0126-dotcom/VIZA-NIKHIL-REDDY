import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onTogglePlay }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];
  
  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (1 / currentTrack.duration) * 100;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-6">
        {/* Album Art */}
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-white/10"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <motion.div 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-1 bg-green-500/20 blur-xl rounded-2xl -z-10"
            />
          )}
        </motion.div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="space-y-1"
            >
              <h3 className="text-white font-bold truncate tracking-tight">{currentTrack.title}</h3>
              <p className="text-slate-400 text-sm truncate font-medium">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>

          {/* Visualizer simulation */}
          <div className="flex items-end gap-1 h-4 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                animate={isPlaying ? {
                  height: [4, Math.random() * 12 + 4, 4]
                } : { height: 4 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  delay: i * 0.1
                }}
                className="w-1 bg-green-500/60 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 space-y-2">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>{Math.floor((progress / 100) * currentTrack.duration / 60)}:{(Math.floor((progress / 100) * currentTrack.duration % 60)).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentTrack.duration / 60)}:{Math.floor(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-slate-400 hover:text-white transition-colors"
            id="prev-btn"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={() => onTogglePlay(!isPlaying)}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            id="play-pause-btn"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-slate-400 hover:text-white transition-colors"
            id="next-btn"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <Volume2 size={16} />
          <div className="w-16 h-1 bg-slate-800 rounded-full">
            <div className="w-3/4 h-full bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* AI Label */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 tracking-wider">
          <AudioLines size={12} className="text-green-500/50" />
          <span>GEN-AI AUDIO STREAMING</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
          <span className="text-[9px] font-bold text-green-500 tracking-tighter uppercase">Hi-Fi</span>
        </div>
      </div>
    </div>
  );
}
