---
title: "Building the Autonomous Loop"
order: 4
description: "Create a loop that enables sequential tool chaining and multi-round execution"
estimatedTime: "15 minutes"
---

# Building the Autonomous Loop

Here's where we add **sequential autonomy**! We'll modify our agent to continue executing tool after tool, using results from one to inform the next, until the task is complete.

## What Part 2 Already Handles

From Part 2, our agent can already handle **parallel tool calls**:

```typescript
// Part 2 - Single round with multiple tools
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages,
  tools: toolDefinitions
});

// If AI wants tools, execute ALL of them
if (response has tool_calls) {
  for each tool_call {
    execute tool
    add result to messages
  }
  // Get final response
  // STOP ❌
}
```

**What Part 2 does well:**
- ✅ Can call multiple tools in one request ("calculator AND joke")
- ✅ Executes independent tools in parallel
- ✅ One round trip: Request → Tools → Response

**What Part 2 can't do:**
- ❌ Can't use Tool A's result as input for Tool B
- ❌ Can't make decisions between tool calls
- ❌ Can't continue after seeing tool results

## The Solution: Multi-Round Autonomous Loop

We need a loop that enables **sequential chaining**:

1. Call OpenAI with tools
2. If AI wants tools, execute them
3. Send results back **to the AI**
4. **Let AI see results and decide what's next**
5. **Repeat from step 1** until AI gives text response
6. Add safety limits (max iterations)

This lets the agent:
- 🔗 See the results from Tool A
- 🧠 Decide what to do next based on those results
- 🔧 Call Tool B using information from Tool A
- 🔁 Continue until the task is complete

## The Key Insight

**Parallel (Part 2):**
```
User → AI → [Tool A, Tool B, Tool C] → Results → AI → Response
        └──────── ONE round trip ────────┘
```

**Sequential (Part 3):**
```
User → AI → Tool A → Result A → AI → Tool B → Result B → AI → Response
       └─ Round 1 ─┘          └─ Round 2 ─┘          └─ Round 3 ─┘
```

The agent goes back to OpenAI **between tools** to process results and decide next steps!

## Update openai-client.ts

Replace your `chat` and `handleToolCalls` functions with this autonomous version:

```typescript
// openai-client.ts
import OpenAI from 'openai';
import { toolDefinitions } from './toolDefinitions';
import { 
  calculator, 
  getDadJoke,
  searchTrainRoutes,
  bookTrain,
  searchHotels,
  bookHotel,
  getActivities
} from './tools';
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

// Safety limit to prevent infinite loops
const MAX_ITERATIONS = 15;

/**
 * Autonomous chat function with multi-step tool support
 */
export async function chat(messages: ChatMessageArray): Promise<string> {
  let iterationCount = 0;
  
  while (iterationCount < MAX_ITERATIONS) {
    iterationCount++;
    
    console.log(`\n🔄 Iteration ${iterationCount}/${MAX_ITERATIONS}`);
    
    // Call OpenAI with current message history
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      tools: toolDefinitions,
    });

    const aiMessage = response.choices[0]?.message;
    
    if (!aiMessage) {
      throw new Error('No response received from OpenAI');
    }
    
    // Check if AI wants to use tools
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      console.log(`🔧 AI wants to call ${aiMessage.tool_calls.length} tool(s)`);
      
      // Add AI's message to history
      messages.push(aiMessage as AssistantMessageWithTools);
      
      // Execute all tool calls
      await executeToolCalls(messages, aiMessage.tool_calls);
      
      // Continue the loop to let AI process results
      continue;
    }
    
    // No tool calls - AI has finished and provided a text response
    console.log('✅ Agent finished task\n');
    return aiMessage.content || 'No response content';
  }
  
  // Hit the iteration limit
  console.log('⚠️ Reached maximum iterations\n');
  return 'I apologize, but I\'ve reached my processing limit. The task may be too complex or I may be stuck in a loop.';
}

/**
 * Executes tool calls and adds results to message history
 */
async function executeToolCalls(
  messages: ChatMessageArray,
  toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
): Promise<void> {
  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function' && toolCall.function) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      console.log(`  📞 Calling: ${functionName}`);
      console.log(`  📝 Args:`, functionArgs);
      
      // Execute the tool
      const result = await executeToolCall(functionName, functionArgs);
      
      console.log(`  ✅ Result: ${typeof result === 'string' && result.length > 100 ? result.substring(0, 100) + '...' : result}\n`);
      
      // Add tool result to message history
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: String(result)
      });
    }
  }
}

/**
 * Routes tool calls to the correct function
 */
async function executeToolCall(
  functionName: string, 
  args: Record<string, unknown>
): Promise<ToolResult> {
  // Convert function names (snake_case) to match our function names
  switch (functionName) {
    case 'calculator': {
      const calcArgs = args as unknown as CalculatorArgs;
      return calculator(calcArgs.a, calcArgs.b, calcArgs.operation);
    }
      
    case 'get_dad_joke':
      return await getDadJoke();
    
    // Travel tools
    case 'search_train_routes':
      return searchTrainRoutes(
        args.from as string,
        args.to as string
      );
    
    case 'book_train':
      return bookTrain(
        args.from as string,
        args.to as string,
        args.departure as string,
        args.passengerName as string | undefined
      );
    
    case 'search_hotels':
      return searchHotels(
        args.city as string,
        args.maxPrice as number | undefined
      );
    
    case 'book_hotel':
      return bookHotel(
        args.hotelId as string,
        args.checkIn as string,
        args.checkOut as string,
        args.guestName as string | undefined
      );
    
    case 'get_activities':
      return getActivities(args.city as string);
      
    default:
      return `Error: Unknown tool '${functionName}'`;
  }
}
```

## Understanding the Autonomous Loop

Let's break down the key changes:

### 1. The While Loop

```typescript
let iterationCount = 0;

while (iterationCount < MAX_ITERATIONS) {
  iterationCount++;
  // ... agent logic ...
  continue; // Keep going if tools were used
}
```

This loop keeps running as long as:
- The AI calls tools (keeps continuing)
- We haven't hit the safety limit

### 2. Tool Detection and Continuation

```typescript
if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
  // Execute tools
  await executeToolCalls(messages, aiMessage.tool_calls);
  
  // Continue the loop - don't return yet!
  continue;
}
```

After executing tools, we **continue** the loop instead of returning. This lets the AI:
- See the tool results
- Decide what to do next
- Call more tools if needed
- Or finish with a text response

### 3. Natural Exit Condition

```typescript
// No tool calls - AI has finished
return aiMessage.content || 'No response content';
```

The loop exits naturally when the AI provides a text response instead of tool calls.

### 4. Safety Limit

```typescript
const MAX_ITERATIONS = 15;

if (iterationCount >= MAX_ITERATIONS) {
  return 'I apologize, but I\'ve reached my processing limit...';
}
```

Prevents infinite loops if:
- The AI gets confused
- Tools keep failing
- Task is genuinely impossible

## How It Works: Example Flow

**User:** "Book a trip to Galway"

**Parallel approach (Part 2 - doesn't work for this):**
```
Round 1:
  AI tries: book_train(?), book_hotel(?)
  ❌ Fails: Doesn't have departure times or hotel IDs
```

**Sequential approach (Part 3 - works!):**
```
Round 1:
  AI: "I need to search trains first"
  🔧 Calls: search_train_routes("Dublin", "Galway")
  ✅ Result: [train options with times]
  → CONTINUE LOOP (send results back to AI)

Round 2:
  AI: "Perfect! I see 09:00 and 14:00 trains. I'll book 09:00"
  🔧 Calls: book_train("Dublin", "Galway", "09:00")
  ✅ Result: {booking confirmed, price: 25}
  → CONTINUE LOOP

Round 3:
  AI: "Train booked! Now I need a hotel in Galway"
  🔧 Calls: search_hotels("Galway")
  ✅ Result: [hotel options with IDs]
  → CONTINUE LOOP

Round 4:
  AI: "I'll book hotel h1"
  🔧 Calls: book_hotel("h1", "2025-11-01", "2025-11-03")
  ✅ Result: {hotel booking confirmed, price: 240}
  → CONTINUE LOOP

Round 5:
  AI: "Everything is booked, I can respond now"
  💬 Text: "I've booked your trip to Galway: Train €25, Hotel €240..."
  → EXIT LOOP (return response)
```

The agent autonomously chained **4 tool calls** across **5 rounds**, using results from each to inform the next!

## Logging for Visibility

Notice the console logs:

```typescript
console.log(`\n🔄 Iteration ${iterationCount}/${MAX_ITERATIONS}`);
console.log(`🔧 AI wants to call ${aiMessage.tool_calls.length} tool(s)`);
console.log(`  📞 Calling: ${functionName}`);
console.log(`  ✅ Result: ...`);
console.log('✅ Agent finished task\n');
```

These help you see:
- How many iterations it takes
- What tools are being called
- When the task completes
- If you hit the safety limit

## Key Differences from Part 2

| Aspect | Part 2 (Parallel) | Part 3 (Sequential) |
|--------|------------------|---------------------|
| **OpenAI calls** | One call per user request | Multiple calls in a loop |
| **Tool execution** | All tools at once | One round at a time |
| **Between tools** | No processing | AI sees results, decides next step |
| **Tool dependencies** | Tools must be independent | Tools can depend on previous results |
| **Use case** | "Do X and Y" (unrelated) | "Do X, then use X's result in Y" |
| **Example** | "Calculate and joke" ✅ | "Search then book" ✅ |
| **Complexity** | Simpler, faster | More powerful, flexible |

The key insight: **We go back to the AI between tool calls** so it can process results and chain the next action!

## Parallel vs Sequential: Visual Comparison

### Scenario 1: "Calculate 50×30 and tell me a joke"

**Part 2 handles this perfectly:**
```
┌─────────┐
│  User   │ "Calculate 50×30 and tell me a joke"
└────┬────┘
     │
┌────▼────────────────────────────┐
│  OpenAI (1 call)                │
│  "I need calculator and joke"   │
└────┬────────────────────────────┘
     │
     ├─────────────┬─────────────┐
     ▼             ▼             
┌─────────┐   ┌─────────┐       
│calc(50  │   │get_dad  │       
│  ×30)   │   │_joke()  │       
└────┬────┘   └────┬────┘       
     │             │             
     └──────┬──────┘             
            ▼                    
┌───────────────────────────┐   
│  OpenAI (same call)       │   
│  Sees both results        │   
└────┬──────────────────────┘   
     │
┌────▼────┐
│Response:│
│"1500 &  │
│ joke"   │
└─────────┘
```
**✅ One round, parallel execution - perfect!**

### Scenario 2: "Book a train to Galway"

**Part 2 can't handle this:**
```
┌─────────┐
│  User   │ "Book a train to Galway"
└────┬────┘
     │
┌────▼────────────────────────────┐
│  OpenAI (1 call)                │
│  "I'll try to book directly"    │
└────┬────────────────────────────┘
     │
┌────▼───────────────────┐
│book_train("Dublin",    │
│  "Galway", ???)        │
│❌ What time?           │
│❌ Doesn't exist yet!   │
└────────────────────────┘
```

**Part 3 handles this with sequential rounds:**
```
┌─────────┐
│  User   │ "Book a train to Galway"
└────┬────┘
     │
┌────▼────────────────────────┐ Round 1
│  OpenAI                     │
│  "Need to search first"     │
└────┬────────────────────────┘
     │
┌────▼────────────────────────┐
│search_train_routes("Dublin",│
│  "Galway")                  │
│✅ Returns: [{09:00}, {14:00}]│
└────┬────────────────────────┘
     │ Results go back to AI
┌────▼────────────────────────┐ Round 2
│  OpenAI                     │
│  "I see 09:00 available"    │
└────┬────────────────────────┘
     │
┌────▼────────────────────────┐
│book_train("Dublin",         │
│  "Galway", "09:00")         │
│✅ Returns: {bookingId: 123} │
└────┬────────────────────────┘
     │ Results go back to AI
┌────▼────────────────────────┐ Round 3
│  OpenAI                     │
│  "Booking complete!"        │
└────┬────────────────────────┘
     │
┌────▼────┐
│Response:│
│"Booked  │
│ train"  │
└─────────┘
```
**✅ Multiple rounds, sequential execution - needed for dependent tasks!**

## What We Accomplished

✅ **Autonomous execution** - Agent keeps going until done  
✅ **Tool chaining** - Multiple tools in sequence  
✅ **Safe limits** - Won't run forever  
✅ **Visibility** - Logs show what's happening  
✅ **Natural completion** - Stops when task is done  

Next, we'll test this with real travel booking scenarios! 🚀
