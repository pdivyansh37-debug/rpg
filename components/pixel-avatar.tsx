'use client';

import React from 'react';
import { AvatarConfig } from '@/types/game';

interface PixelAvatarProps {
  config?: Partial<AvatarConfig>;
  size?: number;
  className?: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'MALE',
  skinColor: '#A87A5B', // Medium warm skin
  hairColor: '#221E1F', // Dark hair
  hairStyle: 'afro',
  shirtColor: '#4A464D', // Dark charcoal tunic
  bgGradient: 'bg-indigo-300',
};

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  config = {},
  size = 80,
  className = '',
}) => {
  const finalConfig: AvatarConfig = { ...DEFAULT_AVATAR, ...config };

  const skin = finalConfig.skinColor;
  const hair = finalConfig.hairColor;
  const shirt = finalConfig.shirtColor;
  const gender = finalConfig.gender || 'MALE';
  const shadowSkin = '#7E5539';
  const pants = '#2A272E';
  const shoes = '#121114';
  const eyes = '#111012';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`shape-pixel-art ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* -------------------- 1. HAIR / HELMET RENDERING -------------------- */}
      {finalConfig.hairStyle === 'afro' && (
        <>
          <rect x="5" y="1" width="6" height="2" fill={hair} />
          <rect x="4" y="2" width="8" height="4" fill={hair} />
          <rect x="3" y="3" width="10" height="3" fill={hair} />
          <rect x="3" y="6" width="3" height="3" fill={hair} />
          <rect x="10" y="6" width="3" height="3" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'short' && (
        <>
          <rect x="5" y="2" width="6" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="2" fill={hair} />
          <rect x="4" y="5" width="2" height="2" fill={hair} />
          <rect x="10" y="5" width="2" height="2" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'spiky' && (
        <>
          <rect x="5" y="1" width="2" height="2" fill={hair} />
          <rect x="8" y="1" width="3" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="3" fill={hair} />
          <rect x="3" y="4" width="2" height="3" fill={hair} />
          <rect x="11" y="4" width="2" height="3" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'long' && (
        <>
          <rect x="5" y="2" width="6" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="3" fill={hair} />
          <rect x="3" y="5" width="3" height="6" fill={hair} />
          <rect x="10" y="5" width="3" height="6" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'bob' && (
        <>
          <rect x="5" y="2" width="6" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="3" fill={hair} />
          <rect x="3" y="5" width="2" height="4" fill={hair} />
          <rect x="11" y="5" width="2" height="4" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'ponytail' && (
        <>
          <rect x="5" y="2" width="6" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="2" fill={hair} />
          {/* High combat ponytail rising on right side */}
          <rect x="11" y="1" width="2" height="2" fill={hair} />
          <rect x="12" y="2" width="2" height="5" fill={hair} />
          <rect x="4" y="5" width="2" height="2" fill={hair} />
        </>
      )}

      {finalConfig.hairStyle === 'braids' && (
        <>
          <rect x="5" y="2" width="6" height="2" fill={hair} />
          <rect x="4" y="3" width="8" height="2" fill={hair} />
          <rect x="3" y="5" width="2" height="6" fill={hair} />
          <rect x="11" y="5" width="2" height="6" fill={hair} />
          {/* Neon hair ties */}
          <rect x="3" y="8" width="2" height="1" fill="#00F0FF" />
          <rect x="11" y="8" width="2" height="1" fill="#00F0FF" />
        </>
      )}

      {finalConfig.hairStyle === 'cyber_helm' && (
        <>
          <rect x="4" y="1" width="8" height="5" fill="#334155" />
          <rect x="3" y="3" width="10" height="4" fill="#1E293B" />
          {/* Cybernetic Visor Glow */}
          <rect x="4" y="5" width="8" height="2" fill="#00F0FF" />
          <rect x="5" y="5" width="4" height="1" fill="#FFFFFF" opacity="0.8" />
        </>
      )}

      {/* -------------------- 2. FACE BASE & EARS -------------------- */}
      {finalConfig.hairStyle !== 'cyber_helm' && (
        <>
          <rect x="5" y="5" width="6" height="5" fill={skin} />
          <rect x="6" y="10" width="4" height="1" fill={skin} />

          {/* Ears */}
          <rect x="4" y="6" width="1" height="2" fill={skin} />
          <rect x="11" y="6" width="1" height="2" fill={skin} />

          {/* Cyborg Ear Augment */}
          {gender === 'CYBORG' && (
            <>
              <rect x="4" y="6" width="1" height="1" fill="#00F0FF" />
              <rect x="11" y="7" width="1" height="1" fill="#00F0FF" />
            </>
          )}

          {/* -------------------- 3. EYES & DETAILS -------------------- */}
          {gender === 'CYBORG' ? (
            <>
              {/* Left Eye: Normal */}
              <rect x="6" y="6" width="1" height="2" fill={eyes} />
              <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.7" />
              {/* Right Eye: Cybernetic Glowing Optic */}
              <rect x="9" y="6" width="2" height="2" fill="#00F0FF" />
              <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <rect x="6" y="6" width="1" height="2" fill={eyes} />
              <rect x="9" y="6" width="1" height="2" fill={eyes} />
              <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.7" />
              <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.7" />
            </>
          )}

          {/* Female Aesthetic details: Lashes & Cute Soft Blush */}
          {gender === 'FEMALE' && (
            <>
              {/* Eyelash wings */}
              <rect x="5" y="5" width="1" height="1" fill={eyes} />
              <rect x="10" y="5" width="1" height="1" fill={eyes} />
              {/* Soft pink blush */}
              <rect x="5" y="8" width="1" height="1" fill="#F43F5E" opacity="0.45" />
              <rect x="10" y="8" width="1" height="1" fill="#F43F5E" opacity="0.45" />
            </>
          )}

          {/* Smile / Mouth */}
          <rect x="7" y="8" width="2" height="1" fill={shadowSkin} />

          {/* Neck */}
          <rect x="7" y="10" width="2" height="1" fill={shadowSkin} />
        </>
      )}

      {/* -------------------- 4. SHIRT / CHASSIS -------------------- */}
      <rect x="5" y="11" width="6" height="3" fill={shirt} />
      <rect x="6" y="11" width="4" height="1" fill="#2E2B33" />

      {/* Arms & Hands */}
      <rect x="4" y="11" width="1" height="2" fill={shirt} />
      <rect x="11" y="11" width="1" height="2" fill={shirt} />
      <rect x="4" y="13" width="1" height="1" fill={skin} />
      <rect x="11" y="13" width="1" height="1" fill={skin} />

      {/* -------------------- 5. PANTS & SHOES -------------------- */}
      <rect x="6" y="14" width="4" height="1" fill={pants} />
      <rect x="6" y="15" width="1" height="1" fill={shoes} />
      <rect x="9" y="15" width="1" height="1" fill={shoes} />
    </svg>
  );
};
