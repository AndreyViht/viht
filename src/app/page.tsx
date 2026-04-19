"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.photo) setPhoto(data.photo);
        if (data.music) setMusic(data.music);
      });
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
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
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
    <main className="page">
      <div className="bg-layer">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <header className="hdr">
        <span className="logo">Viht</span>
      </header>

      <section className="hero">
        {photo && (
          <div className="photo-wrap">
            <img src={photo} alt="Viht" className="photo" />
            <div className="photo-shine" />
          </div>
        )}
      </section>

      {music && (
        <div className="player">
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />
          <button onClick={togglePlay} className="play-btn">
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                <rect x="4" y="3" width="4" height="14" rx="1"/>
                <rect x="12" y="3" width="4" height="14" rx="1"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                <path d="M5 3l12 7-12 7V3z"/>
              </svg>
            )}
          </button>
          <span className="time">{fmt(currentTime)}</span>
          <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="seek" />
          <span className="time">{fmt(duration)}</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="vol" />
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700&family=Space+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        .page { position: relative; min-height: 100vh; overflow: hidden; background: #060610; font-family: 'Sora', sans-serif; color: white; }
        .bg-layer { position: fixed; inset: 0; z-index: 0; }
        .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.3; animation: drift 20s ease-in-out infinite; }
        .b1 { width: 650px; height: 650px; background: radial-gradient(circle, #7c3aed, #4c1d95); top: -150px; left: -150px; animation-delay: 0s; }
        .b2 { width: 550px; height: 550px; background: radial-gradient(circle, #0ea5e9, #0369a1); bottom: -150px; right: -150px; animation-delay: -7s; }
        .b3 { width: 450px; height: 450px; background: radial-gradient(circle, #ec4899, #9d174d); top: 35%; left: 38%; animation-delay: -14s; }
        @keyframes drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(50px,-40px) scale(1.08); }
          66% { transform: translate(-40px,50px) scale(0.93); }
        }
        .hdr { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 18px 24px; background: rgba(255,255,255,0.03); backdrop-filter: blur(30px) saturate(180%); -webkit-backdrop-filter: blur(30px) saturate(180%); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .logo { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.04em; background: linear-gradient(135deg, #ffffff 20%, #c4b5fd 60%, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 80px 24px 100px; }
        .photo-wrap { position: relative; border-radius: 28px; overflow: hidden; box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.6), 0 0 100px rgba(124,58,237,0.2); animation: floatup 6s ease-in-out infinite; }
        @keyframes floatup { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .photo { display: block; max-width: min(700px, 90vw); max-height: 70vh; object-fit: cover; }
        .photo-shine { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.3) 100%); pointer-events: none; }
        .player { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 50; display: flex; align-items: center; gap: 12px; padding: 12px 22px; border-radius: 60px; background: rgba(10,10,20,0.7); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06); white-space: nowrap; }
        .play-btn { width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(135deg, #7c3aed, #3b82f6); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 20px rgba(124,58,237,0.5); transition: transform 0.15s, box-shadow 0.15s; }
        .play-btn:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(124,58,237,0.8); }
        .time { font-family: 'Space Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.35); }
        .seek { width: 180px; -webkit-appearance: none; appearance: none; height: 3px; border-radius: 2px; outline: none; cursor: pointer; background: rgba(255,255,255,0.12); }
        .vol { width: 65px; -webkit-appearance: none; appearance: none; height: 3px; border-radius: 2px; outline: none; cursor: pointer; background: rgba(255,255,255,0.12); }
        .seek::-webkit-slider-thumb, .vol::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 0 6px rgba(167,139,250,0.8); }
      `}</style>
    </main>
  );
}
