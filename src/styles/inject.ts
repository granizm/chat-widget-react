const STYLE_ID = 'chat-widget-react-styles';

const CSS = `
@keyframes cwr-fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cwr-slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cwr-spin {
  to { transform: rotate(360deg); }
}

@keyframes cwr-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
`;

export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
