---
title: "Dad Jokes API Tool"
order: 4
description: "Build a tool that fetches real data from an external API"
estimatedTime: "12 minutes"
---

# Dad Jokes API Tool

Now let's build something more interesting - a tool that calls a **real external API** to fetch dad jokes! 🎭

## Why This Matters

The calculator tool was self-contained. But most useful tools need to:
- Fetch data from the internet
- Call external APIs
- Get real-time information

This is where your agent becomes truly useful!

## About the Dad Jokes API

We'll use the [icanhazdadjoke.com](https://icanhazdadjoke.com/) API because:
- ✅ It's free (no API key needed)
- ✅ It's simple (one endpoint)
- ✅ It's reliable
- ✅ It's fun!

## Step 1: Add Types for Dad Joke

First, let's add the types for our Dad Joke response to `types.ts`:

```typescript
// Add to types.ts

export interface DadJokeResponse {
  id: string;
  joke: string;
  status: number;
}

// Error types
export interface APIError extends Error {
  status?: number;
  response?: {
    status: number;
    statusText: string;
  };
}
```

## Step 2: Add the Tool Function

Open your `tools.ts` file and add this function:

```typescript
// tools.ts
import type { CalculatorOperation, ToolResult, DadJokeResponse, APIError } from './types';

/**
 * Calculator tool (from before)
 */
export function calculator(a: number, b: number, operation: CalculatorOperation): ToolResult {
  // ... existing calculator code ...
}

/**
 * Fetches a random dad joke from the icanhazdadjoke API
 */
export async function getDadJoke(): Promise<ToolResult> {
  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'My AI Agent Tutorial (https://github.com/yourusername/tutorial)'
      }
    });
    
    if (!response.ok) {
      return `Error: Failed to fetch joke (${response.status})`;
    }
    
    const data = await response.json() as DadJokeResponse;
    return data.joke;
    
  } catch (error) {
    const apiError = error as APIError;
    return `Error: ${apiError.message}`;
  }
}
```

## Understanding This Code

Let's break it down:

### The `async` Keyword
```typescript
export async function getDadJoke(): Promise<ToolResult> {
```
- We use `async` because fetching from an API takes time
- The function will return a Promise

### The Fetch Call
```javascript
const response = await fetch('https://icanhazdadjoke.com/', {
  headers: { ... }
});
```
- `fetch()` makes an HTTP request to the API
- `await` waits for the response
- **Headers** tell the API we want JSON back

### Why Those Headers?

```javascript
headers: {
  'Accept': 'application/json',  // "Give me JSON, not HTML"
  'User-Agent': 'My AI Agent Tutorial (...)' // Identifies who's calling
}
```

The API requires these headers:
- `Accept: application/json` - Without this, you get HTML instead of JSON
- `User-Agent` - Polite way to identify your app

### Error Handling
```javascript
if (!response.ok) {
  return `Error: Failed to fetch joke (${response.status})`;
}
```
- Checks if the request succeeded (status 200-299)
- Returns helpful error message if something went wrong

### Getting the Joke
```typescript
const data = await response.json() as DadJokeResponse;
return data.joke;
```
- Parse the JSON response
- Extract just the joke text
- Return it as a string

## Step 3: Add the Tool Definition

Open `toolDefinitions.ts` and add this to the `toolDefinitions` array:

```typescript
// toolDefinitions.ts
import type OpenAI from 'openai';

export const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  // ... existing calculator definition ...
  
  {
    type: "function",
    function: {
      name: "get_dad_joke",
      description: "Fetches a random dad joke from the internet. Use this when the user asks for a joke, wants to laugh, or needs cheering up.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
];
```

## Why Empty Parameters?

Notice `properties: {}` and `required: []`?

This tool doesn't need any parameters! It just fetches a random joke. But we still need to include the `parameters` object with its structure - that's part of OpenAI's schema.

## Step 4: Test the Tool

Let's test it before integrating it into the agent.

Create a quick test file called `test-dad-joke.ts`:

```typescript
// test-dad-joke.ts
import { getDadJoke } from './tools';

console.log('Fetching a dad joke...\n');

getDadJoke().then(joke => {
  console.log('🎭 ' + joke);
}).catch(error => {
  console.error('Error:', error);
});
```

Run it:

```bash
npx ts-node test-dad-joke.ts
```

You should see a random dad joke! Try running it a few times to get different jokes.

Example output:
```
Fetching a dad joke...

🎭 Why don't scientists trust atoms? Because they make up everything!
```

## What This Looks Like in Action

When a user says "Tell me a joke", the AI will:

1. **Recognize the need** - "User wants a joke"
2. **Call the tool**:
   ```json
   {
     "name": "get_dad_joke",
     "arguments": {}
   }
   ```
3. **Your code executes** - Calls `getDadJoke()`
4. **API returns** - `"Why don't scientists trust atoms? Because they make up everything!"`
5. **AI responds** - "Here's a joke for you: Why don't scientists trust atoms? Because they make up everything! 😄"

## Handling Errors Gracefully

What if the API is down? Our error handling catches it:

### Error Handling
```typescript
catch (error) {
  const apiError = error as APIError;
  return `Error: ${apiError.message}`;
}

The AI will receive the error message and can tell the user something like:
> "Sorry, I couldn't fetch a joke right now. The joke API might be temporarily unavailable."

## Your Tool Arsenal So Far

You now have two tools:

1. **calculator** - Does math without external calls
2. **get_dad_joke** - Fetches data from an external API

These demonstrate the two main types of tools:
- 🔧 **Computational tools** (calculator, text processing, etc.)
- 🌐 **API tools** (weather, jokes, search, databases)

## Quick Exercise (Optional)

Try adding a third tool! Here's a challenge:

**Tool idea:** `get_random_number`
- Takes two parameters: `min` and `max`
- Returns a random number between them
- Hint: `Math.floor(Math.random() * (max - min + 1)) + min`

Can you create both the function and the definition? Give it a try!

## What's Next?

We have:
- ✅ Two working tools
- ✅ Tool definitions that tell the AI about them

Next, we need to build the **tool execution loop** - the code that:
1. Sends tools to the AI
2. Detects when the AI wants to call a tool
3. Executes the tool
4. Sends the result back
5. Gets the final response

Let's build that! 🚀
