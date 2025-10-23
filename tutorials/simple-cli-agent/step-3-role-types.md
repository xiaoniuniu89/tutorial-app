---
title: "Understanding Message Roles"
description: "Learn about system, user, and assistant roles for building conversations"
---

# Understanding Message Roles

OpenAI's chat models use three types of messages to build conversations:

## The Three Message Roles

### **System Message**
Sets the AI's personality and rules for the entire conversation.

```typescript
{ role: 'system', content: 'You are a helpful assistant that gives short, clear answers.' }
```

**Think of it as:** Instructions for how the AI should behave
**Use it for:** Setting tone, personality, constraints, or special rules

### **User Message**
What the person types - their questions or requests.

```typescript
{ role: 'user', content: 'What is TypeScript?' }
```

**Think of it as:** The human's input
**Use it for:** Questions, requests, or any user input

### **Assistant Message**
The AI's previous responses. Used to maintain conversation history.

```typescript
{ role: 'assistant', content: 'TypeScript is a typed superset of JavaScript...' }
```

**Think of it as:** What the AI said before
**Use it for:** Keeping track of the conversation so the AI remembers what it said

## Example Conversation

Here's how a full conversation looks:

```typescript
const messages = [
  { 
    role: 'system', 
    content: 'You are a helpful coding tutor. Keep answers simple.' 
  },
  { 
    role: 'user', 
    content: 'What is a variable?' 
  },
  { 
    role: 'assistant', 
    content: 'A variable is a container that stores a value...' 
  },
  { 
    role: 'user', 
    content: 'Can you show me an example?' 
  }
];
```

The AI sees ALL these messages and can:
- Follow the system instructions
- Remember what it said before
- Answer the latest user question with full context

## Key Takeaways

✅ **System** = AI's personality and rules (first message)
✅ **User** = What the person types
✅ **Assistant** = What the AI responded (for memory)

In the next step, we'll use these roles to build a chat interface with conversation memory!