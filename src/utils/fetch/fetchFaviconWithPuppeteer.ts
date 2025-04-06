/**
 * Fetch favicon using Puppeteer
 */
export async function fetchFaviconWithPuppeteer(browser: any, faviconUrl: string): Promise<Buffer | null> {
  const faviconPage = await browser.newPage();
  
  try {
    // Set a short timeout for favicon
    const faviconResponse = await faviconPage.goto(faviconUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 5000 
    });
    
    if (faviconResponse && faviconResponse.ok()) {
      return await faviconResponse.buffer();
    }
  } catch (faviconErr) {
    console.warn(`Failed to fetch favicon with Puppeteer: ${faviconErr instanceof Error ? faviconErr.message : 'Unknown error'}`);
  } finally {
    await faviconPage.close().catch((err: any) => console.warn(`Error closing favicon page: ${err}`));
  }
  
  return null;
}