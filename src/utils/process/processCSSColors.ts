import { extractCSSColors } from "../extract/extractCSSColors";
import { normalizeColor } from "../normalizeColor";

/**
 * Process CSS colors from styles
 */
export function processCssColors(styles: string[]): { palette: any, cssColors: string[] } {
  // Extract color palette
  const palette = extractCSSColors(styles.join('\n'));
  
  // Extract and process all CSS colors
  let allCssColors = [...new Set(
    (styles.join('\n').match(/#[0-9a-fA-F]{3,6}|rgba?\([^\)]+\)/g) || [])
      .map(color => color.toLowerCase())
  )];
  
  // Normalize and convert RGB colors to hex
  allCssColors = allCssColors.map(color => normalizeColor(color));
  
  // Remove duplicates that might have been created by normalization
  const uniqueCssColors = [...new Set(allCssColors)]
    .slice(0, 20)
    .sort((a, b) => a.localeCompare(b));
  
  return { 
    palette, 
    cssColors: uniqueCssColors 
  };
}