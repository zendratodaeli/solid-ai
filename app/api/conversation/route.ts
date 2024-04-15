import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    // Ensure user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    };

    // Ensure the OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) { 
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    };

    // Validate that messages are present and correctly structured
    if (!messages || !Array.isArray(messages) || messages.some(msg => typeof msg !== 'object' || !msg.role || !msg.content)) {
      return new NextResponse("Messages must be an array of objects with 'role' and 'content' fields", { status: 400 });
    };

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages
    });

    // Send the content of the first response choice
    return new NextResponse(JSON.stringify(response.choices[0].message.content), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
