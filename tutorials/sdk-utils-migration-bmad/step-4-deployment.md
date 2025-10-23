---
title: "Deployment Phase - Rolling Out Your Migration"
description: "Deploy migrated utilities safely with proper testing and monitoring"
---

# Deployment Phase - Rolling Out Your Migration

The final phase focuses on safely deploying your migrated utilities to production.

## Objectives

- Deploy changes incrementally and safely
- Monitor for issues and regressions
- Maintain rollback capabilities
- Complete the migration successfully

## Deployment Strategy

### 1. Feature Flags

Use feature flags for controlled rollout:

```typescript
// filepath: src/config/features.ts
export const features = {
  useNewSDK: process.env.USE_NEW_SDK === 'true',
  migratedUtilities: process.env.MIGRATED_UTILS?.split(',') || []
};

// Usage
import { features } from './config/features';
import { sdk } from '@new-sdk';
import { LegacyStringUtil } from './legacy/utils';

function processString(value: string): boolean {
  if (features.useNewSDK) {
    return sdk.string.isEmpty(value);
  }
  return LegacyStringUtil.isEmpty(value);
}
```

### 2. Phased Rollout

Deploy in stages:

**Stage 1: Development**
```bash
# Deploy to dev environment
USE_NEW_SDK=true npm run deploy:dev
```

**Stage 2: Staging**
```bash
# Test in staging with production-like data
USE_NEW_SDK=true npm run deploy:staging
```

**Stage 3: Canary Production**
```bash
# Enable for 5% of traffic
ROLLOUT_PERCENTAGE=5 npm run deploy:canary
```

**Stage 4: Full Production**
```bash
# Full rollout
USE_NEW_SDK=true npm run deploy:production
```

## Monitoring and Validation

### Set Up Monitoring

```typescript
// filepath: src/monitoring/migration-metrics.ts
import { metrics } from './metrics-service';

export class MigrationMonitor {
  static trackUtilityCall(utilityName: string, isNewSDK: boolean) {
    metrics.increment('utility.calls', {
      name: utilityName,
      sdk: isNewSDK ? 'new' : 'legacy'
    });
  }
  
  static trackError(utilityName: string, error: Error) {
    metrics.error('utility.error', {
      name: utilityName,
      message: error.message,
      stack: error.stack
    });
  }
}

// Usage in adapter
export class MonitoredStringUtil {
  static isEmpty(value: string): boolean {
    try {
      MigrationMonitor.trackUtilityCall('StringUtil.isEmpty', true);
      return sdk.string.isEmpty(value);
    } catch (error) {
      MigrationMonitor.trackError('StringUtil.isEmpty', error);
      // Fallback to legacy
      return LegacyStringUtil.isEmpty(value);
    }
  }
}
```

### Compare Results

Implement shadow mode to compare outputs:

```typescript
function shadowCompare<T>(
  legacyFn: () => T,
  newFn: () => T,
  name: string
): T {
  const legacyResult = legacyFn();
  
  try {
    const newResult = newFn();
    
    if (JSON.stringify(legacyResult) !== JSON.stringify(newResult)) {
      metrics.increment('migration.mismatch', { utility: name });
      console.warn(`Mismatch in ${name}:`, { legacyResult, newResult });
    }
  } catch (error) {
    metrics.increment('migration.error', { utility: name });
  }
  
  return legacyResult; // Use legacy result during comparison
}
```

## Rollback Plan

Maintain ability to rollback:

```typescript
// Quick rollback mechanism
const MIGRATION_ENABLED = 
  process.env.ENABLE_SDK_MIGRATION !== 'false';

export function getStringUtil() {
  return MIGRATION_ENABLED 
    ? sdk.string 
    : LegacyStringUtil;
}
```

### Rollback Procedure

```bash
# Emergency rollback
export ENABLE_SDK_MIGRATION=false
npm run restart:production

# Or use feature flag service
curl -X POST https://api.feature-flags.com/flags/sdk-migration \
  -d '{"enabled": false}'
```

## Post-Deployment Tasks

### 1. Monitor Key Metrics

Track for 24-48 hours:
- Error rates
- Response times
- API call volumes
- User-reported issues

### 2. Validate Business Logic

Ensure:
- Data integrity maintained
- Business rules still enforced
- No silent failures

### 3. Gather Team Feedback

Survey developers:
- New API usability
- Documentation clarity
- Migration pain points

## Cleanup Phase

Once stable (2-4 weeks):

1. **Remove feature flags**:
```typescript
// Remove conditional logic
- if (features.useNewSDK) {
-   return sdk.string.isEmpty(value);
- }
- return LegacyStringUtil.isEmpty(value);
+ return sdk.string.isEmpty(value);
```

2. **Delete legacy code**:
```bash
# Remove old implementations
rm -rf src/legacy/utils
```

3. **Update documentation**:
- Remove deprecation warnings
- Update API documentation
- Create migration retrospective

## Success Criteria

Consider migration complete when:
- ✅ All utilities migrated
- ✅ Zero production issues for 2 weeks
- ✅ Performance metrics stable or improved
- ✅ Team comfortable with new SDK
- ✅ Legacy code removed
- ✅ Documentation updated

## Lessons Learned

Document:
- What worked well
- Challenges encountered
- Process improvements
- Team recommendations

Congratulations! You've successfully completed the SDK utils migration using the BMAD-METHOD.
