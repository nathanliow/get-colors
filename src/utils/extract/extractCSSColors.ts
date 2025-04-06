import { normalizeColor } from "../normalizeColor";

export function extractCSSColors(css: string) {
  const colors = css.match(/#[0-9a-fA-F]{3,6}|rgba?\([^\)]+\)/g) || [];
  const uniqueColors = [...new Set(colors)].slice(0, 10);
  
  return {
    primary: uniqueColors[0] ? normalizeColor(uniqueColors[0]) : '',
    secondary: uniqueColors[1] ? normalizeColor(uniqueColors[1]) : '',
    accent: uniqueColors[2] ? normalizeColor(uniqueColors[2]) : '',
    text: uniqueColors[3] ? normalizeColor(uniqueColors[3]) : '',
  };
}
