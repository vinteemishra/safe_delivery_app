// import { PropTypes, any, number } from 'prop-types';
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  Platform,
  View,
} from "react-native";

interface OwnProps {
  extraGab?: number;
}

interface State {
  animate: Animated.Value;
  test: any;
  keyboardHeight: number;
  layoutHeight: number;
}

const { State: TextInputState } = TextInput;
const { height: windowHeight } = Dimensions.get("window");

export default class AnimatedAvoidKeyboardContainer extends Component<
  OwnProps,
  State
> {
  private keyboardDidShowSub;
  private keyboardDidHideSub;

  constructor(props: OwnProps) {
    super(props);
    const keyboardShowEvent =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const keyboardHideEvent =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    this.keyboardDidShowSub = Keyboard.addListener(
      keyboardShowEvent,
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      keyboardHideEvent,
      this.handleKeyboardDidHide
    );
    this.state = {
      animate: new Animated.Value(0),
      test: TextInputState,
      keyboardHeight: 0,
      layoutHeight: 0,
    };
  }

  static defaultProps = {
    extraGab: 0,
  };

  componentWillMount() {
    // this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    // this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { children, extraGab } = this.props;
    const { animate } = this.state;
    const platformDependendHeightAdjustment =
      Platform.OS === "android" ? 0 : this.state.keyboardHeight;
    return (
      <View
        style={{ height: "100%", width: "100%" }}
        onLayout={(event) => {
          console.log(
            "onLayout",
            event.nativeEvent.layout.height,
            event.nativeEvent.layout.y,
            "windowHeight",
            windowHeight
          );
          this.setState({ layoutHeight: event.nativeEvent.layout.height });
        }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              height:
                this.state.layoutHeight - platformDependendHeightAdjustment,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }

  handleKeyboardDidShow = (event) => {
    // const { State: TextInputState } = TextInput;

    const { extraGab } = this.props;
    const keyboardHeight = event.endCoordinates.height;
    // const platformDependedMargin = Platform.OS === "android" ? 55 : 65
    this.setState({ keyboardHeight: keyboardHeight });
    // const currentlyFocusedField = TextInputState.currentlyFocusedField();

    // UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
    //     console.log("handleKeyboardDidShow measure", keyboardHeight, originX, originY, width, height, pageX, pageY)
    //     const fieldHeight = height;
    //     const fieldTop = pageY;
    //     const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
    // if (gap >= 0) {
    //     return;
    // }
    // Animated.timing(
    //     this.state.animate,
    //     {
    //         toValue: gap - extraGab, //To get the create user bottom wivible also
    //         duration: 350,
    //         useNativeDriver: true,
    //     }
    // ).start();
    // });
  };

  handleKeyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
    // Animated.timing(
    //     this.state.animate,
    //     {
    //         toValue: 0,
    //         duration: 350,
    //         useNativeDriver: true,
    //     }
    // ).start();
    Keyboard.dismiss();
  };
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
