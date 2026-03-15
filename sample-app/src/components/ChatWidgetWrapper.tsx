'use client';

import { ChatWidget } from '@/components/ChatWidgetInline';

export function ChatWidgetWrapper() {
  return (
    <ChatWidget
      webhookUrl="/api/chat"
      theme={{
        primaryColor: '#6366f1',
        backgroundColor: '#ffffff',
        botMessageBackground: '#f1f5f9',
        botMessageColor: '#1e293b',
        userMessageColor: '#ffffff',
        borderRadius: 16,
        messageBorderRadius: 16,
      }}
      labels={{
        title: 'AI Assistant',
        subtitle: 'Powered by Chat Widget',
        inputPlaceholder: 'メッセージを入力...',
        sendButtonText: '送信',
        welcomeMessage: 'こんにちは！何かお手伝いできますか？',
        typingText: '入力中...',
      }}
    />
  );
}
