import type { NextApiRequest, NextApiResponse } from 'next';
import { handleApiError } from '@/utils/handle/handleApiError';
import { extractWebsiteData } from '@/utils/extract/extractWebsiteData';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;
  try {
    // Configure chromium
    await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
    
    // Launch browser with @sparticuz/chromium
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });

    // Add connection error handling
    browser.on('disconnected', () => {
      throw new Error('Browser was disconnected');
    });

    // Fetch website content and extract data
    const websiteData = await extractWebsiteData(url, browser);
    
    res.status(200).json(websiteData);
  } catch (err) {
    console.error('Error in handler:', err);
    handleApiError(err, url, res);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
    }
  }
}