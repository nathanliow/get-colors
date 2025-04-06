import axios from 'axios';
import { NextApiResponse } from 'next';

/**
 * Handle API errors
 */
export function handleApiError(err: unknown, url: string, res: NextApiResponse): void {
  if (axios.isAxiosError(err)) {
    const statusCode = err.response?.status;
    
    if (statusCode === 403) {
      return res.status(403).json({ 
        error: 'Website access forbidden. The site may be blocking automated requests.',
        url
      });
    } else if (statusCode === 404) {
      return res.status(404).json({ 
        error: 'Website not found. Please check the URL and try again.',
        url
      });
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(400).json({ 
        error: 'Could not connect to the website. Please check the URL and try again.',
        url
      });
    }
  }
  
  res.status(500).json({ error: 'Failed to extract colors', url });
}