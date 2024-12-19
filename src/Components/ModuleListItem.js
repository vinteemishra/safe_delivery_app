import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  I18nManager,
} from "react-native";
import AppText from "../Components/AppText";
import ColorTheme from "../Constants/ColorTheme";

const styles = StyleSheet.create({
  buttonText: {
    flex: 1,
    flexWrap: "wrap",
    alignSelf: "center",
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});
export default class ModuleListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      layoutWidth: 0,
    };
  }
  render() {
    const { icon, assets } = this.props;
    let width = this.state.layoutWidth / 5;
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 1,
            marginBottom: 1,
            borderTopWidth: 1,
            borderColor: ColorTheme.SEPARATOR,
          },
          this.props.style,
        ]}
        onPress={this.props.onPress}
        onLayout={(event) => this.onLayout(event)}
      >
        {/* <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10, borderTopWidth: 1, borderColor: ColorTheme.SEPARATOR }, this.props.style]}> */}
        <Image
          source={{ uri: icon }}
          style={{
            height: 54,
            width: 54,
            opacity: 1,
            margin: 16,
            paddingBottom: 16,
            borderRadius: 27,
            borderWidth: 2,
            borderColor: ColorTheme.SECONDARY,
          }}
        />
        <AppText style={styles.buttonText}>{this.props.children}</AppText>
        {assets ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 16,
            }}
          >
            <Image
              resizeMode={"contain"}
              source={{ uri: assets.stars }}
              style={{
                margin: 0,
                padding: 0,
                height: width / 2.5,
                width: width,
                opacity: 1,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              }}
            />
            <AppText
              style={{ margin: 0, fontSize: ColorTheme.FONT_SIZE * 0.6 }}
            >
              {assets.level}
            </AppText>
          </View>
        ) : null}
        {/* </View> */}
      </TouchableOpacity>
    );
  }

  onLayout(event) {
    this.setState({
      layoutWidth: event.nativeEvent.layout.width,
      layoutHeight: event.nativeEvent.layout.height,
    });
  }
}
ModuleListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
};
