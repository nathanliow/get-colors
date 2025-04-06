// Helper function to filter out colors that are too similar
export function filterSimilarColors(colors: string[]): string[] {
  const result: string[] = [];
  const threshold = 30; // RGB distance threshold
  
  for (const color of colors) {
    // Convert hex to RGB
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    
    // Check if this color is too similar to any already in the result
    const isTooSimilar = result.some(existingColor => {
      const er = parseInt(existingColor.substring(1, 3), 16);
      const eg = parseInt(existingColor.substring(3, 5), 16);
      const eb = parseInt(existingColor.substring(5, 7), 16);
      
      // Calculate color distance (simple Euclidean distance in RGB space)
      const distance = Math.sqrt(
        Math.pow(r - er, 2) + 
        Math.pow(g - eg, 2) + 
        Math.pow(b - eb, 2)
      );
      
      return distance < threshold;
    });
    
    if (!isTooSimilar) {
      result.push(color);
    }
  }
  
  return result;
}