import axios from "axios";
import { launchPuppeteer } from "./launchPuppeteer";

// Helper function to get favicon buffer
export async function getFaviconBuffer(faviconUrl: string, headers: Record<string, string>): Promise<Buffer | null> {
  if (!faviconUrl) return null;
  
  console.log(`Attempting to fetch favicon from: ${faviconUrl}`);
  
  // Try with Axios first
  try {
    const faviconRes = await axios.get(faviconUrl, { 
      responseType: 'arraybuffer',
      headers,
      timeout: 5000 // 5 second timeout
    });
    
    console.log(`Successfully fetched favicon with Axios: ${faviconUrl}`);
    return Buffer.from(faviconRes.data);
  } catch (axiosErr) {
    console.warn(`Axios failed to fetch favicon: ${axiosErr instanceof Error ? axiosErr.message : 'Unknown error'}`);
    
    // If Axios fails, try with Puppeteer as it can bypass CORS and other restrictions
    try {
      console.log(`Falling back to Puppeteer for favicon: ${faviconUrl}`);
      const browser = await launchPuppeteer();
      
      try {
        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 100, height: 100 });
        await page.setUserAgent(headers['User-Agent']);
        
        // Add referrer that matches the favicon domain to bypass referrer policies
        const faviconUrlObj = new URL(faviconUrl);
        const referrer = `${faviconUrlObj.protocol}//${faviconUrlObj.hostname}`;
        
        // Navigate directly to the favicon
        const response = await page.goto(faviconUrl, {
          waitUntil: 'networkidle0',
          timeout: 5000,
          referer: referrer
        });
        
        if (response && response.ok()) {
          const buffer = await response.buffer();
          console.log(`Successfully fetched favicon with Puppeteer: ${faviconUrl}`);
          return buffer;
        } else {
          console.warn(`Puppeteer received non-OK response: ${response?.status()}`);
        }
      } finally {
        await browser.close();
      }
    } catch (puppeteerErr) {
      console.warn(`Puppeteer failed to fetch favicon: ${puppeteerErr instanceof Error ? puppeteerErr.message : 'Unknown error'}`);
    }
    
    // Final attempt: try a fetch using Node.js internals to bypass more restrictions
    try {
      console.log(`Making final attempt to fetch favicon with Node.js http: ${faviconUrl}`);
      
      // Use the Node.js http/https module directly
      const fetchWithNode = async (url: string): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const urlObj = new URL(url);
          const httpModule = urlObj.protocol === 'https:' ? require('https') : require('http');
          
          const options = {
            method: 'GET',
            headers: {
              ...headers,
              'Referer': urlObj.origin,
              'Origin': urlObj.origin
            }
          };
          
          const req = httpModule.request(url, options, (res: any) => {
            if (res.statusCode !== 200) {
              return reject(new Error(`HTTP status code ${res.statusCode}`));
            }
            
            const chunks: Buffer[] = [];
            res.on('data', (chunk: Buffer) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
          });
          
          req.on('error', reject);
          req.end();
        });
      };
      
      const buffer = await fetchWithNode(faviconUrl);
      console.log(`Successfully fetched favicon with Node.js: ${faviconUrl}`);
      return buffer;
    } catch (nodeErr) {
      console.warn(`Node.js failed to fetch favicon: ${nodeErr instanceof Error ? nodeErr.message : 'Unknown error'}`);
    }
  }
  
  console.error(`All methods failed to fetch favicon: ${faviconUrl}`);
  return null;
}