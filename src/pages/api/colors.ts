import type { NextApiRequest, NextApiResponse } from 'next';
import { handleApiError } from '@/utils/handle/handleApiError';
import { extractWebsiteData } from '@/utils/extract/extractWebsiteData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Fetch website content and extract data
    const websiteData = await extractWebsiteData(url);
    res.status(200).json(websiteData);
  } catch (err) {
    console.error(err);
    handleApiError(err, url, res);
  }
}