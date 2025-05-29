
// Color Utility Functions

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Parses a HEX color string to an RGB object.
 * Supports 3-digit and 6-digit hex codes.
 */
export function hexToRgb(hex: string): RGBColor | null {
  if (!hex || typeof hex !== 'string') return null;
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculates the relative luminance of an RGB color.
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const sRGB = [rgb.r, rgb.g, rgb.b].map(val => {
    const s = val / 255;
    return (s <= 0.03928) ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculates the contrast ratio between two RGB colors.
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function calculateContrastRatio(hexColor1: string, hexColor2: string): number {
  const rgb1 = hexToRgb(hexColor1);
  const rgb2 = hexToRgb(hexColor2);

  if (!rgb1 || !rgb2) return 1; // Default to 1 if parsing fails

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface WCAGRating {
  level: 'AA' | 'AAA';
  size: 'Normal' | 'Large';
  passes: boolean;
}

/**
 * Determines WCAG pass/fail status for different levels and text sizes.
 * Normal Text: AA >= 4.5, AAA >= 7.0
 * Large Text (18pt or 14pt bold): AA >= 3.0, AAA >= 4.5
 */
export function getWCAGRatings(contrastRatio: number): WCAGRating[] {
  const ratings: WCAGRating[] = [];

  ratings.push({
    level: 'AA',
    size: 'Normal',
    passes: contrastRatio >= 4.5
  });
  ratings.push({
    level: 'AA',
    size: 'Large',
    passes: contrastRatio >= 3.0
  });
  ratings.push({
    level: 'AAA',
    size: 'Normal',
    passes: contrastRatio >= 7.0
  });
  ratings.push({
    level: 'AAA',
    size: 'Large',
    passes: contrastRatio >= 4.5
  });

  return ratings;
}
