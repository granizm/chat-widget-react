'use client';

import { ChatWidget } from '@/components/ChatWidgetInline';

export function ChatWidgetWrapper() {
  return (
    <ChatWidget
      webhookUrl="/api/chat"
      theme={{
        userBubbleColor: '#006cff',
        borderRadius: 16,
      }}
      labels={{
        title: 'AI Assistant',
        subtitle: 'Powered by n8n',
        inputPlaceholder: 'Send a message...',
        welcomeMessage: 'How can I help you today?',
      }}
    />
  );
}
