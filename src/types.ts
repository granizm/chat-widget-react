import type { UseChatOptions } from 'ai/react';
import type { CSSProperties, ReactNode } from 'react';

export interface ChatWidgetTheme {
  /** Primary color used for buttons, user messages, header */
  primaryColor?: string;
  /** Background color of the chat window */
  backgroundColor?: string;
  /** Background color for bot messages */
  botMessageBackground?: string;
  /** Text color for bot messages */
  botMessageColor?: string;
  /** Text color for user messages */
  userMessageColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Border radius for the chat window */
  borderRadius?: number;
  /** Border radius for message bubbles */
  messageBorderRadius?: number;
}

export interface ChatWidgetLabels {
  /** Title displayed in the header */
  title?: string;
  /** Subtitle displayed in the header */
  subtitle?: string;
  /** Placeholder text for the input field */
  inputPlaceholder?: string;
  /** Text for the send button */
  sendButtonText?: string;
  /** Welcome message shown when chat is empty */
  welcomeMessage?: string;
  /** Typing indicator text */
  typingText?: string;
}

export interface ChatWidgetProps {
  /** Webhook URL for the chat API (e.g., n8n webhook URL) */
  webhookUrl: string;
  /** Additional options passed to useChat hook */
  chatOptions?: Partial<UseChatOptions>;
  /** Theme customization */
  theme?: ChatWidgetTheme;
  /** Label/text customization */
  labels?: ChatWidgetLabels;
  /** Width of the chat window in pixels */
  windowWidth?: number;
  /** Height of the chat window in pixels */
  windowHeight?: number;
  /** Position of the widget button */
  position?: 'bottom-right' | 'bottom-left';
  /** Whether the chat window is open by default */
  defaultOpen?: boolean;
  /** Custom button icon (React node) */
  buttonIcon?: ReactNode;
  /** Custom close icon (React node) */
  closeIcon?: ReactNode;
  /** Size of the floating button in pixels */
  buttonSize?: number;
  /** Custom CSS class name for the root container */
  className?: string;
  /** Custom inline style for the root container */
  style?: CSSProperties;
  /** Callback when chat window opens */
  onOpen?: () => void;
  /** Callback when chat window closes */
  onClose?: () => void;
  /** Custom header component */
  renderHeader?: (props: { labels: Required<ChatWidgetLabels>; onClose: () => void }) => ReactNode;
  /** Custom message component */
  renderMessage?: (props: { role: string; content: string; id: string }) => ReactNode;
  /** Custom input component */
  renderInput?: (props: {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
  }) => ReactNode;
}
