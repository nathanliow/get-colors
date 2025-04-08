import { Button as ChakraButton, Stack } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"

interface ButtonsProps {
  palette: any;
  websiteData: any;
}

export default function Buttons({ palette, websiteData }: ButtonsProps) {
  return (
    <div className="flex gap-4 mb-4 h-full w-full">
      <Stack direction="column">
        <ChakraButton 
          style={{
            backgroundColor: palette.primary || websiteData.colors.palette.primary,
            color: palette.text || websiteData.colors.palette.text,
          }}
          variant="solid"
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
      </Stack>
    </div>
  )
}