import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Create a Google Generative AI model instance
const model = google("gemini-1.5-pro-latest");

// Define the runtime as edge for better performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-1.5-pro-latest"),
    messages,
  });

  return result.toDataStreamResponse();
}
