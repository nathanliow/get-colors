import { Badge } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";

interface BadgesProps {
  palette: any;
  websiteData: any;
}

export default function Badges({ palette, websiteData }: BadgesProps) {

  return (
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
  )
}