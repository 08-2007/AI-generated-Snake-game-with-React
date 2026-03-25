import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#00ffff] font-mono selection:bg-[#ff00ff]/30 relative screen-tear">
      {/* Static Noise Overlay */}
      <div className="static-noise" />

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Header */}
        <header className="w-full max-w-5xl flex flex-col items-start gap-4 border-b-2 border-[#00ffff]/20 pb-6">
          <div className="flex items-center gap-4">
            <Terminal className="w-8 h-8 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-pixel uppercase tracking-widest glitch-text" data-text="NEURAL_SNAKE.EXE">
              NEURAL_SNAKE.EXE
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#ff00ff] animate-pulse">
            <Activity className="w-4 h-4" />
            <span>SYSTEM_STATUS: OPERATIONAL // UPLINK_ESTABLISHED</span>
          </div>
        </header>

        {/* Game and Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
          {/* Sidebar: Music Player */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="p-4 border-l-4 border-[#ff00ff] bg-[#ff00ff]/5">
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-[#ff00ff]">AUDIO_STREAM_01</h2>
            </div>
            <MusicPlayer />
            
            {/* Terminal Log */}
            <div className="p-4 bg-[#0a0a0a] border border-[#00ffff]/20 font-pixel text-sm space-y-1">
              <p className="text-[#00ffff]/40"> {">"} INITIALIZING_NEURAL_LINK...</p>
              <p className="text-[#00ffff]/40"> {">"} LOADING_SYNTH_WAVE_BUFFER...</p>
              <p className="text-[#ff00ff]"> {">"} WARNING: GRID_INTEGRITY_COMPROMISED</p>
              <p className="text-[#00ffff]/40"> {">"} AWAITING_INPUT_COMMANDS...</p>
            </div>
          </motion.div>

          {/* Main: Snake Game */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <div className="p-4 border-l-4 border-[#00ffff] bg-[#00ffff]/5 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.4em]">VISUAL_MATRIX_RENDER</h2>
              <span className="text-[10px] text-[#00ffff]/40">FPS: 60.00 // LATENCY: 0.04ms</span>
            </div>
            <div className="flex justify-center bg-[#050505] p-4 border border-[#00ffff]/10 shadow-[0_0_30px_rgba(0,255,255,0.05)]">
              <SnakeGame />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-5xl mt-8 pt-6 border-t border-[#00ffff]/10 flex justify-between items-center text-[10px] font-pixel tracking-widest text-[#00ffff]/30">
          <p>© 2026 // PROTOCOL_X9 // ALL_RIGHTS_RESERVED</p>
          <div className="flex gap-4">
            <span>ENCRYPTION: AES-256</span>
            <span>NODE: ASIA-SE-1</span>
          </div>
        </footer>
      </main>

      {/* Jarring Color Accents */}
      <div className="fixed top-0 left-0 w-1 h-full bg-[#ff00ff]/20" />
      <div className="fixed top-0 right-0 w-1 h-full bg-[#00ffff]/20" />
    </div>
  );
}
