import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req) {
  const body = await req.json()
  const messages = body.messages

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: "You are a helpful AI assistant. Be concise and friendly in your responses.",
    messages,
  })

  return result.toDataStreamResp
}