'use client';

import React from 'react';
import { AvatarConfig } from '@/types/game';

interface PixelAvatarProps {
  config?: Partial<AvatarConfig>;
  size?: number;
  className?: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#A87A5B', // Medium warm skin from reference screenshot
  hairColor: '#221E1F', // Dark curly hair
  hairStyle: 'afro',
  shirtColor: '#4A464D', // Dark charcoal/grey tunic
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
  const darkOutline = '#1A181C';
  const shadowSkin = '#8C5E43';
  const pants = '#353238';
  const shoes = '#1A181C';
  const eyes = '#111012';

  // 16x16 pixel-art layout matching the cute retro sprite in the user's screenshot
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`shape-pixel-art ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Head / Hair Shape */}
      {finalConfig.hairStyle === 'afro' && (
        <>
          {/* Afro curls top */}
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
          <rect x="3" y="5" width="3" height="5" fill={hair} />
          <rect x="10" y="5" width="3" height="5" fill={hair} />
        </>
      )}

      {/* Face Base */}
      <rect x="5" y="5" width="6" height="5" fill={skin} />
      <rect x="6" y="10" width="4" height="1" fill={skin} />

      {/* Ears */}
      <rect x="4" y="6" width="1" height="2" fill={skin} />
      <rect x="11" y="6" width="1" height="2" fill={skin} />

      {/* Eyes */}
      <rect x="6" y="6" width="1" height="2" fill={eyes} />
      <rect x="9" y="6" width="1" height="2" fill={eyes} />
      {/* Eye catchlight */}
      <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.7" />
      <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.7" />

      {/* Smile / Mouth */}
      <rect x="7" y="8" width="2" height="1" fill={shadowSkin} />

      {/* Neck */}
      <rect x="7" y="10" width="2" height="1" fill={shadowSkin} />

      {/* Shirt / Tunic */}
      <rect x="5" y="11" width="6" height="3" fill={shirt} />
      <rect x="6" y="11" width="4" height="1" fill="#3D3A40" />

      {/* Arms & Hands */}
      <rect x="4" y="11" width="1" height="2" fill={shirt} />
      <rect x="11" y="11" width="1" height="2" fill={shirt} />
      <rect x="4" y="13" width="1" height="1" fill={skin} />
      <rect x="11" y="13" width="1" height="1" fill={skin} />

      {/* Pants */}
      <rect x="6" y="14" width="4" height="1" fill={pants} />

      {/* Legs & Shoes */}
      <rect x="6" y="15" width="1" height="1" fill={shoes} />
      <rect x="9" y="15" width="1" height="1" fill={shoes} />
    </svg>
  );
};
