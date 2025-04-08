import { HStack, RadioCard } from "@chakra-ui/react"

interface RadioCardProps {
  palette: any;
  websiteData: any;
}

export default function RadioCardComponents({ palette, websiteData }: RadioCardProps) {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Radio Card Label</RadioCard.Label>
      <HStack align="stretch">
        <RadioCard.Item value="next">
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl 
            style={{ 
              backgroundColor: palette.primary,
              color: palette.text
            }}>
            <RadioCard.ItemContent>
              <RadioCard.ItemText 
                style={{ 
                  color: palette.text 
              }}> 
                next
              </RadioCard.ItemText>
              <RadioCard.ItemDescription 
                style={{ 
                  color: palette.text 
                }}>
                Best for apps
              </RadioCard.ItemDescription>
            </RadioCard.ItemContent>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
          <RadioCard.ItemAddon 
            style={{ 
              backgroundColor: palette.primary,
              color: palette.text
            }}>
            Some addon text
          </RadioCard.ItemAddon>
        </RadioCard.Item>
        <RadioCard.Item value="astro">
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl style={{ backgroundColor: palette.secondary }}>
            <RadioCard.ItemContent>
              <RadioCard.ItemText style={{ color: palette.text }}>astro</RadioCard.ItemText>
              <RadioCard.ItemDescription style={{ color: palette.text }}>
                Best for static sites
              </RadioCard.ItemDescription>
            </RadioCard.ItemContent>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
          <RadioCard.ItemAddon style={{ 
            backgroundColor: palette.secondary, 
            color: palette.text 
            }}>
              Some addon text
              </RadioCard.ItemAddon>
        </RadioCard.Item>
      </HStack>
    </RadioCard.Root>
  )
}