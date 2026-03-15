import React from 'react';

interface TypingIndicatorProps {
  primaryColor: string;
  botMessageBackground: string;
  text: string;
}

export function TypingIndicator({ primaryColor, botMessageBackground, text }: TypingIndicatorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      {/* Bot avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="17" r="4" />
        </svg>
      </div>

      <div
        style={{
          padding: '10px 16px',
          backgroundColor: botMessageBackground,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#6b7280',
        }}
      >
        <span style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#9ca3af',
                display: 'inline-block',
                animation: `cwr-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </span>
        <span style={{ marginLeft: 4 }}>{text}</span>
      </div>
    </div>
  );
}
