import { NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json(
        { error: "Missing 'messages' or 'model' in request body" },
        { status: 400 },
      );
    }

    const response = await together.chat.completions.create({
      messages,
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    const content = response?.choices?.[0]?.message?.content;
    const role = response?.choices?.[0]?.message?.role;
    const id = response?.id;
    const createdAt = response?.created;

    if (!content || !id || !role || !createdAt) {
      return NextResponse.json(
        { error: "Failed to retrieve AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json([...messages, { content, role, id, createdAt }]);
  } catch (error) {
    console.error("Error with Together API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
