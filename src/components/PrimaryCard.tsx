import { 
  Heading, 
  Text 
} from "@chakra-ui/react";

interface PrimaryCardProps {
  palette: any;
  websiteData: any;
}

export default function PrimaryCard({ palette, websiteData }: PrimaryCardProps) {
  return (
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
  )
}