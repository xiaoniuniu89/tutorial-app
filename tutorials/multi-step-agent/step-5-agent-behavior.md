---
title: "Understanding Agent Behavior"
order: 5
description: "Learn how to guide autonomous agent behavior and handle edge cases"
estimatedTime: "10 minutes"
---

# Understanding Agent Behavior

Now that we have an autonomous agent, we need to understand how to **guide** its behavior and handle tricky situations.

## The Challenge of Autonomy

When an agent can make multiple decisions in a row, you need to think about:
- How does it know when to stop?
- What if it makes mistakes?
- How do you guide it without micromanaging?
- What about edge cases?

## Using System Messages Effectively

The system message is your **primary control** over agent behavior. Let's upgrade it!

### Basic System Message (Part 2)

```typescript
{ 
  role: 'system', 
  content: 'You are a helpful assistant.' 
}
```

This is too vague for autonomous agents!

### Autonomous Agent System Message

Update your `index.ts` with this improved system message:

```typescript
// index.ts
import * as readline from 'readline';
import { chat } from './openai-client';
import type { ChatMessageArray } from './types';

// Enhanced system message for autonomous behavior
const messages: ChatMessageArray = [
  { 
    role: 'system', 
    content: `You are a helpful Irish travel booking assistant.

Your goal: Complete travel booking tasks autonomously by using the available tools.

Guidelines:
1. When asked to book a trip, search for options first, then book
2. Always confirm bookings with specific details (times, prices, booking IDs)
3. If something is unavailable, suggest alternatives
4. Complete the entire task before responding to the user
5. Be concise in your final response - just give the key booking details

Available tools:
- search_train_routes: Find trains between cities
- book_train: Book a specific train (use departure time from search results)
- search_hotels: Find hotels in a city
- book_hotel: Book a hotel (use hotel ID from search results)
- get_activities: Get tourist activities in a city

Important: Always search before booking to get accurate IDs and times.`
  }
];

const MAX_MESSAGES = 20; // Increased for longer autonomous conversations

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function trimMemory(): void {
  if (messages.length > MAX_MESSAGES + 1) {
    const systemMessage = messages[0];
    const recentMessages = messages.slice(-MAX_MESSAGES);
    messages.length = 0;
    messages.push(systemMessage, ...recentMessages);
    
    console.log('💭 (Trimmed old messages to save memory)\n');
  }
}

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

    messages.push({ role: 'user', content: input });

    try {
      const response = await chat(messages);
      messages.push({ role: 'assistant', content: response });
      
      console.log(`\nAgent: ${response}\n`);
      
      trimMemory();
    } catch (error) {
      console.error('Error:', error);
    }

    chatLoop();
  });
}

console.log('🤖 Irish Travel Agent Ready! Type "exit" to quit.\n');
console.log('Try: "Book me a weekend trip to Galway"\n');
chatLoop();
```

## Breaking Down the System Message

### 1. Clear Identity
```
You are a helpful Irish travel booking assistant.
```
Sets the context and domain.

### 2. Primary Goal
```
Your goal: Complete travel booking tasks autonomously by using the available tools.
```
Tells the agent to **complete tasks**, not just answer questions.

### 3. Specific Guidelines
```
1. Search for options first, then book
2. Always confirm bookings with details
3. Suggest alternatives if unavailable
4. Complete the entire task before responding
5. Be concise in final response
```

These guide the agent's decision-making process.

### 4. Tool Awareness
```
Available tools:
- search_train_routes: Find trains between cities
- book_train: Book a specific train
...
```

Reminds the agent what tools exist (though it also gets this from tool definitions).

### 5. Critical Instructions
```
Important: Always search before booking to get accurate IDs and times.
```

Prevents common mistakes!

## Common Autonomous Behavior Patterns

### Pattern 1: Search → Select → Book

**Good behavior:**
```
1. search_train_routes("Dublin", "Galway")
2. book_train("Dublin", "Galway", "09:00") ✅
```

**Bad behavior (prevented by system message):**
```
1. book_train("Dublin", "Galway", "09:00") ❌
   Error: Need to search first to get valid times
```

### Pattern 2: Error Recovery

**Good behavior:**
```
1. book_hotel("h99") → Error: Hotel not found
2. search_hotels("Galway") → Get valid IDs
3. book_hotel("h1") ✅
```

The agent should **adapt** when tools fail!

### Pattern 3: Task Completion Recognition

**Good behavior:**
```
1. book_train(...) → Success
2. book_hotel(...) → Success
3. Return text response with summary ✅
```

**Bad behavior:**
```
1. book_train(...) → Success
2. book_hotel(...) → Success
3. search_hotels(...) → Why? Task is done! ❌
```

## Handling Edge Cases

### Edge Case 1: Ambiguous Requests

**User:** "Book a trip"

**Problem:** Where? When? How long?

**Good agent behavior:**
```typescript
// Agent should ask for clarification, not guess
"I'd be happy to help! Could you tell me:
- Which city you'd like to visit?
- When you'd like to travel?
- How many nights you'd like to stay?"
```

**Update system message to handle this:**
```
If the user's request is missing critical information (destination, dates), 
ask for clarification before using tools.
```

### Edge Case 2: No Results

**User:** "Book a train to London"

**Tools return:** No trains found (London isn't in our Irish routes!)

**Good agent behavior:**
```typescript
// Agent should explain limitations
"I can only book trains within Ireland (Dublin, Galway, Cork, Belfast). 
Would you like to travel to one of these cities instead?"
```

### Edge Case 3: Iteration Limit Hit

If agent hits MAX_ITERATIONS, it might mean:
- Task is too complex
- Agent is confused/stuck
- Tools are failing repeatedly

**Current handling:**
```typescript
return 'I apologize, but I\'ve reached my processing limit...';
```

You could improve this:
```typescript
return 'I\'ve tried many steps but haven\'t completed the task. 
        What I managed to do: [summarize progress]
        What I\'m stuck on: [explain issue]';
```

## Observing Agent Reasoning

The console logs let you see the agent's "thought process":

```
🔄 Iteration 1/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: search_train_routes
  📝 Args: { from: 'Dublin', to: 'Galway' }
  ✅ Result: [train data]

🔄 Iteration 2/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: book_train
  📝 Args: { from: 'Dublin', to: 'Galway', departure: '09:00' }
  ✅ Result: {"bookingId":"TRAIN-123"...}

✅ Agent finished task
```

You can see:
- What tools it chooses
- In what order
- What data it uses from previous results
- When it decides it's done

## Testing Different Behaviors

Try these prompts to test agent behavior:

### Test 1: Complete Task
```
"Book a weekend trip to Galway"
```
Should: Search trains → Book train → Search hotels → Book hotel → Summarize

### Test 2: Ambiguous Request
```
"I want to go somewhere"
```
Should: Ask for clarification (destination, dates)

### Test 3: Partial Information
```
"Book me a hotel in Cork"
```
Should: Ask about dates (check-in/check-out)

### Test 4: Invalid Request
```
"Book a train to Paris"
```
Should: Explain limitations, suggest Irish cities

### Test 5: Complex Multi-City
```
"Plan a tour: Dublin to Galway, stay one night, then Galway to Cork"
```
Should: Handle multiple legs of journey

## Adjusting MAX_ITERATIONS

```typescript
const MAX_ITERATIONS = 15;
```

**Too low (e.g., 5):** Agent might not finish complex tasks  
**Too high (e.g., 50):** Expensive, slow, might indicate problems  
**Goldilocks (10-20):** Good for most multi-step tasks  

For our travel booking scenarios, 15 is reasonable:
- Simple trip: 4-6 iterations
- Complex trip: 8-12 iterations
- Error recovery: +2-3 iterations

## Key Takeaways

✅ **System messages are crucial** for guiding autonomous behavior  
✅ **Expect failures** and make agents resilient  
✅ **Observe the logs** to understand agent reasoning  
✅ **Test edge cases** to find limitations  
✅ **Adjust limits** based on your use case  

Next, we'll run real tests and see our autonomous agent in action! 🚀
