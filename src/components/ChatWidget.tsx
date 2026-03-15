import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import type { ChatWidgetProps, ChatWidgetLabels, ChatWidgetTheme } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeMessage } from './WelcomeMessage';
import { injectStyles } from '../styles/inject';

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
  renderHeader,
  renderMessage,
  renderInput,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stylesInjected = useRef(false);

  const theme: Required<ChatWidgetTheme> = { ...DEFAULT_THEME, ...themeProp };
  const labels: Required<ChatWidgetLabels> = { ...DEFAULT_LABELS, ...labelsProp };

  // Inject CSS animations on mount
  useEffect(() => {
    if (!stylesInjected.current) {
      injectStyles();
      stylesInjected.current = true;
    }
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: webhookUrl,
    ...chatOptions,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      else onClose?.();
      return next;
    });
  }, [onOpen, onClose]);

  const positionStyle =
    position === 'bottom-left'
      ? { left: 20, bottom: 20 }
      : { right: 20, bottom: 20 };

  const windowPositionStyle =
    position === 'bottom-left'
      ? { left: 0, bottom: buttonSize + 12 }
      : { right: 0, bottom: buttonSize + 12 };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        zIndex: 99999,
        fontFamily: theme.fontFamily,
        ...positionStyle,
        ...style,
      }}
    >
      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'absolute',
            ...windowPositionStyle,
            width: windowWidth,
            height: windowHeight,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.backgroundColor,
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'cwr-slideUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          {renderHeader ? (
            renderHeader({ labels, onClose: toggleOpen })
          ) : (
            <ChatHeader
              labels={labels}
              primaryColor={theme.primaryColor}
              onClose={toggleOpen}
              borderRadius={theme.borderRadius}
            />
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              backgroundColor: theme.backgroundColor,
            }}
          >
            {messages.length === 0 ? (
              <WelcomeMessage
                message={labels.welcomeMessage}
                primaryColor={theme.primaryColor}
              />
            ) : (
              messages.map((m) =>
                renderMessage ? (
                  <React.Fragment key={m.id}>
                    {renderMessage({ role: m.role, content: m.content, id: m.id })}
                  </React.Fragment>
                ) : (
                  <MessageBubble
                    key={m.id}
                    role={m.role}
                    content={m.content}
                    id={m.id}
                    primaryColor={theme.primaryColor}
                    botMessageBackground={theme.botMessageBackground}
                    botMessageColor={theme.botMessageColor}
                    userMessageColor={theme.userMessageColor}
                    messageBorderRadius={theme.messageBorderRadius}
                  />
                ),
              )
            )}

            {isLoading && (
              <TypingIndicator
                primaryColor={theme.primaryColor}
                botMessageBackground={theme.botMessageBackground}
                text={labels.typingText}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {renderInput ? (
            renderInput({ input, handleInputChange, handleSubmit, isLoading })
          ) : (
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              primaryColor={theme.primaryColor}
              placeholder={labels.inputPlaceholder}
              sendButtonText={labels.sendButtonText}
              borderRadius={theme.borderRadius}
            />
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggleOpen}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: '50%',
          backgroundColor: theme.primaryColor,
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          fontSize: 24,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.22)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.18)';
        }}
      >
        {open
          ? closeIcon || (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )
          : buttonIcon || (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
      </button>
    </div>
  );
}
