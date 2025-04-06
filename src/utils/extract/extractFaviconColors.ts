import { filterSimilarColors } from "../filterSimilarColors";
import { extractColorsByFileType } from "./extractColorsByFileType";
import fileType from "file-type";
import { prepareFaviconFiles } from "../prepareFaviconFiles";
import { normalizeColor } from "../normalizeColor";

/**
 * Extract colors from favicon
 */
export async function extractFaviconColors(faviconUrl: string, faviconBuffer: Buffer): Promise<string[]> {
  let faviconColors: string[] = [];
  
  try {
    // Detect content type
    const contentTypeInfo = await fileType.fromBuffer(faviconBuffer).catch(() => null);
    const contentType = contentTypeInfo?.mime || 'application/octet-stream';
    
    // Determine file extension
    const { ext, tmpFile, pngTmpFile } = prepareFaviconFiles(faviconUrl, contentType, faviconBuffer);
    
    // Extract colors based on file type
    faviconColors = await extractColorsByFileType(ext, contentType, tmpFile, pngTmpFile, faviconBuffer);
    
    // Process extracted colors
    if (faviconColors.length > 0) {
      // Filter similar colors
      faviconColors = filterSimilarColors(faviconColors);
      
      // Normalize to hex format
      faviconColors = faviconColors.map(normalizeColor);
      
      // Remove duplicates
      faviconColors = [...new Set(faviconColors)];
    }
  } catch (error) {
    console.error('Favicon color extraction failed:', error);
    faviconColors = [];
  }
  
  return faviconColors;
}
