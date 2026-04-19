'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

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

const SYNCED_LYRICS = [
  { time: 0, text: "" },
  { time: 14, text: "Помнишь войсы в дескорде\nШёпот, дрожь в твоём голосе\nЗвук, захода в канал\nИ тишина вдруг становится счастьем\nНочью мы связаны\nЗелёный кружок — ты онлайн" },
  { time: 40, text: "«Ты тут?» — и сразу дыхание ближе\nКак будто не сеть, а один вай-фай\nСобрались будто лего мгновенно\nВ приватном канале вдвоём\nИ даже другие не мешали" },
  { time: 68, text: "Мы между словами живём\nТолько не спеши\nВ танцах две души\nЯ с хриплым голосом жду под твоим чатом\nХочешь — промолчи\nХочешь — убежим\nЯ даже в сети укрою тебя под своим зонтом\nКапли лета на экране\nМикрофон ловит каждый вздох\nТы смеёшься так осторожно\nБудто кто-то услышит нас всерьёз" },
  { time: 106, text: "В каждом слове — чуть больше, чем просто\nМежду строками тёплый ток\nИ пока горит «typing…» рядом\nЯ читаю тебя между строк\nДаже если мир тревожный\nТы мне пишешь: «ты ведь тоже…»\nИ становится всё несложно\nВсё можно" },
  { time: 128, text: "Медленно плывёт время в звонках\nСквозь наушники — Сквозь сердце\nЕсли вдруг пропадаешь на секунду\nЯ уже жду твой «reconnect» назад\nПамять сохранит голос твой в проводах\nКак голосовое в архиве снов\nЯ включу его ночью снова\nИ услышу тебя без слов\nТолько не спеши\nВ танцах две души" },
  { time: 159, text: "Я с хриплым голосом жду под твоим чатом\nХочешь — промолчи\nХочешь — убежим\nПусть весь мир зависнет — мы не молчим\nКапли лета на ладошке\nТы смеёшься так осторожно" },
  { time: 188, text: "В каждом слове — чуть больше, чем просто\nНам всё можно\nДаже если всё тревожно\nЭти чувства — невозможно\nНо пока ты в онлайне рядом\nВсё возможно\nНам всё можно" },
  { time: 226, text: "Пусть исчезнет всё позже\nНо пока ты со мной в дескорде\nВсё можно" }
];

const KaraokeLyrics = ({ currentTime }: { currentTime: number }) => {
  // Find the current lyric block based on time
  let activeIndex = 0;
  for (let i = 0; i < SYNCED_LYRICS.length; i++) {
    if (currentTime >= SYNCED_LYRICS[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  const activeText = SYNCED_LYRICS[activeIndex]?.text || "";

  if (!activeText) return null;

  const lines = activeText.split('\n');

  return (
    <div className="absolute inset-0 lg:relative lg:inset-auto flex items-center justify-center pointer-events-none z-30 overflow-hidden lg:overflow-visible w-full h-full lg:min-h-[400px]">
      <AnimatePresence mode="popLayout">
        <motion.div
           key={activeIndex}
           initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
           transition={{ duration: 1.5, ease: 'easeInOut' }}
           className="w-full px-4 sm:px-8 lg:px-0 text-center lg:text-left opacity-100 mix-blend-normal lg:mix-blend-normal"
        >
          <div className="flex flex-col gap-2">
            {lines.map((line, lineIdx) => (
              <motion.p 
                key={lineIdx} 
                className="text-sm sm:text-base lg:text-lg font-medium tracking-wide text-white/50 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] lg:drop-shadow-[0_2px_4px_rgba(255,255,255,0.05)]"
              >
                {line.split(/\s+/).map((word, wordIdx) => (
                  <span key={wordIdx} className="inline-block mr-2 lg:mr-2.5">
                    {word.split('').map((char, charIdx) => (
                      <motion.span
                        key={charIdx}
                        initial={{ opacity: 0.2, textShadow: '0 0 0px rgba(255,255,255,0)' }}
                        animate={{ opacity: 1, textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                        transition={{ 
                          duration: 0.5, 
                          delay: lineIdx * 1.0 + wordIdx * 0.25 + charIdx * 0.05 
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LiquidPlayer = ({ src, onTimeUpdate }: { src: string, onTimeUpdate?: (time: number) => void }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const playRef = useRef<number>(0);

  useEffect(() => {
    // Autoplay fallback (interaction required in many browsers)
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
         audioRef.current.play().catch(() => setIsPlaying(false));
         setIsPlaying(true);
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

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
      onTimeUpdate?.(audio.currentTime);
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
  }, [isPlaying, src, volume, onTimeUpdate]); // added volume to deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (!isPlaying) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
      onTimeUpdate?.(audio.currentTime);
    }
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPlaying, onTimeUpdate]);

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
      className="w-full flex justify-center mt-6"
    >
      <div className="w-[95%] max-w-[400px] flex gap-3 items-center">
        <audio ref={audioRef} src={src} loop preload="metadata" autoPlay />

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
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

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
          className="px-8 py-3 glass rounded-[30px] flex items-center justify-center gap-3 mt-4"
        >
          <motion.span 
            className="text-xl sm:text-2xl font-bold tracking-[0.2em] leading-none uppercase bg-gradient-to-r from-[#ff3366] via-[#7b33ff] to-[#33ccff] bg-[length:200%_auto] text-transparent bg-clip-text animate-gradient-x"
          >
            VIHT <span className="opacity-70 font-medium">| BLONDA</span>
          </motion.span>
        </motion.div>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4" />
      </header>

      <main className="relative z-10 flex flex-col w-full h-full items-center justify-center flex-1 mt-8 min-h-[500px] overflow-hidden">
        {/* Center: Image and Player */}
        <div className="flex flex-col items-center gap-8 w-full relative z-20">
          <AnimatePresence>
            {photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="relative flex items-center justify-center w-full"
              >
                <div className="w-80 h-80 sm:w-[400px] sm:h-[400px] rounded-2xl overflow-hidden glass shadow-2xl relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photoUrl} 
                    alt="Main portfolio graphic" 
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  
                  {/* Mobile Lyrics Overlay - ABSOLUTE INSIDE IMAGE Container */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center lg:hidden bg-black/40 p-4">
                     <KaraokeLyrics currentTime={currentAudioTime} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {musicUrl && <LiquidPlayer src={musicUrl} onTimeUpdate={setCurrentAudioTime} />}
          </AnimatePresence>
        </div>

        {/* Right Desktop Lyrics Container - Absolute so it doesn't push the center block */}
        <div className="hidden lg:flex flex-col absolute right-0 top-1/2 -translate-y-1/2 w-[350px] pr-8 xl:pr-16 z-20">
           <KaraokeLyrics currentTime={currentAudioTime} />
        </div>
      </main>
    </div>
  );
}
