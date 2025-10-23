---
title: "Tool Execution Loop"
order: 5
description: "Build the agent loop that handles tool calls and responses"
estimatedTime: "15 minutes"
---

# Tool Execution Loop

Now for the exciting part - connecting everything together! We'll modify our chat agent to:
1. Tell OpenAI about our tools
2. Detect when it wants to use a tool
3. Execute the tool
4. Send the result back
5. Get the final response

## The Tool-Enabled Chat Flow

Here's what happens:

```
User: "What's 50 × 30?"
  ↓
OpenAI: "I need to use calculator tool"
  ↓
Your code: Calls calculator(50, 30, 'multiply')
  ↓
Result: 1500
  ↓
OpenAI: "The answer is 1,500"
  ↓
User sees: "The answer is 1,500"
```

## Step 1: Update the Chat Function

Remember our simple `chat()` function from Part 1? Now we'll make it tool-aware.

Create or update `openai-client.ts`:

```typescript
// openai-client.ts
import OpenAI from 'openai';
import { toolDefinitions } from './toolDefinitions';
import { calculator, getDadJoke } from './tools';
import type { 
  ChatMessageArray, 
  AssistantMessageWithTools, 
  ToolResult, 
  CalculatorArgs 
} from './types';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Chat with the AI, now with tool support!
 */
export async function chat(messages: ChatMessageArray): Promise<string> {
  // Step 1: Send the chat with available tools
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    tools: toolDefinitions,  // 👈 Tell OpenAI about our tools!
  });

  const aiMessage = response.choices[0]?.message;
  
  if (!aiMessage) {
    throw new Error('No response received from OpenAI');
  }
  
  // Step 2: Check if AI wants to use a tool
  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    // AI wants to use tools! We need to handle that
    return await handleToolCalls(messages, aiMessage as AssistantMessageWithTools);
  }
  
  // Step 3: No tools needed, just return the response
  return aiMessage.content || 'No response content';
}

/**
 * Handles when the AI wants to call tools
 */
async function handleToolCalls(
  messages: ChatMessageArray, 
  aiMessage: AssistantMessageWithTools
): Promise<string> {
  // Add the AI's message (with tool calls) to history
  messages.push(aiMessage);
  
  // Execute each tool call
  for (const toolCall of aiMessage.tool_calls) {
    if (toolCall.type === 'function' && toolCall.function) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      console.log(`\n🔧 AI is calling tool: ${functionName}`);
      console.log(`📝 Arguments:`, functionArgs);
      
      // Execute the appropriate tool
      const result = await executeToolCall(functionName, functionArgs);
      
      console.log(`✅ Tool result: ${result}\n`);
      
      // Add the tool result to messages
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: String(result)
      });
    }
  }
  
  // Send the tool results back to OpenAI for a final response
  const finalResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages
  });
  
  return finalResponse.choices[0]?.message?.content || 'No response content';
}

/**
 * Executes the actual tool function
 */
async function executeToolCall(
  functionName: string, 
  args: Record<string, unknown>
): Promise<ToolResult> {
  switch (functionName) {
    case 'calculator': {
      const calcArgs = args as unknown as CalculatorArgs;
      return calculator(calcArgs.a, calcArgs.b, calcArgs.operation);
    }
      
    case 'get_dad_joke':
      return await getDadJoke();
      
    default:
      return `Error: Unknown tool '${functionName}'`;
  }
}
```

## Understanding the Code

Let's break down the key parts:

### 1. Sending Tools with the Request

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages,
  tools: toolDefinitions,  // 👈 New!
});
```

By adding `tools: toolDefinitions`, we tell OpenAI "here are the tools you can use".

### 2. Checking for Tool Calls

```typescript
if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
  return await handleToolCalls(messages, aiMessage as AssistantMessageWithTools);
}
```

OpenAI responds with a `tool_calls` array if it wants to use tools. Otherwise, it's a normal text response.

### 3. The Tool Call Structure

When AI wants to use a tool, it sends something like:

```typescript
{
  id: "call_abc123",
  type: "function",
  function: {
    name: "calculator",
    arguments: '{"a": 50, "b": 30, "operation": "multiply"}'
  }
}
```

Notice `arguments` is a **JSON string**, not an object. That's why we parse it:

```typescript
const functionArgs = JSON.parse(toolCall.function.arguments);
```

### 4. Executing the Tool

```typescript
const result = await executeToolCall(functionName, functionArgs);
```

This calls our actual function (`calculator` or `getDadJoke`) with the parsed arguments.

### 5. Sending Results Back

```typescript
messages.push({
  role: 'tool',
  tool_call_id: toolCall.id,
  content: String(result)
});
```

We add a special message with `role: 'tool'` that contains:
- The `tool_call_id` (so OpenAI knows which call this answers)
- The `content` (the result, as a string)

### 6. Getting Final Response

```typescript
const finalResponse = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages
});
```

We send ALL the messages (including tool results) back to OpenAI, and it generates a final response for the user.

## The Complete Message Flow

Here's what the messages array looks like through the process:

**Initially:**
```typescript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' }
] as ChatMessageArray
```

**After AI requests tool:**
```typescript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' },
  { role: 'assistant', content: null, tool_calls: [...] }
] as ChatMessageArray
```

**After tool execution:**
```typescript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' },
  { role: 'assistant', content: null, tool_calls: [...] },
  { role: 'tool', tool_call_id: 'call_abc123', content: '1500' }
] as ChatMessageArray
```

**Final response:**
```typescript
{ role: 'assistant', content: 'The answer is 1,500' }
```

## Handling Multiple Tool Calls

The AI can call multiple tools at once! That's why we loop through `tool_calls`:

```typescript
for (const toolCall of aiMessage.tool_calls) {
  if (toolCall.type === 'function' && toolCall.function) {
    // Execute each one
  }
}
```

For example, if the user says "Tell me a joke and calculate 10 + 5", the AI might call both tools in one go!

## Step 2: Update index.ts

Now update your main file to use the tool-enabled chat function.

```typescript
// index.ts
import * as readline from 'readline';
import { chat } from './openai-client';
import { toolDefinitions } from './toolDefinitions';
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

What changed?

Not much in `index.ts`! The magic happens inside `chat()`. We just:
1. Call `chat(messages)` like before
2. It handles tools automatically
3. Returns the final response

This is the beauty of good abstraction - the main chat loop stays simple!

## Error Handling

What if something goes wrong? Our code handles common issues:

**Unknown tool:**
```typescript
default:
  return `Error: Unknown tool '${functionName}'`;
```

**Tool throws error:**
```typescript
try {
  const result = await executeToolCall(functionName, functionArgs);
} catch (error) {
  result = `Error executing tool: ${(error as Error).message}`;
}
```

The AI sees these errors and can communicate them to the user naturally.

## Pro Tips

### Logging Tool Calls

The console.log statements help you see what's happening:

```typescript
console.log(`🔧 AI is calling tool: ${functionName}`);
console.log(`📝 Arguments:`, functionArgs);
console.log(`✅ Tool result: ${result}\n`);
```

This is super helpful for debugging! You can remove them later if you want.

### System Message

Notice we updated the system message:

```typescript
content: 'You are a helpful assistant. Keep responses clear and friendly.'
```

This reminds the AI it has tools available.

## What's Next?

Your agent is complete! 🎉 Let's test it and see the tools in action!
