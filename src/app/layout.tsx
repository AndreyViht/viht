import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viht",
  description: "Следующее поколение приватности",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: "#000" }}>{children}</body>
    </html>
  );
}
