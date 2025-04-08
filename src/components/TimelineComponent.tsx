import { 
  Text, 
  Timeline
} from "@chakra-ui/react";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu"

interface TimelineProps {
  palette: any;
  websiteData: any;
}

export default function TimelineComponent({ palette, websiteData }: TimelineProps) {
  return (
    <Timeline.Root maxW="400px">
      <Timeline.Item 
        style={{ 
          backgroundColor: palette.primary || websiteData.colors.palette.primary, 
          color: palette.text || websiteData.colors.palette.text,
          padding: "10px",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          }}>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <LuShip />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>Product Shipped</Timeline.Title>
          <Timeline.Description>13th May 2021</Timeline.Description>
          <Text textStyle="sm">
            We shipped your product via <strong>FedEx</strong> and it should
            arrive within 3-5 business days.
          </Text>
        </Timeline.Content>
      </Timeline.Item>

      <Timeline.Item 
        style={{ 
        backgroundColor: palette.primary || websiteData.colors.palette.primary, 
        color: palette.text || websiteData.colors.palette.text,
        padding: "10px",
        }}>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <LuCheck />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title textStyle="sm">Order Confirmed</Timeline.Title>
          <Timeline.Description>18th May 2021</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>

      <Timeline.Item style={{ 
        backgroundColor: palette.primary || websiteData.colors.palette.primary, 
        color: palette.text || websiteData.colors.palette.text,
        padding: "10px",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        }}>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <LuPackage />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title textStyle="sm">Order Delivered</Timeline.Title>
          <Timeline.Description>20th May 2021, 10:30am</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  )
}