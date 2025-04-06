import getColors from "get-image-colors";
import { extractColorsFromBuffer } from "../extract/extractColorsFromBuffer";
import { writeFileSync } from "fs";
import icoToPng from "ico-to-png";

/**
 * Handle ICO file for color extraction
 */
export async function handleIcoFile(faviconBuffer: Buffer, pngTmpFile: string): Promise<string[]> {
  try {
    // Convert ICO to PNG
    const pngBuffer = await icoToPng(faviconBuffer, 32);
    writeFileSync(pngTmpFile, pngBuffer);
    
    // Extract colors from PNG
    const colors = await getColors(pngTmpFile);
    return colors.map(c => c.hex());
  } catch (icoErr) {
    console.warn(`ICO conversion failed: ${icoErr instanceof Error ? icoErr.message : 'Unknown error'}`);
    
    // Try manual buffer extraction
    try {
      const rawColors = extractColorsFromBuffer(faviconBuffer);
      if (rawColors.length > 0) {
        return rawColors;
      }
    } catch (bufferErr) {
      console.warn(`Buffer color extraction failed: ${bufferErr instanceof Error ? bufferErr.message : 'Unknown error'}`);
    }
    
    return [];
  }
} 