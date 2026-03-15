import React from 'react';
import { ChatWidget } from '@anthropic-chat/widget';

/**
 * Basic usage - n8n webhook integration
 */
export function BasicExample() {
  return (
    <ChatWidget
      webhookUrl="https://your-n8n.com/webhook/xxx/chat"
    />
  );
}

/**
 * Full customization example
 */
export function CustomizedExample() {
  return (
    <ChatWidget
      webhookUrl="https://your-n8n.com/webhook/xxx/chat"
      position="bottom-right"
      windowWidth={420}
      windowHeight={600}
      buttonSize={60}
      theme={{
        primaryColor: '#8b5cf6',
        backgroundColor: '#fafafa',
        botMessageBackground: '#f3e8ff',
        botMessageColor: '#1e1b4b',
        userMessageColor: '#ffffff',
        borderRadius: 20,
        messageBorderRadius: 18,
      }}
      labels={{
        title: 'サポートAI',
        subtitle: 'お気軽にどうぞ',
        inputPlaceholder: 'メッセージを入力...',
        sendButtonText: '送信',
        welcomeMessage: 'こんにちは！何かお手伝いできますか？',
        typingText: '入力中...',
      }}
      onOpen={() => console.log('Chat opened')}
      onClose={() => console.log('Chat closed')}
    />
  );
}

/**
 * With custom session ID for n8n
 */
export function WithSessionExample() {
  return (
    <ChatWidget
      webhookUrl="https://your-n8n.com/webhook/xxx/chat"
      chatOptions={{
        body: {
          sessionId: `session-${Date.now()}`,
        },
      }}
      labels={{
        title: 'Chat Support',
        welcomeMessage: 'How can I assist you?',
      }}
    />
  );
}
