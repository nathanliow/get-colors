import { 
  AbsoluteCenter,
  HStack,
  Progress, 
  ProgressCircle 
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import CustomSpinner from "./Spinner";

interface ProgressComponentProps {
  palette: any;
  websiteData: any;
}

export default function ProgressComponent({ palette, websiteData }: ProgressComponentProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Progress.Root
        width="120px"
        value={progress}
        color={palette.primary}
        variant="outline"
      >
        <Progress.Track style={{
          backgroundColor: palette.primary,
        }}>
          <Progress.Range style={{
            backgroundColor: palette.text,
          }}/>
        </Progress.Track>
      </Progress.Root>
      <Progress.Root
        width="120px"
        value={progress}
        color={palette.secondary}
        variant="subtle"
      >
        <Progress.Track style={{
          backgroundColor: palette.secondary,
        }}>
          <Progress.Range style={{
            backgroundColor: palette.text,
          }}/>
        </Progress.Track>
      </Progress.Root>

      <HStack>
        <ProgressCircle.Root
          width="120px"
          value={progress}
        >
          <ProgressCircle.Circle>
            <ProgressCircle.Track stroke={palette.primary}/>
            <ProgressCircle.Range stroke={palette.text}/>
          </ProgressCircle.Circle>
          <AbsoluteCenter>
            <ProgressCircle.ValueText />
          </AbsoluteCenter>
        </ProgressCircle.Root>

        <ProgressCircle.Root
          width="120px"
          value={progress}
        >
          <ProgressCircle.Circle>
            <ProgressCircle.Track stroke={palette.secondary}/>
            <ProgressCircle.Range stroke={palette.text}/>
          </ProgressCircle.Circle>
          <AbsoluteCenter>
            <ProgressCircle.ValueText />
          </AbsoluteCenter>
        </ProgressCircle.Root>

        <CustomSpinner 
          palette={palette} 
          websiteData={websiteData}
        />
      </HStack>
    </>
  )
}