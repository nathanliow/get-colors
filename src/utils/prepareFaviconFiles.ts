import { tmpdir } from "os";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFileSync } from "fs";

/**
 * Prepare favicon files and determine file extension
 */
export function prepareFaviconFiles(
  faviconUrl: string,
  contentType: string,
  faviconBuffer: Buffer
): { ext: string; tmpFile: string; pngTmpFile: string } {
  // Map content type to extension
  const contentTypeToExt: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
    'image/vnd.microsoft.icon': '.ico',
    'image/webp': '.webp'
  };
  
  // Get file extension from URL
  const urlParts = faviconUrl.split('.');
  const urlExt = urlParts.length > 1 ? 
      `.${urlParts[urlParts.length - 1].split('?')[0].toLowerCase()}` : '';
  
  // Determine extension to use
  const validExts = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  const detectedExt = contentType in contentTypeToExt ? contentTypeToExt[contentType as keyof typeof contentTypeToExt] : '';
  const ext = detectedExt || (validExts.includes(urlExt) ? urlExt : '.png');
  
  // Create temp files
  const tmpFile = join(tmpdir(), `${uuidv4()}${ext}`);
  const pngTmpFile = join(tmpdir(), `${uuidv4()}.png`);
  
  // Write favicon to temp file
  writeFileSync(tmpFile, faviconBuffer);
  
  return { ext, tmpFile, pngTmpFile };
}

