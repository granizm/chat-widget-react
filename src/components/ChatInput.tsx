import React, { useRef, useEffect } from 'react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  primaryColor: string;
  placeholder: string;
  sendButtonText: string;
  borderRadius: number;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  primaryColor,
  placeholder,
  sendButtonText,
  borderRadius,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '10px 14px',
          border: '1px solid #d1d5db',
          borderRadius: 12,
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
          lineHeight: 1.5,
          maxHeight: 120,
          transition: 'border-color 0.15s',
          backgroundColor: isLoading ? '#f9fafb' : '#ffffff',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = primaryColor;
          e.target.style.boxShadow = `0 0 0 2px ${primaryColor}33`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        style={{
          padding: '10px 16px',
          backgroundColor: !input.trim() || isLoading ? '#d1d5db' : primaryColor,
          color: '#ffffff',
          border: 'none',
          borderRadius: 12,
          cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'inherit',
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
      >
        {isLoading ? (
          <span
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'cwr-spin 0.6s linear infinite',
            }}
          />
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            {sendButtonText}
          </>
        )}
      </button>
    </form>
  );
}
