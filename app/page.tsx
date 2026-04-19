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

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
      className="w-full flex justify-center"
    >
      <div className="glass rounded-2xl p-4 w-[90%] max-w-[500px] flex flex-col gap-3 shadow-2xl">
        <audio ref={audioRef} src={src} loop preload="metadata" />

        <div className="flex items-center gap-4 px-2">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 shrink-0 transition-transform"
          >
            {isPlaying ? <Pause fill="currentColor" stroke="none" className="w-5 h-5" /> : <Play fill="currentColor" stroke="none" className="w-5 h-5 pl-1" />}
          </button>

          <div className="flex-1 flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider opacity-60 text-white">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex items-center relative">
               <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-white rounded-full pointer-events-none" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button onClick={toggleMute} className="flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95 text-white/40">
              {isMuted || volume === 0 ? <VolumeX strokeWidth={2} className="w-3.5 h-3.5" /> : <Volume2 strokeWidth={2} className="w-3.5 h-3.5" />}
            </button>
            <div className="h-1 w-16 bg-white/20 rounded-full flex items-center relative hidden sm:block">
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

      <footer className="relative z-10 w-full flex flex-col items-center gap-12 pb-4">
        <AnimatePresence>
          {musicUrl && <LiquidPlayer src={musicUrl} />}
        </AnimatePresence>
        <a href="/advihtminui" className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity text-white">Protected Access</a>
      </footer>

      <div className="absolute top-6 right-8 z-20 flex gap-2">
        <a href="/advihtminui" className="px-3 py-1.5 glass rounded-lg text-[9px] font-bold uppercase text-white/50 border-white/5 hover:text-white transition-colors">Admin Panel</a>
      </div>
    </div>
  );
}
