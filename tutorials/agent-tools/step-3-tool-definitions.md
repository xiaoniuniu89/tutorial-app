---
title: "Understanding Tool Definitions"
order: 3
description: "Learn the schema for defining tools that OpenAI can call"
estimatedTime: "8 minutes"
---

# Understanding Tool Definitions

Before we add more tools, let's understand **exactly** how tool definitions work. This is the "language" you use to teach the AI about your tools.

## The Basic Structure

Every tool definition follows this pattern:

```javascript
{
  type: "function",
  function: {
    name: "tool_name",
    description: "What this tool does",
    parameters: {
      type: "object",
      properties: {
        // Your parameters here
      },
      required: ["list", "of", "required", "params"]
    }
  }
}
```

## The Three Key Parts

### 1. Name (How the AI Identifies It)

```javascript
name: "get_dad_joke"
```

- Use lowercase with underscores (snake_case)
- Be descriptive but concise
- This is what the AI will say when it wants to call the tool

### 2. Description (When to Use It)

```javascript
description: "Fetches a random dad joke from an API"
```

The description is **crucial**. This is how the AI decides when to use the tool.

**Good descriptions:**
- ✅ "Calculates the sum, difference, product, or quotient of two numbers"
- ✅ "Fetches the current weather for a given city"
- ✅ "Searches for and returns dad jokes"

**Bad descriptions:**
- ❌ "Does math" (too vague)
- ❌ "Tool" (says nothing)
- ❌ "Returns data" (what data?)

### 3. Parameters (What Information It Needs)

This is where you define what arguments the function takes.

#### Simple Parameter Example

```javascript
parameters: {
  type: "object",
  properties: {
    city: {
      type: "string",
      description: "The city name, e.g., 'London' or 'New York'"
    }
  },
  required: ["city"]
}
```

This defines a tool that needs one required string parameter called `city`.

#### Multiple Parameters Example

```javascript
parameters: {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "The search term to look for"
    },
    limit: {
      type: "number",
      description: "Maximum number of results to return"
    },
    include_nsfw: {
      type: "boolean",
      description: "Whether to include NSFW results"
    }
  },
  required: ["query"]  // Only query is required, others are optional
}
```

## Parameter Types

OpenAI supports these parameter types:

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text | `"hello"`, `"New York"` |
| `number` | Integer or decimal | `42`, `3.14` |
| `boolean` | True or false | `true`, `false` |
| `array` | List of items | `["a", "b", "c"]` |
| `object` | Nested structure | `{"name": "John", "age": 30}` |

## Using Enums (Limited Choices)

Sometimes you want to restrict parameters to specific values:

```javascript
operation: {
  type: "string",
  enum: ["add", "subtract", "multiply", "divide"],
  description: "The math operation to perform"
}
```

Now the AI can **only** choose from these four operations.

## Optional vs Required Parameters

```javascript
parameters: {
  type: "object",
  properties: {
    city: {
      type: "string",
      description: "City name"
    },
    units: {
      type: "string",
      enum: ["celsius", "fahrenheit"],
      description: "Temperature units (defaults to celsius)"
    }
  },
  required: ["city"]  // Only city is required, units is optional
}
```

If `units` isn't provided, your function should use a default value.

## Real-World Example: Weather Tool

Let's put it all together:

```javascript
{
  type: "function",
  function: {
    name: "get_weather",
    description: "Gets the current weather for a specific city",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name, e.g., 'Paris' or 'Tokyo'"
        },
        units: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "Temperature unit (default: celsius)"
        }
      },
      required: ["city"]
    }
  }
}
```

When a user asks "What's the weather in Paris?", the AI might generate:

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "Paris"
  }
}
```

Or if they ask "What's the weather in New York in Fahrenheit?":

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "New York",
    "units": "fahrenheit"
  }
}
```

## Common Mistakes

❌ **Vague descriptions**
```javascript
description: "Gets data"  // Too vague!
```

❌ **Wrong parameter type**
```javascript
age: {
  type: "string",  // Should be "number"!
  description: "Person's age"
}
```

❌ **Missing required array**
```javascript
parameters: {
  type: "object",
  properties: { ... }
  // Missing required: [] array!
}
```

## Quick Reference

```javascript
// Complete tool definition template
{
  type: "function",
  function: {
    name: "your_tool_name",
    description: "Clear description of what it does and when to use it",
    parameters: {
      type: "object",
      properties: {
        param1: {
          type: "string",
          description: "What this parameter is for"
        },
        param2: {
          type: "number",
          description: "Another parameter",
          enum: [1, 2, 3]  // Optional: limit to specific values
        }
      },
      required: ["param1"]  // List required parameters
    }
  }
}
```

## What's Next?

Now that you understand the definition format, let's add a fun tool that calls a real external API - the Dad Jokes API! 🎭
