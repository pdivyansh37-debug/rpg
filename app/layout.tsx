import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Life RPG - Gamified Habit Tracker & Productivity',
  description: 'Gamify your habits, daily routines, and to-do lists in retro 16-bit cyber RPG style.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-[#070514] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950`}
      >
        {children}
      </body>
    </html>
  );
}
