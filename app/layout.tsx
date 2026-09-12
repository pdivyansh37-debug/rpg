import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life RPG - Gamified Productivity & Habit Progression',
  description: 'Transform mundane daily tasks into an epic RPG progression journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 relative`}>
        {/* Subtle Scanlines effect */}
        <div className="fixed inset-0 scanlines pointer-events-none z-50 opacity-40" />

        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
