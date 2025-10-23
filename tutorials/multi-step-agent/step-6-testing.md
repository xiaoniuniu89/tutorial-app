---
title: "Testing Your Autonomous Agent"
order: 6
description: "Run comprehensive tests and see your multi-step agent book complete trips"
estimatedTime: "15 minutes"
---

# Testing Your Autonomous Agent

Time to see your autonomous agent in action! Let's test it with realistic Irish travel scenarios.

## Setup and Installation

Make sure your project is ready:

### 1. Check package.json

Your `package.json` should look like this:

```json
{
  "name": "multi-step-agent",
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

### 2. Check tsconfig.json

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
```

### 3. Check .env file

```bash
OPENAI_API_KEY=your_actual_api_key_here
```

### 4. Install dependencies

```bash
npm install
```

## File Checklist

Make sure you have all these files:

```
multi-step-agent/
├── package.json
├── tsconfig.json
├── .env
├── types.ts              (from Step 2)
├── mockData.ts           (from Step 2)
├── tools.ts              (from Step 2)
├── toolDefinitions.ts    (from Step 3)
├── openai-client.ts      (from Step 4)
└── index.ts              (from Step 5)
```

## Running the Agent

Start the development server:

```bash
npm run dev
```

You should see:
```
🤖 Irish Travel Agent Ready! Type "exit" to quit.

Try: "Book me a weekend trip to Galway"

You: 
```

## Test Scenarios

### Test 1: Simple Weekend Trip

**Input:**
```
Book me a weekend trip to Galway
```

**Expected Agent Behavior:**
```
🔄 Iteration 1/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: search_train_routes
  📝 Args: { from: 'Dublin', to: 'Galway' }
  ✅ Result: [array of train routes]

🔄 Iteration 2/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: book_train
  📝 Args: { from: 'Dublin', to: 'Galway', departure: '09:00' }
  ✅ Result: {"bookingId":"TRAIN-123..."...}

🔄 Iteration 3/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: search_hotels
  📝 Args: { city: 'Galway' }
  ✅ Result: [array of hotels]

🔄 Iteration 4/15
🔧 AI wants to call 1 tool(s)
  📞 Calling: book_hotel
  📝 Args: { hotelId: 'h1', checkIn: '2025-11-01', checkOut: '2025-11-03' }
  ✅ Result: {"bookingId":"HOTEL-456..."...}

✅ Agent finished task

Agent: I've successfully booked your weekend trip to Galway! Here are the details:

Train: Dublin → Galway departing at 09:00, arriving at 11:30 (€25)
Booking ID: TRAIN-123...

Hotel: Clayton Hotel Galway, 2 nights (€240)
Check-in: 2025-11-01, Check-out: 2025-11-03
Booking ID: HOTEL-456...

Total Cost: €265
```

**What to observe:**
- ✅ Searches before booking
- ✅ Uses results from search (departure time, hotel ID)
- ✅ Books both train and hotel
- ✅ Provides clear summary with booking IDs
- ✅ Stops after completing the task

### Test 2: Budget-Conscious Trip

**Input:**
```
Book me a trip to Cork, but keep the hotel under €120 per night
```

**Expected Agent Behavior:**
```
🔄 Iteration 1/15
  📞 Calling: search_train_routes
  📝 Args: { from: 'Dublin', to: 'Cork' }

🔄 Iteration 2/15
  📞 Calling: book_train
  📝 Args: { from: 'Dublin', to: 'Cork', departure: '08:30' }

🔄 Iteration 3/15
  📞 Calling: search_hotels
  📝 Args: { city: 'Cork', maxPrice: 120 }

🔄 Iteration 4/15
  📞 Calling: book_hotel
  📝 Args: { hotelId: 'h4', checkIn: '...', checkOut: '...' }

✅ Agent finished task

Agent: I've booked your trip to Cork within budget:

Train: Dublin → Cork at 08:30 (€28)
Hotel: Clayton Hotel Cork, €110/night (within your €120 budget)
...
```

**What to observe:**
- ✅ Respects the budget constraint
- ✅ Chooses a hotel under €120/night

### Test 3: With Activities

**Input:**
```
Book a 2-day trip to Galway and suggest things to do there
```

**Expected Agent Behavior:**
```
[Books train and hotel as before...]

🔄 Iteration 5/15
  📞 Calling: get_activities
  📝 Args: { city: 'Galway' }
  ✅ Result: [array of activities]

✅ Agent finished task

Agent: Your Galway trip is booked! Here's your itinerary:

Transportation: Train at 09:00, arrives 11:30 (€25)
Accommodation: Clayton Hotel Galway, 2 nights (€240)

Recommended Activities in Galway:
• Cliffs of Moher Tour - €55, 6 hours
• Galway Food Tour - €45, 3 hours  
• Aran Islands Ferry - €35, 8 hours

Total travel cost: €265 (plus activities)
```

**What to observe:**
- ✅ Completes booking first
- ✅ Then fetches activities
- ✅ Provides comprehensive itinerary

### Test 4: Multi-City Trip (Advanced)

**Input:**
```
I want to visit Galway for one night, then continue to Cork for another night
```

**Expected Agent Behavior:**
```
[Books Dublin → Galway train]
[Books Galway hotel for 1 night]
[Searches Galway → Dublin trains - won't find direct Galway-Cork]
[May book Galway → Dublin → Cork, or explain direct route not available]
```

**What to observe:**
- ✅ Handles multi-leg journeys
- ✅ Adapts when direct routes don't exist
- ✅ Books hotels in correct cities

### Test 5: Ambiguous Request

**Input:**
```
I want to go on a trip
```

**Expected Agent Behavior:**
```
✅ Agent finished task

Agent: I'd be happy to help you book a trip! Could you provide:
- Which city would you like to visit? (Galway, Cork, or Belfast)
- When would you like to travel?
- How many nights would you like to stay?

Once I have these details, I can search for trains and hotels for you.
```

**What to observe:**
- ✅ Doesn't make assumptions
- ✅ Asks for clarification
- ✅ No tool calls made (appropriate!)

### Test 6: Invalid Destination

**Input:**
```
Book me a train to London
```

**Expected Agent Behavior:**
```
🔄 Iteration 1/15
  📞 Calling: search_train_routes
  📝 Args: { from: 'Dublin', to: 'London' }
  ✅ Result: No train routes found from Dublin to London

✅ Agent finished task

Agent: I'm sorry, but I can only book trains within Ireland. 
The available destinations from Dublin are:
- Galway
- Cork
- Belfast

Would you like to book a trip to one of these cities instead?
```

**What to observe:**
- ✅ Attempts the search (good!)
- ✅ Handles "not found" gracefully
- ✅ Suggests alternatives

## Debugging Common Issues

### Issue 1: Agent Doesn't Search Before Booking

**Symptom:**
```
📞 Calling: book_train
❌ Error: No available train...
```

**Fix:** Strengthen system message:
```typescript
"CRITICAL: Always search_train_routes before book_train, 
and search_hotels before book_hotel. You need the IDs and times from search results."
```

### Issue 2: Agent Hits Iteration Limit

**Symptom:**
```
⚠️ Reached maximum iterations
```

**Possible causes:**
- Task is genuinely complex
- Agent is stuck in a loop
- Tools keep failing

**Fix:** 
1. Check logs to see what's happening
2. Simplify the request
3. Fix failing tools
4. Increase MAX_ITERATIONS if needed

### Issue 3: Agent Makes Up Booking IDs

**Symptom:**
Agent returns details without actually calling tools

**Fix:** System message:
```typescript
"You must ONLY use real booking IDs from tool responses. 
Never invent or assume booking details."
```

### Issue 4: TypeScript Errors

**Common errors:**
```
Cannot find module 'openai'
```

**Fix:**
```bash
npm install openai dotenv
npm install -D @types/node typescript ts-node
```

## Performance Metrics

Track how your agent performs:

| Scenario | Expected Iterations | Expected Tools | Time |
|----------|-------------------|----------------|------|
| Simple trip | 4-5 | 4 (search+book×2) | 5-8s |
| With budget | 4-5 | 4 | 5-8s |
| With activities | 5-6 | 5 | 6-10s |
| Multi-city | 6-8 | 6+ | 8-12s |
| Ambiguous | 0-1 | 0 | 2-3s |

## What You've Built

Congratulations! You now have an autonomous agent that can:

✅ **Plan complex tasks** - Break down "book a trip" into steps  
✅ **Chain tool calls** - Use output from one tool in another  
✅ **Make decisions** - Choose which tools to use and when  
✅ **Handle errors** - Adapt when things go wrong  
✅ **Complete autonomously** - Finish tasks without hand-holding  
✅ **Stay safe** - Stop after reasonable limits  

## Next Steps

Want to extend your agent? Try adding:

1. **Real APIs** - Replace mocks with actual Irish Rail, Booking.com APIs
2. **Calendar integration** - Check user's actual availability
3. **Payment processing** - Handle real bookings
4. **More sophisticated planning** - Optimize for price, time, or preferences
5. **Conversation memory** - Remember user preferences across sessions
6. **Error recovery** - Retry failed bookings automatically
7. **Parallel tool calls** - Call multiple tools simultaneously (OpenAI supports this!)

## Series Complete! 🎉

You've now built three increasingly sophisticated agents:

**Part 1:** Basic conversational agent with memory  
**Part 2:** Agent with single-step tool calling  
**Part 3:** Autonomous multi-step reasoning agent  

You understand the fundamentals of building AI agents from scratch. The patterns you've learned here apply to any agent framework or library - you've learned the core concepts that power tools like LangChain, AutoGPT, and more!

Keep building! 🚀
