---
title: "Run Your CLI Chat Agent"
description: "Set up npm scripts, test the agent, and learn troubleshooting tips"
---

# Run Your CLI Chat Agent

Let's set up the scripts and test your chat agent to make sure everything works!

## Running Your Chat Agent

Run your chat agent with ts-node:

```bash
npx ts-node index.ts
```

Or add a script to `package.json`:

**package.json (add to scripts section)**
```json
{
  "scripts": {
    "chat": "ts-node index.ts"
  }
}
```

Then run:
```bash
npm run chat
```

## Testing Your Agent

Once running, you'll see:

```
🤖 Chat started! Type "exit" to quit.

You: 
```

### Example Conversation

Try this to test the memory:

```
You: My favorite color is blue

AI: That's great! Blue is a wonderful color...

You: What's my favorite color?

AI: Your favorite color is blue!
```

The AI remembers! That's because we're sending the full conversation history with each message.

### Testing Memory

```
You: My name is Sam

AI: Nice to meet you, Sam!

You: I like pizza

AI: Pizza is delicious! What's your favorite topping?

You: What's my name and what food do I like?

AI: Your name is Sam and you like pizza!
```

## Exit the Chat

Type `exit` to quit:

```
You: exit
👋 Goodbye!
```

## Troubleshooting

**"OpenAI API Error"**
- Check your `.env` file has `OPENAI_API_KEY=your-key-here`
- Verify your API key is valid at platform.openai.com
- Make sure you have credits in your OpenAI account

**"Cannot find module"**
- Check your file is named `openai-client.ts` (not `.js`)
- Make sure you're in the correct directory
- Run `npm install` to install dependencies

## 🎉 What You Built

Congratulations! You built a **simple CLI chat agent** with:

✅ **Simple functional code** - No classes or complex patterns
✅ **OpenAI integration** - Real conversations with GPT-4
✅ **Conversation memory** - The AI remembers what was said
✅ **Clean interface** - Easy to use command-line chat

## How It Works

1. **Messages array** stores the full conversation
2. **Chat loop** prompts for input and sends to OpenAI
3. **Each response** gets added to the messages array
4. **Next request** includes all previous messages for context

This simple pattern is the foundation for more complex AI agents!

## Next Steps

Want to make it better? Try adding:
- A `clear` command to reset the conversation
- Different personalities (change the system message)
- Streaming responses (show AI typing in real-time)
- Save/load conversations from files

You now understand the basics of building AI chat agents! 🚀