'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Shield, ShoppingBag, Terminal } from 'lucide-react';
import { sound } from '@/lib/sound';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Matrix Quests', icon: Swords },
    { href: '/character', label: 'Hero System', icon: Shield },
    { href: '/shop', label: 'Cyber Bazaar', icon: ShoppingBag },
  ];

  return (
    <nav className="flex items-center justify-center border-b border-indigo-950/80 bg-[#090714]/80 backdrop-blur-md px-3 py-2 sticky bottom-0 sm:static z-30">
      <div className="flex gap-1.5 sm:gap-2 font-mono text-xs">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => sound.playClick()}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 transition-all ${
                isActive
                  ? 'border border-cyan-400 bg-cyan-950/70 font-extrabold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'border border-transparent text-slate-400 hover:border-indigo-900 hover:bg-[#120b24] hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
