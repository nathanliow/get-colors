import getColors from "get-image-colors";
import { handleIcoFile } from "../handle/handleIcoFile";
import { handleNonIcoFile } from "../handle/handleNonIcoFile";

/**
 * Extract colors from favicon based on file type
 */
export async function extractColorsByFileType(
  ext: string,
  contentType: string,
  tmpFile: string,
  pngTmpFile: string,
  faviconBuffer: Buffer
): Promise<string[]> {
  try {
    // Try direct color extraction first
    return await getColors(tmpFile).then(colors => colors.map(c => c.hex()));
  } catch (directErr) {
    console.warn(`Direct color extraction failed: ${directErr instanceof Error ? directErr.message : 'Unknown error'}`);
    
    // Handle based on file type
    if (contentType.includes('icon') || ext.toLowerCase() === '.ico') {
      return await handleIcoFile(faviconBuffer, pngTmpFile);
    } else {
      return await handleNonIcoFile(faviconBuffer, pngTmpFile);
    }
  }
}