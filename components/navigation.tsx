'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scroll, Shield, ShoppingBag } from 'lucide-react';
import { sound } from '@/lib/sound';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Quests Hub', icon: Scroll },
    { href: '/character', label: 'Hero Sheet', icon: Shield },
    { href: '/shop', label: 'Item Shop', icon: ShoppingBag },
  ];

  return (
    <nav className="flex items-center justify-center border-b border-slate-800 bg-slate-950/60 px-4 py-2">
      <div className="flex gap-2 font-mono text-xs">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => sound.playClick()}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                isActive
                  ? 'border border-amber-400/80 bg-amber-950/50 font-bold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                  : 'border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
