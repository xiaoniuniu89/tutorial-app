---
title: "Adaptation Phase - Implementing the Migration"
description: "Execute the migration plan and adapt your codebase to use new SDK utilities"
---

# Adaptation Phase - Implementing the Migration

Now we implement the migration plan, adapting code to use the new SDK utilities.

## Objectives

- Implement utility replacements systematically
- Create adapter layers where needed
- Maintain code stability during migration
- Document changes for team members

## Migration Strategy

Follow this order:
1. **Leaf utilities first**: Start with utilities that have no dependencies
2. **Progressive migration**: Move up the dependency chain
3. **Maintain compatibility**: Keep old code working during transition

## Step-by-Step Implementation

### 1. Create Adapter Layer

Start with a compatibility layer:

```typescript
// filepath: src/adapters/sdk-adapters.ts
import { sdk } from '@new-sdk';

/**
 * Adapter layer for gradual migration
 * Maintains old API while using new SDK internally
 */
export class StringUtilAdapter {
  static isEmpty(value: string, trimWhitespace?: boolean): boolean {
    return sdk.string.isEmpty(value, { trim: trimWhitespace ?? false });
  }
  
  static capitalize(value: string): string {
    return sdk.string.capitalize(value);
  }
}
```

### 2. Replace Imports Incrementally

Update imports file by file:

```typescript
// OLD
import { StringUtil } from './legacy/utils';

// NEW
import { StringUtilAdapter as StringUtil } from './adapters/sdk-adapters';

// Usage remains the same
if (StringUtil.isEmpty(name)) {
  // ...
}
```

### 3. Refactor to New API

Once stable, refactor to use new SDK directly:

```typescript
// Phase 1: Using adapter (maintains old API)
if (StringUtil.isEmpty(name, true)) { }

// Phase 2: Direct SDK usage (new API)
if (sdk.string.isEmpty(name, { trim: true })) { }
```

### 4. Handle Complex Migrations

For utilities requiring significant changes:

```typescript
// OLD: Complex utility with custom logic
class DataProcessor {
  static transform(data: any[]): ProcessedData {
    // Custom implementation
  }
}

// NEW: Adapted to use SDK primitives
class DataProcessor {
  static transform(data: any[]): ProcessedData {
    return sdk.data.pipe(
      data,
      sdk.data.filter(this.isValid),
      sdk.data.map(this.normalize),
      sdk.data.reduce(this.aggregate)
    );
  }
  
  private static isValid = (item: any) => sdk.validation.check(item, schema);
  private static normalize = (item: any) => sdk.transform.normalize(item);
  private static aggregate = (acc: any, item: any) => sdk.data.merge(acc, item);
}
```

## Code Organization

Structure your migration:

```
src/
├── adapters/           # Compatibility adapters
│   ├── sdk-adapters.ts
│   └── legacy-compat.ts
├── utils/              # New implementations
│   ├── string.utils.ts
│   └── data.utils.ts
└── legacy/             # Old code (deprecated)
    └── utils/
```

## Deprecation Warnings

Add deprecation notices:

```typescript
/**
 * @deprecated Use sdk.string.isEmpty() instead
 * Will be removed in version 3.0
 */
export function isEmpty(value: string): boolean {
  console.warn('isEmpty is deprecated. Use sdk.string.isEmpty()');
  return sdk.string.isEmpty(value);
}
```

## Migration Checklist

For each utility:
- [ ] Adapter created
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Team notified
- [ ] Deprecation warnings added

## Next Steps

With adaptation complete, move to the Deployment phase to roll out changes safely.
