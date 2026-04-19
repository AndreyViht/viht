'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: delay + index * 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

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

const SONG_LYRICS = [
  "Помнишь войсы в дескорде",
  "Шёпот, дрожь в твоём голосе",
  "Звук, захода в канал",
  "И тишина вдруг становится счастьем",
  "Ночью мы связаны",
  "Зелёный кружок — ты онлайн",
  "«Ты тут?» — и сразу дыхание ближе",
  "Как будто не сеть, а один вай-фай",
  "Собрались будто лего мгновенно",
  "В приватном канале вдвоём",
  "И даже другие не мешали",
  "Мы между словами живём",
  "Только не спеши",
  "В танцах две души",
  "Я с хриплым голосом жду под твоим чатом",
  "Хочешь — промолчи",
  "Хочешь — убежим",
  "Я даже в сети укрою тебя под своим зонтом",
  "Капли лета на экране",
  "Микрофон ловит каждый вздох",
  "Ты смеёшься так осторожно",
  "Будто кто-то услышит нас всерьёз",
  "В каждом слове — чуть больше, чем просто",
  "Между строками тёплый ток",
  "И пока горит «typing…» рядом",
  "Я читаю тебя между строк",
  "Даже если мир тревожный",
  "Ты мне пишешь: «ты ведь тоже…»",
  "И становится всё несложно",
  "Всё можно",
  "Медленно плывёт время в звонках",
  "Сквозь наушники — Сквозь сердце",
  "Если вдруг пропадаешь на секунду",
  "Я уже жду твой «reconnect» назад",
  "Память сохранит голос твой в проводах",
  "Как голосовое в архиве снов",
  "Я включу его ночью снова",
  "И услышу тебя без слов",
  "Только не спеши",
  "В танцах две души",
  "Я с хриплым голосом жду под твоим чатом",
  "Хочешь — промолчи",
  "Хочешь — убежим",
  "Пусть весь мир зависнет — мы не молчим",
  "Капли лета на ладошке",
  "Ты смеёшься так осторожно",
  "В каждом слове — чуть больше, чем просто",
  "Нам всё можно",
  "Даже если всё тревожно",
  "Эти чувства — невозможно",
  "Но пока ты в онлайне рядом",
  "Всё возможно",
  "Нам всё можно",
  "Пусть исчезнет всё позже",
  "Но пока ты со мной в дескорде",
  "Всё можно"
];

const KaraokeLyrics = () => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    // wait for a bit initially then cycle every 4 seconds
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % SONG_LYRICS.length);
    }, 4500); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
           key={lineIndex}
           initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
           exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
           transition={{ duration: 1.5, ease: 'easeInOut' }}
           className="w-full px-4 sm:px-12 text-center opacity-100 sm:opacity-30 mix-blend-screen"
        >
          <motion.p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]">
            {SONG_LYRICS[lineIndex].split(/\s+/).map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block mr-2">
                {word.split('').map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    initial={{ opacity: 0.2, textShadow: '0 0 0px rgba(255,255,255,0)' }}
                    animate={{ opacity: 1, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}
                    transition={{ 
                      duration: 0.1, 
                      delay: wordIdx * 0.3 + charIdx * 0.05 // words appear seq, chars fast
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

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
      <div className="w-[95%] max-w-[400px] flex gap-3 items-center">
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
          className="px-8 py-2/min-h-16 glass rounded-[30px] flex flex-col items-center justify-center p-3"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-white leading-none">VIHT</span>
          <span className="text-[10px] mt-1 font-mono text-white/50 lowercase tracking-[0.15em]">
            <TypewriterText text="by global" delay={1} />
          </span>
        </motion.div>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4" />
      </header>

      <main className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center w-full min-h-[500px]">
        {/* Central image area */}
        <AnimatePresence>
          {photoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="flex items-center justify-center w-full my-8 absolute inset-0 sm:relative"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-80 h-80 sm:w-[500px] sm:h-[500px] flex items-center justify-center pointer-events-none relative opacity-40 sm:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photoUrl} 
                  alt="Main portfolio graphic" 
                  className="w-full h-full object-cover"
                  style={{
                    WebkitMaskImage: 'radial-gradient(circle at center, black 35%, transparent 70%)',
                    maskImage: 'radial-gradient(circle at center, black 35%, transparent 70%)'
                  }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <KaraokeLyrics />
      </main>

      <footer className="relative z-10 w-full flex flex-col items-center gap-12 pb-12">
        <AnimatePresence>
          {musicUrl && <LiquidPlayer src={musicUrl} />}
        </AnimatePresence>
      </footer>
    </div>
  );
}
