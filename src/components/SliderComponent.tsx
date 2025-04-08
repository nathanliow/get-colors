import { 
  Slider
} from "@chakra-ui/react";

interface SliderProps {
  palette: any;
  websiteData: any;
}

export default function SliderComponent({ palette, websiteData }: SliderProps) {
  return (
    <Slider.Root 
      width="200px" 
      defaultValue={[40]}
      >
      <Slider.Control>
        <Slider.Track bg={palette.primary}>
          <Slider.Range bg={palette.accent}/>
        </Slider.Track>
        <Slider.Thumbs bg={palette.text}/>
      </Slider.Control>
    </Slider.Root>
  )
}