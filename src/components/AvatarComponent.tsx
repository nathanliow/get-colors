import { Avatar } from "@chakra-ui/react";

interface AvatarComponentProps {
  palette: any;
  websiteData: any;
}

export default function AvatarComponent({ palette, websiteData }: AvatarComponentProps) {
  return (
    <div className="flex flex-row gap-4">
      <Avatar.Root style={{ backgroundColor: palette.primary }}>
        <Avatar.Fallback name="John Doe" />
      </Avatar.Root>
      <Avatar.Root style={{ backgroundColor: palette.secondary }}>
        <Avatar.Fallback />
      </Avatar.Root>
    </div>
  )
}
