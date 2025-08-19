#!/usr/bin/env node

/**
 * Material Theme Builder to CSS Variables Converter
 * 
 * This script converts a JSON file exported from Material Theme Builder
 * to CSS custom properties (variables) in HSL format, ready to be used
 * in globals.css for Tailwind CSS.
 * 
 * Usage:
 *   node scripts/material-to-css.js <input.json> [output.css]
 * 
 * Example JSON format:
 * {
 *   "primary": "#0057FF",
 *   "onPrimary": "#FFFFFF",
 *   "background": "#0B1220",
 *   "surface": "#1A1A1A"
 * }
 */

const fs = require('fs');
const path = require('path');

// Convert hex color to HSL
function hexToHsl(hex) {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the r, g, b values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  // Convert to the format Tailwind expects: "hue saturation% lightness%"
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Convert camelCase to kebab-case for CSS variables
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Generate CSS variables from Material Theme Builder JSON
function generateCSSVariables(colorsJson) {
  const cssVars = [];
  
  Object.entries(colorsJson).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      const cssVarName = camelToKebab(key);
      const hslValue = hexToHsl(value);
      cssVars.push(`    --${cssVarName}: ${hslValue};`);
    }
  });
  
  return cssVars.join('\n');
}

// Generate complete CSS structure
function generateCSS(colorsJson, isDarkMode = false) {
  const variables = generateCSSVariables(colorsJson);
  const selector = isDarkMode ? '@media (prefers-color-scheme: dark)' : '';
  
  if (isDarkMode) {
    return `
${selector} {
  :root {
${variables}
  }
}`;
  } else {
    return `@layer base {
  :root {
${variables}
  }
}`;
  }
}

// Process color object that might have separate light/dark colors
function processColorObject(colorsJson) {
  // Check if the JSON has separate light and dark sections
  if (colorsJson.light && colorsJson.dark) {
    return {
      light: colorsJson.light,
      dark: colorsJson.dark
    };
  }
  
  // If not, use the same colors for both light and dark
  return {
    light: colorsJson,
    dark: colorsJson
  };
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/material-to-css.js <input.json> [output.css]');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/material-to-css.js colors.json');
    console.log('  node scripts/material-to-css.js colors.json output.css');
    console.log('');
    console.log('Expected JSON format:');
    console.log('  { "primary": "#0057FF", "onPrimary": "#FFFFFF", "background": "#0B1220" }');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found.`);
    process.exit(1);
  }

  try {
    const jsonContent = fs.readFileSync(inputFile, 'utf8');
    const colorsJson = JSON.parse(jsonContent);

    // Process colors (might have separate light/dark modes)
    const colorModes = processColorObject(colorsJson);

    // Generate CSS for light mode
    const lightModeCSS = generateCSS(colorModes.light, false);
    
    // Generate CSS for dark mode
    const darkModeCSS = generateCSS(colorModes.dark, true);

    const fullCSS = `${lightModeCSS}

${darkModeCSS}`;

    if (outputFile) {
      fs.writeFileSync(outputFile, fullCSS);
      console.log(`✅ CSS variables generated successfully in "${outputFile}"`);
    } else {
      console.log('Generated CSS variables:');
      console.log(fullCSS);
    }

    console.log('\n📝 Instructions:');
    console.log('1. Copy the generated CSS variables to your src/app/globals.css file');
    console.log('2. Replace the existing variables in the :root selector');
    console.log('3. Make sure to also update the dark mode section if needed');
    console.log('4. Your Tailwind config should already be set up to use these variables');
    console.log('\n💡 Pro tip: You can also provide separate light/dark colors like this:');
    console.log('   { "light": { "primary": "#0057FF" }, "dark": { "primary": "#4A90F2" } }');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File "${inputFile}" not found.`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in "${inputFile}".`);
      console.error('Make sure your JSON file has the correct format.');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { hexToHsl, camelToKebab, generateCSSVariables, generateCSS, processColorObject };