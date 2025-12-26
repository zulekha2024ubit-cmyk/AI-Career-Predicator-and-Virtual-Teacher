import { NextRequest, NextResponse } from 'next/server'

// System prompt for the Virtual Teacher AI Assistant
const SYSTEM_PROMPT = `You are an expert Virtual Teacher and Career Advisor for AI CareerPath platform. Your role is to:

1. **Help users with their learning journey**: Explain concepts, recommend learning resources, clarify doubts about any roadmap topic (web development, data science, AI/ML, cybersecurity, etc.)

2. **Provide career guidance**: Answer questions about career paths, skill requirements, industry trends, job market insights, and career transitions.

3. **Motivate and encourage**: Be supportive, patient, and encouraging. Help users stay motivated in their learning journey.

4. **Be concise and clear**: Give practical, actionable advice. Keep responses focused and easy to understand.

5. **Reference the platform**: When relevant, mention specific roadmaps, projects, or features available on AI CareerPath.

6. **Adapt to the user's level**: Whether they're a complete beginner or experienced professional, adjust your explanations accordingly.

**Guidelines:**
- Keep responses under 150 words unless explaining complex topics
- Use simple language and examples
- Suggest next steps or actions when appropriate
- If you don't know something, admit it and suggest where they might find the answer
- Be friendly and professional

Remember: You're here to make learning easier and career planning clearer!`

// Model fallback chain - will try each model in order until one succeeds
const MODELS = [
  'gpt-5-nano-2025-08-07',       // Specific date version
  'gpt-5-nano',                  // 🚀 Latest 2025: ultra-fast, cheapest
  'gpt-5-mini-2025-08-07',       // Specific date version
  'gpt-5-mini',                  // Latest 2025 mini variant
  'gpt-4.1-nano-2025-04-14',     // April 2025 nano variant
  'gpt-4.1-nano',                // Generic 4.1 nano
  'gpt-4.1-mini-2025-04-14',     // April 2025 mini variant
  'gpt-4.1-mini',                // Generic 4.1 mini
  
]

async function callOpenAIWithFallback(apiKey: string, messages: any[]) {
  let lastError = null

  // Try each model in the fallback chain
  for (const model of MODELS) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }

      // If model not available or other error, try next one
      const error = await response.json()
      lastError = error
      
      // Continue to next model in the fallback chain
      continue
      
    } catch (error: any) {
      lastError = error
      // Continue to next model
      continue
    }
  }

  // If all models failed, throw the last error
  throw new Error(lastError?.error?.message || lastError?.message || 'All models failed')
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local file.' },
        { status: 500 }
      )
    }

    // Prepare messages with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]

    // Call OpenAI API with automatic model fallback
    const data = await callOpenAIWithFallback(apiKey, fullMessages)
    const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error: any) {
    console.error('Virtual Teacher API error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
