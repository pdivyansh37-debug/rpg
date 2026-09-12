'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Shield, Sparkles, Lock, ArrowDown, ChevronRight, Check } from 'lucide-react';
import { SkillNode } from '@/types/game';
import { sound } from '@/lib/sound';

interface NeuralSkillTreeProps {
  unspentPoints: number;
  onUpgradeNode?: (nodeId: string) => void;
}

const INITIAL_NODES: SkillNode[] = [
  {
    id: 'node-root',
    title: 'Chrono-Synapse Core',
    tier: 1,
    maxTier: 1,
    unlocked: true,
    cost: 0,
    description: 'Central neural hub. Accelerates passive XP gain by +10%.',
    icon: 'cpu',
    category: 'CORE',
  },
  {
    id: 'node-attack',
    title: 'Paradox Scythe-Hex',
    tier: 2,
    maxTier: 5,
    unlocked: true,
    cost: 1,
    description: 'Strikes deal +25% critical damage during World Boss Raids.',
    icon: 'zap',
    category: 'ATTACK',
  },
  {
    id: 'node-defense',
    title: 'Cognitive Shield',
    tier: 1,
    maxTier: 3,
    unlocked: true,
    cost: 1,
    description: 'Absorbs 50% damage from missed daily tasks.',
    icon: 'shield',
    category: 'DEFENSE',
  },
  {
    id: 'node-flow',
    title: 'Hyperfocus Flow Arc',
    tier: 2,
    maxTier: 5,
    unlocked: true,
    cost: 1,
    description: 'Reduces habit cool-down and doubles gold generation on 90m deep work blocks.',
    icon: 'sparkles',
    category: 'FOCUS',
  },
  {
    id: 'node-dilation',
    title: 'Quantum Time Dilation',
    tier: 0,
    maxTier: 3,
    unlocked: false,
    cost: 2,
    description: 'Grants an extra 24-hour grace buffer before streak decay.',
    icon: 'lock',
    category: 'FOCUS',
  },
];

export const NeuralSkillTree: React.FC<NeuralSkillTreeProps> = ({
  unspentPoints,
  onUpgradeNode,
}) => {
  const [nodes, setNodes] = useState<SkillNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<SkillNode>(INITIAL_NODES[3]);

  const handleUpgrade = (node: SkillNode) => {
    if (unspentPoints < node.cost || node.tier >= node.maxTier) return;

    sound.playSkillUnlock();
    setNodes((prev) =>
      prev.map((n) =>
        n.id === node.id ? { ...n, tier: n.tier + 1, unlocked: true } : n
      )
    );
    setSelectedNode((prev) => ({ ...prev, tier: prev.tier + 1, unlocked: true }));
    onUpgradeNode?.(node.id);
  };

  return (
    <div className="rounded-3xl border-2 border-[#201D48] bg-gradient-to-b from-[#130E29] to-[#0A0718] p-5 shadow-2xl font-mono text-slate-100">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#241F50]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black tracking-wider text-white uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            Neural Circuit Skill Tree
          </h3>
        </div>
        <span className="text-[11px] text-cyan-300 font-bold">
          ACTIVE NODES: 4 / 8
        </span>
      </div>

      {/* Visual Tree Nodes Grid */}
      <div className="mt-4 flex flex-col items-center space-y-3">
        {/* Root Core Node */}
        <button
          onClick={() => {
            sound.playClick();
            setSelectedNode(nodes[0]);
          }}
          className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 transition-all ${
            selectedNode.id === nodes[0].id
              ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_15px_rgba(0,240,255,0.4)] text-cyan-300'
              : 'border-[#262058] bg-[#120B28] text-slate-300 hover:border-cyan-700'
          }`}
        >
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-black tracking-tight">{nodes[0].title}</span>
          <span className="text-[10px] bg-cyan-900/80 text-cyan-300 px-1.5 py-0.5 rounded">
            CORE
          </span>
        </button>

        {/* Tree Branch Connector */}
        <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-500" />

        {/* Level 2 Branch Nodes */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {nodes.slice(1, 3).map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedNode(node);
                }}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/80 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-purple-200'
                    : 'border-[#241D52] bg-[#100B24] text-slate-400 hover:border-purple-700'
                }`}
              >
                {node.category === 'ATTACK' ? (
                  <Zap className="w-4 h-4 text-amber-400" />
                ) : (
                  <Shield className="w-4 h-4 text-cyan-400" />
                )}
                <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                  {node.title}
                </span>
                <span className="text-[9px] font-black text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/40">
                  TIER {node.tier}/{node.maxTier}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tree Branch Connector */}
        <div className="h-4 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />

        {/* Level 3 Nodes */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {nodes.slice(3, 5).map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedNode(node);
                }}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                  !node.unlocked
                    ? 'border-[#1C173E] bg-[#0A0718] text-slate-600 opacity-60'
                    : isSelected
                    ? 'border-pink-400 bg-pink-950/80 shadow-[0_0_15px_rgba(255,42,133,0.4)] text-pink-200'
                    : 'border-[#241D52] bg-[#100B24] text-slate-400 hover:border-pink-700'
                }`}
              >
                {!node.unlocked ? (
                  <Lock className="w-4 h-4 text-slate-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-pink-400" />
                )}
                <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                  {node.title}
                </span>
                <span className="text-[9px] font-black text-pink-300 bg-pink-950/80 px-1.5 py-0.2 rounded border border-pink-500/40">
                  {node.unlocked ? `TIER ${node.tier}/${node.maxTier}` : 'LOCKED'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & Upgrade Box */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-4 rounded-2xl border border-cyan-500/50 bg-[#0E0A22] p-4 space-y-2.5 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-300">
                {selectedNode.title}
              </span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/60 px-2 py-0.5 rounded-lg">
                LEVEL {selectedNode.tier} / {selectedNode.maxTier}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {selectedNode.description}
            </p>

            <button
              onClick={() => handleUpgrade(selectedNode)}
              disabled={unspentPoints < selectedNode.cost || selectedNode.tier >= selectedNode.maxTier}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all ${
                selectedNode.tier >= selectedNode.maxTier
                  ? 'bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 cursor-default'
                  : unspentPoints >= selectedNode.cost
                  ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-95'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {selectedNode.tier >= selectedNode.maxTier ? (
                <>
                  <Check className="w-3.5 h-3.5" /> MAXIMUM LEVEL REACHED
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  UPGRADE NODE ({selectedNode.cost} SP REQUIRED)
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
