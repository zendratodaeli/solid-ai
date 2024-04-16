import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    };

    if (!process.env.OPENAI_API_KEY) { 
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    };

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 401 });
    };

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", {status: 403})
    }

    const input = {
      prompt: prompt,
    };
    
    const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", 
    { input });
  
    if(!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (error) {
    console.error("[VIDEO _ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
