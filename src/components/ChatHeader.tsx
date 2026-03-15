import React from 'react';
import type { ChatWidgetLabels } from '../types';

interface ChatHeaderProps {
  labels: Required<ChatWidgetLabels>;
  primaryColor: string;
  onClose: () => void;
  borderRadius: number;
}

export function ChatHeader({ labels, primaryColor, onClose, borderRadius }: ChatHeaderProps) {
  return (
    <div
      style={{
        padding: '16px 20px',
        background: `linear-gradient(135deg, ${primaryColor}, ${adjustColor(primaryColor, -20)})`,
        color: '#ffffff',
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
          {labels.title}
        </div>
        {labels.subtitle && (
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            {labels.subtitle}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Close chat"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: '#ffffff',
          width: 32,
          height: 32,
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.25)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
        }}
      >
        ✕
      </button>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
