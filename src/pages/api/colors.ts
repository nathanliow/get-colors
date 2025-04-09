import type { NextApiRequest, NextApiResponse } from 'next';
import { handleApiError } from '@/utils/handle/handleApiError';
import { extractWebsiteData } from '@/utils/extract/extractWebsiteData';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Configure chromium
    await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
    
    // Launch browser with @sparticuz/chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });

    // Fetch website content and extract data
    const websiteData = await extractWebsiteData(url, browser);
    await browser.close();
    
    res.status(200).json(websiteData);
  } catch (err) {
    console.error(err);
    handleApiError(err, url, res);
  }
}