import { launchPuppeteer } from "../launchPuppeteer";
import { extractFaviconUrlWithPuppeteer } from "../extract/extractFaviconUrlWithPuppeteer";
import { fetchFaviconWithPuppeteer } from "./fetchFaviconWithPuppeteer";
import { DEFAULT_HEADERS } from "../constants";

/**
 * Fetch website content using Puppeteer
 */
export async function fetchWithPuppeteer(url: string): Promise<{
  html: string;
  faviconUrl: string;
  faviconBuffer: Buffer | null;
}> {
  const browser = await launchPuppeteer();
  let page;
  let html = '';
  let faviconUrl = '';
  let faviconBuffer: Buffer | null = null;
  
  try {
    page = await browser.newPage();
    
    // Configure page
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(DEFAULT_HEADERS['User-Agent']);
    await page.setExtraHTTPHeaders(DEFAULT_HEADERS);
    
    // Optimize page loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'font' || resourceType === 'media' || resourceType === 'websocket') {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });
    
    // Get HTML content
    html = await page.content();
    
    // Extract favicon URL
    faviconUrl = await extractFaviconUrlWithPuppeteer(page, url);
    
    // Fetch favicon if found
    if (faviconUrl && faviconUrl.startsWith('http')) {
      faviconBuffer = await fetchFaviconWithPuppeteer(browser, faviconUrl);
    }
  } catch (error) {
    console.error(`Puppeteer navigation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Try to get content even if navigation wasn't fully completed
    if (page) {
      try {
        html = await page.content();
        console.log('Got partial HTML content despite navigation error');
      } catch (contentErr) {
        console.error(`Failed to get HTML content: ${contentErr instanceof Error ? contentErr.message : 'Unknown error'}`);
        throw new Error('Failed to load website with Puppeteer');
      }
    }
  } finally {
    // Clean up resources
    if (page) {
      await page.close().catch(err => console.warn(`Error closing page: ${err}`));
    }
    await browser.close().catch(err => console.warn(`Error closing browser: ${err}`));
  }
  
  return { html, faviconUrl, faviconBuffer };
}
