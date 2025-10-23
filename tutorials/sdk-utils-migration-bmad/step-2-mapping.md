---
title: "Mapping Phase - Creating Your Migration Blueprint"
description: "Map old SDK utilities to new implementations and create a detailed migration plan"
---

# Mapping Phase - Creating Your Migration Blueprint

In this phase, we create a detailed map between old and new SDK utilities.

## Objectives

- Map old utilities to new SDK equivalents
- Identify gaps and custom solutions needed
- Create detailed migration specifications
- Plan for backward compatibility

## Create Utility Mapping Document

Build a comprehensive mapping table:

| Old Utility | New SDK Method | Notes | Status |
|-------------|----------------|-------|--------|
| `StringUtil.isEmpty()` | `sdk.string.isEmpty()` | Direct replacement | ✅ |
| `DateUtil.format()` | `sdk.date.format()` | API changed slightly | ⚠️ |
| `CustomUtil.process()` | Custom implementation | No SDK equivalent | 🔴 |

## Document API Differences

For each mapping, document differences:

```typescript
// OLD SDK
StringUtil.isEmpty(value, trimWhitespace)

// NEW SDK
sdk.string.isEmpty(value, { trim: true })

// Migration Note: 
// Parameter changed from positional to options object
```

## Identify Custom Solutions

For utilities without direct SDK equivalents:

```typescript
// Custom implementation needed
class CustomMigrationHelper {
  // Preserve old functionality
  static process(data: any): ProcessedData {
    // Implementation using new SDK primitives
    return sdk.data.transform(data, {
      // configuration
    });
  }
}
```

## Create Migration Specifications

For each utility, document:

1. **Before**: Current implementation
2. **After**: Target implementation
3. **Breaking Changes**: API differences
4. **Migration Strategy**: Step-by-step approach
5. **Testing Requirements**: Validation needs

## Plan Backward Compatibility

Consider creating adapter layers:

```typescript
// Backward compatibility adapter
export class LegacyStringUtil {
  static isEmpty(value: string, trimWhitespace?: boolean): boolean {
    // Delegates to new SDK
    return sdk.string.isEmpty(value, { trim: trimWhitespace });
  }
}
```

## Validate Mapping Completeness

Ensure you've covered:
- ✅ All utilities identified in assessment
- ✅ All dependencies mapped
- ✅ All breaking changes documented
- ✅ Custom solutions specified

## Next Steps

With your mapping complete, move to the Adaptation phase where we'll implement the actual migrations.
