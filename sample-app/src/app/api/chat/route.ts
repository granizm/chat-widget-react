import { NextRequest } from 'next/server';

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://n8n.granizm.net/webhook/349e7c90-1f46-488d-81f8-3cb5cdfeb029/chat';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages || [];
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    return new Response('No message', { status: 400 });
  }

  const userInput = lastMessage.content as string;
  const sessionId = body.sessionId || `session-${Date.now()}`;

  // Call n8n Chat Trigger
  const n8nRes = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'sendMessage',
      sessionId,
      chatInput: userInput,
    }),
  });

  if (!n8nRes.ok) {
    const errText = await n8nRes.text();
    console.error('n8n error:', n8nRes.status, errText);
    return new Response(`n8n error: ${n8nRes.status}`, { status: 502 });
  }

  // n8n may return JSON with "output" field or plain text
  const contentType = n8nRes.headers.get('content-type') || '';
  let reply: string;

  if (contentType.includes('application/json')) {
    const data = await n8nRes.json();
    // n8n Chat Trigger typically returns { output: "..." }
    reply = data.output || data.text || data.response || JSON.stringify(data);
  } else {
    reply = await n8nRes.text();
  }

  // Convert to Vercel AI SDK Data Stream format
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send the full response as a single text chunk
      controller.enqueue(encoder.encode(`0:${JSON.stringify(reply)}\n`));
      controller.enqueue(
        encoder.encode(
          `e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`,
        ),
      );
      controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  });
}
