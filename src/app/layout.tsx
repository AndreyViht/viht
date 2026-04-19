import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viht",
  description: "Viht",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Space+Mono&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#000", fontFamily: "'Sora', sans-serif" }}>{children}</body>
    </html>
  );
}
