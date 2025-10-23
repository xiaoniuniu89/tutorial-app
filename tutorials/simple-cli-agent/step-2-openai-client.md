---
title: "Setting Up OpenAI"
description: "Initialize the OpenAI client and create a simple chat function"
---

# Setting Up OpenAI

Let's set up a simple OpenAI client to send messages and get responses with proper TypeScript types.

## Create the Types File

First, create a `types.ts` file for type safety:

```typescript
// types.ts
import type OpenAI from 'openai';

// Use OpenAI's built-in types for messages
export type ChatMessageArray = OpenAI.Chat.Completions.ChatCompletionMessageParam[];

// Function types
export type ChatFunction = (messages: ChatMessageArray) => Promise<string>;

// Error types
export interface APIError extends Error {
  status?: number;
  response?: {
    status: number;
    statusText: string;
  };
}
```

## Create the OpenAI Client File

Create a file called `openai-client.ts`:

```typescript
// openai-client.ts
import OpenAI from 'openai';
import type { ChatMessageArray } from './types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat function with conversation history support
export async function chat(messages: ChatMessageArray): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages
  });

  return response.choices[0]?.message?.content || 'No response';
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

**Chat function with proper typing:**
```typescript
export async function chat(messages: ChatMessageArray): Promise<string>
```
- Takes an array of messages (conversation history)
- Uses OpenAI's built-in types for type safety
- Returns the AI's response as a string
- Handles null/undefined responses gracefully

**Type safety benefits:**
- `ChatMessageArray` ensures messages have the correct structure
- TypeScript will catch type errors at compile time
- Better IDE support with autocomplete and error checking

## Test It Out

Let's test it quickly. Create a test file:

**test.ts**
```typescript
import { chat } from './openai-client';
import type { ChatMessageArray } from './types';

async function test() {
  const messages: ChatMessageArray = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello! What can you help me with?' }
  ];
  
  const response = await chat(messages);
  console.log('AI:', response);
}

test();
```

Run it:
```bash
npx ts-node test.ts
```

You should see the AI respond! Now let's build a full chat interface in the next step.