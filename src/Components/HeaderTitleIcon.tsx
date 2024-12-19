import * as React from "react";
import { Image, Platform } from "react-native";

export default class HeaderTitleIcon extends React.Component {
  public render() {
    return (
      <Image
        style={{
          height: 20,
          width: 150,
          resizeMode: "contain",
        }}
        source={require("../../img/sda_title.png")}
      />
    );
  }
}
