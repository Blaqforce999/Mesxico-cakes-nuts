/**
 * Design Tokens to CSS Variables Converter
 * 
 * Converts JSON design tokens (Color Roles, Typography, Spacing & Borders)
 * into a single unified CSS variables file.
 * 
 * Note on Colors:
 * - Design systems distinguish between primitive colors (raw palettes) and color roles (semantic tokens).
 * - This converter specifically filters and extracts COLOR ROLES for the UI, ignoring any primitive colors.
 */

const fs = require('fs');
const path = require('path');

// Parse optional CLI arguments: --colors <file> --type <file> --spacing <file> --out <file>
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--colors' && args[i + 1]) options.colors = args[++i];
    else if (args[i] === '--type' && args[i + 1]) options.type = args[++i];
    else if (args[i] === '--spacing' && args[i + 1]) options.spacing = args[++i];
    else if ((args[i] === '--out' || args[i] === '-o') && args[i + 1]) options.out = args[++i];
  }
  return options;
}

const cliOptions = parseArgs();

// File paths (defaults to workspace files)
const COLOR_TOKENS_FILE = path.resolve(__dirname, cliOptions.colors || 'Light.tokens.json');
const TYPOGRAPHY_TOKENS_FILE = path.resolve(__dirname, cliOptions.type || 'Default.tokens.json');
const SPACING_BORDER_TOKENS_FILE = path.resolve(__dirname, cliOptions.spacing || 'spacing-border-token.json');
const OUTPUT_CSS_FILE = path.resolve(__dirname, cliOptions.out || 'tokens.css');

/**
 * Standard font family fallbacks
 */
const FONT_FALLBACKS = {
  Fraunces: "'Fraunces', Georgia, serif",
  'Fredoka One': "'Fredoka One', Georgia, serif",
  Inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

/**
 * Font weight name to numeric mapping
 */
const FONT_WEIGHT_MAP = {
  Thin: '100',
  ExtraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
  ExtraBold: '800',
  Black: '900',
};

/**
 * Recognized semantic color roles in Material Design / Design Token specifications.
 * The UI consumes color roles, not primitive swatch palettes.
 */
const KNOWN_COLOR_ROLES = new Set([
  'primary',
  'on-primary',
  'primary-container',
  'on-primary-container',
  'secondary',
  'on-secondary',
  'secondary-container',
  'on-secondary-container',
  'tertiary',
  'on-tertiary',
  'tertiary-container',
  'on-tertiary-container',
  'background',
  'on-background',
  'surface',
  'on-surface',
  'surface-variant',
  'on-surface-variant',
  'surface-container',
  'surface-container-low',
  'surface-container-high',
  'surface-container-highest',
  'surface-dim',
  'surface-bright',
  'surface-tint',
  'outline',
  'outline-variant',
  'error',
  'on-error',
  'error-container',
  'on-error-container',
  'inverse-surface',
  'inverse-on-surface',
  'inverse-primary',
  'scrim',
  'shadow',
]);

/**
 * Checks if a token represents a color role rather than a primitive color.
 * Filters out raw palette swatches (e.g., neutral-10, red-500, primitive, palette, core).
 */
function isColorRole(key, parentKey = '') {
  const normalizedKey = key.toLowerCase();
  const normalizedParent = parentKey.toLowerCase();

  // If parent indicates primitives/palette, exclude
  if (
    normalizedParent.includes('primitive') ||
    normalizedParent.includes('palette') ||
    normalizedParent.includes('core') ||
    normalizedParent.includes('ref')
  ) {
    return false;
  }

  // If key explicitly matches known semantic color roles
  if (KNOWN_COLOR_ROLES.has(normalizedKey)) {
    return true;
  }

  // Check if it follows role conventions (starts with on-, ends with -container, surface-, etc.)
  const isSemanticRoleName =
    normalizedKey.startsWith('on-') ||
    normalizedKey.endsWith('-container') ||
    normalizedKey.startsWith('surface-') ||
    normalizedKey.startsWith('inverse-') ||
    ['primary', 'secondary', 'tertiary', 'background', 'surface', 'outline', 'error', 'shadow', 'scrim'].includes(normalizedKey);

  // Primitive swatches typically have numerical scales (e.g., red-50, neutral-90, blue-500)
  const hasPrimitiveNumericScale = /-\d+$/.test(normalizedKey);

  return isSemanticRoleName && !hasPrimitiveNumericScale;
}

/**
 * Extracts color hex or string value from token object
 */
function extractColorValue(token) {
  if (!token) return null;
  if (typeof token === 'string') return token;
  if (token.$value) {
    if (typeof token.$value === 'string') return token.$value;
    if (token.$value.hex) return token.$value.hex;
  }
  if (token.value) {
    if (typeof token.value === 'string') return token.value;
    if (token.value.hex) return token.value.hex;
  }
  return null;
}

/**
 * Formats numbers, avoiding float precision artifacts
 */
function formatNumber(num) {
  if (typeof num !== 'number') return num;
  return Number(num.toFixed(4));
}

/**
 * Convert color tokens (filtering for color roles only)
 */
function processColorTokens(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[Warning] Color tokens file not found: ${filePath}`);
    return [];
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const colorSection = raw.color || raw;
  const variables = [];

  for (const [key, token] of Object.entries(colorSection)) {
    // Skip non-token metadata like $extensions
    if (key.startsWith('$')) continue;

    // Filter: UI only uses color roles, primitive colors are excluded
    if (!isColorRole(key)) {
      console.log(`[Info] Skipping non-role / primitive color token: "${key}"`);
      continue;
    }

    const hexValue = extractColorValue(token);
    if (hexValue) {
      variables.push({
        name: `--color-${key}`,
        value: hexValue,
        comment: `Role: ${key}`,
      });
    }
  }

  return variables;
}

/**
 * Convert typography tokens
 */
function processTypographyTokens(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[Warning] Typography tokens file not found: ${filePath}`);
    return { individualVars: [], compositeVars: [], familyVars: [] };
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const typeSection = raw.type || raw;
  const individualVars = [];
  const compositeVars = [];
  const familyVars = [
    { name: '--font-family-display', value: FONT_FALLBACKS['Fredoka One'] },
    { name: '--font-family-body', value: FONT_FALLBACKS['Inter'] },
  ];

  for (const [styleName, styleProps] of Object.entries(typeSection)) {
    if (styleName.startsWith('$')) continue;

    const rawFamily = styleProps['font-family']?.$value || styleProps['font-family']?.value || 'sans-serif';
    const familyFallback = FONT_FALLBACKS[rawFamily] || `'${rawFamily}', sans-serif`;

    const rawWeight = styleProps['font-weight']?.$value || styleProps['font-weight']?.value || 'Regular';
    const numericWeight = FONT_WEIGHT_MAP[rawWeight] || rawWeight;

    const rawSize = styleProps['font-size']?.$value ?? styleProps['font-size']?.value ?? 16;
    const fontSize = `${formatNumber(rawSize)}px`;

    const rawLineHeight = styleProps['line-height']?.$value ?? styleProps['line-height']?.value ?? 24;
    const lineHeight = `${formatNumber(rawLineHeight)}px`;

    const rawLetterSpacing = styleProps['letter-spacing']?.$value ?? styleProps['letter-spacing']?.value ?? 0;
    const letterSpacing = `${formatNumber(rawLetterSpacing)}px`;

    // Individual CSS Variables
    individualVars.push({
      name: `--typography-${styleName}-font-family`,
      value: familyFallback,
    });
    individualVars.push({
      name: `--typography-${styleName}-font-weight`,
      value: `${numericWeight}`,
      comment: rawWeight,
    });
    individualVars.push({
      name: `--typography-${styleName}-font-size`,
      value: fontSize,
    });
    individualVars.push({
      name: `--typography-${styleName}-line-height`,
      value: lineHeight,
    });
    individualVars.push({
      name: `--typography-${styleName}-letter-spacing`,
      value: letterSpacing,
    });

    // Shorthand CSS variable for convenient font shorthand
    compositeVars.push({
      name: `--typography-${styleName}`,
      value: `${numericWeight} ${fontSize}/${lineHeight} ${familyFallback}`,
      comment: `Shorthand for ${styleName}`,
    });
  }

  return { individualVars, compositeVars, familyVars };
}

/**
 * Convert spacing and border tokens
 */
function processSpacingAndBorderTokens(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[Warning] Spacing/border tokens file not found: ${filePath}`);
    return { spacingVars: [], borderVars: [] };
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const spacingVars = [];
  const borderVars = [];

  // Spacing tokens
  if (raw.spacing) {
    for (const [key, val] of Object.entries(raw.spacing)) {
      if (key.startsWith('$')) continue;
      const numericVal = typeof val === 'object' ? (val.$value ?? val.value) : val;
      spacingVars.push({
        name: `--spacing-${key}`,
        value: `${formatNumber(Number(numericVal))}px`,
      });
    }
  }

  // Border tokens (provides both --border-width-* and --border-* for convenience)
  if (raw.border) {
    for (const [key, val] of Object.entries(raw.border)) {
      if (key.startsWith('$')) continue;
      const numericVal = typeof val === 'object' ? (val.$value ?? val.value) : val;
      const formattedVal = `${formatNumber(Number(numericVal))}px`;
      borderVars.push({
        name: `--border-width-${key}`,
        value: formattedVal,
      });
      borderVars.push({
        name: `--border-${key}`,
        value: formattedVal,
      });
    }
  }

  return { spacingVars, borderVars };
}

/**
 * Generate formatted CSS output
 */
function generateCSS() {
  console.log('Converting design tokens to CSS variables...');

  const colorVars = processColorTokens(COLOR_TOKENS_FILE);
  const { individualVars: typeVars, compositeVars: typeShorthands, familyVars } = processTypographyTokens(TYPOGRAPHY_TOKENS_FILE);
  const { spacingVars, borderVars } = processSpacingAndBorderTokens(SPACING_BORDER_TOKENS_FILE);

  let css = `/**
 * ==============================================================================
 * DESIGN TOKENS - CSS VARIABLES
 * Generated on: ${new Date().toISOString()}
 * 
 * Sources:
 * - Colors: ${path.basename(COLOR_TOKENS_FILE)} (Color Roles only; primitives excluded for UI)
 * - Typography: ${path.basename(TYPOGRAPHY_TOKENS_FILE)}
 * - Spacing & Borders: ${path.basename(SPACING_BORDER_TOKENS_FILE)}
 * ==============================================================================
 */

:root {
  /* ==========================================================================
     COLOR ROLES (Semantic UI Colors)
     Note: In this color system, only color roles are used by the UI components.
     Primitive colors are excluded to maintain semantic design abstraction.
     ========================================================================== */
`;

  for (const v of colorVars) {
    const comment = v.comment ? ` /* ${v.comment} */` : '';
    css += `  ${v.name.padEnd(35)}: ${v.value};${comment}\n`;
  }

  css += `\n  /* ==========================================================================
     FONT FAMILIES
     ========================================================================== */\n`;

  for (const v of familyVars) {
    css += `  ${v.name.padEnd(35)}: ${v.value};\n`;
  }

  css += `\n  /* ==========================================================================
     TYPOGRAPHY TOKENS (Font Family, Weight, Size, Line Height, Letter Spacing)
     ========================================================================== */\n`;

  let currentCategory = '';
  for (const v of typeVars) {
    const category = v.name.replace('--typography-', '').split('-')[0];
    if (category !== currentCategory) {
      currentCategory = category;
      css += `\n  /* --- ${category.toUpperCase()} --- */\n`;
    }
    const comment = v.comment ? ` /* ${v.comment} */` : '';
    css += `  ${v.name.padEnd(46)}: ${v.value};${comment}\n`;
  }

  css += `\n  /* ==========================================================================
     TYPOGRAPHY COMPOSITE SHORTHANDS (font: weight size/line-height family)
     ========================================================================== */\n`;

  for (const v of typeShorthands) {
    css += `  ${v.name.padEnd(35)}: ${v.value};\n`;
  }

  css += `\n  /* ==========================================================================
     SPACING TOKENS
     ========================================================================== */\n`;

  for (const v of spacingVars) {
    css += `  ${v.name.padEnd(20)}: ${v.value};\n`;
  }

  css += `\n  /* ==========================================================================
     BORDER WIDTH TOKENS
     ========================================================================== */\n`;

  for (const v of borderVars) {
    css += `  ${v.name.padEnd(25)}: ${v.value};\n`;
  }

  css += `}\n`;

  // Write to output file
  fs.writeFileSync(OUTPUT_CSS_FILE, css, 'utf8');
  console.log(`\nSuccessfully converted tokens!`);
  console.log(`Generated CSS file: ${OUTPUT_CSS_FILE}`);
  console.log(`Summary:`);
  console.log(` - Color Roles:   ${colorVars.length} variables`);
  console.log(` - Typography:    ${typeVars.length} individual + ${typeShorthands.length} shorthand variables`);
  console.log(` - Spacing:       ${spacingVars.length} variables`);
  console.log(` - Border Widths: ${borderVars.length} variables`);
}

// Execute conversion
generateCSS();

module.exports = {
  processColorTokens,
  processTypographyTokens,
  processSpacingAndBorderTokens,
  generateCSS,
  isColorRole,
};
