'use client'

import React, { useState, useEffect, useRef } from "react";
import { 
  Input, 
  Button as ChakraButton, 
  Heading,
  Text, 
  Badge,
  Stack,
  Box
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ColorSwatch } from "@/components/ColorSwatch";
import { updateWebsiteTheme, useWebsitePalette } from "@/lib/websiteTheme";
import { WebsiteData } from "@/utils/interfaces";

export default function Home() {
  const [url, setUrl] = useState("");
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaletteKey, setSelectedPaletteKey] = useState<string | null>(null);
  const { palette, updateColor, shuffleColors } = useWebsitePalette();
  const [isThemePaletteVisible, setIsThemePaletteVisible] = useState(false);
  const themePaletteRef = useRef<HTMLDivElement>(null);

  // Update the theme when websiteData changes
  useEffect(() => {
    if (websiteData?.colors) {
      // Pass both palette and favicon colors to let the utility handle fallback
      updateWebsiteTheme(
        websiteData.colors.palette, 
        websiteData.colors.favicon
      );
    }
  }, [websiteData]);

  // Handle mouse movement for theme palette visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bottomThreshold = window.innerHeight - 100;
      if (e.clientY > bottomThreshold) {
        setIsThemePaletteVisible(true);
      } else if (e.clientY < bottomThreshold - 250) {
        setIsThemePaletteVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch colors");
      }
      
      if (!data.colors || !data.colors.palette) {
        throw new Error("Could not extract color palette from this website");
      }
      
      setWebsiteData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setWebsiteData(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle color refresh
  const handleRefreshColors = () => {
    if (websiteData?.colors?.palette) {
      const shuffled = shuffleColors();
      console.log("Shuffled palette:", shuffled);
    }
  };

  // Handle color selection from any swatch
  const handleColorSelect = (color: string) => {
    if (selectedPaletteKey) {
      updateColor(selectedPaletteKey as any, color);
      setSelectedPaletteKey(null);
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      {websiteData && (
        <Box 
          as="nav" 
          position="fixed" 
          top="0" 
          left="0" 
          right="0" 
          zIndex="999" 
          bg="black" 
          py="3" 
          px="6" 
          boxShadow="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading 
            as="h1" 
            size="lg" 
            onClick={() => setWebsiteData(null)}
            className="cursor-pointer"
          >
            Get Colors
          </Heading>
          <div className="flex gap-2 w-full max-w-md ml-auto">
            <Input
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  fetchColors();
                }
              }}
            />
            <div className="flex hover:bg-gray-800 w-10 h-10 transition-colors justify-center items-center rounded-lg">
              <Button 
                onClick={fetchColors} 
                disabled={loading}
                className="cursor-pointer"
              >
                →
              </Button>
            </div>
          </div>
        </Box>
      )}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 pt-24">
        <div className="h-16 w-full"/>

        {!websiteData && (
          <div className="flex flex-col gap-4 items-center">
            <Heading as="h1" size="lg">Get Colors</Heading>
            <div className="flex flex-row gap-4">
              <Input
                placeholder="Enter website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    fetchColors();
                  }
                }}
              />
              <div className="flex hover:bg-gray-800 w-10 h-10 transition-colors justify-center items-center rounded-lg">
                <Button 
                  onClick={fetchColors} 
                  disabled={loading}
                  className="cursor-pointer"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {websiteData && websiteData.colors && websiteData.colors.palette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">{websiteData.title}</h2>
              <div className="h-4 w-full"></div>
              {(websiteData.faviconBase64 || websiteData.favicon) && (
                <div className="flex justify-center my-4">
                  <img 
                    src={websiteData.faviconBase64 || websiteData.favicon} 
                    alt="Website Favicon" 
                    className="w-12 h-12 object-contain border rounded-md"
                    onError={(e) => {
                      // If base64 doesn't work, try URL directly as fallback
                      if (
                        websiteData.faviconBase64 && 
                        websiteData.favicon && 
                        websiteData.faviconBase64 !== websiteData.favicon
                      ) {
                        console.log('Base64 favicon failed, trying URL');
                        (e.target as HTMLImageElement).src = websiteData.favicon;
                      } else {
                        // Hide image on error
                        (e.target as HTMLImageElement).style.display = 'none';
                      }
                    }}
                  />
                </div>
              )}
              <div className="h-4 w-full"></div>
              <p className="text-gray-600">{websiteData.description}</p>
            </div>

            {/* Current Theme Palette - Bottom Slide-up */}
            <motion.div 
              ref={themePaletteRef}
              className="fixed left-0 right-0 bottom-0 p-4 rounded-t-lg shadow-lg border z-20 bg-black"
              initial={{ y: "100%" }}
              animate={{ y: isThemePaletteVisible ? "0%" : "85%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full"/>
              </div>
              <div className="w-20 h-6 bg-black"/>
              <div className="flex flex-row gap-4 justify-center overflow-x-auto pb-2">
                {Object.entries(palette).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div
                      className={`w-10 h-10 rounded-lg border cursor-pointer hover:opacity-80 relative group ${selectedPaletteKey === key ? 'ring-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: value }}
                      onClick={() => selectedPaletteKey === key ? setSelectedPaletteKey(null) : setSelectedPaletteKey(key)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={value === '#fff' || (value.startsWith('#') && parseInt(value.slice(1), 16) > 0xcccccc) ? 'black' : 'white'} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="drop-shadow-md"
                        >
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={value === '#fff' || (value.startsWith('#') && parseInt(value.slice(1), 16) > 0xcccccc) ? 'black' : 'white'} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="drop-shadow-md"
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium">{key}</span>
                      <span className="text-xs text-gray-500">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-3">
                <div className="flex hover:bg-gray-800 w-32 transition-colors justify-center items-center rounded-lg">
                  <Button 
                    onClick={handleRefreshColors}
                    className="cursor-pointer"
                  >
                    Shuffle Colors
                  </Button>
                </div>
              </div>
              <div className="h-2 w-full"></div>
            </motion.div>

            {/* Palette Colors */}
            <div className="h-10 w-full"></div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h3 className="flex text-xl justify-center font-semibold">Primary Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {Object.values(websiteData.colors.palette).every(value => value === "") ? (
                    <p className="text-gray-500 col-span-full">No primary colors extracted</p>
                  ) : (
                    Object.entries(websiteData.colors.palette).map(([key, value]) => (
                      value !== "" && (
                        <ColorSwatch 
                          key={key} 
                          color={value} 
                          label={key} 
                          onSelect={selectedPaletteKey ? handleColorSelect : undefined}
                        />
                      )
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="flex text-xl justify-center font-semibold mb-4">Favicon Colors</h3>
                {websiteData.colors.favicon.length > 0 ? (
                  <div className="p-4 rounded-md">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {websiteData.colors.favicon.map((color, index) => (
                        color !== "" && (
                          <ColorSwatch 
                            key={`favicon-${index}`} 
                            color={color} 
                            onSelect={selectedPaletteKey ? handleColorSelect : undefined}
                          />
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No favicon colors extracted</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="flex text-xl justify-center font-semibold mb-4">Website Colors</h3>
                {websiteData.colors.css && websiteData.colors.css.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {websiteData.colors.css.map((color, index) => (
                      <ColorSwatch 
                        key={`css-${index}`} 
                        color={color} 
                        onSelect={selectedPaletteKey ? handleColorSelect : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No CSS colors extracted</p>
                )}
              </div>

              <div className="flex flex-col gap-4 w-full p-8">                
                {/* Chakra UI Components */}
                <div>
                  <h3 className="flex text-lg justify-center font-semibold mb-4">Chakra UI Components</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cards */}
                    <div className="border rounded-md overflow-hidden">
                      <div 
                        style={{
                          backgroundColor: palette.primary || websiteData.colors.palette.primary,
                          color: palette.text || websiteData.colors.palette.text,
                          padding: "1rem"
                        }}
                      >
                        <Heading size="md">Primary Card</Heading>
                        <Text mt={2}>This is a card using the primary color.</Text>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div 
                        style={{
                          backgroundColor: palette.secondary || websiteData.colors.palette.secondary,
                          color: palette.text || websiteData.colors.palette.text,
                          padding: "1rem"
                        }}
                      >
                        <Heading size="md">Secondary Card</Heading>
                        <Text mt={2}>This is a card using the secondary color.</Text>
                      </div>
                    </div>
                    
                    {/* Buttons */}
                    <div>
                      <div className="flex gap-4 mb-4">
                        <ChakraButton 
                          style={{
                            backgroundColor: palette.primary || websiteData.colors.palette.primary,
                            color: palette.text || websiteData.colors.palette.text
                          }}
                        >
                          Primary
                        </ChakraButton>
                        <ChakraButton 
                          style={{
                            backgroundColor: palette.secondary || websiteData.colors.palette.secondary,
                            color: palette.text || websiteData.colors.palette.text
                          }}
                        >
                          Secondary
                        </ChakraButton>
                        <ChakraButton 
                          style={{
                            backgroundColor: palette.accent || websiteData.colors.palette.accent,
                            color: palette.text || websiteData.colors.palette.text
                          }}
                        >
                          Accent
                        </ChakraButton>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-4 mb-4">
                        <Stack direction="column">
                          <Badge 
                            variant="outline"
                            style={{
                              backgroundColor: palette.primary || websiteData.colors.palette.primary,
                              color: palette.text || websiteData.colors.palette.text,
                              padding: "0.25rem 0.75rem",
                              borderRadius: "0.375rem"
                            }}
                          >
                            Primary Badge
                          </Badge>
                          <Badge 
                            variant="outline"
                            style={{
                              backgroundColor: palette.secondary || websiteData.colors.palette.secondary,
                              color: palette.text || websiteData.colors.palette.text,
                              padding: "0.25rem 0.75rem",
                              borderRadius: "0.375rem"
                            }}
                          >
                            Secondary Badge
                          </Badge>
                          <Badge 
                            variant="outline"
                            style={{
                              backgroundColor: palette.accent || websiteData.colors.palette.accent,
                              color: palette.text || websiteData.colors.palette.text,
                              padding: "0.25rem 0.75rem",
                              borderRadius: "0.375rem"
                            }}
                          >
                            Accent Badge
                          </Badge>
                        </Stack>
                      </div>
                    </div>
                    
                    {/* Combined component */}
                    <div 
                      className="border rounded-md p-5"
                      style={{
                        backgroundColor: palette.primary || websiteData.colors.palette.primary,
                        color: palette.text || websiteData.colors.palette.text
                      }}
                    >
                      <Heading size="sm" mb={2}>Component Card</Heading>
                      <Text mb={4}>Combined components using palette colors</Text>
                      <hr className="my-4" />
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{
                            backgroundColor: palette.accent || websiteData.colors.palette.accent,
                            color: palette.text || websiteData.colors.palette.text
                          }}
                        >
                          JD
                        </div>
                        <div>
                          <Text fontWeight="bold">John Doe</Text>
                          <Text fontSize="sm">Team Member</Text>
                        </div>
                        <ChakraButton 
                          size="sm"
                          style={{
                            backgroundColor: palette.secondary || websiteData.colors.palette.secondary,
                            color: palette.text || websiteData.colors.palette.text
                          }}
                        >
                          View
                        </ChakraButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Bottom spacer, for some reason padding not working */}
        <div className="h-48 w-full"></div>
      </main>
    </>
  );
}
