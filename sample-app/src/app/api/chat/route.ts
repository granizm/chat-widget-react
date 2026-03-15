import { NextRequest, NextResponse } from 'next/server';

// Demo echo API - replace with n8n webhook proxy in production
export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages || [];
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    return NextResponse.json({ error: 'No message' }, { status: 400 });
  }

  const userInput = lastMessage.content as string;

  // Demo responses
  const responses: Record<string, string> = {
    hello: 'こんにちは！Chat Widget のデモへようこそ。何かお手伝いできますか？',
    help: 'このチャットウィジェットは @anthropic-chat/widget で構築されています。テーマ、ラベル、コンポーネントをカスタマイズできます。',
  };

  const lower = userInput.toLowerCase().trim();
  const reply =
    responses[lower] ||
    `Echo: ${userInput}\n\nこれはデモ応答です。本番では n8n Chat Trigger の webhook URL に接続してください。`;

  // Return streaming-compatible response (Vercel AI SDK format)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Simulate streaming by sending chunks
      const chars = reply.split('');
      let i = 0;
      const interval = setInterval(() => {
        if (i < chars.length) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chars[i])}\n`));
          i++;
        } else {
          controller.enqueue(
            encoder.encode(
              `e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`,
            ),
          );
          controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
          controller.close();
          clearInterval(interval);
        }
      }, 20);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  });
}
