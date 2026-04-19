"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [headline, setHeadline] = useState("Добро пожаловать в Viht");
  const [subtitle, setSubtitle] = useState("Следующее поколение приватности");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("viht_photo");
    const savedMusic = localStorage.getItem("viht_music");
    const savedHeadline = localStorage.getItem("viht_headline");
    const savedSubtitle = localStorage.getItem("viht_subtitle");
    if (savedPhoto) setPhoto(savedPhoto);
    if (savedMusic) setMusic(savedMusic);
    if (savedHeadline) setHeadline(savedHeadline);
    if (savedSubtitle) setSubtitle(savedSubtitle);
  }, []);

  useEffect(() => {
    if (music && audioRef.current) {
      audioRef.current.src = music;
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
  }, [music]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    setProgress(val);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated background blobs */}
      <div className="fixed inset-0 z-0">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="noise" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="logo-text">Viht</span>
          <a href="#" className="btn-glass">Подключиться</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-6">
        <div className="text-center mb-12">
          <h1 className="hero-title">{headline}</h1>
          <p className="hero-sub">{subtitle}</p>
        </div>

        {/* Photo */}
        {photo && (
          <div className="photo-frame mb-12">
            <img src={photo} alt="Viht" className="photo-img" />
            <div className="photo-glow" />
          </div>
        )}


      </section>

      {/* Music Player */}
      {music && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 player-bar">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="play-btn">
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <rect x="4" y="3" width="4" height="14" rx="1"/>
                  <rect x="12" y="3" width="4" height="14" rx="1"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M5 3l12 7-12 7V3z"/>
                </svg>
              )}
            </button>

            <div className="flex flex-col gap-1 min-w-[180px]">
              <div className="flex items-center gap-2">
                <span className="time-text">{fmt(currentTime)}</span>
                <input
                  type="range" min="0" max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="seek-bar flex-1"
                />
                <span className="time-text">{fmt(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="rgba(255,255,255,0.5)">
                <path d="M2 5h2l3-3v10l-3-3H2V5zm7 .5a2.5 2.5 0 010 3M9.5 3a5 5 0 010 8"/>
              </svg>
              <input
                type="range" min="0" max="1" step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="vol-bar"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Space+Mono&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; color: white; }

        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; animation: drift 18s ease-in-out infinite; }
        .blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, #a78bfa, #6d28d9); top: -100px; left: -100px; animation-delay: 0s; }
        .blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, #38bdf8, #0ea5e9); bottom: -100px; right: -100px; animation-delay: -6s; }
        .blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, #f472b6, #ec4899); top: 40%; left: 40%; animation-delay: -12s; }
        @keyframes drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-30px) scale(1.05); }
          66% { transform: translate(-30px,40px) scale(0.95); }
        }
        .noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .glass-nav {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .logo-text {
          font-size: 1.6rem; font-weight: 700; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 30%, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .nav-link {
          color: rgba(255,255,255,0.65); font-size: 0.9rem; text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: white; }
        .btn-glass {
          padding: 8px 20px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: white; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-glass:hover { background: rgba(255,255,255,0.2); transform: scale(1.03); }

        .hero-title {
          font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 700;
          letter-spacing: -0.04em; line-height: 1.05;
          background: linear-gradient(160deg, #ffffff 0%, #c4b5fd 50%, #93c5fd 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        .hero-sub {
          font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255,255,255,0.55);
          font-weight: 300; max-width: 480px; margin: 0 auto;
        }

        .photo-frame {
          position: relative; border-radius: 28px; overflow: hidden;
          box-shadow: 0 0 80px rgba(167,139,250,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        }
        .photo-img { display: block; max-height: 420px; max-width: 700px; width: 100%; object-fit: cover; }
        .photo-glow {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4));
        }

        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; padding: 28px 24px;
          transition: transform 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15);
        }
        .card-title { font-size: 1.05rem; font-weight: 600; margin-bottom: 8px; }
        .card-desc { font-size: 0.875rem; color: rgba(255,255,255,0.5); line-height: 1.6; }

        .player-bar {
          background: rgba(20,20,30,0.6);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 60px; padding: 14px 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
          white-space: nowrap;
        }
        .play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(167,139,250,0.5);
          transition: transform 0.15s, box-shadow 0.15s; flex-shrink: 0;
        }
        .play-btn:hover { transform: scale(1.08); box-shadow: 0 0 30px rgba(167,139,250,0.7); }
        .time-text { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: rgba(255,255,255,0.4); }
        .seek-bar, .vol-bar {
          -webkit-appearance: none; appearance: none;
          height: 3px; border-radius: 2px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #a78bfa var(--val, 0%), rgba(255,255,255,0.15) var(--val, 0%));
        }
        .seek-bar { width: 100%; }
        .vol-bar { width: 70px; }
        .seek-bar::-webkit-slider-thumb, .vol-bar::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%;
          background: white; box-shadow: 0 0 6px rgba(167,139,250,0.8);
          transition: transform 0.1s;
        }
        .seek-bar::-webkit-slider-thumb:hover, .vol-bar::-webkit-slider-thumb:hover { transform: scale(1.3); }
      `}</style>
    </main>
  );
}
