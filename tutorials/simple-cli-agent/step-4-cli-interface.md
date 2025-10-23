---
title: "Build the CLI Chat Interface"
description: "Create a simple chat loop that remembers conversation history"
---

# Build the CLI Chat Interface

Let's build a simple command-line chat interface with conversation memory!

## OpenAI Client is Already Updated

Our OpenAI client from step 2 already handles conversation history properly with TypeScript types. We're using the `ChatMessageArray` type which includes all message types (`system`, `user`, `assistant`, and `tool`).

## Create the Chat Loop

Now create the main chat file using the exact TypeScript implementation provided:

**index.ts**
```typescript
import * as readline from 'readline';
import { chat } from './openai-client';
import type { ChatMessageArray } from './types';

// System message + message history
const messages: ChatMessageArray = [
  { role: 'system', content: 'You are a helpful assistant. Keep responses clear and friendly.' }
];

// Maximum number of messages to remember (not counting system message)
const MAX_MESSAGES = 10;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to keep only recent messages
function trimMemory(): void {
  // Keep system message (first one) + last MAX_MESSAGES messages
  if (messages.length > MAX_MESSAGES + 1) {
    const systemMessage = messages[0];
    const recentMessages = messages.slice(-MAX_MESSAGES);
    messages.length = 0;  // Clear array
    messages.push(systemMessage, ...recentMessages);
    
    console.log('💭 (Trimmed old messages to save memory)\n');
  }
}

// Main chat loop
async function chatLoop(): Promise<void> {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      rl.close();
      return;
    }

    if (!input.trim()) {
      chatLoop();
      return;
    }

    // Add user message
    messages.push({ role: 'user', content: input });

    try {
      // Get AI response
      const response = await chat(messages);
      
      // Add assistant response
      messages.push({ role: 'assistant', content: response });
      
      console.log(`\nAI: ${response}\n`);
      
      // Trim old messages if needed
      trimMemory();
    } catch (error) {
      console.error('Error:', error);
    }

    chatLoop();
  });
}

console.log('🤖 Chat started! Type "exit" to quit.\n');
chatLoop();
```

## How It Works

**1. Message History with Memory Management**
```typescript
const messages: ChatMessageArray = [
  { role: 'system', content: 'You are a helpful assistant...' }
];
```
We start with a system message using proper OpenAI types. The `trimMemory()` function prevents the array from growing too large.

**2. The Chat Loop with TypeScript**
```typescript
async function chatLoop(): Promise<void> {
  rl.question('You: ', async (input) => {
    // ... handle input with proper typing
    chatLoop(); // Continue the loop
  });
}
```
A recursive function with:
- Proper TypeScript return type
- Input validation and error handling
- Memory management

**3. Maintaining Context**
```typescript
messages.push({ role: 'user', content: input });
const response = await chat(messages);
messages.push({ role: 'assistant', content: response });
trimMemory(); // Keep memory usage reasonable
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