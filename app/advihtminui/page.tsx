'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Music, Image as ImageIcon, CheckCircle, Loader2, RefreshCw, Settings2, Save } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | null>(null);
  const [musicBlobUrl, setMusicBlobUrl] = useState<string | null>(null);
  const [appConfig, setAppConfig] = useState<any>({
    bgEffect: 'blobs',
    photoEffect: 'none',
    playerStyle: 'minimal',
    buttons: []
  });
  
  const [isFetching, setIsFetching] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const fetchContent = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setPhotoBlobUrl(data.photoUrl);
      setMusicBlobUrl(data.musicUrl);
      if (data.config) {
        setAppConfig((prev: any) => ({ ...prev, ...data.config }));
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchContent();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleConfigSave = async () => {
    setIsSavingConfig(true);
    
    // Create a JSON blob
    const file = new Blob([JSON.stringify(appConfig)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', file, 'config.json');
    formData.append('type', 'config');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }
      alert('Настройки успешно сохранены!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении настроек');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleUpload = async (file: File, type: 'photo' | 'music') => {
    const isPhoto = type === 'photo';
    if (isPhoto) setUploadingPhoto(true);
    else setUploadingMusic(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      
      if (isPhoto) {
        setPhotoBlobUrl(data.url);
      } else {
        setMusicBlobUrl(data.url);
      }
    } catch (err) {
      console.error(err);
      alert(`Ошибка при загрузке ${isPhoto ? 'фото' : 'музыки'}`);
    } finally {
      if (isPhoto) setUploadingPhoto(false);
      else setUploadingMusic(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8 rounded-2xl bg-[#111] border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-medium mb-6 text-center tracking-tight">Admin</h1>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl focus:outline-none focus:border-white/50 transition-colors text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto min-h-screen">
      <header className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-medium tracking-tight">Управление контентом</h1>
        <button onClick={fetchContent} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
          <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Photo Upload Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden transition-all hover:border-white/20">
          <ImageIcon className="w-12 h-12 mb-4 text-white/50" />
          <h2 className="text-xl font-medium mb-2">Центральное изображение</h2>
          
          {photoBlobUrl ? (
            <div className="flex flex-col items-center">
              <span className="flex items-center text-green-400 text-sm mb-4">
                <CheckCircle className="w-4 h-4 mr-2" /> Загружено
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoBlobUrl} alt="Current" className="w-24 h-24 object-cover rounded-xl mb-4 border border-white/20" />
            </div>
          ) : (
            <p className="text-white/50 text-sm mb-6">Файл не загружен</p>
          )}

          <input
            type="file"
            accept="image/*"
            ref={photoInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'photo')}
            className="hidden"
          />
          
          <button
            onClick={() => photoInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {uploadingPhoto ? <Loader2 className="w-5 h-5 animate-spin" /> : (photoBlobUrl ? 'Заменить изображение' : 'Загрузить')}
          </button>
        </div>

        {/* Music Upload Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden transition-all hover:border-white/20">
          <Music className="w-12 h-12 mb-4 text-white/50" />
          <h2 className="text-xl font-medium mb-2">Фоновая музыка</h2>
          
          {musicBlobUrl ? (
            <div className="flex flex-col items-center">
              <span className="flex items-center text-green-400 text-sm mb-4">
                <CheckCircle className="w-4 h-4 mr-2" /> Загружено
              </span>
              <audio controls src={musicBlobUrl} className="mb-4 h-8 w-48 opacity-80" />
            </div>
          ) : (
            <p className="text-white/50 text-sm mb-6">Файл не загружен</p>
          )}

          <input
            type="file"
            accept="audio/*"
            ref={musicInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'music')}
            className="hidden"
          />
          
          <button
            onClick={() => musicInputRef.current?.click()}
            disabled={uploadingMusic}
            className="flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {uploadingMusic ? <Loader2 className="w-5 h-5 animate-spin" /> : (musicBlobUrl ? 'Заменить музыку' : 'Загрузить')}
          </button>
        </div>
      </div>

      {/* Config Settings Card */}
      <div className="mt-8 bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 transition-all hover:border-white/20">
        <div className="flex items-center mb-6">
          <Settings2 className="w-8 h-8 mr-4 text-white/50" />
          <h2 className="text-2xl font-medium">Эффекты и плеер</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Background Effects */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Эффекты обоев</label>
            <select
              value={appConfig.bgEffect || 'blobs'}
              onChange={(e) => setAppConfig({ ...appConfig, bgEffect: e.target.value })}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="none">Без эффектов (черный цвет)</option>
              <option value="blobs">Цветные переливы (пятна)</option>
              <option value="pulse">Пульсация энергии (красная)</option>
            </select>
            <p className="text-xs text-white/40 mt-2">Эффекты на заднем плане за контентом.</p>
          </div>

          {/* Photo Effects */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Эффект фото</label>
            <select
              value={appConfig.photoEffect || 'none'}
              onChange={(e) => setAppConfig({ ...appConfig, photoEffect: e.target.value })}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="none">Обычное (Закругленные края)</option>
              <option value="glow">Светящееся (Glass + Тень)</option>
              <option value="levitate">Парящее (Анимация движения)</option>
            </select>
            <p className="text-xs text-white/40 mt-2">Эффект вокруг главного фото.</p>
          </div>

          {/* Player Style */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Стиль плеера</label>
            <select
              value={appConfig.playerStyle || 'minimal'}
              onChange={(e) => setAppConfig({ ...appConfig, playerStyle: e.target.value })}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="minimal">Минималистичный (Полоски)</option>
              <option value="glass">Glass (В стеклянном блоке)</option>
              <option value="glow">Неоновый (Светящийся)</option>
            </select>
            <p className="text-xs text-white/40 mt-2">Дизайн полоски прогресса.</p>
          </div>
        </div>

        {/* Buttons List and Editor */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-lg font-medium mb-4">Настройка кнопок-ссылок</h3>
          {appConfig.buttons && appConfig.buttons.map((btn: any, index: number) => (
            <div key={btn.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mb-4 bg-white/5 p-4 rounded-xl relative">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-white/70 mb-1">Текст</label>
                <input
                  type="text"
                  value={btn.text}
                  onChange={(e) => {
                    const newButtons = [...appConfig.buttons];
                    newButtons[index].text = e.target.value;
                    setAppConfig({...appConfig, buttons: newButtons});
                  }}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-white/70 mb-1">Ссылка</label>
                <input
                  type="text"
                  value={btn.link}
                  onChange={(e) => {
                    const newButtons = [...appConfig.buttons];
                    newButtons[index].link = e.target.value;
                    setAppConfig({...appConfig, buttons: newButtons});
                  }}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-white/70 mb-1">Цвет HEX</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={btn.color}
                    onChange={(e) => {
                      const newButtons = [...appConfig.buttons];
                      newButtons[index].color = e.target.value;
                      setAppConfig({...appConfig, buttons: newButtons});
                    }}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={btn.color}
                    onChange={(e) => {
                      const newButtons = [...appConfig.buttons];
                      newButtons[index].color = e.target.value;
                      setAppConfig({...appConfig, buttons: newButtons});
                    }}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-2 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="col-span-1 flex gap-2">
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-white/70 mb-1">X (%)</label>
                  <input
                    type="number"
                    value={btn.x}
                    min="0" max="100"
                    onChange={(e) => {
                      const newButtons = [...appConfig.buttons];
                      newButtons[index].x = Number(e.target.value);
                      setAppConfig({...appConfig, buttons: newButtons});
                    }}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-3 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-white/70 mb-1">Y (%)</label>
                  <input
                    type="number"
                    value={btn.y}
                    min="0" max="100"
                    onChange={(e) => {
                      const newButtons = [...appConfig.buttons];
                      newButtons[index].y = Number(e.target.value);
                      setAppConfig({...appConfig, buttons: newButtons});
                    }}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => {
                    const newButtons = appConfig.buttons.filter((_: any, i: number) => i !== index);
                    setAppConfig({...appConfig, buttons: newButtons});
                  }}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-sm transition-colors w-full"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              const newButtons = appConfig.buttons ? [...appConfig.buttons] : [];
              newButtons.push({
                id: `btn-${Date.now()}`,
                text: 'Новая кнопка',
                link: 'https://',
                color: '#ffffff',
                x: 50,
                y: 50
              });
              setAppConfig({...appConfig, buttons: newButtons});
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors mt-2"
          >
            + Добавить кнопку
          </button>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleConfigSave}
            disabled={isSavingConfig}
            className="flex items-center justify-center px-6 py-3 bg-[#9966ff] hover:bg-[#8545ff] text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {isSavingConfig ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );
}
