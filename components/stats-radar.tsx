'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RadarStats } from '@/types/game';

interface StatsRadarProps {
  stats: RadarStats;
  maxVal?: number;
  size?: number;
}

export const StatsRadar: React.FC<StatsRadarProps> = ({
  stats,
  maxVal = 25,
  size = 260,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  // 6 Axes: STR, INT, STA, AGI, SYN, VOID
  const axes = [
    { key: 'str', label: 'STR', val: stats.str, angle: -Math.PI / 2 },
    { key: 'int', label: 'INT', val: stats.int, angle: -Math.PI / 6 },
    { key: 'sta', label: 'STA', val: stats.sta, angle: Math.PI / 6 },
    { key: 'agi', label: 'AGI', val: stats.agi, angle: Math.PI / 2 },
    { key: 'syn', label: 'SYN', val: stats.syn, angle: (5 * Math.PI) / 6 },
    { key: 'void', label: 'VOID', val: stats.void, angle: (-5 * Math.PI) / 6 },
  ];

  // Calculate polygon points for grid rings (25%, 50%, 75%, 100%)
  const getRingPoints = (scale: number) => {
    return axes
      .map(({ angle }) => {
        const x = center + radius * scale * Math.cos(angle);
        const y = center + radius * scale * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Calculate polygon points for stats
  const statPoints = axes
    .map(({ val, angle }) => {
      const normalized = Math.min(1, Math.max(0.15, val / maxVal));
      const x = center + radius * normalized * Math.cos(angle);
      const y = center + radius * normalized * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex items-center justify-center p-2 select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#7C4DFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.05" />
          </radialGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Web Rings */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <polygon
            key={i}
            points={getRingPoints(scale)}
            fill="none"
            stroke="#26234D"
            strokeWidth="1.2"
            strokeDasharray={scale === 1 ? 'none' : '3 3'}
          />
        ))}

        {/* Axis Lines */}
        {axes.map(({ angle }, i) => {
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#26234D"
              strokeWidth="1"
            />
          );
        })}

        {/* Dynamic Stat Polygon Fill */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          points={statPoints}
          fill="url(#radarGradient)"
          stroke="#00F0FF"
          strokeWidth="2.5"
          filter="url(#neonGlow)"
        />

        {/* Vertices Dots */}
        {axes.map(({ val, angle }, i) => {
          const normalized = Math.min(1, Math.max(0.15, val / maxVal));
          const cx = center + radius * normalized * Math.cos(angle);
          const cy = center + radius * normalized * Math.sin(angle);

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill="#00F0FF"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels around perimeter */}
        {axes.map(({ label, val, angle }, i) => {
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          return (
            <g key={i} className="font-mono text-[11px] font-black">
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#E2E8F0"
                className="drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]"
              >
                {label} ({val})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
