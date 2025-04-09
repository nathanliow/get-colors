import { WebsiteData } from "../interfaces";
import * as cheerio from "cheerio";
import { processCssColors } from "../process/processCSSColors";
import { extractStylesFromHtml } from "./extractStylesFromHtml";
import { fetchWebsiteContent } from "../fetch/fetchWebsiteContent";
import { processFavicon } from "../process/processFavicon";

/**
 * Extract all website data including colors, favicon, and metadata
 */
export async function extractWebsiteData(url: string, browser: any): Promise<WebsiteData> {
  try {
    const page = await browser.newPage();
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Get website HTML and favicon
    const { html, faviconUrl, faviconBuffer } = await fetchWebsiteContent(url);
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);
    
    // Extract basic metadata
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content') || '';
    
    // Extract style information
    const styles = extractStylesFromHtml($);
    
    // Process the favicon
    const { faviconColors, faviconBase64 } = await processFavicon(faviconUrl, faviconBuffer);
    
    // Process CSS colors
    const { palette, cssColors } = processCssColors(styles);

    await page.close();
    
    return {
      title,
      description,
      url,
      favicon: faviconUrl,
      faviconBase64,
      colors: {
        palette,
        css: cssColors,
        favicon: faviconColors,
      }
    };
  } catch (error) {
    console.error('Error in extractWebsiteData:', error);
    throw error;
  }
}