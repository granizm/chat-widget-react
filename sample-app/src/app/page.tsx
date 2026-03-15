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
      <div
        style={{
          textAlign: 'center',
          color: '#ffffff',
          maxWidth: 600,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Chat Widget Demo
        </h1>
        <p
          style={{
            fontSize: 18,
            opacity: 0.9,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          A modern, customizable chat widget for React.
          <br />
          Powered by Vercel AI SDK.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '20px 24px',
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>~20KB</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Gzipped size</div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '20px 24px',
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>TypeScript</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Full type support</div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '20px 24px',
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>n8n Ready</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Chat Trigger compatible</div>
          </div>
        </div>

        <p style={{ marginTop: 40, fontSize: 14, opacity: 0.7 }}>
          Click the chat icon in the bottom-right corner to try it out.
        </p>
      </div>

      <ChatWidgetWrapper />
    </main>
  );
}
