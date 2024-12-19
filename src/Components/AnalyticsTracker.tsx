import * as React from "react";
import { NavigationEvents } from "react-navigation";
import { analytics } from "../Utils/analytics";

interface OwnProps {
  eventType: string;
  eventData: string;
}
export default class AnalyticsTracker extends React.Component<OwnProps> {
  render() {
    return (
      <NavigationEvents
        onWillFocus={() => {
          analytics.event(this.props.eventType, this.props.eventData);
        }}
      />
    );
  }
}
