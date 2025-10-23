---
title: "Writing Effective Tutorial Steps"
description: "Best practices for creating clear, engaging tutorial content with examples and code"
---

# Writing Effective Tutorial Steps

Each step in your tutorial is a separate Markdown file with frontmatter that creates a seamless learning experience.

## File Organization

Create your tutorial with step files that have frontmatter:

```
tutorials/my-awesome-tutorial/
├── _tutorial.yml              ← Optional (only for series)
├── step-1-setup.md            ← Frontmatter + content
├── step-2-implementation.md   ← Frontmatter + content
├── step-3-testing.md          ← Frontmatter + content
└── step-4-deployment.md       ← Frontmatter + content
```

Each file has frontmatter at the top:

```markdown
---
title: "Project Setup"
description: "Initialize the project with dependencies"
---

# Project Setup

Your content starts here...
```

## Step File Structure

Each step file should follow this proven structure:

```markdown
# Step Title

Brief introduction paragraph explaining what this step accomplishes and why it's important.

## Prerequisites Check

Quick verification that students are ready:
- [ ] Previous step completed successfully
- [ ] Required tools installed
- [ ] Environment variables set

## Goal

**By the end of this step, you will have:**
- Specific, measurable outcome 1
- Specific, measurable outcome 2
- Specific, measurable outcome 3

## Implementation

### Substep 1: Action Item

Clear instructions with code examples:

```bash
npm install @types/node
```

Explanation of what this command does and why.

### Substep 2: Create Files

**Create `src/config.ts`:**

```typescript
export const config = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
};
```

**Explanation:** This configuration centralizes API settings and environment variables.

### Substep 3: Test Your Work

Verification steps:

```bash
npm run build
```

Expected output:
```
✅ Build completed successfully
📁 Output written to dist/
```

## Writing Guidelines

### **Start with Purpose**
Begin each step by clearly stating what the student will accomplish:

```markdown
# Create the OpenAI Client

In this step, we'll create a reusable OpenAI client module that handles API communication and provides type-safe interfaces for our chat application.
```

### **Use Progressive Disclosure**
Introduce concepts gradually, building on previous knowledge:

1. **Show the code first** - Give students something that works
2. **Explain how it works** - Break down the implementation  
3. **Explain why it matters** - Connect to larger concepts

### **Provide Complete Examples**
Every code block should be complete and runnable:

```typescript
// ✅ Good: Complete, self-contained example
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function sendMessage(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || 'No response';
}
```

## Code Presentation Best Practices

### Use Specific Language Tags

Always specify the language for syntax highlighting:

```typescript
// TypeScript
interface User {
  id: string;
  name: string;
}
```

```bash
# Terminal commands
cd my-project
npm start
```

```json
// JSON configuration
{
  "scripts": {
    "dev": "vite"
  }
}
```

### Include File Context

Always specify where code should be placed:

**Create `src/utils/helpers.ts`:**

```typescript
/**
 * Helper functions for the tutorial
 */

export function formatResponse(text: string): string {
  return text.trim().replace(/\n{3,}/g, '\n\n');
}

export function validateInput(input: string): boolean {
  return input.length > 0 && input.length < 1000;
}
```

### Show Progressive Enhancement

Start simple, then enhance:

```typescript
// Basic version - gets the job done
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }]
});

// Enhanced version - with error handling
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 500,
  temperature: 0.7
}).catch(error => {
  console.error('OpenAI API Error:', error);
  throw new Error('Failed to get AI response');
});
```

## Interactive Elements

### Progress Checkboxes

Use checkboxes for student self-verification:

- [ ] Dependencies installed successfully
- [ ] Configuration file created  
- [ ] Test command passes
- [ ] No TypeScript errors

### Code Verification

Provide ways for students to verify their work:

**Test your configuration:**

```typescript
// Add this to test your setup
console.log('Configuration loaded:', config);
```

**Expected output:**
```
Configuration loaded: { apiKey: 'sk-...', model: 'gpt-4' }
```

### Callout Boxes

Use blockquotes for important information:

> **💡 Pro Tip:** You can use environment variables to switch between development and production configurations.

> **⚠️ Warning:** Never commit API keys to version control. Always use environment variables.

> **📚 Learn More:** For advanced configuration options, see the [official documentation](https://example.com).

## Error Handling

Include common issues and solutions:

### Troubleshooting

**Problem:** "Module not found" error
**Solution:** Ensure you've run `npm install` and the package is in package.json

**Problem:** Environment variable not loaded
**Solution:** Check your `.env` file exists and restart your development server

**Problem:** TypeScript compilation errors
**Solution:** Run `npm run type-check` to see detailed error messages

## Content Organization

### Use Descriptive Headings

Structure content with clear headings:

```markdown
## Setting Up the OpenAI Client
### Installing Dependencies  
### Configuration Setup
### Testing the Connection

## Building the Chat Interface
### Creating the Input Handler
### Managing Conversation History
### Displaying AI Responses
```

### Include Expected Results

Show students what success looks like:

```typescript
// Your final function should look like this:
export async function chatWithAI(message: string): Promise<string> {
  // Implementation details...
  return response.choices[0].message.content || 'No response';
}
```

**Testing your function:**
```typescript
const result = await chatWithAI('Hello, how are you?');
console.log(result); // Should output AI's greeting response
```

## Visual Elements

### Use Success Indicators

Create scannable content with visual cues:

```markdown
## What This Code Does:

✅ **Environment Setup**: Loads API keys from .env file  
✅ **Client Instance**: Creates configured OpenAI client  
✅ **Type Safety**: Provides TypeScript interfaces  
✅ **Error Handling**: Graceful API error management  
✅ **Reusability**: Exportable functions for other modules  
```

### Add Visual Hierarchy

```markdown
# Main Step Title
## Section Headers  
### Subsection Headers
**Bold for file names and important terms**
*Italic for emphasis*
`Code snippets` for inline code
```

## Writing Style Guidelines

### Clear Instructions

❌ **Don't:** "Set up the project"  
✅ **Do:** "Run `npm create vite@latest my-project --template typescript` to create a new Vite project"

### Explain the Why

❌ **Don't:** "Add this code to app.ts"  
✅ **Do:** "Add this code to app.ts to handle user input and maintain conversation state"

### Use Active Voice

✅ **Good:** "Create a new file called `config.ts`"  
❌ **Avoid:** "A new file called `config.ts` should be created"

### Be Conversational But Clear

✅ **Good:** "Now let's add error handling to make our agent more robust"  
❌ **Avoid:** "Error handling mechanisms must be implemented"

## File Naming Conventions

Use descriptive, sequential names:

✅ **Good:**
- `step-1-project-setup.md`
- `step-2-api-integration.md`  
- `step-3-user-interface.md`
- `step-4-deployment.md`

❌ **Avoid:**
- `part1.md`
- `setup.md`
- `final.md`

## Linking Between Steps

Reference other steps when helpful:

```markdown
> **📖 Review:** If you need to review the project setup, see [Step 1: Project Setup](step-1-project-setup.md).

> **⏭️ Next:** In the next step, we'll add error handling to make our application production-ready.
```

## Testing Your Content

Before publishing, validate your step content:

✅ **Code Examples Work**: Test every code snippet  
✅ **Instructions Are Clear**: Can someone else follow them?  
✅ **Prerequisites Met**: Are required tools/knowledge mentioned?  
✅ **Logical Flow**: Does each step build on the previous?  
✅ **Consistent Terminology**: Use the same terms throughout  

Your step files are where the real learning happens - make them clear, comprehensive, and engaging!