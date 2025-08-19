# Scripts

This directory contains utility scripts for the Read-It project.

## material-to-css.js

Converts a JSON file exported from Material Theme Builder to CSS custom properties (variables) in HSL format, ready to be used in `globals.css` for Tailwind CSS.

### Usage

```bash
node scripts/material-to-css.js <input.json> [output.css]
```

### Examples

Display generated CSS variables in console:
```bash
node scripts/material-to-css.js colors.json
```

Save generated CSS variables to a file:
```bash
node scripts/material-to-css.js colors.json output.css
```

### Input Format

The script expects a JSON file with hex color values:

```json
{
  "primary": "#0057FF",
  "onPrimary": "#FFFFFF",
  "background": "#0B1220",
  "surface": "#1A1A1A",
  "secondary": "#5A67D8",
  "accent": "#ED8936",
  "destructive": "#E53E3E"
}
```

### Output

The script generates CSS variables in HSL format that can be directly used in your `globals.css` file:

```css
@layer base {
  :root {
    --primary: 220 100% 50%;
    --on-primary: 0 0% 100%;
    --background: 220 49% 8%;
    --surface: 0 0% 10%;
    /* ... */
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary: 220 100% 50%;
    --on-primary: 0 0% 100%;
    /* ... */
  }
}
```

### Integration with Tailwind

The generated variables work seamlessly with your existing Tailwind configuration. The `tailwind.config.ts` should reference these variables using the `hsl()` function:

```typescript
colors: {
  primary: 'hsl(var(--primary))',
  background: 'hsl(var(--background))',
  // ...
}
```

### Preparing for Tailwind v4

This approach aligns with Tailwind v4's direction of using CSS variables directly in `globals.css` instead of defining colors in the config file. When you upgrade to Tailwind v4, you'll be able to remove the color definitions from `tailwind.config.ts` and rely entirely on the CSS variables in `globals.css`.