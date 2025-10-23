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
    "dev": "npx ts-node index.ts",
    "build": "npx tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "openai": "^4.70.3",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0"
  }
}
```

## Setup tsconfig.json

Create a TypeScript configuration file:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}

## Environment Setup

Make sure your `.env` file has your OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Install Dependencies

First, install all dependencies:

```bash
npm install
```

## Test 1: Calculator Tool

Start the development server and ask a math question:

```bash
npm run dev
```

Then type in the chat:

```
You: What is 50 times 30?
```

Expected output should include something like:

```
🔧 AI is calling tool: calculator
📝 Arguments: { a: 50, b: 30, operation: 'multiply' }
✅ Tool result: 1500

AI: The answer is 1,500
```

## Test 2: Dad Joke Tool

Try asking for a joke:

```
You: Tell me a dad joke
```

Expected output should include:

```
🔧 AI is calling tool: get_dad_joke
📝 Arguments: {}
✅ Tool result: Why don't scientists trust atoms? Because they make up everything!

AI: Here's a dad joke for you: Why don't scientists trust atoms? Because they make up everything! 😄
```

## Test 3: Multiple Tools

Try a request that might use both tools:

```
You: Calculate 100 divided by 4 and then tell me a joke to celebrate
```

The AI might call both tools in sequence!

## Test 4: Error Handling

Test error conditions:

```
You: What is 10 divided by 0?
```

Should handle the division by zero gracefully:

```
✅ Tool result: Error: Cannot divide by zero
AI: I can't divide by zero as that's mathematically undefined.
```

## Building for Production

When ready for production, build the TypeScript:

```bash
npm run build
npm start
```

This compiles your TypeScript to JavaScript and runs the compiled version.