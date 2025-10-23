---
title: "Build the CLI Chat Interface"
description: "Create a simple chat loop that remembers conversation history"
---

# Build the CLI Chat Interface

Let's build a simple command-line chat interface with conversation memory!

## Update the OpenAI Client

First, let's update our OpenAI client to handle conversation history:

**openai-client.ts**
```typescript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Message type
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Chat function with conversation history
export async function chat(messages: Message[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages
  });

  return response.choices[0].message.content || 'No response';
}
```

## Create the Chat Loop

Now create the main chat file:

**index.ts**
```typescript
import * as readline from 'readline';
import { chat } from './openai-client';

// Message history
const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
  { role: 'system', content: 'You are a helpful assistant. Keep responses clear and friendly.' }
];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main chat loop
async function chatLoop() {
  rl.question('You: ', async (input) => {
    // Handle exit
    if (input.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      rl.close();
      return;
    }

    // Skip empty input
    if (!input.trim()) {
      chatLoop();
      return;
    }

    // Add user message to history
    messages.push({ role: 'user', content: input });

    try {
      // Get AI response
      const response = await chat(messages);
      
      // Add assistant response to history
      messages.push({ role: 'assistant', content: response });
      
      console.log(`\nAI: ${response}\n`);
    } catch (error) {
      console.error('Error:', error);
    }

    // Continue the loop
    chatLoop();
  });
}

// Start the chat
console.log('🤖 Chat started! Type "exit" to quit.\n');
chatLoop();
```

## How It Works

**1. Message History**
```typescript
const messages = [
  { role: 'system', content: 'You are a helpful assistant...' }
];
```
We start with a system message that sets the AI's personality. Every user/AI message gets added to this array.

**2. The Chat Loop**
```typescript
async function chatLoop() {
  rl.question('You: ', async (input) => {
    // ... handle input
    chatLoop(); // Continue the loop
  });
}
```
A simple recursive function that:
- Prompts for user input
- Sends messages to OpenAI
- Gets the response
- Repeats

**3. Maintaining Context**
```typescript
messages.push({ role: 'user', content: input });
const response = await chat(messages);
messages.push({ role: 'assistant', content: response });
```
By adding each exchange to the `messages` array, the AI remembers the full conversation!

## Try It Out

The AI now has memory! Try this conversation:

```
You: My name is Alex
AI: Nice to meet you, Alex!

You: What's my name?
AI: Your name is Alex!
```

The AI remembers because we're sending the full conversation history each time.

## What We Built

✅ **Simple functional code** - No classes, just functions
✅ **Conversation memory** - AI remembers what was said
✅ **Easy to understand** - Clear, straightforward logic
✅ **Ready to extend** - Easy to add features later

Next, let's run it!