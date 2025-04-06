import os from 'os';
import chromium from 'chrome-aws-lambda';
import puppeteerCore from 'puppeteer-core';

// Helper function to launch Puppeteer
export async function launchPuppeteer() {
  // Check if we're running locally or in a serverless environment
  const isDev = process.env.NODE_ENV === 'development';
  
  let options;
  
  if (isDev) {
    // For local development, use local Chrome
    const localChromePaths = {
      win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      linux: '/usr/bin/google-chrome',
      darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    };
    
    const platform = os.platform() as 'win32' | 'linux' | 'darwin';
    const executablePath = localChromePaths[platform];
    
    options = {
      args: [],
      executablePath,
      headless: true
    };
  } else {
    // For serverless environments, use chrome-aws-lambda
    const executablePath = await chromium.executablePath;
    
    if (!executablePath) {
      throw new Error('Chrome executable not found');
    }
    
    options = {
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    };
  }
  
  return puppeteerCore.launch(options);
}
