'use client'

import React, { useState, useEffect } from "react";
import { 
  Input, 
  Button as ChakraButton, 
  Heading,
  Text, 
  Badge,
  Stack
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
  const { palette, shuffleColors } = useWebsitePalette();

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      {/* Top spacer, for some reason padding not working */}
      <div className="h-20 w-full"></div>
      <h1 className="text-3xl font-bold">Website Color Extractor</h1>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={fetchColors} disabled={loading}>
          {loading ? "Loading..." : "Get Colors"}
        </Button>
      </div>

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
            <p className="text-gray-600">{websiteData.description}</p>
          </div>


          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Primary Palette</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {Object.values(websiteData.colors.palette).every(value => value === "") ? (
                  <p className="text-gray-500 col-span-full">No primary colors extracted</p>
                ) : (
                  Object.entries(websiteData.colors.palette).map(([key, value]) => (
                    value !== "" && (
                      <ColorSwatch key={key} color={value} label={key} />
                    )
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold mb-4">Favicon Colors</h3>
              {websiteData.colors.favicon.length > 0 ? (
                <div className="p-4 rounded-md">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {websiteData.colors.favicon.map((color, index) => (
                      color !== "" && (
                        <ColorSwatch key={`favicon-${index}`} color={color} />
                      )
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No favicon colors extracted</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold mb-4">CSS Colors</h3>
              {websiteData.colors.css && websiteData.colors.css.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {websiteData.colors.css.map((color, index) => (
                    <ColorSwatch key={`css-${index}`} color={color} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No CSS colors extracted</p>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full p-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Color Usage Examples</h3>
                <Button onClick={handleRefreshColors}>Shuffle Colors</Button>
              </div>
              
              {/* Chakra UI Components */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Chakra UI Components</h4>
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
      <div className="h-20 w-full"></div>
    </main>
  );
}
