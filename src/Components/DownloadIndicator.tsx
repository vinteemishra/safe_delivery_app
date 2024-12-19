import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "./AppText";
import ResponsiveProgressBar from "./ResponsiveProgressBar";
interface OwnProps {
  progress: number;
  width: number;
  style: ViewStyle;
  text: string;
  onPress?(): void;
  isVisible?: boolean;
  doNotShowExtendIcon?: boolean;
  language?: string;
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: ColorTheme.WHITE,
    borderColor: ColorTheme.SEPARATOR,
    borderTopWidth: 1,
    // height: 90,
    justifyContent: "flex-end",
  },
  spinner: {
    height: 20,
    width: 20,
  },
});

class DownloadIndicator extends Component<OwnProps> {
  state = {
    downloadProgressWidth: !this.props.width ? 300 : this.props.width,
    animate: new Animated.Value(0),
    doNotShowExtendIcon: false,
  };

  componentDidMount() {
    if (this.props.progress !== 100) {
      this._animateIn();
    }
  }

  componentDidUpdate() {
    if (
      this.props.progress === 100 &&
      this.state.doNotShowExtendIcon === false
    ) {
      this.setState({ doNotShowExtendIcon: true });
    }
  }

  private _animateIn() {
    return Animated.timing(this.state.animate, {
      toValue: 1,
      duration: 1500,
      isInteraction: false,
      useNativeDriver: false,
    }).start(this._animateOut.bind(this));
  }

  private _animateOut() {
    return Animated.timing(this.state.animate, {
      toValue: 0.3,
      duration: 1500,
      isInteraction: false,
      useNativeDriver: false,
    }).start(this._animateIn.bind(this));
  }

  render() {
    const {
      onPress,
      text,
      style,
      progress,
      isVisible,
      doNotShowExtendIcon,
      language,
    } = this.props;

    if (!isVisible) {
      return null;
    }

    let _height = 0;

    if (
      progress === 100 &&
      (language === "India - Hindi" || language === "Myanmar")
    ) {
      //(language === 'India - Hindi' || language === 'Myanmar')
      _height = 85;
    } else if (
      progress === 100 &&
      (language !== "India - Hindi" && language !== "Myanmar")
    ) {
      _height = 75;
    } else if (
      progress !== 100 &&
      (language !== "India - Hindi" && language !== "Myanmar")
    ) {
      _height = 90;
    } else if (
      progress !== 100 &&
      (language === "India - Hindi" || language === "Myanmar")
    ) {
      _height = 100;
    }

    const shown_progress = progress === undefined || 0 ? 0 : progress;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? undefined : 1}
      >
        <View
          style={[
            style ? style : styles.container,
            { height: _height, flexDirection: "column", alignItems: "center" },
          ]}
        >
          <View style={{ marginBottom: 8, marginTop: 4 }}>
            {doNotShowExtendIcon ||
            this.state.doNotShowExtendIcon === true ? null : (
              <Animated.View
                style={{
                  alignItems: "center",
                  marginBottom: -12,
                  opacity: this.state.animate,
                }}
              >
                <Image
                  style={{
                    tintColor: ColorTheme.PRIMARY,
                    height: 48,
                    width: 48,
                  }}
                  source={require("../../img/expand_arrow.png")}
                />
              </Animated.View>
            )}
            <AppText
              style={[
                ,
                { fontWeight: "400", textAlign: "center", fontSize: 16 },
              ]}
            >
              {text || ""}
            </AppText>
          </View>
          <ResponsiveProgressBar
            progress={shown_progress}
            towardsNextIndex={0}
            size={100}
            duration={250}
            height={4}
            width={this.state.downloadProgressWidth}
            color={ColorTheme.PRIMARY}
            style={{
              borderRadius: 20,
              borderWidth: 0,
              backgroundColor: "#eee",
            }}
            hideProgressText={true}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            <AppText style={{ fontSize: 16 }}>{shown_progress}%</AppText>
            <View style={{ marginLeft: 8 }}>
              {shown_progress >= 100 ? null : (
                <ActivityIndicator color={ColorTheme.PRIMARY} size={"small"} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DownloadIndicator;
