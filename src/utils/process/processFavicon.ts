import { extractFaviconColors } from "../extract/extractFaviconColors";
import { createFaviconBase64 } from "../createFaviconBase64";

/**
 * Process favicon buffer to extract colors and create base64 data URL
 */
export async function processFavicon(
  faviconUrl: string, 
  faviconBuffer: Buffer | null
): Promise<{ 
  faviconColors: string[]; 
  faviconBase64?: string;
}> {
  let faviconColors: string[] = [];
  let faviconBase64: string | undefined = undefined;
  
  if (!faviconBuffer) {
    return { faviconColors, faviconBase64 };
  }
  
  try {
    // Extract colors from favicon
    faviconColors = await extractFaviconColors(faviconUrl, faviconBuffer);
    
    // Create base64 data URL
    faviconBase64 = await createFaviconBase64(faviconUrl, faviconBuffer);
  } catch (error) {
    console.error('Favicon processing failed:', error);
  }
  
  return { faviconColors, faviconBase64 };
}
