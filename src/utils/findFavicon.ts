import * as cheerio from 'cheerio';

// Helper function to find favicon
export async function findFavicon($: cheerio.CheerioAPI, baseUrl: string, headers: Record<string, string>): Promise<string> {
  let faviconUrl = '';
  
  // Approach 1: Check common favicon link tags
  const faviconSelectors = [
    'link[rel="icon"]', 
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="mask-icon"]'
  ];

  for (const selector of faviconSelectors) {
    const href = $(selector).attr('href');
    if (href) {
      try {
        faviconUrl = new URL(href, baseUrl).href;
        console.log(`Found favicon from ${selector}: ${faviconUrl}`);
        break;
      } catch (err) {
        console.warn(`Invalid favicon URL: ${href}`);
      }
    }
  }

  // Approach 2: Try root domain favicon.ico as fallback
  if (!faviconUrl) {
    try {
      faviconUrl = new URL('/favicon.ico', baseUrl).href;
      console.log(`Trying root favicon: ${faviconUrl}`);
    } catch (err) {
      console.warn(`Invalid base URL: ${baseUrl}`);
    }
  }
  
  return faviconUrl;
}