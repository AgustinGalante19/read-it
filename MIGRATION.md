# Migration Guide: Tailwind v4 Preparation

This project is prepared for Tailwind v4 migration. Here's how the color system works and what will change.

## Current Setup (Tailwind v3)

Currently, the project uses:
1. CSS variables defined in `src/app/globals.css`
2. `tailwind.config.ts` that references these variables with `hsl()` wrapper
3. Components use Tailwind classes like `bg-primary`, `text-foreground`, etc.

## Tailwind v4 Migration Path

In Tailwind v4:
1. ✅ CSS variables in `globals.css` (already implemented)
2. ❌ Remove color definitions from `tailwind.config.ts` 
3. ✅ Components continue using the same Tailwind classes

## What Changes

### Before (Tailwind v3):
```typescript
// tailwind.config.ts
colors: {
  primary: 'hsl(var(--primary))',
  background: 'hsl(var(--background))',
  // ...
}
```

```css
/* globals.css */
:root {
  --primary: 220 100% 50%;
  --background: 0 0% 100%;
}
```

### After (Tailwind v4):
```typescript
// tailwind.config.ts - colors section removed or much smaller
// Tailwind v4 automatically detects CSS variables
```

```css
/* globals.css - same as before */
:root {
  --primary: 220 100% 50%;
  --background: 0 0% 100%;
}
```

## Benefits of This Approach

1. **Smooth Migration**: When v4 arrives, minimal config changes needed
2. **Dynamic Theming**: Easy to change colors via CSS variables
3. **Material Theme Builder Integration**: Use our script to convert Material colors
4. **Design System Friendly**: Variables can be shared across different frameworks

## Using the Material Theme Builder Script

1. Export your colors from Material Theme Builder as JSON
2. Run: `npm run colors your-colors.json output.css`
3. Copy the generated CSS to `globals.css`
4. Your Tailwind classes automatically use the new colors

## Example Workflow

```bash
# Generate CSS from Material Theme Builder export
npm run colors material-colors.json generated-colors.css

# Copy variables to globals.css (replace existing ones)
# Your components automatically get the new colors!
```

This approach ensures your project is ready for Tailwind v4 while working perfectly with v3.