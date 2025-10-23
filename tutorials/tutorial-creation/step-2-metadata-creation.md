---
title: "Adding Frontmatter to Steps"
description: "Learn how to add YAML frontmatter to markdown files for step metadata"
---

# Adding Frontmatter to Steps

Learn how to add YAML frontmatter to your markdown files to provide step metadata.

## The Beauty of Frontmatter

**🎯 Simple and Standard:**
- YAML frontmatter is a web standard used everywhere
- Just a few lines at the top of your markdown file
- No complex configuration or TypeScript needed
- Works with any markdown editor

**✅ Two Required Fields:**
- `title` - The display title for your step
- `description` - A brief description of what the step covers

That's it! No IDs, no filenames, no imports - just title and description.

## Step-by-Step Frontmatter Workflow

### 1. Create Your Tutorial Folder

First, create your tutorial folder:

```bash
mkdir tutorials/my-awesome-tutorial
cd tutorials/my-awesome-tutorial
```

### 2. Create Step Files with Frontmatter

Create your step files with YAML frontmatter at the top:

**step-1-setup.md:**
```markdown
---
title: "Project Setup and Configuration"
description: "Set up your development environment and install dependencies"
---

# Project Setup and Configuration

In this step, we'll get your project ready for development.

## Installing Dependencies

Start by creating a new project...
```

**step-2-implementation.md:**
```markdown
---
title: "Building the Core Functionality"
description: "Implement the main features and business logic"
---

# Building the Core Functionality

Now that setup is complete, let's build the core features...
```

**step-3-testing.md:**
```markdown
---
title: "Testing and Deployment"
description: "Test your application and deploy it to production"
---

# Testing and Deployment

Let's ensure everything works correctly...
```

### 3. That's It!

Seriously, that's all you need to do. The system will:
- 🔍 **Auto-discover** your tutorial folder
- 📋 **Parse frontmatter** from each step file
- 📝 **Order steps** by filename automatically
- ✨ **Build tutorial** object with all metadata

## Optional: Adding Series Information

If your tutorial is part of a series, create a `_tutorial.yml` file:

**_tutorial.yml:**
```yaml
series:
  name: "AI Assistant Development"
  part: 1
  nextTutorial: "advanced-ai-assistant"
```

You can also override defaults here:

```yaml
title: "Custom Tutorial Title"
description: "Custom description if you don't want it auto-generated"
author: "Your Name"

series:
  name: "My Tutorial Series"
  part: 2
  previousTutorial: "intro-tutorial"
  nextTutorial: "advanced-tutorial"
```

**Note:** You don't need to specify `totalParts` - the system calculates this automatically by counting tutorials in the series!

## Frontmatter Format Reference

### Required Fields

Every step file must have these two fields:

```yaml
---
title: "Your Step Title"
description: "Brief description of what this step covers"
---
```

### Good Practices

**✅ Clear Titles:**
- Use action-oriented titles: "Setting Up Your Environment"
- Keep them concise but descriptive
- Start with verbs when appropriate

**✅ Helpful Descriptions:**
- Explain what the step accomplishes
- Keep it to 1-2 sentences
- Focus on outcomes, not implementation details

## Example Step Files

**Good frontmatter example:**
```markdown
---
title: "Integrating OpenAI API"
description: "Connect to the OpenAI API and make your first completion request"
---

# Integrating OpenAI API

Now let's add AI capabilities to your application...
```

**Avoid vague titles:**
```markdown
---
title: "Step 2"  # ❌ Not descriptive
description: "Do some stuff"  # ❌ Too vague
---
```

## Benefits of Frontmatter

**🚀 Simple:** Just YAML at the top of your markdown file
**⚡ Fast:** No build step - changes appear immediately
**🎯 Standard:** Used across the web in Jekyll, Hugo, and more
**📝 Readable:** Easy to understand and edit
**🔧 Flexible:** Add custom fields if needed in the future

## What's Next?

That's really all there is to it! Just:

1. **Create markdown files** with frontmatter
2. **Optional: Add `_tutorial.yml`** for series
3. **Refresh the app** - your tutorial appears!

No CLI, no build step, no registration needed! 🎉
```

## Simplified Metadata Fields

We've removed all the overhead and kept only what matters:

**✅ Essential Fields Only:**
- `id` - Unique identifier (auto-generated from folder name)
- `title` - Human-readable tutorial title
- `description` - Brief explanation of what the tutorial teaches
- `author` - Who created the tutorial
- `series` - Optional series information for multi-part tutorials
- `steps` - Auto-generated from your markdown files

**❌ Removed Overhead:**
- No estimated time (internal tool, not needed)
- No difficulty levels (developers know their skill level)
- No categories or tags (simple search works better)
- No prerequisites lists (mention in description if needed)
- No learning outcomes (let the tutorial speak for itself)

## Benefits of CLI Generation

**🚀 Speed:** Generate metadata in seconds, not minutes
**🎯 Accuracy:** Auto-extracted titles and descriptions are always correct
**🔧 Consistency:** All tutorials follow the same structure automatically
**📝 Focus:** Spend time writing content, not configuring metadata
**🎪 Maintainability:** Easy to regenerate if you change your content

## What's Next?

After generating your metadata.ts, you just need to:

1. **Add one import** to `src/lib/tutorialParser.ts`
2. **Register your tutorial** in the tutorialRegistry object

The CLI even tells you exactly what to add! 🎉