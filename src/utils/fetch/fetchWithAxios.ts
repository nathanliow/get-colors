import axios from "axios";
import { findFavicon } from "../findFavicon";
import { getFaviconBuffer } from "../getFaviconBuffer";
import { DEFAULT_HEADERS } from "../constants";
import * as cheerio from "cheerio";

/** 
 * Fetch website content using Axios
 */
export async function fetchWithAxios(url: string): Promise<{
  html: string;
  faviconUrl: string;
  faviconBuffer: Buffer | null;
}> {
  const response = await axios.get(url, { headers: DEFAULT_HEADERS });
  const html = response.data;
  
  // Parse with cheerio
  const $ = cheerio.load(html);
  
  // Try to find favicon
  const faviconUrl = await findFavicon($, url, DEFAULT_HEADERS);
  const faviconBuffer = await getFaviconBuffer(faviconUrl, DEFAULT_HEADERS);
  
  return { html, faviconUrl, faviconBuffer };
}
