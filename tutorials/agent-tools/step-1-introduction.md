---
title: "Why Agents Need Tools"
order: 1
description: "Understand what tools and function calling are, and why they make AI agents useful"
estimatedTime: "5 minutes"
---

# Why Agents Need Tools

Right now, your agent can chat. It's smart, but it can only _talk_. It can't **do** anything.

Think about it like this:
- 🤖 Your agent knows about the weather, but can't check the current temperature
- 🤖 Your agent knows about math, but can't calculate 2,459 × 8,732 reliably
- 🤖 Your agent knows about jokes, but can't fetch a fresh one from the internet

**Tools change everything.** They give your agent the ability to take actions.

## What Are Tools?

Tools (also called "function calling") let your AI agent:
1. **Recognize when it needs to do something** (like "I should calculate this")
2. **Call a specific function** with the right parameters
3. **Use the result** to give you a better answer

It's like teaching your agent to use a calculator when you ask a math question.

## Real-World Example

**Without tools:**
```
You: What's 12345 × 6789?
Agent: Let me think... approximately 83,810,000
```

**With tools:**
```
You: What's 12345 × 6789?
Agent: [Calls calculator tool]
Agent: The answer is exactly 83,810,205
```

## How It Works (Simple Version)

Here's the basic flow:

1. **User asks a question** → "What's 100 × 25?"
2. **Agent recognizes it needs a tool** → "I should use the calculator"
3. **Agent says what tool to use** → `{"name": "calculator", "arguments": {"a": 100, "b": 25, "operation": "multiply"}}`
4. **Your code runs the function** → Returns `2500`
5. **You send the result back** → Agent sees `2500`
6. **Agent responds to user** → "The answer is 2,500"

## Why This Matters

With tools, your agent becomes an **agent**, not just a chatbot:
- ✅ It can fetch real-time data (weather, stocks, jokes)
- ✅ It can do calculations accurately
- ✅ It can interact with databases
- ✅ It can control other software
- ✅ It can automate tasks

In the next steps, we'll build:
1. A **calculator tool** (simple, no API calls)
2. A **Dad Jokes API tool** (real external API)
3. The **tool execution loop** that makes it all work

Let's get started! 🚀
