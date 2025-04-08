import { 
  Heading, 
  Text 
} from "@chakra-ui/react";

interface SecondaryCardProps {
  palette: any;
  websiteData: any;
}

export default function SecondaryCard({ palette, websiteData }: SecondaryCardProps) {
  return (
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
  )
}