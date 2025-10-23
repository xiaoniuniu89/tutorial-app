---
title: "Testing Your Tutorial"
description: "Verify your tutorial works correctly and provides a great learning experience"
---

# Testing Your Tutorial

Once you've created your tutorial content, it's essential to test it thoroughly to ensure a smooth learning experience for your students.

## Pre-Publication Testing

### **Test Your Own Steps**
The most important test is following your own tutorial from start to finish:

1. **Fresh Environment**: Test in a clean directory/environment
2. **Follow Exactly**: Don't skip steps or assume knowledge
3. **Time Yourself**: Verify your time estimates are realistic
4. **Copy-Paste Code**: Test that all code examples work as written
5. **Check Prerequisites**: Ensure listed requirements are sufficient

### **Validate File Structure**
Make sure your tutorial folder has everything needed:

```bash
# Navigate to your tutorial folder
cd tutorials/your-tutorial-name/

# Check required files exist
ls -la

# Should see:
# _tutorial.yml (optional)
# step-1-[name].md
# step-2-[name].md
# etc.
```

### **Frontmatter Validation**
The system automatically validates frontmatter:

```bash
# Start the dev server
npm run dev

# Check browser console for validation messages:
# - Should show "Discovered X tutorials"
# - Any frontmatter errors will be logged clearly
```

**Built-in validation checks:**
✅ **YAML Syntax**: Frontmatter is valid YAML  
✅ **Required Fields**: Both `title` and `description` present  
✅ **File Discovery**: All `step-*.md` files found  
✅ **Order**: Steps automatically ordered by filename  
✅ **Series**: Optional `_tutorial.yml` parsed correctly

## Testing in the Tutorial System

### **Load Your Tutorial**
1. **Refresh the homepage** to see if your tutorial appears
2. **Check the tutorial card** displays correct information
3. **Launch the wizard** to test step navigation
4. **Verify all steps load** without errors

### **Navigation Testing**
Test the wizard interface thoroughly:

✅ **Step progression**: Can you move forward through all steps?  
✅ **Back navigation**: Does the back button work correctly?  
✅ **Progress indicator**: Does it show correct step numbers?  
✅ **Step titles**: Are they displayed properly in navigation?  

### **Content Rendering**
Verify your content displays correctly:

✅ **Markdown formatting**: Headers, lists, emphasis render properly  
✅ **Code blocks**: Syntax highlighting and copy buttons work  
✅ **Links**: Internal and external links function  
✅ **Images**: Any images load correctly  

## User Testing

### **Get Feedback**
Have others test your tutorial:

1. **Target Audience**: Test with people at the intended skill level
2. **Fresh Perspective**: Use testers unfamiliar with the content
3. **Document Issues**: Keep track of confusion points and errors
4. **Time Tracking**: See if others complete in estimated time

### **Feedback Questions**
Ask testers these questions:

```
📝 **Clarity Questions:**
- Were the instructions clear and easy to follow?
- Did you get stuck anywhere? Where and why?
- Was anything confusing or poorly explained?

📝 **Content Questions:**  
- Did you feel prepared with the listed prerequisites?
- Were the code examples helpful and complete?
- Did you understand why you were doing each step?

📝 **Experience Questions:**
- How was the pacing? Too fast or too slow?
- Did you feel accomplished at the end?
- Would you recommend this tutorial to others?
```

## Common Issues to Check

### **Technical Problems**
- ❌ **Missing files**: Step files referenced in TypeScript metadata don't exist
- ❌ **Broken code**: Code examples have syntax errors or don't run
- ❌ **Wrong file paths**: References to files that don't exist
- ❌ **Dependency issues**: Required packages not listed in setup
- ❌ **TypeScript errors**: Metadata doesn't compile correctly

### **Content Problems**
- ❌ **Knowledge gaps**: Assuming knowledge not in prerequisites
- ❌ **Unclear instructions**: Ambiguous or incomplete directions
- ❌ **Missing context**: Code without explanation of what it does
- ❌ **Poor flow**: Steps that don't build logically on each other

### **Metadata Problems**
- ❌ **Inaccurate difficulty**: Too easy or too hard for stated level
- ❌ **Wrong time estimates**: Significantly over or under actual time
- ❌ **Missing tags**: Poor discoverability due to incomplete tagging
- ❌ **Outdated info**: References to old versions or deprecated methods
- ❌ **Type errors**: Invalid TypeScript metadata structure

## Simple Development Workflow

### **Instant Feedback**
The beauty of frontmatter-based tutorials:

✅ **No build step**: Changes appear on browser refresh  
✅ **Console logging**: Check browser console for discovery info  
✅ **Clear errors**: YAML parse errors show helpful messages  
✅ **Fast iteration**: Edit, save, refresh - done!

### **Development Commands**

```bash
# Start development server
npm run dev

# That's it! Just edit your markdown files
# and refresh the browser to see changes
```

## Continuous Improvement

### **Version Tracking**
Add version info in optional `_tutorial.yml`:

```yaml
title: "My Awesome Tutorial"
author: "Your Name"
version: "2.0"
lastUpdated: "2024-02-15"

series:
  name: "Tutorial Series"
  part: 1
```

### **Monitor Usage**
If possible, track tutorial completion and feedback:

- **Completion rates**: Where do people drop off?
- **Common questions**: What support requests do you get?
- **User feedback**: Reviews and suggestions for improvement

## Publishing Checklist

Before making your tutorial live, verify:

✅ **All steps tested** and working  
✅ **TypeScript metadata** compiles without errors  
✅ **File structure** correct  
✅ **Code examples** tested and functional  
✅ **Time estimates** validated  
✅ **Prerequisites** sufficient  
✅ **User testing** completed with feedback incorporated  
✅ **Content reviewed** for clarity and flow  
✅ **Type safety** validated in development environment  

## 🎉 Ready to Publish!

Congratulations! Your tutorial is now thoroughly tested and ready to help others learn. Remember:

- **Quality over speed**: It's better to have a well-tested tutorial than a rushed one
- **Iterate based on feedback**: Continuous improvement makes great tutorials even better  
- **Celebrate your contribution**: You're helping others learn and grow their skills!
- **Leverage TypeScript**: Use the type system to maintain quality and prevent errors

Your tested tutorial will provide a smooth, confidence-building learning experience for every student who follows it.