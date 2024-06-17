import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY 
// });

const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const instructionMessage: 
ChatCompletionMessageParam = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations"
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    };

    if (!process.env.GROQ_API_KEY) { 
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    };

    if (!messages || !Array.isArray(messages) || messages.some(msg => typeof msg !== 'object' || !msg.role || !msg.content)) {
      return new NextResponse("Messages must be an array of objects with 'role' and 'content' fields", { status: 400 });
    };

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", {status: 403})
    }

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      temperature: 1,
      messages: [instructionMessage, ...messages],
    });

    if(!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse(JSON.stringify(response.choices[0].message.content), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
