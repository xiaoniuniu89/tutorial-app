---
title: "Assessment Phase - Understanding Your Current State"
description: "Learn how to assess your current SDK utilities and identify migration requirements"
---

# Assessment Phase - Understanding Your Current State

The first phase of the BMAD-METHOD focuses on thoroughly understanding what needs to be migrated and why.

## Objectives

By the end of this step, you will:
- Identify all SDK utilities currently in use
- Understand dependencies and relationships
- Document current functionality
- Assess migration complexity

## Inventory Your SDK Utilities

Start by creating a comprehensive inventory of all utilities:

```bash
# Find all utility files in your project
find . -type f -name "*util*" -o -name "*helper*"
```

## Document Current Usage

Create a spreadsheet or document listing:
- Utility name
- File location
- Primary functions
- Dependencies
- Usage frequency
- Critical vs. non-critical

## Identify Dependencies

Map out how utilities interact:

```typescript
// Example: Document utility dependencies
const utilityMap = {
  'DataUtil': {
    dependsOn: ['ValidationUtil', 'FormatUtil'],
    usedBy: ['UserService', 'OrderService']
  }
};
```

## Assess Complexity

Rate each utility's migration complexity:
- **Low**: Simple, standalone utilities
- **Medium**: Utilities with some dependencies
- **High**: Core utilities with many dependents

## Create Migration Priorities

Based on your assessment:
1. High-priority: Critical path utilities
2. Medium-priority: Frequently used utilities
3. Low-priority: Rarely used utilities

## Next Steps

With your assessment complete, you're ready to move to the Mapping phase where we'll create a detailed migration plan.
