/**
 * Website theme utilities for dynamic color management
 */

import { useState, useCallback } from "react";

export type WebsitePalette = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
};

// Initialize with empty values
const initialPalette: WebsitePalette = {
  primary: "",
  secondary: "",
  accent: "",
  text: "",
};

// Global palette store
let currentPalette = { ...initialPalette };

// Helper to check if a color is dark
export function isColorDark(color: string): boolean {
  // Simple check for darkness - could be improved
  return !!color.match(/#[0-9a-f]{6}/i) && 
    parseInt(color.substring(1, 3), 16) +
    parseInt(color.substring(3, 5), 16) +
    parseInt(color.substring(5, 7), 16) < 382;
}

// Function to update the theme with website colors
export function updateWebsiteTheme(
  palette: WebsitePalette, 
  faviconColors?: string[]
) {
  // Check if palette has values
  const isPrimaryEmpty = Object.values(palette).every(value => value === "" || !value);
  
  if (isPrimaryEmpty && faviconColors && faviconColors.length > 0) {
    // Filter out empty colors
    const validFaviconColors = faviconColors.filter(color => color !== "");
    
    if (validFaviconColors.length > 0) {
      // Create a palette from favicon colors
      const faviconPalette: WebsitePalette = {
        primary: validFaviconColors[0] || "",
        secondary: validFaviconColors[1] || validFaviconColors[0] || "",
        accent: validFaviconColors[2] || validFaviconColors[0] || "",
        text: "#000000" // Default to black text
      };
      
      // If the background is dark, use white text
      if (isColorDark(faviconPalette.primary)) {
        faviconPalette.text = "#ffffff";
      }
      
      console.log("Using favicon colors for palette:", faviconPalette);
      currentPalette = { ...faviconPalette };
      return faviconPalette;
    }
  }
  
  // Use the regular palette
  currentPalette = { ...palette };
  return palette;
}

// Function to get the current palette
export function getWebsitePalette(): WebsitePalette {
  return { ...currentPalette };
}

// Function to shuffle the palette colors
export function shufflePalette(): WebsitePalette {
  const keys = Object.keys(currentPalette) as (keyof WebsitePalette)[];
  
  // Create a shuffled array of keys
  const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
  
  // Create a new palette with shuffled colors
  const shuffled = keys.reduce((acc, key, index) => {
    acc[key] = currentPalette[shuffledKeys[index]];
    return acc;
  }, {} as WebsitePalette);
  
  // Update the current palette
  currentPalette = shuffled;
  return { ...currentPalette };
}

// React hook for using website palette
export function useWebsitePalette() {
  const [palette, setPalette] = useState<WebsitePalette>(currentPalette);
  
  const updatePalette = useCallback((newPalette: WebsitePalette, faviconColors?: string[]) => {
    const updatedPalette = updateWebsiteTheme(newPalette, faviconColors);
    setPalette({ ...updatedPalette });
  }, []);
  
  const shuffleColors = useCallback(() => {
    const shuffled = shufflePalette();
    setPalette({ ...shuffled });
    return shuffled;
  }, []);
  
  return { 
    palette, 
    updatePalette, 
    shuffleColors
  };
} 