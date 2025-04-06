// Simple color extraction from buffer by sampling bytes
export function extractColorsFromBuffer(buffer: Buffer): string[] {
  const colors: string[] = [];
  const uniqueColors = new Set<string>();
  
  // Skip file header (first 10-20 bytes usually) for better results
  const startOffset = 24;
  
  // Only process if we have enough data
  if (buffer.length > startOffset + 100) {
    // Sample the buffer at regular intervals
    // For ICO files, the data often contains color palette information
    for (let i = startOffset; i < buffer.length - 3; i += 4) {
      // We're looking for RGB values
      const r = buffer[i];
      const g = buffer[i + 1];
      const b = buffer[i + 2];
      
      // Skip transparent or all black/white pixels
      if (
        (r > 5 || g > 5 || b > 5) && // not black
        (r < 250 || g < 250 || b < 250) && // not white
        !(r === g && g === b) // not grayscale
      ) {
        const colorHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        uniqueColors.add(colorHex);
        
        // Limit to 5 colors
        if (uniqueColors.size >= 5) {
          break;
        }
      }
    }
    
    colors.push(...uniqueColors);
  }
  
  return colors;
}