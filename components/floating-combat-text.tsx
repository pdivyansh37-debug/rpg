'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CombatTextEvent {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'XP' | 'GOLD' | 'DAMAGE' | 'HEAL' | 'COMBO' | 'LOOT' | 'CRIT';
}

interface FloatingCombatTextProps {
  events: CombatTextEvent[];
}

export const FloatingCombatText: React.FC<FloatingCombatTextProps> = ({ events }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden font-mono select-none">
      <AnimatePresence>
        {events.map((ev) => {
          let colorClass = 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]';
          let scaleAnim = [0.5, 1.3, 1.0];

          if (ev.type === 'DAMAGE') {
            colorClass = 'text-rose-400 font-black drop-shadow-[0_0_12px_rgba(244,63,94,1)] text-lg sm:text-xl';
            scaleAnim = [0.8, 1.5, 1.1];
          } else if (ev.type === 'HEAL') {
            colorClass = 'text-emerald-300 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]';
          } else if (ev.type === 'XP') {
            colorClass = 'text-cyan-300 font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]';
          } else if (ev.type === 'COMBO') {
            colorClass = 'text-purple-300 font-black drop-shadow-[0_0_14px_rgba(168,85,247,1)] text-lg';
            scaleAnim = [0.7, 1.4, 1.0];
          } else if (ev.type === 'LOOT') {
            colorClass = 'text-yellow-300 font-black drop-shadow-[0_0_14px_rgba(253,224,71,1)] text-base';
          }

          return (
            <motion.div
              key={ev.id}
              initial={{
                opacity: 0,
                scale: 0.5,
                x: ev.x,
                y: ev.y,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: scaleAnim,
                x: ev.x + (Math.random() * 40 - 20),
                y: ev.y - 70,
              }}
              transition={{
                duration: 1.1,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
              }}
              className={`text-sm sm:text-base font-extrabold tracking-tight ${colorClass}`}
            >
              {ev.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
