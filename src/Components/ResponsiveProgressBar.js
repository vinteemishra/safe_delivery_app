import React, { Component } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#f00",
  },

  progressBar: {
    flex: 1,
    backgroundColor: "#f00",
    justifyContent: "center",
    alignItems: "center",
  },

  progressTxt: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const barMinWidthOffset = 20;
const maxFontSize = 15;
const defaultProps = {
  height: 12,
  width: 200,
  onProgress: null,
  hideProgressText: false,
};

export default class ResponsiveProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width:
        this.props.progress && this.props.size
          ? new Animated.Value(this.props.progress / this.props.size)
          : new Animated.Value(this.props.progress),
    };
  }

  componentDidUpdate(prevProps) {
    // const towardsNextIndex = 1/3;
    if (prevProps.progress !== this.props.progress) {
      const progressDecrease = prevProps.progress > this.props.progress;
      Animated.timing(this.state.width, {
        toValue: this.props.progress / this.props.size,
        duration: progressDecrease ? 0 : this.props.duration,
        useNativeDriver: false,
      }).start();
    }
  }

  // componentDidUpdate(prevProps, prevState) { //Testng, the one from feature/certificate-experience-fase-2 branch
  //     if (prevProps.progress !== this.state.progress) {
  //         Animated.timing(this.state.width, {
  //             toValue: this.props.progress / this.props.size,
  //             duration: this.props.duration,
  //             // isInteraction: false
  //         }).start();
  //     }
  // }

  componentDidMount() {
    Animated.timing(this.state.width, {
      toValue: this.props.progress / this.props.size,
      duration: this.props.duration,
      useNativeDriver: false,
      // isInteraction: false
    }).start();
  }

  render() {
    const {
      height,
      style,
      color,
      children,
      textStyle,
      hideProgressText,
      size,
    } = this.props;

    const widthInterpolated = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
      extrapolate: "clamp",
    });

    if (!(size > 0)) return <View />;

    let fontSize =
      this.state.progress <= barMinWidthOffset ? height / 3 : height / 2;
    fontSize = fontSize > maxFontSize ? maxFontSize : fontSize;

    return (
      <View
        style={[
          styles.container,
          { width: this.props.width, height: this.props.height },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: widthInterpolated,
              borderRadius:
                style && style.borderRadius !== undefined
                  ? style.borderRadius
                  : 5,
              backgroundColor: color ? color : "#f00",
            },
          ]}
        >
          {!children && !hideProgressText && (
            <Text style={[styles.progressTxt, { fontSize }, textStyle]}>
              {this.state.progress}%
            </Text>
          )}
        </Animated.View>
        {children}
      </View>
    );
  }
}
