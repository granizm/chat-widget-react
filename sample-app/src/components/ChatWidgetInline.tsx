'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import type { UseChatOptions } from 'ai/react';
import type { CSSProperties, ReactNode } from 'react';

// ── Types ──

interface ChatWidgetTheme {
  /** User message bubble color (Vercel default: #006cff) */
  userBubbleColor?: string;
  /** Background color of the chat window */
  backgroundColor?: string;
  /** Text color */
  foregroundColor?: string;
  /** Muted/secondary text color */
  mutedColor?: string;
  /** Border color */
  borderColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Border radius for the chat window */
  borderRadius?: number;
}

interface ChatWidgetLabels {
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  welcomeMessage?: string;
  typingText?: string;
}

interface ChatWidgetProps {
  webhookUrl: string;
  chatOptions?: Partial<UseChatOptions>;
  theme?: ChatWidgetTheme;
  labels?: ChatWidgetLabels;
  windowWidth?: number;
  windowHeight?: number;
  position?: 'bottom-right' | 'bottom-left';
  defaultOpen?: boolean;
  buttonIcon?: ReactNode;
  closeIcon?: ReactNode;
  buttonSize?: number;
  className?: string;
  style?: CSSProperties;
  onOpen?: () => void;
  onClose?: () => void;
}

// ── Defaults (Vercel AI Chatbot style) ──

const DEFAULT_THEME: Required<ChatWidgetTheme> = {
  userBubbleColor: '#006cff',
  backgroundColor: '#ffffff',
  foregroundColor: '#0a0a0a',
  mutedColor: '#737373',
  borderColor: '#e5e5e5',
  fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  borderRadius: 16,
};

const DEFAULT_LABELS: Required<ChatWidgetLabels> = {
  title: 'AI Assistant',
  subtitle: '',
  inputPlaceholder: 'Send a message...',
  welcomeMessage: 'How can I help you today?',
  typingText: '',
};

// ── Styles injection ──

const STYLE_ID = 'chat-widget-vercel-styles';
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes cwv-fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cwv-slideUp { from { opacity:0; transform:translateY(16px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
    @keyframes cwv-bounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
    @keyframes cwv-pulse { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
    .cwv-scrollbar::-webkit-scrollbar { width: 6px; }
    .cwv-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .cwv-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }
    .cwv-scrollbar::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
  `;
  document.head.appendChild(style);
}

// ── Component ──

export function ChatWidget({
  webhookUrl,
  chatOptions,
  theme: themeProp,
  labels: labelsProp,
  windowWidth = 420,
  windowHeight = 600,
  position = 'bottom-right',
  defaultOpen = false,
  buttonIcon,
  closeIcon,
  buttonSize = 56,
  className,
  style,
  onOpen,
  onClose,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stylesInjected = useRef(false);

  const theme: Required<ChatWidgetTheme> = { ...DEFAULT_THEME, ...themeProp };
  const labels: Required<ChatWidgetLabels> = { ...DEFAULT_LABELS, ...labelsProp };

  useEffect(() => {
    if (!stylesInjected.current) { injectStyles(); stylesInjected.current = true; }
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: webhookUrl,
    ...chatOptions,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [open]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => { const next = !prev; if (next) onOpen?.(); else onClose?.(); return next; });
  }, [onOpen, onClose]);

  const positionStyle = position === 'bottom-left' ? { left: 20, bottom: 20 } : { right: 20, bottom: 20 };
  const windowPositionStyle = position === 'bottom-left' ? { left: 0, bottom: buttonSize + 16 } : { right: 0, bottom: buttonSize + 16 };

  return (
    <div className={className} style={{ position: 'fixed', zIndex: 99999, fontFamily: theme.fontFamily, ...positionStyle, ...style }}>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', ...windowPositionStyle, width: windowWidth, height: windowHeight,
          borderRadius: theme.borderRadius, backgroundColor: theme.backgroundColor,
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'cwv-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: theme.foregroundColor,
        }}>

          {/* Header - minimal Vercel style */}
          <div style={{
            padding: '14px 16px',
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: theme.backgroundColor,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* AI icon with ring border (Vercel style) */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${theme.borderColor}`,
                backgroundColor: theme.backgroundColor,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.foregroundColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{labels.title}</div>
                {labels.subtitle && <div style={{ fontSize: 12, color: theme.mutedColor, lineHeight: 1.3 }}>{labels.subtitle}</div>}
              </div>
            </div>
            <button onClick={toggleOpen} aria-label="Close chat" style={{
              background: 'none', border: 'none', color: theme.mutedColor,
              width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = theme.foregroundColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.mutedColor; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="cwv-scrollbar" style={{
            flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
            backgroundColor: theme.backgroundColor,
          }}>
            {messages.length === 0 ? (
              /* Welcome - Vercel style centered */
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', textAlign: 'center',
                padding: '0 24px',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${theme.borderColor}`, marginBottom: 16,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.foregroundColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p style={{ color: theme.foregroundColor, fontSize: 16, fontWeight: 500, margin: '0 0 4px' }}>
                  {labels.title}
                </p>
                <p style={{ color: theme.mutedColor, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  {labels.welcomeMessage}
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: 10, marginBottom: 20,
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    animation: 'cwv-fadeIn 0.2s ease-out',
                  }}>
                    {/* Assistant avatar */}
                    {!isUser && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${theme.borderColor}`, marginTop: 2,
                        backgroundColor: theme.backgroundColor,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.foregroundColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                    )}

                    {/* Message content */}
                    <div style={{
                      maxWidth: '80%',
                      ...(isUser ? {
                        /* User: blue bubble with white text (Vercel style) */
                        backgroundColor: theme.userBubbleColor,
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: 20,
                        fontSize: 14,
                        lineHeight: 1.6,
                        wordBreak: 'break-word' as const,
                        whiteSpace: 'pre-wrap' as const,
                      } : {
                        /* Assistant: no background, clean text (Vercel style) */
                        backgroundColor: 'transparent',
                        color: theme.foregroundColor,
                        padding: 0,
                        fontSize: 14,
                        lineHeight: 1.7,
                        wordBreak: 'break-word' as const,
                        whiteSpace: 'pre-wrap' as const,
                      }),
                    }}>
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicator - Vercel style with pulsing dots */}
            {isLoading && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${theme.borderColor}`, marginTop: 2,
                  backgroundColor: theme.backgroundColor,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.foregroundColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 4, paddingTop: 8 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: theme.mutedColor,
                      display: 'inline-block',
                      animation: `cwv-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area - Vercel style */}
          <div style={{
            padding: '12px 16px 16px',
            backgroundColor: theme.backgroundColor,
          }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              border: `1px solid ${theme.borderColor}`,
              borderRadius: 12, padding: '8px 8px 8px 14px',
              backgroundColor: theme.backgroundColor,
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={(e) => {
              const form = e.currentTarget;
              form.style.borderColor = '#a3a3a3';
              form.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.04)';
            }}
            onBlur={(e) => {
              const form = e.currentTarget;
              if (!form.contains(e.relatedTarget as Node)) {
                form.style.borderColor = theme.borderColor;
                form.style.boxShadow = 'none';
              }
            }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder={labels.inputPlaceholder}
                rows={1}
                disabled={isLoading}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontSize: 14, lineHeight: 1.5, fontFamily: 'inherit',
                  backgroundColor: 'transparent', color: theme.foregroundColor,
                  maxHeight: 140, padding: '4px 0',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: !input.trim() || isLoading ? '#e5e5e5' : theme.foregroundColor,
                  color: !input.trim() || isLoading ? '#a3a3a3' : theme.backgroundColor,
                  border: 'none', cursor: !input.trim() || isLoading ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background-color 0.15s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button - clean dark style */}
      <button onClick={toggleOpen} aria-label={open ? 'Close chat' : 'Open chat'} style={{
        width: buttonSize, height: buttonSize, borderRadius: '50%',
        backgroundColor: '#0a0a0a', color: '#ffffff',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s',
        fontSize: 24,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)'; }}
      >
        {open
          ? (closeIcon || <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
          : (buttonIcon || <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
        }
      </button>
    </div>
  );
}
