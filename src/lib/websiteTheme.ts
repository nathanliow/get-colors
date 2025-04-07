/**
 * Website theme utilities for dynamic color management
 */

import { useState, useCallback, useEffect } from "react";

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

// Event system to notify subscribers when palette changes
type PaletteListener = (palette: WebsitePalette) => void;
const listeners: PaletteListener[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener({...currentPalette}));
};

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
      notifyListeners();
      return faviconPalette;
    }
  }
  
  // Use the regular palette
  currentPalette = { ...palette };
  notifyListeners();
  return palette;
}

// Function to update a specific color in the palette
export function updatePaletteColor(key: keyof WebsitePalette, color: string): WebsitePalette {
  currentPalette[key] = color;
  
  // If updating primary color and it's dark, adjust text color automatically
  if (key === 'primary' && isColorDark(color)) {
    currentPalette.text = "#ffffff";
  } else if (key === 'primary' && !isColorDark(color)) {
    currentPalette.text = "#000000";
  }
  
  notifyListeners();
  return { ...currentPalette };
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
  notifyListeners();
  return { ...currentPalette };
}

// React hook for using website palette
export function useWebsitePalette() {
  const [palette, setPalette] = useState<WebsitePalette>(currentPalette);
  
  // Listen for global palette changes
  useEffect(() => {
    const handlePaletteChange = (newPalette: WebsitePalette) => {
      setPalette({...newPalette});
    };
    
    // Add listener
    listeners.push(handlePaletteChange);
    
    // Initial sync
    setPalette({...currentPalette});
    
    // Cleanup listener on unmount
    return () => {
      const index = listeners.indexOf(handlePaletteChange);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  const updatePalette = useCallback((newPalette: WebsitePalette, faviconColors?: string[]) => {
    const updatedPalette = updateWebsiteTheme(newPalette, faviconColors);
    setPalette({ ...updatedPalette });
  }, []);
  
  const updateColor = useCallback((key: keyof WebsitePalette, color: string) => {
    const updatedPalette = updatePaletteColor(key, color);
    setPalette({ ...updatedPalette });
    return updatedPalette;
  }, []);
  
  const shuffleColors = useCallback(() => {
    const shuffled = shufflePalette();
    setPalette({ ...shuffled });
    return shuffled;
  }, []);
  
  return { 
    palette, 
    updatePalette, 
    updateColor,
    shuffleColors
  };
} 