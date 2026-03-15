import { ChatWidgetWrapper } from '@/components/ChatWidgetWrapper';

export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        {/* Logo / Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            backgroundColor: '#ffffff',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 8,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}
        >
          Chat Widget
        </h1>

        <p
          style={{
            fontSize: 16,
            color: '#737373',
            lineHeight: 1.5,
            marginBottom: 40,
          }}
        >
          A modern chat widget for React, powered by Vercel AI SDK.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Lightweight', desc: '~20KB gzipped' },
            { label: 'TypeScript', desc: 'Full type support' },
            { label: 'n8n Ready', desc: 'Chat Trigger compatible' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: 12,
                padding: '16px 20px',
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: '#737373' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 48, fontSize: 13, color: '#a3a3a3' }}>
          Click the chat icon in the bottom-right corner to try it.
        </p>
      </div>

      <ChatWidgetWrapper />
    </main>
  );
}
