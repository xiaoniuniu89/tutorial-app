---
title: "Testing Your Agent"
order: 6
description: "Run and test your tool-enabled agent with real examples"
estimatedTime: "10 minutes"
---

# Testing Your Agent

Now that we've built the complete tool execution loop, let's test everything and see your agent in action! 🚀

## Setup package.json

First, make sure your `package.json` has the right structure:

```json
{
  "name": "agent-tools",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "openai": "^4.70.3",
    "dotenv": "^16.4.5"
  }
}
```

The `"type": "module"` line is crucial — it tells Node.js to use ES modules (so we can use `import`/`export`).

## Environment Setup

Make sure your `.env` file has your OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Test 1: Calculator Tool

Start with a simple math question:

```bash
npm start "What is 50 times 30?"
```

Expected output:

```json
{
  "result": 1500
}
```

You should see the agent call the calculator tool with arguments like `{ a: 50, b: 30, operation: 'multiply' }` and return the result.