import { Spinner } from "@chakra-ui/react"

interface SpinnerProps {
  palette: any;
  websiteData: any;
}

export default function CustomSpinner({ palette, websiteData }: SpinnerProps) {
  return (
    <Spinner 
      color={palette.primary || websiteData.colors.palette.primary}
      size="lg"
    />
  )
}