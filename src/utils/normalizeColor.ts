// Helper function to normalize colors to lowercase hex
export const normalizeColor = (color: string): string => {
  // Convert color to lowercase
  color = color.toLowerCase();
  
  // Convert rgb/rgba to hex
  if (color.startsWith('rgb')) {
    // Handle both formats: rgba(255,255,255,0.7) and rgb(255 255 255 / 70%)
    let values: number[] = [];
    let alpha = 1;
    
    if (color.includes('/')) {
      // Modern syntax: rgb(255 255 255 / 70%)
      const parts = color.substring(color.indexOf('(') + 1, color.indexOf(')')).split('/');
      const rgbParts = parts[0].trim().split(/\s+/);
      
      values = rgbParts.map(v => parseInt(v));
      
      // Handle alpha
      if (parts.length > 1) {
        // Extract percentage or decimal
        const alphaStr = parts[1].trim();
        if (alphaStr.endsWith('%')) {
          alpha = parseFloat(alphaStr.slice(0, -1)) / 100;
        } else {
          alpha = parseFloat(alphaStr);
        }
      }
    } else {
      // Traditional syntax: rgba(255, 255, 255, 0.7)
      const numericValues = color.match(/\d+(\.\d+)?/g);
      if (numericValues) {
        values = numericValues.map(v => parseFloat(v));
        // If it's rgba, extract alpha
        if (color.startsWith('rgba') && values.length > 3) {
          alpha = values[3];
          values = values.slice(0, 3);
        }
      }
    }
    
    if (values.length >= 3) {
      const r = Math.min(255, Math.max(0, Math.round(values[0])));
      const g = Math.min(255, Math.max(0, Math.round(values[1])));
      const b = Math.min(255, Math.max(0, Math.round(values[2])));
      
      // Convert RGB to hex
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      // Add alpha channel if not fully opaque
      if (alpha < 1) {
        const a = Math.min(255, Math.max(0, Math.round(alpha * 255)));
        return `${hex}${a.toString(16).padStart(2, '0')}`;
      }
      
      return hex;
    }
  }
  
  // Convert 3-digit hex to 6-digit hex for consistency
  if (color.match(/^#[0-9a-f]{3}$/)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  
  return color;
};