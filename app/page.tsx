'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{
        x: ['-20px', '20px', '-10px', '-20px'],
        y: ['-10px', '20px', '40px', '-10px'],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[450px] h-[450px] rounded-full blur-[80px] opacity-40 bg-[#8b5cf6] top-[-100px] left-[-100px]"
    />
    <motion.div
      animate={{
        x: ['20px', '-20px', '10px', '20px'],
        y: ['20px', '-10px', '30px', '20px'],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[450px] h-[450px] rounded-full blur-[80px] opacity-40 bg-[#3b82f6] bottom-[-150px] right-[-100px]"
    />
    <motion.div
      animate={{
        x: ['-10px', '30px', '-20px', '-10px'],
        y: ['40px', '10px', '-10px', '40px'],
      }}
      transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-[450px] h-[450px] rounded-full blur-[80px] opacity-40 bg-[#ec4899] top-[200px] left-[300px]"
    />
  </div>
);

const LiquidPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const playRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
      if (isPlaying) {
        playRef.current = requestAnimationFrame(updateProgress);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
      playRef.current = requestAnimationFrame(updateProgress);
    } else {
      audio.pause();
      if (playRef.current) cancelAnimationFrame(playRef.current);
    }

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      if (playRef.current) cancelAnimationFrame(playRef.current);
    };
  }, [isPlaying, src, volume]); // added volume to deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (!isPlaying) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    }
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (Number(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(Number(e.target.value));
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVol;
      audio.muted = newVol === 0;
    }
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
      className="w-full flex justify-center"
    >
      <div className="glass rounded-[30px] p-2 pr-6 w-[95%] max-w-[400px] flex gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 items-center">
        <audio ref={audioRef} src={src} loop preload="metadata" />

        <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 shrink-0 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause fill="currentColor" stroke="none" className="w-5 h-5" /> : <Play fill="currentColor" stroke="none" className="w-5 h-5 pl-1" />}
          </button>

          <div className="flex-1 flex flex-col justify-center h-full relative cursor-pointer group">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Base track */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex items-center relative group-hover:h-2 transition-all">
              {/* Fill track */}
              <div 
                className="h-full bg-white rounded-full relative" 
                style={{ width: `${progress}%` }} 
              >
                {/* Thumb indicator (visible on hover or always if preferred, let's keep it clean) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] group-hover:opacity-100 transition-opacity translate-x-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4 group">
            <button onClick={toggleMute} className="flex items-center justify-center hover:text-white transition-colors active:scale-95 text-white/60">
              {isMuted || volume === 0 ? <VolumeX strokeWidth={2} className="w-4 h-4" /> : <Volume2 strokeWidth={2} className="w-4 h-4" />}
            </button>
            <div className="h-1.5 w-16 bg-white/10 rounded-full flex items-center relative group-hover:h-2 transition-all hidden sm:block">
              <input
                 type="range"
                 min="0"
                 max="1"
                 step="0.01"
                 value={isMuted ? 0 : volume}
                 onChange={handleVolumeChange}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div 
                  className="h-full bg-white rounded-full pointer-events-none" 
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }} 
                />
            </div>
          </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setPhotoUrl(data.photoUrl);
        setMusicUrl(data.musicUrl);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between py-12 overflow-hidden bg-[#050505] font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-white select-none">
      <BackgroundBlobs />

      <header className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="px-8 py-2 glass rounded-full flex items-center justify-center"
        >
          <span className="text-2xl font-bold tracking-widest text-white">VIHT</span>
        </motion.div>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4" />
      </header>

      <main className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center w-full">
        {/* Central image area */}
        <AnimatePresence>
          {photoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="flex items-center justify-center w-full my-8"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-80 h-80 sm:w-96 sm:h-96 rounded-2xl glass levitate overflow-hidden flex items-center justify-center p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photoUrl} 
                  alt="Main portfolio graphic" 
                  className="w-full h-full object-cover rounded-xl"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 w-full flex flex-col items-center gap-12 pb-12">
        <AnimatePresence>
          {musicUrl && <LiquidPlayer src={musicUrl} />}
        </AnimatePresence>
      </footer>
    </div>
  );
}
