"use client";

import React from 'react';

interface LogoProps {
  variant?: 'wordmark' | 'symbol';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'wordmark', size = 'md' }: LogoProps) {
  const fontSizes = {
    sm: { wordmark: '1.1rem', symbol: '1.2rem' },
    md: { wordmark: '1.5rem', symbol: '1.6rem' },
    lg: { wordmark: '2rem', symbol: '2.2rem' },
  };

  const currentSize = fontSizes[size];

  if (variant === 'symbol') {
    return (
      <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, color: '#00C896', fontSize: currentSize.symbol }}>
        Ξ
      </span>
    );
  }

  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
      <span
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 700,
          color: '#00C896',
          letterSpacing: '-0.5px',
          fontSize: currentSize.wordmark,
        }}
      >
        ETH
      </span>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          color: 'var(--foreground)',
          letterSpacing: '-0.5px',
          fontSize: currentSize.wordmark,
        }}
      >
        Shala
      </span>
    </span>
  );
}
