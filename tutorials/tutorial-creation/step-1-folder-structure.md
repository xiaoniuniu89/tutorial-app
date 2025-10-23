---
title: "Understanding Tutorial Structure"
description: "Learn the folder-based organization and frontmatter system"
---

# Tutorial Folder Structure

Let's start by understanding how tutorials are organized in our simplified frontmatter-based system.

## Frontmatter-Based Architecture

Our tutorial system uses an incredibly simple approach - just markdown files with YAML frontmatter! No metadata files, no CLI tools, no complex setup. The system automatically discovers and parses your tutorials.

```
tutorials/
├── my-tutorial/
│   ├── _tutorial.yml          # Optional!
│   ├── step-1-setup.md        # Frontmatter + content
│   ├── step-2-implement.md    # Frontmatter + content
│   └── step-3-deploy.md       # Frontmatter + content
└── another-tutorial/
    ├── step-1-intro.md        # Just add frontmatter
    └── step-2-basics.md       # That's it!
```

## Zero-Configuration Workflow

**🎯 Create Tutorial in 2 Steps:**
1. **Create folder + markdown files** - Add frontmatter to each step
2. **Done!** - System auto-discovers everything!

**✅ What Auto-Discovery Does:**
- Scans all folders in `tutorials/`
- Finds all `step-*.md` files
- Parses YAML frontmatter from each file
- Orders steps by filename automatically
- Loads optional `_tutorial.yml` if present
- No registration or build step needed!


## File Naming Conventions

### **Folder Names**
- Use **kebab-case** (lowercase with hyphens)
- Be descriptive but concise
- Examples: `cli-agent`, `react-basics`, `api-integration`

### **Step Files**
- Format: `step-[number]-[description].md`
- Use sequential numbering: `step-1-`, `step-2-`, etc.
- Keep descriptions short and clear
- Examples: `step-1-setup.md`, `step-2-create-client.md`

## Complete Tutorial Example

Here's how a real tutorial folder looks:

```
tutorials/
└── awesome-ai-assistant/
    ├── _tutorial.yml             
    ├── step-1-project-setup.md
    ├── step-2-ai-integration.md
    ├── step-3-user-interface.md
    └── step-4-deployment.md
```

**Each step file has frontmatter:**

```markdown
---
title: "Project Setup and Configuration"
description: "Set up your development environment and install dependencies"
---

# Project Setup and Configuration

In this step, we'll get your project ready...

## Installing Dependencies

Run these commands to install the required packages...
```

**Optional `_tutorial.yml` (only for series):**

```yaml
series:
  name: "AI Assistant Development"
  part: 1
  nextTutorial: "advanced-ai-assistant"
```

That's it! No TypeScript, no imports, no registration needed.

## Directory Organization Tips

### **Group Related Tutorials**
```
tutorials/
├── fundamentals-series/
│   ├── part-1-basics/
│   │   ├── metadata.ts
│   │   └── step-*.md
│   ├── part-2-intermediate/
│   │   ├── metadata.ts  
│   │   └── step-*.md
│   └── part-3-advanced/
│       ├── metadata.ts
│       └── step-*.md
└── standalone-tutorials/
    ├── quick-start-guide/
    └── advanced-patterns/
```

### **Use Series for Multi-Part Content**
Each tutorial folder is independent, but you can link them with `_tutorial.yml`:

```yaml
# In tutorials/part-1-basics/_tutorial.yml
series:
  name: "Fundamentals Series"
  part: 1
  nextTutorial: "part-2-intermediate"

# In tutorials/part-2-intermediate/_tutorial.yml
series:
  name: "Fundamentals Series"
  part: 2
  previousTutorial: "part-1-basics"
  nextTutorial: "part-3-advanced"
```

**Note:** No `totalParts` needed - the system calculates this automatically!

## Frontmatter Benefits

### **Simple and Standard**
- YAML frontmatter is a web standard
- Works with any markdown editor
- Easy to understand and edit
- No build tools required

### **Instant Feedback**
- Changes appear immediately on refresh
- No compilation step
- Easy to test and iterate
- Clear error messages in console

### **Developer Friendly**
- No TypeScript knowledge needed
- Standard markdown + YAML
- Copy-paste friendly
- Version control friendly

## Auto-Discovery System

**No registration needed!** The system automatically:

1. Scans all folders in `tutorials/`
2. Finds all files matching `step-*.md`
3. Parses YAML frontmatter from each file
4. Orders steps by filename (step-1, step-2, etc.)
5. Loads optional `_tutorial.yml` if present
6. Builds complete tutorial objects

Just create the files and refresh the app - your tutorial appears!

## Validation and Testing

The system provides runtime validation:

✅ **Frontmatter Parsing**: Valid YAML required
✅ **Required Fields**: `title` and `description` must be present
✅ **File Discovery**: Files must start with `step-` prefix
✅ **Console Logging**: Clear discovery messages show what's loaded
✅ **Error Messages**: Helpful warnings for parsing issues

## Development Workflow

Creating a new tutorial (incredibly simple!):

1. **Create tutorial folder** in `tutorials/`
2. **Write step files** with frontmatter and content
3. **Optional: Add `_tutorial.yml`** if part of a series
4. **Refresh app** - your tutorial appears immediately!

No build step, no registration, no CLI tools needed!

## Architecture Benefits

🎯 **Zero Configuration**: Just markdown files with frontmatter
⚡ **Instant Updates**: Changes appear on browser refresh
📁 **Simple Structure**: Easy to understand and maintain
� **Scalable**: Add unlimited tutorials instantly
✨ **No Build Step**: Work directly with content files
� **Auto-Discovery**: System finds and parses everything

Your folder structure is incredibly simple and maintainable!

## Key Benefits

✅ **Scalability**: Easy to add new steps without parsing issues  
✅ **Maintainability**: Individual files are easier to edit and review  
✅ **Organization**: Clear separation between tutorial content and metadata  
✅ **Version Control**: Better git diffs and collaboration  
✅ **Performance**: Faster loading of individual steps  

## Quick Start Checklist

To create a new tutorial:

1. **Create folder**: `mkdir tutorials/your-tutorial-name`
2. **Create step files** with frontmatter:
   ```markdown
   ---
   title: "Step Title"
   description: "What this step covers"
   ---
   
   # Your content here
   ```
3. **Optional**: Add `_tutorial.yml` if part of a series
4. **Refresh app**: Your tutorial appears automatically!

That's it! Your tutorial folder structure is incredibly simple!