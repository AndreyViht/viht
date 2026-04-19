"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [headline, setHeadline] = useState("Добро пожаловать в Viht");
  const [subtitle, setSubtitle] = useState("Следующее поколение приватности");
  const [saved, setSaved] = useState<string | null>(null);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "vihtadmin2024";

  useEffect(() => {
    if (!authenticated) return;
    setPhoto(localStorage.getItem("viht_photo"));
    setMusic(localStorage.getItem("viht_music"));
    setHeadline(localStorage.getItem("viht_headline") || "Добро пожаловать в Viht");
    setSubtitle(localStorage.getItem("viht_subtitle") || "Следующее поколение приватности");
  }, [authenticated]);

  const login = () => {
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setPhoto(b64);
  };

  const handleMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setMusic(b64);
  };

  const saveAll = () => {
    if (photo) localStorage.setItem("viht_photo", photo);
    else localStorage.removeItem("viht_photo");
    if (music) localStorage.setItem("viht_music", music);
    else localStorage.removeItem("viht_music");
    localStorage.setItem("viht_headline", headline);
    localStorage.setItem("viht_subtitle", subtitle);
    setSaved("Сохранено ✓");
    setTimeout(() => setSaved(null), 2500);
  };

  const clearItem = (key: "photo" | "music") => {
    if (key === "photo") { setPhoto(null); localStorage.removeItem("viht_photo"); }
    if (key === "music") { setMusic(null); localStorage.removeItem("viht_music"); }
  };

  if (!authenticated) {
    return (
      <div className="admin-root">
        <div className="login-card">
          <div className="login-logo">Viht</div>
          <p className="login-sub">Панель управления</p>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="admin-input"
          />
          {error && <p className="error-text">{error}</p>}
          <button onClick={login} className="admin-btn">Войти</button>
        </div>
        <AdminStyles />
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-container">
        <div className="admin-header">
          <span className="admin-logo">Viht <span className="admin-badge">Admin</span></span>
          <a href="/" className="admin-link" target="_blank">← Открыть сайт</a>
        </div>

        <div className="admin-grid">
          {/* Text content */}
          <section className="admin-card">
            <h2 className="section-title">✏️ Текст страницы</h2>
            <label className="field-label">Заголовок</label>
            <input
              type="text" value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="admin-input"
            />
            <label className="field-label mt">Подзаголовок</label>
            <input
              type="text" value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="admin-input"
            />
          </section>

          {/* Photo */}
          <section className="admin-card">
            <h2 className="section-title">🖼 Фото</h2>
            {photo ? (
              <div className="preview-wrap">
                <img src={photo} alt="preview" className="preview-img" />
                <button onClick={() => clearItem("photo")} className="clear-btn">Удалить</button>
              </div>
            ) : (
              <label className="upload-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span>Загрузить фото</span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden-input" />
              </label>
            )}
          </section>

          {/* Music */}
          <section className="admin-card">
            <h2 className="section-title">🎵 Музыка</h2>
            {music ? (
              <div className="music-preview">
                <div className="music-icon">🎵</div>
                <p className="music-loaded">Трек загружен</p>
                <audio controls src={music} className="audio-preview" />
                <button onClick={() => clearItem("music")} className="clear-btn">Удалить</button>
              </div>
            ) : (
              <label className="upload-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Загрузить музыку</span>
                <input type="file" accept="audio/*" onChange={handleMusic} className="hidden-input" />
              </label>
            )}
          </section>
        </div>

        <div className="save-row">
          <button onClick={saveAll} className="save-btn">
            {saved || "Сохранить всё"}
          </button>
        </div>
      </div>
      <AdminStyles />
    </div>
  );
}

function AdminStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Sora', sans-serif; }

      .admin-root {
        min-height: 100vh;
        background: #0d0d14;
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
      }

      .login-card {
        width: 340px; padding: 40px 32px; border-radius: 24px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(20px);
        display: flex; flex-direction: column; gap: 14px;
        text-align: center;
      }
      .login-logo {
        font-size: 2rem; font-weight: 700; letter-spacing: -0.04em;
        background: linear-gradient(135deg, #fff 30%, #a78bfa);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
      .login-sub { color: rgba(255,255,255,0.35); font-size: 0.85rem; margin-top: -6px; }
      .error-text { color: #f87171; font-size: 0.8rem; }

      .admin-container { width: 100%; max-width: 900px; }
      .admin-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 28px;
      }
      .admin-logo {
        font-size: 1.4rem; font-weight: 700; color: white;
        background: linear-gradient(135deg, #fff 30%, #a78bfa);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
      .admin-badge {
        font-size: 0.65rem; font-weight: 600; background: rgba(167,139,250,0.2);
        border: 1px solid rgba(167,139,250,0.4); color: #a78bfa;
        padding: 2px 8px; border-radius: 20px; margin-left: 8px;
        vertical-align: middle; -webkit-text-fill-color: #a78bfa;
      }
      .admin-link { color: rgba(255,255,255,0.4); font-size: 0.85rem; text-decoration: none; transition: color 0.2s; }
      .admin-link:hover { color: white; }

      .admin-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px; margin-bottom: 20px;
      }
      .admin-card {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px; padding: 24px;
        display: flex; flex-direction: column; gap: 10px;
      }
      .section-title { font-size: 0.95rem; font-weight: 600; color: white; margin-bottom: 4px; }
      .field-label { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
      .field-label.mt { margin-top: 4px; }

      .admin-input {
        width: 100%; padding: 12px 16px; border-radius: 12px;
        background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
        color: white; font-family: 'Sora', sans-serif; font-size: 0.9rem;
        outline: none; transition: border-color 0.2s;
      }
      .admin-input:focus { border-color: rgba(167,139,250,0.5); }
      .admin-input::placeholder { color: rgba(255,255,255,0.25); }

      .admin-btn {
        width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #7c3aed, #3b82f6);
        color: white; font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 600;
        transition: opacity 0.2s, transform 0.15s;
      }
      .admin-btn:hover { opacity: 0.9; transform: scale(1.01); }

      .upload-zone {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 10px; padding: 30px 20px; border-radius: 14px; cursor: pointer;
        border: 2px dashed rgba(255,255,255,0.12); color: rgba(255,255,255,0.35);
        font-size: 0.85rem; transition: border-color 0.2s, color 0.2s;
      }
      .upload-zone:hover { border-color: rgba(167,139,250,0.4); color: rgba(167,139,250,0.8); }
      .hidden-input { display: none; }

      .preview-wrap { display: flex; flex-direction: column; gap: 10px; align-items: center; }
      .preview-img { width: 100%; max-height: 180px; object-fit: cover; border-radius: 12px; }
      .music-preview { display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .music-icon { font-size: 2rem; }
      .music-loaded { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
      .audio-preview { width: 100%; height: 36px; }
      .clear-btn {
        padding: 6px 16px; border-radius: 8px; border: 1px solid rgba(248,113,113,0.3);
        background: rgba(248,113,113,0.08); color: #f87171; font-size: 0.8rem;
        cursor: pointer; transition: background 0.2s;
      }
      .clear-btn:hover { background: rgba(248,113,113,0.15); }

      .save-row { display: flex; justify-content: flex-end; }
      .save-btn {
        padding: 14px 36px; border-radius: 50px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #7c3aed, #3b82f6);
        color: white; font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 600;
        box-shadow: 0 0 30px rgba(124,58,237,0.3);
        transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      }
      .save-btn:hover { opacity: 0.9; transform: scale(1.02); box-shadow: 0 0 40px rgba(124,58,237,0.5); }
    `}</style>
  );
}
