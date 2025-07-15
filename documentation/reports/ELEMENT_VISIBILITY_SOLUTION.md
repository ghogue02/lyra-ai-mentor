# 🔧 Complete Solution: Element Visibility Issues

## 📋 Summary

You're only seeing 2 elements per chapter because of potential:
1. Missing database columns that the app might expect
2. High order_index values pushing elements out of view
3. Browser caching of old data
4. Possible JavaScript errors

## 🚀 Quick Fix (Do These In Order)

### 1. **Run Database Fix**
```sql
fix-element-visibility.sql
```
This will:
- Add any missing columns (is_active, is_gated, is_visible)
- Set all elements to visible
- Fix problematic order_index values
- Show you what should be visible

### 2. **Clear Browser Cache**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear local storage: Open DevTools → Application → Clear Storage

### 3. **Check Debug Output**
Navigate to any lesson - you'll see a debug panel in the bottom right showing:
- How many elements are in the database
- How many are rendered in the DOM
- Any mismatches

### 4. **Remove Debug Panel** (after fixing)
Once everything works, remove the debug panel by editing Lesson.tsx and removing:
```jsx
{/* Debug helper - remove after fixing */}
<ElementVisibilityDebugger />
```

## 📊 What You Should See

### Per Chapter Distribution:
- **Chapter 1**: 4 interactive elements + content
- **Chapter 2**: 11-12 elements per lesson
- **Chapter 3-6**: 6-7 elements per lesson (3 content + 3-4 interactive)

### Example (Chapter 3, Lesson 11):
1. Content: Sofia's Silent Crisis Story (order: 10)
2. Content: The Breaking Point (order: 20)  
3. Content: Finding Her Voice (order: 30)
4. Interactive: Analyze Sofia's Email (order: 35)
5. Interactive: AI Content Generator (order: 50)
6. Interactive: Sofia's Board Meeting (order: 65)

## 🔍 About "Board Defense Strategy"

Found it! It's "Rachel's Board Defense Strategy" in Chapter 5 (element ID 24). This is a legitimate template_creator element, not a bug.

## 🛠️ If Still Having Issues

### Check Console Errors:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors when loading a lesson

### Common Errors and Fixes:
- **"Cannot read property of undefined"** → Run the database fix SQL
- **"Failed to fetch"** → Check Supabase connection
- **No errors but missing elements** → Clear cache and refresh

### Manual Verification:
Run this SQL to see exactly what's in lesson 5:
```sql
SELECT type, title, order_index 
FROM interactive_elements 
WHERE lesson_id = 5 
ORDER BY order_index;
```

You should see 11 elements including:
- Multiple lyra_chat instances
- ai_email_composer
- difficult_conversation_helper  
- document_generator
- automated_element_enhancer

## ✅ Success Indicators

After fixes, you should see:
- Debug panel shows matching database/DOM counts
- All 6-7 elements per lesson visible
- No console errors
- Smooth scrolling through all content

## 🎯 Next Steps

1. **Run the fix SQL now**
2. **Refresh a lesson page**
3. **Check the debug panel**
4. **If all elements show, remove the debug component**

The data is all there (177 total elements) - we just need to ensure the browser can see and render them all!