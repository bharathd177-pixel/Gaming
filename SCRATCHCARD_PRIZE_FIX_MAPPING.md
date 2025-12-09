# Scratch Card Prize Flow - End-to-End Fix Mapping & Analysis

## 1. Property Mapping Table

### ScratchCard Component
| Dialog Field | JCR Path | Sling Model Field | HTL Access | JS Property | Status |
|--------------|----------|-------------------|------------|-------------|---------|
| `./prizeName` | `/content/.../prizes/*/prizeName` | `prizeName` | `model.prizes[0].prizeName` | `prize.prizeName` | ✅ Correct |
| `./prizeCode` | `/content/.../prizes/*/prizeCode` | `prizeCode` | `model.prizes[0].prizeCode` | `prize.prizeCode` | ✅ Correct |
| `./bgColor` | `/content/.../prizes/*/bgColor` | `bgColor` | `model.prizes[0].bgColor` | `prize.bgColor` | ✅ Correct |
| `./iconPath` | `/content/.../prizes/*/iconPath` | `iconPath` | `model.prizes[0].iconPath` | `prize.iconPath` | ✅ Correct |

### PickAGift Component
| Dialog Field | JCR Path | Sling Model Field | HTL Access | JS Property | Status |
|--------------|----------|-------------------|------------|-------------|---------|
| `./text` | `/content/.../giftDetails/*/text` | `text` | `model.giftDetails` (JSON) | `gift.text` | ✅ Correct |
| `./value` | `/content/.../giftDetails/*/value` | `value` | `model.giftDetails` (JSON) | `gift.value` | ✅ Correct |
| `./color` | `/content/.../giftDetails/*/color` | `color` | `model.giftDetails` (JSON) | `gift.color` | ✅ Correct |
| `./icon` | `/content/.../giftDetails/*/icon` | `icon` | `model.giftDetails` (JSON) | `gift.icon` | ✅ Correct |

### SpinWheel Component
| Dialog Field | JCR Path | Sling Model Field | HTL Access | JS Property | Status |
|--------------|----------|-------------------|------------|-------------|---------|
| `./segmentText` | `/content/.../segments/*/segmentText` | `segmentText` | `model.segmentsJson` (JSON) | `segment.segmentText` | ✅ Correct |
| `./segmentValue` | `/content/.../segments/*/segmentValue` | `segmentValue` | `model.segmentsJson` (JSON) | `segment.segmentValue` | ✅ Correct |
| `./segmentColor` | `/content/.../segments/*/segmentColor` | `segmentColor` | `model.segmentsJson` (JSON) | `segment.segmentColor` | ✅ Correct |

## 2. Issues Identified

### Primary Issues (ScratchCard)
1. **HTL Template Property Name Mismatch**
   - **Problem**: HTL template uses `model.prizes[0].name` instead of `model.prizes[0].prizeName`
   - **Problem**: HTL template uses `model.prizes[0].code` instead of `model.prizes[0].prizeCode`
   - **Impact**: Prize background shows "undefined" values

2. **JavaScript Property Mapping Complexity**
   - **Problem**: Too many fallback property names causing confusion
   - **Impact**: Inconsistent property access and potential "undefined" values

3. **Prize Background Rendering**
   - **Problem**: Visual prize background may not update correctly
   - **Impact**: Users don't see the prize while scratching

4. **Alert Message**
   - **Problem**: Shows "undefined - undefined" instead of actual prize name and code
   - **Impact**: Poor user experience

### Secondary Issues (Cross-Component)
1. **Inconsistent Property Naming**
   - ScratchCard: `prizeName`, `prizeCode`, `bgColor`, `iconPath`
   - PickAGift: `text`, `value`, `color`, `icon`
   - SpinWheel: `segmentText`, `segmentValue`, `segmentColor`

## 3. Root Cause Analysis

### Main Root Cause
The HTL template in `scratchcard.html` is using incorrect property names when accessing the first prize's data for the visual background display.

**Current (Incorrect):**
```html
<span class="prize-name">${model.prizes && model.prizes.size > 0 ? model.prizes[0].name : 'Congratulations!' @ context='unsafe'}</span>
<span class="prize-code">${model.prizes && model.prizes.size > 0 ? model.prizes[0].code : '' @ context='unsafe'}</span>
```

**Should Be (Correct):**
```html
<span class="prize-name">${model.prizes && model.prizes.size > 0 ? model.prizes[0].prizeName : 'Congratulations!' @ context='unsafe'}</span>
<span class="prize-code">${model.prizes && model.prizes.size > 0 ? model.prizes[0].prizeCode : '' @ context='unsafe'}</span>
```

## 4. Fix Plan

### Step 1: Fix HTL Template Property Names
- Update `scratchcard.html` to use correct property names
- Ensure prize background renders correctly

### Step 2: Simplify JavaScript Property Mapping
- Reduce fallback property names
- Use consistent property access pattern

### Step 3: Fix Alert Message
- Ensure correct prize name and code are displayed
- Add proper error handling

### Step 4: Cross-Component Validation
- Verify PickAGift and SpinWheel components work correctly
- Ensure no regression issues

## 5. Files to Modify

1. `ui.apps/src/main/content/jcr_root/apps/citi/components/scratchcard/scratchcard.html`
2. `ui.apps/src/main/content/jcr_root/apps/citi/clientlibs/clientlib-base/js/scratchcard-integration.js`

## 6. Validation Checklist

- [ ] Dynamic prizes persist in JCR after author save
- [ ] Prize background displays correctly while scratching
- [ ] Alert shows correct "PrizeName - PrizeCode" format
- [ ] No "undefined" values in console or display
- [ ] Works in both Author and Publish modes
- [ ] No duplicate JS redeclaration errors
- [ ] PickAGift and SpinWheel components still work correctly

## 7. Migration Notes

No migration required - this is a property name fix that doesn't affect existing JCR data structure.
