import React, { Component } from "react";
import { View, ViewStyle } from "react-native";

interface OwnProps {
  selected: boolean;
  style?: ViewStyle;
}

class RadioButton extends Component<OwnProps, {}> {
  render() {
    const { selected, style } = this.props;
    return (
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#000",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        {selected && (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: "#000",
            }}
          />
        )}
      </View>
    );
  }
}

export default RadioButton;
