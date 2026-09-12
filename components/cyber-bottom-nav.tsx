'use client';

import React from 'react';
import { Swords, Activity, ShoppingBag, Skull, Plus } from 'lucide-react';
import { sound } from '@/lib/sound';

export type MainTabType = 'QUESTS' | 'ATTRIBUTES' | 'ARMORY' | 'BOSS';

interface CyberBottomNavProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onOpenCreateQuest?: () => void;
}

export const CyberBottomNav: React.FC<CyberBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateQuest,
}) => {
  const tabs = [
    { key: 'QUESTS', label: 'Quests', icon: Swords },
    { key: 'ATTRIBUTES', label: 'Attributes', icon: Activity },
    { key: 'ARMORY', label: 'Armory', icon: ShoppingBag },
    { key: 'BOSS', label: 'World Boss', icon: Skull },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-lg relative">
        <nav className="flex h-16 w-full items-center justify-around border-t-2 border-slate-200 dark:border-[#262058] bg-white/95 dark:bg-[#090616]/95 backdrop-blur-md px-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-5px_25px_rgba(0,0,0,0.7)] transition-colors duration-200">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(key as MainTabType);
                }}
                className={`flex flex-1 flex-col items-center justify-center py-1 transition-all ${
                  isActive
                    ? 'font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] scale-105'
                    : 'hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`h-5 w-5 mb-0.5 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                />
                <span>{label}</span>

                {isActive && (
                  <span className="mt-0.5 h-1 w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
