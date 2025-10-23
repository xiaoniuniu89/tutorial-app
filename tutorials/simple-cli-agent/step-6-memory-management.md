---
title: "Managing Conversation Memory"
description: "Learn how AI memory works, why it matters, and simple strategies to manage long conversations"
---

# Managing Conversation Memory

Our chat agent remembers everything - but that's actually a problem! Let's learn why and how to fix it.

## The Memory Problem

Remember how we store every message in an array?

```typescript
const messages = [
  { role: 'system', content: '...' },
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
  { role: 'user', content: 'What's 2+2?' },
  { role: 'assistant', content: 'It's 4!' },
  // ... keeps growing!
];
```

Every time someone types something, we add 2 messages (user + assistant). After a long conversation, this array gets HUGE!

## Why This Matters: Understanding Tokens

Think of tokens like words (though they're actually smaller pieces). When you send messages to OpenAI:

- **You pay for tokens** - The more you send, the more it costs
- **There's a limit** - GPT-4o-mini can only read about 128,000 tokens at once
- **It gets slower** - More tokens = slower responses

**Example:**
```
"Hello, how are you?" = about 6 tokens
"Hello" = 1 token
"," = 1 token
"how" = 1 token
"are" = 1 token
"you" = 1 token
"?" = 1 token
```

A 50-message conversation might be **10,000 tokens**!

## When Memory Becomes Too Much

Imagine this conversation:

```
Message 1: "Tell me about dogs"
Message 2: "What about cats?"
Message 3: "How about birds?"
...
Message 100: "What's 2+2?"
```

Does the AI really need to remember messages 1-99 to answer "What's 2+2?"

**NO!** But we're sending all 100 messages anyway. That's:
- ❌ Wasting money
- ❌ Making it slower
- ❌ Filling up memory with irrelevant info

## Simple Memory Strategy: Keep Recent Messages

**The Idea:** Only keep the last few messages. The AI doesn't need to remember everything from an hour ago!

**Think of it like texting a friend:**
- You remember what you just talked about
- But you don't memorize every text from last month
- That's okay! You can still have a good conversation

## Adding a Simple Memory Limit

Let's update our chat to only keep the last 10 messages:

**index.ts (updated)**
```typescript
import * as readline from 'readline';
import { chat } from './openai-client';

// System message + message history
const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
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
function trimMemory() {
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
async function chatLoop() {
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

## What This Code Does

**1. Set a memory limit:**
```typescript
const MAX_MESSAGES = 10;
```
We'll only remember the last 10 messages (5 exchanges of back-and-forth).

**2. The trimMemory function:**
```typescript
function trimMemory() {
  if (messages.length > MAX_MESSAGES + 1) {
    // Keep system message + last 10 messages
    const systemMessage = messages[0];
    const recentMessages = messages.slice(-MAX_MESSAGES);
    messages.length = 0;
    messages.push(systemMessage, ...recentMessages);
  }
}
```

**Breaking it down:**
- Check if we have more than 11 messages (system + 10 others)
- If yes, keep the system message (always first)
- Keep only the last 10 messages
- Delete everything else

**3. Call it after each response:**
```typescript
messages.push({ role: 'assistant', content: response });
trimMemory();  // Clean up old messages
```

## Testing Memory Trimming

Try this conversation:

```
You: My name is Alex
AI: Nice to meet you, Alex!

You: I'm 25 years old
AI: Got it, Alex who is 25!

You: I like pizza
AI: Cool!

You: I live in New York
AI: Interesting!

You: I'm a teacher
AI: Great job!

You: I have a dog
AI: Awesome!

(After 6 more exchanges...)

You: What's my name?
AI: I don't have that information in our current conversation.
```

**Why did the AI forget?** Because "My name is Alex" was message #1, and after 10+ messages, we trimmed it! The AI only remembers recent messages now.

## Is This Good or Bad?

**GOOD things:**
✅ Saves money (fewer tokens sent)
✅ Faster responses (less data to process)
✅ Won't hit token limits on long chats
✅ More focused on recent topics

**TRADE-OFFS:**
⚠️ Forgets old information
⚠️ Can't reference things from earlier in the conversation

**This is perfect for:**
- Casual chatting
- Answering quick questions
- When you don't need long-term memory

## Different Memory Strategies

You can adjust based on your needs:

**1. Very Short Memory (5 messages)**
```typescript
const MAX_MESSAGES = 5;
```
Good for: Quick Q&A, saves lots of money

**2. Longer Memory (20 messages)**
```typescript
const MAX_MESSAGES = 20;
```
Good for: In-depth conversations, brainstorming

**3. Unlimited Memory**
```typescript
// Don't call trimMemory() at all
```
Good for: Important conversations you need to reference
Bad for: Will eventually hit token limits and fail!

## Real-World Example

Imagine you're building a customer support chatbot:

**Bad approach:** Remember the entire conversation
```
User: Hello
Bot: Hi!
User: I need help
Bot: Sure!
... 100 messages later ...
User: What's your return policy?
```
The bot doesn't need all 100 messages to answer a policy question!

**Good approach:** Keep last 10 messages
- Recent context is there if needed
- Old small talk is forgotten
- Costs less and works faster

## Advanced Concept: Smart Trimming

Instead of just keeping recent messages, you could:

**Keep important information:**
- Save user's name separately
- Store key facts in a database
- Only trim casual conversation

**Example:**
```typescript
const userInfo = {
  name: '',
  preferences: []
};

// When user says their name, save it
if (input.includes('My name is')) {
  userInfo.name = extractName(input);
}

// Later, you can reference it even if conversation was trimmed
console.log(`Welcome back, ${userInfo.name}!`);
```

We won't implement this now, but it's something to think about for future projects!

## Key Takeaways

🧠 **Memory isn't free** - Every message costs money and uses the AI's "brain space"

📏 **Token limits exist** - You can't send infinite messages (about 128k tokens max)

✂️ **Trimming helps** - Keeping only recent messages saves money and speeds things up

⚖️ **Balance matters** - Too little memory = AI forgets context. Too much = expensive and slow

🎯 **Choose based on use case** - Quick Q&A needs less memory than deep conversations

## Try It Yourself

Experiment with different `MAX_MESSAGES` values:

- Set it to 4 - Watch how quickly it forgets
- Set it to 30 - See how much it remembers
- Set it to 100 - Compare the speed difference

Understanding memory management makes you a better developer! 🚀
