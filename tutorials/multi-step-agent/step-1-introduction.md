---
title: "Understanding Multi-Step Reasoning"
order: 1
description: "Learn the difference between parallel and sequential tool calling, and why chaining matters"
estimatedTime: "8 minutes"
---

# Understanding Multi-Step Reasoning

Your agent from Part 2 can already use multiple tools! If you ask "What's 12 × 2 and tell me a joke", it calls **both** tools and responds with both answers.

But there's a crucial limitation: those tools are **independent**. They don't depend on each other.

What happens when you need tools to work **together in sequence**? When the output of one tool becomes the input to the next?

That's what Part 3 is all about: **sequential tool chaining**.

## First, Let's Clarify: What Part 2 Already Does

**Part 2 can handle parallel, independent tasks:**
```
You: What's 50 × 30 and tell me a joke?

Agent (in ONE response):
  🔧 Calls calculator(50, 30, 'multiply')
  🔧 Calls get_dad_joke()
  ✅ Gets both results
  
Agent: "50 × 30 = 1,500. And here's a joke: 
        Why don't scientists trust atoms? 
        Because they make up everything! 😄"
```

This works because:
- ✅ Both tools are **independent** (calculator doesn't need joke, joke doesn't need calculator)
- ✅ Agent can call them **in parallel**
- ✅ One round-trip to the AI

This is **parallel autonomy** - already powerful!

## The Problem: Dependent Sequential Tasks

But what if you ask: *"Book me a weekend trip to Galway"*?

**This fails with current Part 2 approach:**
```
You: Book me a train to Galway and a hotel

Agent tries to call:
  🔧 book_train("Dublin", "Galway", ???)
  
❌ ERROR: Agent doesn't know what departure times exist!
❌ ERROR: Agent doesn't know which hotel IDs are available!
```

Why? Because:
1. To **book** a train, you need to know available times
2. To **know** available times, you must **search** first
3. To **book** a hotel, you need a hotel ID
4. To **get** a hotel ID, you must **search** first

The tasks are **dependent** - Tool B needs the result from Tool A!

## The Solution: Sequential Multi-Step Reasoning

**What we need - sequential autonomy:**
```
You: Book me a weekend trip to Galway

Agent Round 1:
  🧠 "I don't know what trains exist, I should search first"
  🔧 Calls: search_train_routes("Dublin", "Galway")
  ✅ Gets: [{departure: "09:00"...}, {departure: "14:00"...}]
  
Agent Round 2:
  🧠 "Now I can book the 09:00 train"
  🔧 Calls: book_train("Dublin", "Galway", "09:00")
  ✅ Gets: {bookingId: "TRAIN-123", price: 25}
  
Agent Round 3:
  🧠 "Train booked! Now I need a hotel in Galway"
  🔧 Calls: search_hotels("Galway")
  ✅ Gets: [{id: "h1", name: "Clayton"...}, {id: "h2"...}]
  
Agent Round 4:
  🧠 "I'll book hotel h1"
  🔧 Calls: book_hotel("h1", "2025-11-01", "2025-11-03")
  ✅ Gets: {bookingId: "HOTEL-456", totalPrice: 240}
  
Agent Round 5:
  🧠 "Everything is booked, task complete!"
  💬 "I've booked your Galway trip:
      - Train: 09:00 Dublin → Galway (€25)
      - Hotel: Clayton Hotel, 2 nights (€240)
      Total: €265"
```

The agent **chains** multiple tool calls, using results from earlier calls in later ones!

## Parallel vs Sequential Autonomy: The Key Difference

Let's make this crystal clear with examples:

### Parallel Autonomy (Part 2 ✅ Already Does This)

**Independent tasks that can happen at the same time:**

| Example | Why It Works |
|---------|--------------|
| "Calculate 50 × 30 and tell me a joke" | Calculator doesn't need joke result |
| "What's the weather in Dublin and Cork?" | Two independent API calls |
| "Add 5+5, multiply 10×2, divide 20÷4" | Three separate calculations |

**Pattern:** Tool A ∥ Tool B ∥ Tool C → All results → Response

These work because **no tool needs data from another tool**.

### Sequential Autonomy (Part 3 - What We're Building)

**Dependent tasks that must happen in order:**

| Example | Why It Needs Chaining |
|---------|----------------------|
| "Book a train to Galway" | Must search first to get departure times |
| "Find the cheapest hotel in Cork and book it" | Must search to compare prices, then use hotel ID |
| "Book a round trip" | Must book outbound first, return booking needs those dates |

**Pattern:** Tool A → Result A → Tool B(uses Result A) → Result B → Tool C(uses Result B) → Response

These require **sequential execution** because:
- 🔗 Tool B needs the **output** from Tool A
- 🔗 Tool C needs the **output** from Tool B
- 🔗 Agent must **wait and process** between each step
- 🔗 Agent must **decide** what to do next based on results

## Real-World Examples of Sequential Autonomy

### Example 1: Search → Book Pattern (Dependent)
```
Task: "Book a train to Galway at 9am"

❌ Part 2 Problem:
Agent: book_train("Dublin", "Galway", "09:00")
Error: How does agent know "09:00" exists?

✅ Part 3 Solution:
Round 1: search_train_routes("Dublin", "Galway")
         → [{departure: "09:00"}, {departure: "14:00"}]
Round 2: book_train("Dublin", "Galway", "09:00")
         → {bookingId: "TRAIN-123"}
```

### Example 2: Compare → Select → Book (Dependent)
```
Task: "Book the cheapest hotel in Cork"

❌ Part 2 Problem:
Agent needs to compare prices, but booking requires a hotel ID

✅ Part 3 Solution:
Round 1: search_hotels("Cork")
         → [{id:"h4", price:110}, {id:"h5", price:150}]
Round 2: Agent analyzes results, picks h4 (cheapest)
Round 3: book_hotel("h4", checkIn, checkOut)
         → {bookingId: "HOTEL-789"}
```

### Example 3: Multi-Stage Journey (Dependent)
```
Task: "Book a round trip to Galway for the weekend"

✅ Part 3 Solution:
Round 1: search_train_routes("Dublin", "Galway")
Round 2: book_train("Dublin", "Galway", "09:00") 
         → Get outbound booking details
Round 3: search_train_routes("Galway", "Dublin")
Round 4: book_train("Galway", "Dublin", "16:00")
         → Uses weekend dates from outbound booking
Round 5: Summarize both bookings
```

**Key Point:** Each step **depends on** or **uses information from** the previous step!

## Why Sequential Autonomy Matters

### What Part 2 Gives You:
✅ Multiple independent actions in one request  
✅ Parallel tool execution  
✅ Great for "do X and Y" where X and Y don't relate  

### What Part 3 Adds:
✅ **Tool chaining** - Output from Tool A → Input for Tool B  
✅ **Decision making** - Agent chooses what to do next based on results  
✅ **Task completion** - Agent keeps going until goal is achieved  
✅ **Real workflows** - Mimics how humans actually complete multi-step tasks  
✅ **Stateful execution** - Agent tracks what's been done and what's next  

### The Real Difference:
| Scenario | Part 2 (Parallel) | Part 3 (Sequential) |
|----------|-------------------|---------------------|
| "Calculate 10×5 and tell joke" | ✅ Perfect! | Overkill |
| "Book cheapest hotel in Cork" | ❌ Can't compare prices first | ✅ Search, compare, book |
| "Plan my weekend trip" | ❌ Don't know what to book | ✅ Search, decide, book everything |  

## What We'll Build

In this tutorial, we'll upgrade from **parallel autonomy** to **sequential autonomy**.

### New Capabilities:
1. **Tool Chaining** - Use search results to inform booking decisions
2. **Multi-Round Execution** - Agent continues until task is complete
3. **State Tracking** - Remember what's been accomplished
4. **Dependent Workflows** - Tool B uses data from Tool A
5. **Safe Iteration Limits** - Prevent infinite loops

### Mock Tools (Irish Travel):
- 🚂 `search_train_routes` - Find available trains
- 🚂 `book_train` - Book a specific train (needs departure time from search)
- 🏨 `search_hotels` - Find available hotels  
- 🏨 `book_hotel` - Book a specific hotel (needs hotel ID from search)
- 📍 `get_activities` - Tourist recommendations

### The Pattern:
```
search → analyze results → book → search next → book → complete
```

**By the end:** Your agent will book entire weekend trips (train + hotel + activities) from a single request, automatically searching before booking, using real search results to make bookings, and deciding when the task is complete.

This is the foundation for **truly autonomous agents**! 🚀

Let's get started!
