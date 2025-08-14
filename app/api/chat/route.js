import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "edge"; // faster streaming

export async function POST(req) {
  try {
    const { personaId, history, systemPrompt } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
 
    // Compose messages: system + prior chat
    const messages = [
      { role: "system", content: systemPrompt || "" },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ];

    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) controller.enqueue(encoder.encode(content));
          }
        } catch (e) {
          controller.enqueue(encoder.encode("\n[stream-error]"));
        } finally {
          controller.close();
        }
      },
    });

    // We send raw text chunks; client will read() them
    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
