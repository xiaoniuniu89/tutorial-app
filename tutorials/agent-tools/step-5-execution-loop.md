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

Create or update `agent.js`:

```javascript
// agent.js
import OpenAI from 'openai';
import { toolDefinitions } from './toolDefinitions.js';
import { calculator, getDadJoke } from './tools.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Chat with the AI, now with tool support!
 */
export async function chat(messages) {
  // Step 1: Send the chat with available tools
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    tools: toolDefinitions,  // 👈 Tell OpenAI about our tools!
  });

  const aiMessage = response.choices[0].message;
  
  // Step 2: Check if AI wants to use a tool
  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    // AI wants to use tools! We need to handle that
    return await handleToolCalls(messages, aiMessage);
  }
  
  // Step 3: No tools needed, just return the response
  return aiMessage.content;
}

/**
 * Handles when the AI wants to call tools
 */
async function handleToolCalls(messages, aiMessage) {
  // Add the AI's message (with tool calls) to history
  messages.push(aiMessage);
  
  // Execute each tool call
  for (const toolCall of aiMessage.tool_calls) {
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
      name: functionName,
      content: String(result)
    });
  }
  
  // Send the tool results back to OpenAI for a final response
  const finalResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages
  });
  
  return finalResponse.choices[0].message.content;
}

/**
 * Executes the actual tool function
 */
async function executeToolCall(functionName, args) {
  switch (functionName) {
    case 'calculator':
      return calculator(args.a, args.b, args.operation);
      
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

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages,
  tools: toolDefinitions,  // 👈 New!
});
```

By adding `tools: toolDefinitions`, we tell OpenAI "here are the tools you can use".

### 2. Checking for Tool Calls

```javascript
if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
  return await handleToolCalls(messages, aiMessage);
}
```

OpenAI responds with a `tool_calls` array if it wants to use tools. Otherwise, it's a normal text response.

### 3. The Tool Call Structure

When AI wants to use a tool, it sends something like:

```javascript
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

```javascript
const functionArgs = JSON.parse(toolCall.function.arguments);
```

### 4. Executing the Tool

```javascript
const result = await executeToolCall(functionName, functionArgs);
```

This calls our actual function (`calculator` or `getDadJoke`) with the parsed arguments.

### 5. Sending Results Back

```javascript
messages.push({
  role: 'tool',
  tool_call_id: toolCall.id,
  name: functionName,
  content: String(result)
});
```

We add a special message with `role: 'tool'` that contains:
- The `tool_call_id` (so OpenAI knows which call this answers)
- The `name` of the tool
- The `content` (the result, as a string)

### 6. Getting Final Response

```javascript
const finalResponse = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages
});
```

We send ALL the messages (including tool results) back to OpenAI, and it generates a final response for the user.

## The Complete Message Flow

Here's what the messages array looks like through the process:

**Initially:**
```javascript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' }
]
```

**After AI requests tool:**
```javascript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' },
  { role: 'assistant', content: null, tool_calls: [...] }
]
```

**After tool execution:**
```javascript
[
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'What is 50 × 30?' },
  { role: 'assistant', content: null, tool_calls: [...] },
  { role: 'tool', tool_call_id: 'call_abc123', name: 'calculator', content: '1500' }
]
```

**Final response:**
```javascript
{ role: 'assistant', content: 'The answer is 1,500' }
```

## Handling Multiple Tool Calls

The AI can call multiple tools at once! That's why we loop through `tool_calls`:

```javascript
for (const toolCall of aiMessage.tool_calls) {
  // Execute each one
}
```

For example, if the user says "Tell me a joke and calculate 10 + 5", the AI might call both tools in one go!

## Step 2: Update index.js

Now update your main file to use the tool-enabled chat function.

```javascript
// index.js
import readline from 'readline';
import { chat } from './agent.js';

const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant with access to tools. Use them when appropriate to provide accurate answers.'
  }
];

async function chatLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('\nYou: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      // Add user message
      messages.push({
        role: 'user',
        content: userInput
      });

      try {
        // Get AI response (with tool support!)
        const response = await chat(messages);
        
        // Add AI response to history
        messages.push({
          role: 'assistant',
          content: response
        });

        console.log(`\nAssistant: ${response}`);
      } catch (error) {
        console.error('Error:', error.message);
      }

      askQuestion();
    });
  };

  console.log('🤖 AI Agent with Tools (type "exit" to quit)\n');
  askQuestion();
}

chatLoop();
```

## What Changed?

Not much in `index.js`! The magic happens inside `chat()`. We just:
1. Call `chat(messages)` like before
2. It handles tools automatically
3. Returns the final response

This is the beauty of good abstraction - the main chat loop stays simple!

## Error Handling

What if something goes wrong? Our code handles common issues:

**Unknown tool:**
```javascript
default:
  return `Error: Unknown tool '${functionName}'`;
```

**Tool throws error:**
```javascript
try {
  const result = await executeToolCall(functionName, functionArgs);
} catch (error) {
  result = `Error executing tool: ${error.message}`;
}
```

The AI sees these errors and can communicate them to the user naturally.

## Pro Tips

### Logging Tool Calls

The console.log statements help you see what's happening:

```javascript
console.log(`🔧 AI is calling tool: ${functionName}`);
console.log(`📝 Arguments:`, functionArgs);
console.log(`✅ Tool result: ${result}\n`);
```

This is super helpful for debugging! You can remove them later if you want.

### System Message

Notice we updated the system message:

```javascript
content: 'You are a helpful assistant with access to tools. Use them when appropriate to provide accurate answers.'
```

This reminds the AI it has tools available.

## What's Next?

Your agent is complete! 🎉 Let's test it and see the tools in action!
