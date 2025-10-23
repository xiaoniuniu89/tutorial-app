---
title: "Defining Travel Tool Schemas"
order: 3
description: "Create OpenAI tool definitions for multi-step travel booking"
estimatedTime: "12 minutes"
---

# Defining Travel Tool Schemas

Now we'll tell OpenAI about our travel tools. These definitions are crucial - they help the AI understand **when** to use each tool and **how** to chain them together.

## Update Tool Definitions

Update your `toolDefinitions.ts` to include the new travel tools:

```typescript
// toolDefinitions.ts
import type OpenAI from 'openai';

/**
 * All tool definitions for OpenAI
 */
export const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  // Existing tools from Part 2
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
  },
  {
    type: "function",
    function: {
      name: "get_dad_joke",
      description: "Fetches a random dad joke from an API",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  
  // New travel tools
  {
    type: "function",
    function: {
      name: "search_train_routes",
      description: "Searches for available train routes between Irish cities (Dublin, Galway, Cork, Belfast)",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Departure city (e.g., 'Dublin', 'Galway', 'Cork', 'Belfast')"
          },
          to: {
            type: "string",
            description: "Destination city (e.g., 'Dublin', 'Galway', 'Cork', 'Belfast')"
          }
        },
        required: ["from", "to"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "book_train",
      description: "Books a train ticket for a specific route and departure time. Use this AFTER searching routes to get available times.",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Departure city"
          },
          to: {
            type: "string",
            description: "Destination city"
          },
          departure: {
            type: "string",
            description: "Departure time in HH:MM format (e.g., '09:00', '14:00')"
          },
          passengerName: {
            type: "string",
            description: "Name of the passenger (optional, defaults to 'Guest')"
          }
        },
        required: ["from", "to", "departure"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_hotels",
      description: "Searches for available hotels in an Irish city with optional price filtering",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City to search in (e.g., 'Galway', 'Cork', 'Belfast')"
          },
          maxPrice: {
            type: "number",
            description: "Maximum price per night in euros (optional)"
          }
        },
        required: ["city"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "book_hotel",
      description: "Books a hotel room. Use this AFTER searching hotels to get hotel IDs.",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Hotel ID from search results (e.g., 'h1', 'h2')"
          },
          checkIn: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format"
          },
          checkOut: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format"
          },
          guestName: {
            type: "string",
            description: "Name of the guest (optional, defaults to 'Guest')"
          }
        },
        required: ["hotelId", "checkIn", "checkOut"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_activities",
      description: "Gets a list of tourist activities and things to do in an Irish city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City to get activities for (e.g., 'Galway', 'Cork', 'Belfast')"
          }
        },
        required: ["city"]
      }
    }
  }
];
```

## Understanding Tool Dependencies

Notice how some tools **depend on others**:

### Search → Book Pattern

```typescript
// Step 1: Search (get available options)
search_train_routes("Dublin", "Galway")
// Returns: [{ departure: "09:00", ... }, { departure: "14:00", ... }]

// Step 2: Book (use info from search)
book_train("Dublin", "Galway", "09:00")
// Returns: { bookingId: "TRAIN-123", ... }
```

The AI needs to:
1. First **search** to see what's available
2. Then **book** using information from the search

This is the essence of **multi-step reasoning**!

## Good vs Bad Tool Descriptions

The descriptions help the AI understand **when** and **how** to use tools together.

### ✅ Good Descriptions

```typescript
description: "Books a train ticket. Use this AFTER searching routes to get available times."
```
- Tells AI this comes AFTER searching
- Explains what information it needs first

```typescript
description: "Searches for available train routes between Irish cities"
```
- Clear about what it does
- Specifies the scope (Irish cities)

### ❌ Bad Descriptions

```typescript
description: "Books train"  // Too vague
```

```typescript
description: "Gets trains and books them"  // Confusing - does two things?
```

```typescript
description: "Train API"  // Not descriptive
```

## Tool Naming Conventions

Notice our naming pattern:

| Pattern | Examples | Purpose |
|---------|----------|---------|
| `search_*` | `search_train_routes`, `search_hotels` | Returns list of options |
| `book_*` | `book_train`, `book_hotel` | Makes a reservation |
| `get_*` | `get_activities`, `get_dad_joke` | Retrieves information |

This consistency helps the AI understand tool purposes!

## Required vs Optional Parameters

Some parameters are optional to give the AI flexibility:

```typescript
{
  passengerName: {
    type: "string",
    description: "Name of the passenger (optional, defaults to 'Guest')"
  }
}
// Not in "required" array!
```

If the user doesn't provide a name, the AI can:
- Skip the parameter (use default)
- Ask the user for it
- Use context from conversation

## The Power of Good Definitions

With clear tool definitions, the AI can automatically:

✅ **Understand the workflow** - Search before booking  
✅ **Chain tools logically** - Get hotel in same city as train destination  
✅ **Fill in details** - Use search results to inform booking  
✅ **Complete complex tasks** - Book entire trips autonomously  

## Example: How AI Uses These Definitions

**User request:** "Book a weekend in Galway"

**AI's reasoning:**
1. Sees `search_train_routes` - "I need to find trains to Galway"
2. Sees `book_train` description says "AFTER searching" - "I'll search first"
3. Gets search results with departure times
4. Sees `book_train` needs departure time - "I'll use '09:00' from the results"
5. Sees `search_hotels` for the destination city - "Now find hotels in Galway"
6. Gets hotel IDs from search
7. Sees `book_hotel` needs hotel ID - "I'll use 'h1' from results"

The AI **chains** these tools because the definitions make the dependencies clear!

Next, we'll build the autonomous execution loop that lets the AI keep calling tools until the task is done! 🚀
