"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [music, setMusic] = useState<boolean>(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "vihtadmin2024";

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/content").then(r => r.json()).then(data => {
      if (data.photo) setPhoto(data.photo);
      if (data.music) setMusic(true);
    });
  }, [authenticated]);

  const login = () => {
    if (password === ADMIN_PASS) { setAuthenticated(true); setError(""); }
    else setError("Неверный пароль");
  };

  const uploadFile = async (file: File, type: "photo" | "music") => {
    setUploading(type);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (type === "photo") setPhoto(data.url);
    if (type === "music") setMusic(true);
    setUploading(null);
    setSaved("Загружено ✓");
    setTimeout(() => setSaved(null), 2500);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "photo");
  };

  const handleMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "music");
  };

  if (!authenticated) {
    return (
      <div className="root">
        <div className="login-card">
          <div className="logo">Viht</div>
          <p className="sub">Панель управления</p>
          <input type="password" placeholder="Пароль" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="inp" />
          {error && <p className="err">{error}</p>}
          <button onClick={login} className="btn">Войти</button>
        </div>
        <Styles />
      </div>
    );
  }

  return (
    <div className="root">
      <div className="container">
        <div className="top-bar">
          <span className="logo">Viht <span className="badge">Admin</span></span>
          <a href="/" target="_blank" className="link">← Открыть сайт</a>
        </div>

        {saved && <div className="toast">{saved}</div>}

        <div className="grid">
          {/* Photo */}
          <div className="card">
            <h2 className="card-title">🖼 Фото</h2>
            {uploading === "photo" ? (
              <div className="loading">Загрузка...</div>
            ) : photo ? (
              <div className="preview">
                <img src={photo} alt="preview" className="preview-img" />
                <label className="replace-btn">
                  Заменить
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="upload-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span>Загрузить фото</span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>

          {/* Music */}
          <div className="card">
            <h2 className="card-title">🎵 Музыка</h2>
            {uploading === "music" ? (
              <div className="loading">Загрузка...</div>
            ) : music ? (
              <div className="preview">
                <div className="music-ok">✓ Трек загружен</div>
                <label className="replace-btn">
                  Заменить
                  <input type="file" accept="audio/*" onChange={handleMusic} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="upload-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Загрузить музыку</span>
                <input type="file" accept="audio/*" onChange={handleMusic} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </div>
      <Styles />
    </div>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Sora', sans-serif; }
      .root { min-height: 100vh; background: #0d0d14; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .login-card { width: 340px; padding: 40px 32px; border-radius: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 14px; text-align: center; }
      .logo { font-size: 2rem; font-weight: 700; letter-spacing: -0.04em; background: linear-gradient(135deg, #fff 30%, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .sub { color: rgba(255,255,255,0.35); font-size: 0.85rem; margin-top: -6px; }
      .err { color: #f87171; font-size: 0.8rem; }
      .inp { width: 100%; padding: 12px 16px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: white; font-family: 'Sora', sans-serif; font-size: 0.9rem; outline: none; }
      .inp:focus { border-color: rgba(167,139,250,0.5); }
      .inp::placeholder { color: rgba(255,255,255,0.25); }
      .btn { width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 600; }
      .container { width: 100%; max-width: 700px; }
      .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
      .badge { font-size: 0.65rem; font-weight: 600; background: rgba(167,139,250,0.2); border: 1px solid rgba(167,139,250,0.4); color: #a78bfa; padding: 2px 8px; border-radius: 20px; margin-left: 8px; vertical-align: middle; -webkit-text-fill-color: #a78bfa; }
      .link { color: rgba(255,255,255,0.4); font-size: 0.85rem; text-decoration: none; }
      .link:hover { color: white; }
      .toast { background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34d399; padding: 10px 20px; border-radius: 12px; text-align: center; margin-bottom: 16px; font-size: 0.9rem; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
      .card-title { font-size: 0.95rem; font-weight: 600; color: white; }
      .upload-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 30px 20px; border-radius: 14px; cursor: pointer; border: 2px dashed rgba(255,255,255,0.12); color: rgba(255,255,255,0.35); font-size: 0.85rem; transition: border-color 0.2s, color 0.2s; }
      .upload-zone:hover { border-color: rgba(167,139,250,0.4); color: rgba(167,139,250,0.8); }
      .hidden { display: none; }
      .loading { text-align: center; padding: 30px; color: rgba(255,255,255,0.4); font-size: 0.85rem; }
      .preview { display: flex; flex-direction: column; gap: 10px; align-items: center; }
      .preview-img { width: 100%; max-height: 160px; object-fit: cover; border-radius: 12px; }
      .music-ok { font-size: 1rem; color: #34d399; text-align: center; padding: 20px; }
      .replace-btn { padding: 8px 20px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
      .replace-btn:hover { background: rgba(255,255,255,0.1); color: white; }
      @media (max-width: 500px) { .grid { grid-template-columns: 1fr; } }
    `}</style>
  );
}
