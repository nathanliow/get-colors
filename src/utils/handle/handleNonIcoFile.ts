import getColors from "get-image-colors";
import sharp from "sharp";

/**
 * Handle non-ICO file for color extraction
 */
export async function handleNonIcoFile(faviconBuffer: Buffer, pngTmpFile: string): Promise<string[]> {
  try {
    // Convert to PNG using sharp
    await sharp(faviconBuffer, { failOnError: false })
      .toFormat('png')
      .toFile(pngTmpFile);
    
    // Extract colors from PNG
    const colors = await getColors(pngTmpFile);
    return colors.map(c => c.hex());
  } catch (sharpErr) {
    console.warn(`Sharp conversion failed: ${sharpErr instanceof Error ? sharpErr.message : 'Unknown error'}`);
    return [];
  }
}