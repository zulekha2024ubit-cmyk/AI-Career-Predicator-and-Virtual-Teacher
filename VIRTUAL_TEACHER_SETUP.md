# Virtual Teacher AI Assistant Setup Guide

## 📍 **AI Prompt Location**

The AI assistant's system prompt (personality, instructions, behavior) is defined in:

**File:** `app/api/chat/route.ts`  
**Location:** Lines 4-30 (the `SYSTEM_PROMPT` constant)

This is where you can customize:
- How the AI introduces itself
- What topics it should focus on
- The tone and style of responses
- Response length guidelines
- Special instructions or rules

---

## 🔧 **Setup Instructions**

### Step 1: Add Your OpenAI API Key

1. Open the file: `.env.local`
2. Replace the line:
   ```
   OPENAI_API_KEY=
   ```
   With your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Save the file

### Step 2: Restart Your Development Server

Stop your current dev server (Ctrl+C) and restart it:

```powershell
npm run dev
```

### Step 3: Test the Virtual Teacher

1. Open your website in the browser
2. Click the chat bubble (💬) in the bottom-right corner
3. Ask a question like:
   - "What is React?"
   - "How do I start learning web development?"
   - "Explain the difference between frontend and backend"

---

## 🎨 **How It Works**

```
User Message → FloatingChatWidget.tsx → /api/chat → OpenAI API → Response
```

1. **User types a message** in the chat widget (`components/FloatingChatWidget.tsx`)
2. **Widget sends message** to `/api/chat` endpoint
3. **API route** (`app/api/chat/route.ts`) adds the system prompt and calls OpenAI
4. **OpenAI returns response** based on the system prompt
5. **Response displayed** in the chat widget

---

## 📝 **Customizing the AI Prompt**

To change how the AI behaves, edit `app/api/chat/route.ts`:

```typescript
const SYSTEM_PROMPT = `You are an expert Virtual Teacher...

// Add your custom instructions here
- Be more technical/casual/formal
- Focus on specific topics
- Use specific examples
- Change response style
`
```

**Examples of customizations:**
- Make it more encouraging for beginners
- Add specific examples from your roadmaps
- Adjust technical depth
- Change personality (formal, casual, friendly)

---

## 🔑 **Getting an OpenAI API Key**

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and paste it in `.env.local`

**Note:** API usage costs money based on tokens used. GPT-3.5-turbo is cheaper than GPT-4.

---

## 💡 **Switching AI Models**

In `app/api/chat/route.ts`, line 60:

```typescript
model: 'gpt-3.5-turbo', // Change to 'gpt-4' for better quality (higher cost)
```

**Available models:**
- `gpt-3.5-turbo` - Fast, affordable
- `gpt-4` - More capable, expensive
- `gpt-4-turbo` - Balance of speed and quality

---

## 🐛 **Troubleshooting**

### "API key not configured" error
- Check `.env.local` has `OPENAI_API_KEY=sk-...`
- Restart dev server after adding the key

### "Failed to get response" error
- Verify API key is valid
- Check OpenAI account has credits
- Check network connection

### AI responses are cut off
- Increase `max_tokens` in `app/api/chat/route.ts` (line 62)
- Current: 300 tokens (~225 words)

---

## 📂 **File Structure**

```
your-project/
├── .env.local                          # 🔑 API key here
├── app/
│   └── api/
│       └── chat/
│           └── route.ts               # 📍 AI PROMPT HERE
└── components/
    └── FloatingChatWidget.tsx         # Chat UI component
```

---

## ✅ **Quick Checklist**

- [ ] Add OpenAI API key to `.env.local`
- [ ] Restart development server
- [ ] Test chat widget
- [ ] Customize AI prompt if needed
- [ ] Check API usage on OpenAI dashboard

---

**Need help?** The AI prompt is in `app/api/chat/route.ts` - that's where all the magic happens! 🎯
