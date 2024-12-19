import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import { getFont } from "../Utils/helpers";
import ColorTheme from "../Constants/ColorTheme";

class AppText extends Component {
  getStyle() {
    return StyleSheet.create({
      text: {
        fontFamily: getFont(),
        fontSize: ColorTheme.FONT_SIZE,
        color: "#333333",
        letterSpacing: 1,
        textAlign: "left",
        // lineHeight: getLineHeight(),
      },
    });
  }

  render() {
    const styles = this.getStyle();
    return (
      <Text
        textBreakStrategy="simple"
        onPress={this.props.onPress}
        style={[styles.text, this.props.style]}
      >
        {this.props.children}
      </Text>
    );
  }
}

export default AppText;
