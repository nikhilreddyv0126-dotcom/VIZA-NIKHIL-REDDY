import { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Gamepad2, Music } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-green-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg shadow-[0_0_15px_#22c55e]">
            <Gamepad2 className="text-black" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">
            Neon<span className="text-green-500">Rhythm</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">High Score</span>
            <div className="flex items-center gap-2 text-green-500 font-mono font-bold">
              <Trophy size={14} />
              <span>1,240</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 max-w-7xl mx-auto w-full">
        
        {/* Game Window Container */}
        <section className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/5 shadow-2xl"
          >
            <SnakeGame onScoreUpdate={setScore} isPlaying={isPlaying} />
            
            {/* Score HUD Overlay */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-white tracking-widest">{score.toString().padStart(4, '0')}</span>
            </div>
          </motion.div>

          {/* Controls Help */}
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-4 h-4 rounded bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">W</div>
                <div className="w-4 h-4 rounded bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">S</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">NAVIGATE</span>
            </div>
            <div className="px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-3">
              <div className="w-8 h-4 rounded bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">SPACE</div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">PLAY/PAUSE</span>
            </div>
          </div>
        </section>

        {/* Music Player Section */}
        <section className="w-full max-w-md flex flex-col gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Music size={18} />
              <h2 className="text-sm font-bold tracking-widest uppercase">System Audio</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Experience adaptive soundscapes that React to your gameplay intensity. 
              Powered by <span className="text-white font-semibold">Gemini Audio Engine</span>.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer isPlaying={isPlaying} onTogglePlay={setIsPlaying} />
          </motion.div>

          <footer className="pt-8 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {['VAPORWAVE', 'LO-FI', 'SYNTH', 'DRUM_BASE'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-900 rounded text-[9px] font-mono text-slate-500 border border-white/5 hover:border-green-500/30 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="p-6 text-center text-[10px] font-mono text-slate-700 tracking-[0.2em] uppercase">
        &copy; 2026 AI STUDIO ARCADE // VERSION 4.2.0-STABLE
      </footer>
    </div>
  );
}

