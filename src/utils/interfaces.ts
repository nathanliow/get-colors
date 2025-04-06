export interface WebsiteData {
  title: string;
  description: string;
  url: string;
  favicon: string;
  faviconBase64?: string;
  colors: {
    css: string[];
    favicon: string[];
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    }
  }
}