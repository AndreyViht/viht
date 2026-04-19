import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Viht',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] font-sans antialiased">
      {children}
    </div>
  );
}
