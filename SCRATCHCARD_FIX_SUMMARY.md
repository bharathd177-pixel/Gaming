# ScratchCard Prize Flow Fix - Implementation Summary

## Changes Made

### 1. HTL Template Fixes (`scratchcard.html`)

**Fixed Property Name Mismatches:**
- Changed `model.prizes[0].name` → `model.prizes[0].prizeName`
- Changed `model.prizes[0].code` → `model.prizes[0].prizeCode`

**Files Modified:**
- `ui.apps/src/main/content/jcr_root/apps/citi/components/scratchcard/scratchcard.html`

**Specific Changes:**
```html
<!-- Before (Incorrect) -->
<span class="prize-name">${model.prizes && model.prizes.size > 0 ? model.prizes[0].name : 'Congratulations!' @ context='unsafe'}</span>
<span class="prize-code">${model.prizes && model.prizes.size > 0 ? model.prizes[0].code : '' @ context='unsafe'}</span>

<!-- After (Correct) -->
<span class="prize-name">${model.prizes && model.prizes.size > 0 ? model.prizes[0].prizeName : 'Congratulations!' @ context='unsafe'}</span>
<span class="prize-code">${model.prizes && model.prizes.size > 0 ? model.prizes[0].prizeCode : '' @ context='unsafe'}</span>
```

### 2. JavaScript Integration Fixes (`scratchcard-integration.js`)

**Simplified Property Mapping:**
- Removed excessive fallback property names
- Used consistent property access pattern
- Fixed prize background rendering

**Files Modified:**
- `ui.apps/src/main/content/jcr_root/apps/citi/clientlibs/clientlib-base/js/scratchcard-integration.js`

**Specific Changes:**

1. **updatePrizeBackground Function:**
   - Simplified property access to use only `prizeName`, `prizeCode`, `bgColor`, `iconPath`
   - Removed fallback properties like `cardText`, `cardValue`, `cardColor`, etc.

2. **extractConfig Function:**
   - Simplified prize mapping to use consistent property names
   - Removed complex fallback chains

3. **onReveal Callback:**
   - Simplified prize data access
   - Ensured correct alert message format

## Root Cause Resolution

### Primary Issue: Property Name Mismatch
The HTL template was using incorrect property names (`name`, `code`) instead of the actual Sling Model field names (`prizeName`, `prizeCode`). This caused the prize background to display "undefined" values.

### Secondary Issue: JavaScript Complexity
The JavaScript had too many fallback property names, making it difficult to debug and potentially causing inconsistent behavior.

## Expected Results

After these fixes:

1. **Prize Background Display:** Should show the correct prize name and code while scratching
2. **Alert Message:** Should display "PrizeName - PrizeCode" instead of "undefined - undefined"
3. **Property Consistency:** All property names are now aligned across dialog → Sling Model → HTL → JS
4. **No Regression:** PickAGift and SpinWheel components remain unaffected

## Testing Checklist

- [ ] Dynamic prizes persist in JCR after author save
- [ ] Prize background displays correctly while scratching
- [ ] Alert shows correct "PrizeName - PrizeCode" format
- [ ] No "undefined" values in console or display
- [ ] Works in both Author and Publish modes
- [ ] No duplicate JS redeclaration errors
- [ ] PickAGift and SpinWheel components still work correctly

## Files Modified

1. `ui.apps/src/main/content/jcr_root/apps/citi/components/scratchcard/scratchcard.html`
   - Fixed property name mismatches in HTL template
   - Updated debug information section

2. `ui.apps/src/main/content/jcr_root/apps/citi/clientlibs/clientlib-base/js/scratchcard-integration.js`
   - Simplified property mapping
   - Fixed prize background rendering
   - Improved alert message handling

## Migration Notes

No migration required - this is a property name fix that doesn't affect existing JCR data structure. The changes are backward compatible and don't require any data migration.
