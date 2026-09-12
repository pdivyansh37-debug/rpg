'use client';

import React from 'react';
import { Calendar, CheckCircle2, Gift, Plus } from 'lucide-react';
import { sound } from '@/lib/sound';

export type TabType = 'HABITS' | 'DAILIES' | 'TODOS' | 'REWARDS';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreateModal: () => void;
  todoCount?: number;
  rewardCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateModal,
  todoCount = 1,
  rewardCount = 1,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Container restricted to mobile width on larger screens for realistic app feel */}
      <div className="mx-auto max-w-lg relative">
        {/* Raised Center Diamond Floating Action Button */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-50">
          <button
            onClick={() => {
              sound.playClick();
              onOpenCreateModal();
            }}
            title="Create new task or reward"
            className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7C4DFF] text-white shadow-lg transition-transform active:scale-95 hover:scale-105 hover:bg-[#8A5BEF] rotate-45 border-4 border-white"
          >
            {/* Counter-rotate icon inside diamond */}
            <div className="-rotate-45">
              <Plus className="h-7 w-7 stroke-[3.5]" />
            </div>
          </button>
        </div>

        {/* Purple App Bar */}
        <nav className="flex h-16 w-full items-center justify-between bg-[#5D32A8] px-2 text-white shadow-2xl rounded-t-2xl">
          {/* Tab 1: Habits */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('HABITS');
            }}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-opacity ${
              activeTab === 'HABITS' ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-90'
            }`}
          >
            {/* Custom Plus/Minus Habit Icon */}
            <div className="flex h-5 w-6 items-center justify-center rounded border border-current text-[9px] font-black leading-none mb-0.5">
              <span className="mr-0.5">+</span>
              <span>-</span>
            </div>
            <span className="text-[11px] tracking-tight">Habits</span>
          </button>

          {/* Tab 2: Dailies */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('DAILIES');
            }}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-opacity mr-6 ${
              activeTab === 'DAILIES' ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-90'
            }`}
          >
            <Calendar className="h-5 w-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[11px] tracking-tight">Dailies</span>
          </button>

          {/* Space for the Center Diamond FAB */}
          <div className="w-8 shrink-0 pointer-events-none" />

          {/* Tab 3: To Do's */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('TODOS');
            }}
            className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-opacity ml-6 ${
              activeTab === 'TODOS' ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-90'
            }`}
          >
            <div className="relative">
              <CheckCircle2 className="h-5 w-5 mb-0.5 stroke-[2.2]" />
              {todoCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#9E8EF0] text-[9px] font-black text-white">
                  {todoCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">To Do's</span>
          </button>

          {/* Tab 4: Rewards */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('REWARDS');
            }}
            className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-opacity ${
              activeTab === 'REWARDS' ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-90'
            }`}
          >
            <div className="relative">
              <Gift className="h-5 w-5 mb-0.5 stroke-[2.2]" />
              {rewardCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#9E8EF0] text-[9px] font-black text-white">
                  {rewardCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Rewards</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
