import fileType from "file-type";

/**
 * Create base64 data URL from favicon
 */
export async function createFaviconBase64(faviconUrl: string, faviconBuffer: Buffer): Promise<string | undefined> {
  try {
    // Determine MIME type
    let mimeType = 'image/x-icon';
    
    // Try to detect from file extension
    const urlParts = faviconUrl.split('.');
    const fileExt = urlParts.length > 1 ? 
        `.${urlParts[urlParts.length - 1].split('?')[0].toLowerCase()}` : '';
    
    // Map extension to MIME type
    const extToMime: Record<string, string> = {
      '.ico': 'image/x-icon',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    };
    
    if (fileExt && extToMime[fileExt]) {
      mimeType = extToMime[fileExt];
    }
    
    // Try to detect from buffer
    try {
      const fileTypeInfo = await fileType.fromBuffer(faviconBuffer);
      if (fileTypeInfo && fileTypeInfo.mime) {
        mimeType = fileTypeInfo.mime;
      }
    } catch (detectErr) {
      // Use extension-based MIME type if detection fails
    }
    
    // Create data URL
    const base64 = faviconBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.warn(`Failed to create base64 data URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return undefined;
  }
}
