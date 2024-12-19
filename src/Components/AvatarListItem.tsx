import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import AppText from "../Components/AppText";
import ColorTheme from "../Constants/ColorTheme";

interface OwnProps {
  icon: string;
  onPress(): void;
  tintColor?: string;
}

export default class AvatarListItem extends React.Component<OwnProps> {
  render() {
    let { icon, onPress, tintColor } = this.props;

    if (typeof icon === "undefined") icon = "placeholder_icon";

    return (
      <TouchableOpacity style={{ justifyContent: "center" }} onPress={onPress}>
        <View style={styles.textContainer}>
          <Image
            source={{ uri: icon }}
            style={{
              tintColor: tintColor,
              height: 54,
              width: 54,
              opacity: 1,
              margin: 12,
              marginLeft: 16,
              borderRadius: 27,
              borderWidth: 2,
              borderColor: ColorTheme.SECONDARY,
              resizeMode: "cover",
            }}
          />
          <AppText style={styles.textStyle}>{this.props.children}</AppText>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    flexWrap: "wrap",
    marginRight: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 1,
    borderColor: ColorTheme.SEPARATOR,
    backgroundColor: ColorTheme.SECONDARY,
    minHeight: 76,
  },
});
