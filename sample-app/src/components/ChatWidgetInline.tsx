'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import type { UseChatOptions } from 'ai/react';
import type { CSSProperties, ReactNode } from 'react';

// ── Types ──

interface ChatWidgetTheme {
  /** User message bubble color (Vercel default: #006cff) */
  userBubbleColor?: string;
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

// ── Dark / Light token sets ──

interface ColorTokens {
  bg: string;
  fg: string;
  muted: string;
  border: string;
  hoverBg: string;
  inputBg: string;
  shadow: string;
  scrollThumb: string;
  scrollThumbHover: string;
  disabledBg: string;
  disabledFg: string;
  buttonBg: string;
  buttonFg: string;
}

const LIGHT_TOKENS: ColorTokens = {
  bg: '#ffffff',
  fg: '#0a0a0a',
  muted: '#737373',
  border: '#e5e5e5',
  hoverBg: '#f5f5f5',
  inputBg: '#ffffff',
  shadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1)',
  scrollThumb: '#d4d4d4',
  scrollThumbHover: '#a3a3a3',
  disabledBg: '#e5e5e5',
  disabledFg: '#a3a3a3',
  buttonBg: '#0a0a0a',
  buttonFg: '#ffffff',
};

const DARK_TOKENS: ColorTokens = {
  bg: '#0a0a0a',
  fg: '#fafafa',
  muted: '#a3a3a3',
  border: '#262626',
  hoverBg: '#262626',
  inputBg: '#0a0a0a',
  shadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 8px 24px -8px rgba(0,0,0,0.4)',
  scrollThumb: '#404040',
  scrollThumbHover: '#525252',
  disabledBg: '#262626',
  disabledFg: '#525252',
  buttonBg: '#fafafa',
  buttonFg: '#0a0a0a',
};

// ── Defaults ──

const DEFAULT_THEME: Required<ChatWidgetTheme> = {
  userBubbleColor: '#006cff',
  fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  borderRadius: 16,
};

const DEFAULT_LABELS: Required<ChatWidgetLabels> = {
  title: 'AI Assistant',
  subtitle: '',
  inputPlaceholder: 'Send a message...',
  welcomeMessage: 'How can I help you today?',
};

// ── Styles injection ──

function injectStyles(isDark: boolean) {
  const STYLE_ID = 'chat-widget-vercel-styles';
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  const tokens = isDark ? DARK_TOKENS : LIGHT_TOKENS;
  el.textContent = `
    @keyframes cwv-fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cwv-slideUp { from { opacity:0; transform:translateY(16px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
    @keyframes cwv-bounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
    .cwv-scrollbar::-webkit-scrollbar { width: 6px; }
    .cwv-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .cwv-scrollbar::-webkit-scrollbar-thumb { background: ${tokens.scrollThumb}; border-radius: 3px; }
    .cwv-scrollbar::-webkit-scrollbar-thumb:hover { background: ${tokens.scrollThumbHover}; }
  `;
}

// ── Detect dark mode ──

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const htmlDark = document.documentElement.classList.contains('dark');
      const mediaDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(htmlDark || mediaDark);
    };
    check();

    // Observe class changes on <html>
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Listen for system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', check);

    return () => { observer.disconnect(); mq.removeEventListener('change', check); };
  }, []);

  return isDark;
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
  const isDark = useDarkMode();

  const theme: Required<ChatWidgetTheme> = { ...DEFAULT_THEME, ...themeProp };
  const labels: Required<ChatWidgetLabels> = { ...DEFAULT_LABELS, ...labelsProp };
  const c: ColorTokens = isDark ? DARK_TOKENS : LIGHT_TOKENS;

  useEffect(() => {
    if (typeof document !== 'undefined') injectStyles(isDark);
  }, [isDark]);

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

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [open]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => { const next = !prev; if (next) onOpen?.(); else onClose?.(); return next; });
  }, [onOpen, onClose]);

  const positionStyle = position === 'bottom-left' ? { left: 20, bottom: 20 } : { right: 20, bottom: 20 };
  const windowPositionStyle = position === 'bottom-left' ? { left: 0, bottom: buttonSize + 16 } : { right: 0, bottom: buttonSize + 16 };

  // Vercel layers icon
  const LayersIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c.fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  );

  return (
    <div className={className} style={{ position: 'fixed', zIndex: 99999, fontFamily: theme.fontFamily, ...positionStyle, ...style }}>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', ...windowPositionStyle, width: windowWidth, height: windowHeight,
          borderRadius: theme.borderRadius, backgroundColor: c.bg,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadow,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'cwv-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: c.fg, transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: `1px solid ${c.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: c.bg, transition: 'background-color 0.3s, border-color 0.3s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${c.border}`, backgroundColor: c.bg,
                transition: 'background-color 0.3s, border-color 0.3s',
              }}>
                <LayersIcon />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{labels.title}</div>
                {labels.subtitle && <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.3 }}>{labels.subtitle}</div>}
              </div>
            </div>
            <button onClick={toggleOpen} aria-label="Close chat" style={{
              background: 'none', border: 'none', color: c.muted,
              width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = c.hoverBg; e.currentTarget.style.color = c.fg; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = c.muted; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="cwv-scrollbar" style={{
            flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
            backgroundColor: c.bg, transition: 'background-color 0.3s',
          }}>
            {messages.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${c.border}`, marginBottom: 16,
                  transition: 'border-color 0.3s',
                }}>
                  <LayersIcon size={24} />
                </div>
                <p style={{ color: c.fg, fontSize: 16, fontWeight: 500, margin: '0 0 4px' }}>{labels.title}</p>
                <p style={{ color: c.muted, fontSize: 14, margin: 0, lineHeight: 1.5 }}>{labels.welcomeMessage}</p>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    animation: 'cwv-fadeIn 0.2s ease-out',
                  }}>
                    {!isUser && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${c.border}`, marginTop: 2, backgroundColor: c.bg,
                        transition: 'background-color 0.3s, border-color 0.3s',
                      }}>
                        <LayersIcon size={14} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '80%',
                      ...(isUser ? {
                        backgroundColor: theme.userBubbleColor,
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: 20,
                        fontSize: 14, lineHeight: 1.6,
                        wordBreak: 'break-word' as const, whiteSpace: 'pre-wrap' as const,
                      } : {
                        backgroundColor: 'transparent',
                        color: c.fg,
                        padding: 0,
                        fontSize: 14, lineHeight: 1.7,
                        wordBreak: 'break-word' as const, whiteSpace: 'pre-wrap' as const,
                      }),
                    }}>
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${c.border}`, marginTop: 2, backgroundColor: c.bg,
                }}>
                  <LayersIcon size={14} />
                </div>
                <div style={{ display: 'flex', gap: 4, paddingTop: 8 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', backgroundColor: c.muted,
                      display: 'inline-block',
                      animation: `cwv-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: '12px 16px 16px', backgroundColor: c.bg, transition: 'background-color 0.3s' }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              border: `1px solid ${c.border}`, borderRadius: 12,
              padding: '8px 8px 8px 14px', backgroundColor: c.inputBg,
              transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.3s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = c.muted;
              e.currentTarget.style.boxShadow = `0 0 0 1px ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`;
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                e.currentTarget.style.borderColor = c.border;
                e.currentTarget.style.boxShadow = 'none';
              }
            }}>
              <textarea
                ref={textareaRef} value={input} onChange={handleInputChange}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim() && !isLoading) handleSubmit(e as unknown as React.FormEvent); } }}
                placeholder={labels.inputPlaceholder} rows={1} disabled={isLoading}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontSize: 14, lineHeight: 1.5, fontFamily: 'inherit',
                  backgroundColor: 'transparent', color: c.fg,
                  maxHeight: 140, padding: '4px 0',
                }}
              />
              <button type="submit" disabled={!input.trim() || isLoading} style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: !input.trim() || isLoading ? c.disabledBg : c.fg,
                color: !input.trim() || isLoading ? c.disabledFg : c.bg,
                border: 'none', cursor: !input.trim() || isLoading ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background-color 0.15s, color 0.15s',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button onClick={toggleOpen} aria-label={open ? 'Close chat' : 'Open chat'} style={{
        width: buttonSize, height: buttonSize, borderRadius: '50%',
        backgroundColor: c.buttonBg, color: c.buttonFg,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 16px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.18)'}, 0 0 0 1px ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s, background-color 0.3s',
        fontSize: 24,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open
          ? (closeIcon || <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
          : (buttonIcon || <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
        }
      </button>
    </div>
  );
}
