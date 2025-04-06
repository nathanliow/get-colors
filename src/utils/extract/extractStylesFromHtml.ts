import * as cheerio from "cheerio";

/**
 * Extract all style elements and linked stylesheets from HTML
 */
export function extractStylesFromHtml($: cheerio.CheerioAPI): string[] {
  const styles: string[] = [];
  
  // Get inline styles
  $('style').each((_, el) => {
    styles.push($(el).html() || '');
  });

  // Get linked stylesheets
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) styles.push(href);
  });
  
  return styles;
}