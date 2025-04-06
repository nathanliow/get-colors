import { fetchWithAxios } from "./fetchWithAxios";
import { fetchWithPuppeteer } from "./fetchWithPuppeteer";

/**
 * Fetch website content using Axios with Puppeteer fallback
 */
export async function fetchWebsiteContent(url: string): Promise<{ 
  html: string; 
  faviconUrl: string; 
  faviconBuffer: Buffer | null;
}> {
  try {
    // Try with Axios first (faster)
    return await fetchWithAxios(url);
  } catch (axiosErr) {
    console.warn(`Axios request failed: ${axiosErr instanceof Error ? axiosErr.message : 'Unknown error'}`);
    console.log('Falling back to Puppeteer for website access');
    
    // Fall back to Puppeteer (more robust)
    return await fetchWithPuppeteer(url);
  }
}