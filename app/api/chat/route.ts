import { teacherModel } from "@/lib/gemini"
import { NextResponse } from "next/server"

type Message = { role: 'system' | 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key not configured on server' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const messages: Message[] = body.messages || []

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      )
    }

    // 1. Format the history for Gemini
    // Gemini expects an array of { role: "user" | "model", parts: [{ text: string }] }
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    // 2. Get the latest user message
    const latestMessage = messages[messages.length - 1]?.content

    if (!latestMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      )
    }

    // 3. Start chat with history
    const chatSession = teacherModel.startChat({
      history: history,
    })

    // 4. Send message to Gemini
    const result = await chatSession.sendMessage(latestMessage)
    const responseText = result.response.text()

    // Frontend expects { message } format
    return NextResponse.json({ message: responseText })
  } catch (error: any) {
    console.error('Gemini Error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'The teacher is busy right now. Try again later.'
    
    if (error?.message?.includes('API key not valid')) {
      errorMessage = 'Gemini API key not valid. Please check your GEMINI_API_KEY in .env.local'
    } else if (error?.message?.includes('not found')) {
      errorMessage = `Gemini model not found. Try setting GEMINI_MODEL=gemini-2.5-flash or gemini-2.5-pro in .env.local. Current model: ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}. Error: ${error.message}`
    } else if (error?.message) {
      errorMessage = `Gemini API error: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
