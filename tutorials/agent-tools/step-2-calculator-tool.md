---
title: "Building a Calculator Tool"
order: 2
description: "Create your first tool - a simple calculator that the AI can use"
estimatedTime: "10 minutes"
---

# Building a Calculator Tool

Let's build your first tool! We'll create a simple calculator that can add, subtract, multiply, and divide.

## What Makes a Tool?

Every tool needs two parts:
1. **Definition** - Tells the AI what the tool does and how to use it
2. **Implementation** - The actual JavaScript function that does the work

## Step 1: Create the Calculator Function

Create a new file called `tools.js`:

```javascript
// tools.js

/**
 * Calculator tool - performs basic math operations
 */
export function calculator(a, b, operation) {
  const numA = Number(a);
  const numB = Number(b);
  
  switch (operation) {
    case 'add':
      return numA + numB;
    case 'subtract':
      return numA - numB;
    case 'multiply':
      return numA * numB;
    case 'divide':
      if (numB === 0) {
        return "Error: Cannot divide by zero";
      }
      return numA / numB;
    default:
      return `Error: Unknown operation '${operation}'`;
  }
}
```

Simple! Just a JavaScript function that takes two numbers and an operation.

## Step 2: Define the Tool for OpenAI

Now we need to tell OpenAI about this tool. Create a new file called `toolDefinitions.js`:

```javascript
// toolDefinitions.js

/**
 * Tool definitions for OpenAI
 * These tell the AI what tools exist and how to use them
 */
export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "calculator",
      description: "Performs basic math operations like add, subtract, multiply, and divide",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
            description: "The first number"
          },
          b: {
            type: "number",
            description: "The second number"
          },
          operation: {
            type: "string",
            enum: ["add", "subtract", "multiply", "divide"],
            description: "The math operation to perform"
          }
        },
        required: ["a", "b", "operation"]
      }
    }
  }
];
```

## Understanding the Definition

Let's break down what each part means:

- **`type: "function"`** - This is a function tool (vs other tool types)
- **`name: "calculator"`** - The AI will use this name when calling the tool
- **`description`** - Helps the AI understand WHEN to use this tool
- **`parameters`** - Describes what arguments the function needs
  - **`properties`** - Each parameter (a, b, operation)
  - **`type`** - The data type (number, string, etc.)
  - **`enum`** - For operation, only these values are allowed
  - **`required`** - These parameters must be provided

## How the AI Uses This

When you ask "What's 50 times 20?", the AI will:

1. Read the tool description
2. Recognize it needs to calculate something
3. Generate a tool call like this:

```json
{
  "name": "calculator",
  "arguments": {
    "a": 50,
    "b": 20,
    "operation": "multiply"
  }
}
```

Your code will then:
1. Parse this JSON
2. Call `calculator(50, 20, 'multiply')`
3. Get back `1000`
4. Send that result to the AI
5. AI responds: "The answer is 1,000"

## Quick Test

Before we integrate this into the agent, let's test the calculator function directly.

Add this to the bottom of `tools.js` temporarily:

```javascript
// Quick test (remove this later)
console.log(calculator(10, 5, 'add'));        // Should print: 15
console.log(calculator(10, 5, 'multiply'));   // Should print: 50
console.log(calculator(10, 0, 'divide'));     // Should print: Error message
```

Run it:

```bash
node tools.js
```

You should see:
```
15
50
Error: Cannot divide by zero
```

✅ Perfect! Remove those test lines and we're ready to integrate this into the agent.

## What's Next?

Now we have:
- ✅ A calculator function that works
- ✅ A tool definition that tells the AI about it

Next, we'll learn about the tool definition format in more detail, then add a more interesting tool - the Dad Jokes API! 🎭
