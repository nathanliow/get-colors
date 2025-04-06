/**
 * Extract favicon URL using Puppeteer
 */
export async function extractFaviconUrlWithPuppeteer(page: any, url: string): Promise<string> {
  // Try to get favicon URL from link elements
  let faviconUrl = await page.evaluate(() => {
    const selectors = [
      'link[rel="icon"]', 
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];
    
    for (const selector of selectors) {
      const link = document.querySelector(selector);
      if (link && (link as HTMLLinkElement).href) {
        return (link as HTMLLinkElement).href;
      }
    }
    
    return '';
  });
  
  // If no favicon found in link tags, try default location
  if (!faviconUrl) {
    try {
      const pageUrl = new URL(url);
      faviconUrl = `${pageUrl.origin}/favicon.ico`;
    } catch (urlErr) {
      console.warn(`Error creating favicon URL: ${urlErr}`);
    }
  }
  
  return faviconUrl;
}