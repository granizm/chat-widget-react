'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import type { UseChatOptions } from 'ai/react';
import type { CSSProperties, ReactNode } from 'react';

// ── Types ──

interface ChatWidgetTheme {
  primaryColor?: string;
  backgroundColor?: string;
  botMessageBackground?: string;
  botMessageColor?: string;
  userMessageColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  messageBorderRadius?: number;
}

interface ChatWidgetLabels {
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  sendButtonText?: string;
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

// ── Defaults ──

const DEFAULT_THEME: Required<ChatWidgetTheme> = {
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  botMessageBackground: '#f1f5f9',
  botMessageColor: '#1e293b',
  userMessageColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  borderRadius: 16,
  messageBorderRadius: 16,
};

const DEFAULT_LABELS: Required<ChatWidgetLabels> = {
  title: 'AI Assistant',
  subtitle: '',
  inputPlaceholder: 'Type a message...',
  sendButtonText: 'Send',
  welcomeMessage: 'Hello! How can I help you today?',
  typingText: 'Typing...',
};

// ── Styles injection ──

const STYLE_ID = 'chat-widget-styles';
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes cwr-fadeIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cwr-slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cwr-spin { to { transform:rotate(360deg) } }
    @keyframes cwr-bounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
  `;
  document.head.appendChild(style);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Component ──

export function ChatWidget({
  webhookUrl,
  chatOptions,
  theme: themeProp,
  labels: labelsProp,
  windowWidth = 400,
  windowHeight = 560,
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

  const toggleOpen = useCallback(() => {
    setOpen((prev) => { const next = !prev; if (next) onOpen?.(); else onClose?.(); return next; });
  }, [onOpen, onClose]);

  const positionStyle = position === 'bottom-left' ? { left: 20, bottom: 20 } : { right: 20, bottom: 20 };
  const windowPositionStyle = position === 'bottom-left' ? { left: 0, bottom: buttonSize + 12 } : { right: 0, bottom: buttonSize + 12 };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className={className} style={{ position: 'fixed', zIndex: 99999, fontFamily: theme.fontFamily, ...positionStyle, ...style }}>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', ...windowPositionStyle, width: windowWidth, height: windowHeight,
          borderRadius: theme.borderRadius, backgroundColor: theme.backgroundColor,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'cwr-slideUp 0.25s ease-out',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${adjustColor(theme.primaryColor, -20)})`,
            color: '#fff', borderTopLeftRadius: theme.borderRadius, borderTopRightRadius: theme.borderRadius,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{labels.title}</div>
              {labels.subtitle && <div style={{ fontSize: 12, opacity: 0.85 }}>{labels.subtitle}</div>}
            </div>
            <button onClick={toggleOpen} aria-label="Close chat" style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, backgroundColor: theme.backgroundColor }}>
            {messages.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', flex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: `${theme.primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primaryColor} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{labels.welcomeMessage}</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12, animation: 'cwr-fadeIn 0.2s ease-out' }}>
                  {m.role !== 'user' && (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: theme.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, marginTop: 2 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                  )}
                  <div style={{
                    maxWidth: '78%', padding: '10px 14px',
                    borderRadius: theme.messageBorderRadius,
                    backgroundColor: m.role === 'user' ? theme.primaryColor : theme.botMessageBackground,
                    color: m.role === 'user' ? theme.userMessageColor : theme.botMessageColor,
                    fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    ...(m.role === 'user' ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }),
                  }}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: theme.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div style={{ padding: '10px 16px', backgroundColor: theme.botMessageBackground, borderRadius: 16, borderBottomLeftRadius: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <span style={{ display: 'flex', gap: 3 }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#9ca3af', display: 'inline-block', animation: `cwr-bounce 1.2s ease-in-out ${i*0.15}s infinite` }} />)}
                  </span>
                  <span style={{ marginLeft: 4 }}>{labels.typingText}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8,
            alignItems: 'flex-end', backgroundColor: '#fff',
            borderBottomLeftRadius: theme.borderRadius, borderBottomRightRadius: theme.borderRadius,
          }}>
            <textarea ref={textareaRef} value={input} onChange={handleInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim() && !isLoading) handleSubmit(e as unknown as React.FormEvent); } }}
              placeholder={labels.inputPlaceholder} rows={1} disabled={isLoading}
              style={{
                flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 12,
                fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none',
                lineHeight: 1.5, maxHeight: 120,
              }}
            />
            <button type="submit" disabled={!input.trim() || isLoading} style={{
              padding: '10px 16px', backgroundColor: !input.trim() || isLoading ? '#d1d5db' : theme.primaryColor,
              color: '#fff', border: 'none', borderRadius: 12,
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            }}>
              {isLoading ? (
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'cwr-spin 0.6s linear infinite' }} />
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>{labels.sendButtonText}</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button onClick={toggleOpen} aria-label={open ? 'Close chat' : 'Open chat'} style={{
        width: buttonSize, height: buttonSize, borderRadius: '50%', backgroundColor: theme.primaryColor,
        color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)', transition: 'transform 0.2s, box-shadow 0.2s', fontSize: 24,
      }}>
        {open
          ? (closeIcon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
          : (buttonIcon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
        }
      </button>
    </div>
  );
}
