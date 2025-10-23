---
title: "Setting Up OpenAI"
description: "Initialize the OpenAI client and create a simple chat function"
---

# Setting Up OpenAI

Let's set up a simple OpenAI client to send messages and get responses.

## Create the OpenAI Client File

Create a file called `openai-client.ts`:

```typescript
// openai-client.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple function to send a message and get a response
export async function chat(userMessage: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ]
  });

  return response.choices[0].message.content || 'No response';
}
```

## What This Code Does

**Load environment variables:**
```typescript
dotenv.config();
```
This loads your `.env` file so we can access the OpenAI API key.

**Create OpenAI client:**
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```
Initialize the OpenAI client with your API key.

**Simple chat function:**
```typescript
export async function chat(userMessage: string): Promise<string>
```
- Takes a user message as input
- Sends it to OpenAI's GPT-4o-mini model
- Returns the AI's response

That's it! A simple, straightforward function to chat with AI.

## Test It Out

Let's test it quickly. Create a test file:

**test.ts**
```typescript
import { chat } from './openai-client';

async function test() {
  const response = await chat('Hello! What can you help me with?');
  console.log('AI:', response);
}

test();
```

Run it:
```bash
npx ts-node test.ts
```

You should see the AI respond! Now let's build a full chat interface in the next step.