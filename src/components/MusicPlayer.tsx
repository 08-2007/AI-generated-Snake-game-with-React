import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (newProgress / 100) * duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] border-2 border-[#ff00ff]/20 p-6 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full aspect-square border border-[#ff00ff]/30 overflow-hidden group">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150 group-hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#ff00ff]/10 mix-blend-overlay" />
          {isPlaying && (
            <div className="absolute top-2 right-2 flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className="w-1 bg-[#ff00ff]"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-pixel text-[#ff00ff] uppercase tracking-tighter glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[10px] text-[#ff00ff]/60 uppercase tracking-[0.2em]">SOURCE: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] text-[#ff00ff]/40 uppercase tracking-widest">
            <span>BUFFERING...</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="p-2 text-[#ff00ff]/60 hover:text-[#ff00ff] transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-[#ff00ff]/60 hover:text-[#ff00ff] transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-4">
            <Volume2 className="w-4 h-4 text-[#ff00ff]/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
