# @anthropic-chat/widget

A modern, customizable chat widget component for React. Designed as a bottom-right popup chat bubble that connects to any AI backend via the [Vercel AI SDK](https://sdk.vercel.ai/) `useChat` hook.

Perfect for integrating with **n8n Chat Trigger**, or any API compatible with Vercel AI SDK.

## Features

- Right-bottom popup chat widget (like Intercom / Zendesk)
- Powered by Vercel AI SDK `useChat` hook
- Fully customizable theme, labels, and components
- TypeScript support
- Zero CSS dependencies (styles injected at runtime)
- Lightweight (~8KB gzipped)

## Installation

```bash
npm install @anthropic-chat/widget ai react react-dom
```

## Quick Start

```tsx
import { ChatWidget } from '@anthropic-chat/widget';

function App() {
  return (
    <ChatWidget
      webhookUrl="https://your-n8n.com/webhook/xxx/chat"
    />
  );
}
```

## Customization

### Theme & Labels

```tsx
<ChatWidget
  webhookUrl="https://your-n8n.com/webhook/xxx/chat"
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
/>
```

### Position & Size

```tsx
<ChatWidget
  webhookUrl="..."
  position="bottom-left"     // 'bottom-right' | 'bottom-left'
  windowWidth={420}          // Chat window width (px)
  windowHeight={600}         // Chat window height (px)
  buttonSize={60}            // Floating button size (px)
  defaultOpen={false}        // Start open/closed
/>
```

### n8n Integration

```tsx
<ChatWidget
  webhookUrl="https://your-n8n.com/webhook/xxx/chat"
  chatOptions={{
    body: {
      sessionId: 'unique-session-id',
    },
  }}
/>
```

### Custom Components

Override individual parts of the widget:

```tsx
<ChatWidget
  webhookUrl="..."
  renderHeader={({ labels, onClose }) => (
    <div className="my-custom-header">
      <h3>{labels.title}</h3>
      <button onClick={onClose}>Close</button>
    </div>
  )}
  renderMessage={({ role, content, id }) => (
    <div className={`my-message ${role}`}>{content}</div>
  )}
  renderInput={({ input, handleInputChange, handleSubmit, isLoading }) => (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
      <button type="submit" disabled={isLoading}>Send</button>
    </form>
  )}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `webhookUrl` | `string` | required | Chat API endpoint URL |
| `chatOptions` | `Partial<UseChatOptions>` | - | Additional useChat options |
| `theme` | `ChatWidgetTheme` | see below | Theme customization |
| `labels` | `ChatWidgetLabels` | see below | Text/label customization |
| `windowWidth` | `number` | `400` | Chat window width (px) |
| `windowHeight` | `number` | `560` | Chat window height (px) |
| `position` | `string` | `'bottom-right'` | Widget position |
| `defaultOpen` | `boolean` | `false` | Start open |
| `buttonSize` | `number` | `56` | Button size (px) |
| `buttonIcon` | `ReactNode` | chat icon | Custom open icon |
| `closeIcon` | `ReactNode` | X icon | Custom close icon |
| `className` | `string` | - | Root CSS class |
| `style` | `CSSProperties` | - | Root inline style |
| `onOpen` | `() => void` | - | Open callback |
| `onClose` | `() => void` | - | Close callback |
| `renderHeader` | `function` | - | Custom header renderer |
| `renderMessage` | `function` | - | Custom message renderer |
| `renderInput` | `function` | - | Custom input renderer |

## Sub-components

Individual components are also exported for advanced usage:

```tsx
import {
  ChatWidget,
  ChatHeader,
  ChatInput,
  MessageBubble,
  TypingIndicator,
  WelcomeMessage,
} from '@anthropic-chat/widget';
```

## License

MIT
