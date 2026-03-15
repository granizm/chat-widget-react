import React from 'react';

interface MessageBubbleProps {
  role: string;
  content: string;
  id: string;
  primaryColor: string;
  botMessageBackground: string;
  botMessageColor: string;
  userMessageColor: string;
  messageBorderRadius: number;
}

export function MessageBubble({
  role,
  content,
  primaryColor,
  botMessageBackground,
  botMessageColor,
  userMessageColor,
  messageBorderRadius,
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        animation: 'cwr-fadeIn 0.2s ease-out',
      }}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
            <circle cx="12" cy="17" r="4" />
          </svg>
        </div>
      )}

      <div
        style={{
          maxWidth: '78%',
          padding: '10px 14px',
          borderRadius: messageBorderRadius,
          backgroundColor: isUser ? primaryColor : botMessageBackground,
          color: isUser ? userMessageColor : botMessageColor,
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          ...(isUser
            ? { borderBottomRightRadius: 4 }
            : { borderBottomLeftRadius: 4 }),
        }}
      >
        {content}
      </div>
    </div>
  );
}
