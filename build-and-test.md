# Build and Test Instructions for ScratchCard Prize Fix

## Prerequisites

1. Maven 3.6+ installed
2. Java 8+ installed
3. AEM instance running (Author and Publish)
4. Access to AEM admin console

## Build Commands

### 1. Clean Build
```bash
cd Projects/citi
mvn clean install
```

### 2. Auto-Install Package
```bash
mvn -PautoInstallPackage clean install
```

### 3. Deploy to AEM
```bash
mvn -PautoInstallPackage -PautoInstallBundle clean install
```

## Testing Steps

### Step 1: Author Testing

1. **Access AEM Author:**
   - Navigate to `http://localhost:4502`
   - Login with admin credentials

2. **Add ScratchCard Component:**
   - Create or edit a page
   - Add the ScratchCard component to the page
   - Open the component dialog

3. **Configure Prizes:**
   - Add 3+ prizes with the following data:
     - Prize 1: Name="50% Off", Code="SAVE50", Color="#FFD700", Icon="🎉"
     - Prize 2: Name="Free Shipping", Code="FREESHIP", Color="#4CAF50", Icon="🚚"
     - Prize 3: Name="$25 Gift Card", Code="GIFT25", Color="#2196F3", Icon="💳"

4. **Save and Verify:**
   - Save the component configuration
   - Check that prizes are displayed correctly in the component
   - Verify debug information shows correct values

### Step 2: Publish Testing

1. **Activate Page:**
   - Activate the page to publish
   - Navigate to the published URL

2. **Test ScratchCard:**
   - Scratch the card to reveal the prize
   - Verify the prize background is visible while scratching
   - Check that the alert shows "PrizeName - PrizeCode" format
   - Ensure no "undefined" values appear

### Step 3: Console Validation

1. **Open Browser Console:**
   - Press F12 to open developer tools
   - Go to Console tab

2. **Check for Errors:**
   - Look for any JavaScript errors
   - Verify no "undefined" values in logs
   - Check that prize data is parsed correctly

3. **Expected Console Output:**
   ```
   [Citi ScratchCard] INFO: All components found, proceeding with initialization
   [Citi ScratchCard] INFO: All available prizes: [Array of prize objects]
   [Citi ScratchCard] INFO: Randomly selected prize 1 of 3: {prizeName: "50% Off", prizeCode: "SAVE50", ...}
   [Citi ScratchCard] INFO: Updated prize background with: {prizeName: "50% Off", ...}
   [Citi ScratchCard] INFO: Final display text: 50% Off - SAVE50
   ```

## Validation Checklist

### Author Mode
- [ ] Component dialog opens correctly
- [ ] Prizes can be added and saved
- [ ] Debug information shows correct values
- [ ] No JavaScript errors in console

### Publish Mode
- [ ] Page loads without errors
- [ ] Prize background displays correctly
- [ ] Scratch functionality works
- [ ] Alert shows correct prize information
- [ ] No "undefined" values anywhere

### Cross-Component Testing
- [ ] PickAGift component still works
- [ ] SpinWheel component still works
- [ ] No regression in other components

## Troubleshooting

### Common Issues

1. **"undefined - undefined" Alert:**
   - Check that prizes are configured in the dialog
   - Verify HTL template property names are correct
   - Check console for parsing errors

2. **Prize Background Not Visible:**
   - Verify CSS is loaded correctly
   - Check that prize data is being passed to JavaScript
   - Ensure updatePrizeBackground function is called

3. **JavaScript Errors:**
   - Check that all required libraries are loaded
   - Verify component dependencies are available
   - Check for syntax errors in modified files

### Debug Commands

1. **Check JCR Structure:**
   ```bash
   # In CRXDE Lite, navigate to component node
   # Verify prizes node structure:
   /content/.../jcr:content/root/.../scratchcard/prizes/
   ```

2. **Verify Sling Model:**
   ```bash
   # Check model output in browser
   # Add ?debug=layout to page URL
   ```

3. **Test JSON Output:**
   ```bash
   # Check prizes JSON in browser console
   console.log(document.querySelector('.scratch-card-game').getAttribute('data-prizes'));
   ```

## Rollback Instructions

If issues occur, rollback by:

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

## Success Criteria

The fix is successful when:

1. ✅ Dynamic prizes persist in JCR after author save
2. ✅ Prize background displays correctly while scratching
3. ✅ Alert shows correct "PrizeName - PrizeCode" format
4. ✅ No "undefined" values in console or display
5. ✅ Works in both Author and Publish modes
6. ✅ No duplicate JS redeclaration errors
7. ✅ PickAGift and SpinWheel components still work correctly
