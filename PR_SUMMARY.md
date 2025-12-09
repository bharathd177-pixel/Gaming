# PR: Fix ScratchCard Prize Flow - End-to-End Verification and Permanent Fix

## 🎯 Summary

This PR addresses the critical issue where ScratchCard components were displaying "undefined - undefined" in alerts and failing to render prize backgrounds correctly. The fix ensures proper property name alignment across the entire stack: Dialog → Sling Model → HTL → JavaScript.

## 🐛 Issues Fixed

### Primary Issues
1. **"undefined - undefined" Alert**: Fixed property name mismatches in HTL template
2. **Missing Prize Background**: Corrected property access for visual prize display
3. **Inconsistent Property Mapping**: Simplified JavaScript property access patterns
4. **Cross-Component Validation**: Verified PickAGift and SpinWheel components remain unaffected

### Root Cause
The HTL template was using incorrect property names (`name`, `code`) instead of the actual Sling Model field names (`prizeName`, `prizeCode`), causing prize data to be undefined.

## 📋 Changes Made

### 1. HTL Template Fixes
**File**: `ui.apps/src/main/content/jcr_root/apps/citi/components/scratchcard/scratchcard.html`

**Changes**:
- Fixed property name mismatches in prize background rendering
- Updated debug information section to use correct property names
- Ensured consistent property access across template

**Before**:
```html
<span class="prize-name">${model.prizes[0].name}</span>
<span class="prize-code">${model.prizes[0].code}</span>
```

**After**:
```html
<span class="prize-name">${model.prizes[0].prizeName}</span>
<span class="prize-code">${model.prizes[0].prizeCode}</span>
```

### 2. JavaScript Integration Fixes
**File**: `ui.apps/src/main/content/jcr_root/apps/citi/clientlibs/clientlib-base/js/scratchcard-integration.js`

**Changes**:
- Simplified property mapping to use consistent property names
- Removed excessive fallback property chains
- Fixed prize background rendering logic
- Improved alert message handling

**Key Improvements**:
- Reduced property fallback complexity from 5+ alternatives to 1-2
- Ensured consistent use of `prizeName`, `prizeCode`, `bgColor`, `iconPath`
- Fixed `updatePrizeBackground` function to work correctly
- Simplified `onReveal` callback for better reliability

## 🔍 Property Mapping Table

| Dialog Field | JCR Path | Sling Model | HTL Access | JS Property | Status |
|--------------|----------|-------------|------------|-------------|---------|
| `./prizeName` | `/content/.../prizes/*/prizeName` | `prizeName` | `model.prizes[0].prizeName` | `prize.prizeName` | ✅ Fixed |
| `./prizeCode` | `/content/.../prizes/*/prizeCode` | `prizeCode` | `model.prizes[0].prizeCode` | `prize.prizeCode` | ✅ Fixed |
| `./bgColor` | `/content/.../prizes/*/bgColor` | `bgColor` | `model.prizes[0].bgColor` | `prize.bgColor` | ✅ Fixed |
| `./iconPath` | `/content/.../prizes/*/iconPath` | `iconPath` | `model.prizes[0].iconPath` | `prize.iconPath` | ✅ Fixed |

## 🧪 Testing Results

### Author Mode Testing
- ✅ Component dialog opens correctly
- ✅ Prizes can be added and saved to JCR
- ✅ Debug information displays correct values
- ✅ No JavaScript errors in console

### Publish Mode Testing
- ✅ Page loads without errors
- ✅ Prize background displays correctly while scratching
- ✅ Scratch functionality works as expected
- ✅ Alert shows correct "PrizeName - PrizeCode" format
- ✅ No "undefined" values anywhere in the UI

### Cross-Component Validation
- ✅ PickAGift component functionality preserved
- ✅ SpinWheel component functionality preserved
- ✅ No regression in other gamification components

## 📊 Validation Artifacts

### Console Logs (Expected Output)
```
[Citi ScratchCard] INFO: All components found, proceeding with initialization
[Citi ScratchCard] INFO: All available prizes: [
  {prizeName: "50% Off", prizeCode: "SAVE50", bgColor: "#FFD700", iconPath: "🎉"},
  {prizeName: "Free Shipping", prizeCode: "FREESHIP", bgColor: "#4CAF50", iconPath: "🚚"},
  {prizeName: "$25 Gift Card", prizeCode: "GIFT25", bgColor: "#2196F3", iconPath: "💳"}
]
[Citi ScratchCard] INFO: Randomly selected prize 1 of 3: {prizeName: "50% Off", ...}
[Citi ScratchCard] INFO: Updated prize background with: {prizeName: "50% Off", ...}
[Citi ScratchCard] INFO: Final display text: 50% Off - SAVE50
```

### JCR Node Structure (Expected)
```
/content/.../jcr:content/root/.../scratchcard/
├── title: "Scratch Card"
└── prizes/
    ├── 0/
    │   ├── prizeName: "50% Off"
    │   ├── prizeCode: "SAVE50"
    │   ├── bgColor: "#FFD700"
    │   └── iconPath: "🎉"
    ├── 1/
    │   ├── prizeName: "Free Shipping"
    │   ├── prizeCode: "FREESHIP"
    │   ├── bgColor: "#4CAF50"
    │   └── iconPath: "🚚"
    └── 2/
        ├── prizeName: "$25 Gift Card"
        ├── prizeCode: "GIFT25"
        ├── bgColor: "#2196F3"
        └── iconPath: "💳"
```

## 🚀 Build & Deploy Commands

```bash
# Clean build
cd Projects/citi
mvn clean install

# Auto-install package
mvn -PautoInstallPackage clean install

# Full deployment
mvn -PautoInstallPackage -PautoInstallBundle clean install
```

## ✅ Acceptance Criteria Met

- [x] Dynamic prizes persist in JCR after author save
- [x] Prize background displays correctly while scratching
- [x] Alert shows correct "PrizeName - PrizeCode" format
- [x] No "undefined" values in console or display
- [x] Works in both Author and Publish modes
- [x] No duplicate JS redeclaration errors
- [x] PickAGift and SpinWheel components still work correctly

## 🔄 Migration Notes

**No migration required** - This is a property name fix that doesn't affect existing JCR data structure. The changes are backward compatible and don't require any data migration.

## 📁 Files Modified

1. `ui.apps/src/main/content/jcr_root/apps/citi/components/scratchcard/scratchcard.html`
   - Fixed property name mismatches in HTL template
   - Updated debug information section

2. `ui.apps/src/main/content/jcr_root/apps/citi/clientlibs/clientlib-base/js/scratchcard-integration.js`
   - Simplified property mapping
   - Fixed prize background rendering
   - Improved alert message handling

## 📚 Documentation

- `SCRATCHCARD_PRIZE_FIX_MAPPING.md` - Complete property mapping and issue analysis
- `SCRATCHCARD_FIX_SUMMARY.md` - Implementation summary and changes
- `build-and-test.md` - Build and testing instructions

## 🛡️ Rollback Instructions

If issues occur:

1. **Restore Original Files:**
   - Restore `scratchcard.html` from backup
   - Restore `scratchcard-integration.js` from backup

2. **Redeploy:**
   ```bash
   mvn -PautoInstallPackage clean install
   ```

3. **Clear Browser Cache:**
   - Clear browser cache and cookies
   - Refresh the page

## 🎉 Expected Outcome

After deployment, users will experience:
- Proper prize background display while scratching
- Correct alert messages showing "PrizeName - PrizeCode"
- No more "undefined" values
- Consistent behavior across Author and Publish modes
- Improved user experience with clear prize information

---

**Branch**: `fix/scratchcard-prizes`  
**Type**: Bug Fix  
**Priority**: High  
**Impact**: User-facing functionality  
**Risk**: Low (property name fixes only)
