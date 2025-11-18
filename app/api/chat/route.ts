// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Missing `message` in request body" },
        { status: 400 }
      );
    }

    const userMessage = body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini", // or the model you want
      messages: [
        {
          role: "system",
          content:
            "You are Planora, a helpful travel assistant. Answer concisely about travel, trips, and destinations.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn’t generate a reply.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    // This will show a useful error in your server terminal
    console.error("OPENAI /api/chat error:", err);

    return NextResponse.json(
      {
        error:
          err?.message ||
          "Unexpected error while talking to OpenAI from /api/chat",
      },
      { status: 500 }
    );
  }
}
