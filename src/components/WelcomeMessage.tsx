import React from 'react';

interface WelcomeMessageProps {
  message: string;
  primaryColor: string;
}

export function WelcomeMessage({ message, primaryColor }: WelcomeMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        flex: 1,
      }}
    >
      {/* Bot icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: `${primaryColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 260 }}>
        {message}
      </p>
    </div>
  );
}
