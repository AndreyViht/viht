# Viht Site

## Деплой на Vercel

### 1. Залей на GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/ТВОЙ_АККАУНТ/viht-site.git
git push -u origin main
```

### 2. Vercel
1. Зайди на [vercel.com](https://vercel.com) → New Project → импортируй репо
2. В настройках проекта → **Environment Variables** добавь:
   - `NEXT_PUBLIC_ADMIN_PASS` = твой пароль (придумай свой, не дефолтный)
3. Deploy

### 3. Готово
- Главная: `https://твой-домен.vercel.app`
- Админка: `https://твой-домен.vercel.app/advihtminui`

## Локальный запуск
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Что делает админка
- Загрузка фото (сохраняется в localStorage браузера)
- Загрузка музыки (сохраняется в localStorage браузера)
- Редактирование заголовка и подзаголовка
- Пароль задаётся через env переменную

## ⚠️ Важно
localStorage работает только в том же браузере, где залито.  
Если нужно хранить файлы для всех пользователей → нужен Supabase Storage.  
Скажи — добавлю интеграцию.
