import * as React from "react";
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Image,
} from "react-native";
import AppText from "./AppText";
import ColorTheme from "../Constants/ColorTheme";

interface OwnProps {
  tintColor?: string;
  onPress(): void;
  style?: StyleProp<ViewStyle>;
  fillColor?: string;
  disabled?: boolean;
  checked?: boolean;
  label?: string;
  disabledTintColor?: string;
}

interface State {}

const styles = StyleSheet.create({
  checkedView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  checkedImage: {
    height: "80%",
    width: "80%",
    tintColor: ColorTheme.SECONDARY,
    resizeMode: "contain",
  },
});

export default class CheckBox extends React.Component<OwnProps, State> {
  public render() {
    const {
      tintColor,
      onPress,
      checked,
      disabled,
      label,
      disabledTintColor,
    } = this.props;

    const enabledColor = tintColor ? tintColor : "#1F5099";
    const disabledColor = disabledTintColor
      ? disabledTintColor
      : "rgba(105, 105, 105, .6)";
    const checkedColor = disabled ? disabledColor : enabledColor;
    const bold = checked ? "bold" : "normal";

    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={disabled ? () => {} : onPress}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderColor: checkedColor,
            borderWidth: 1,
            borderRadius: 2,
            backgroundColor: checked ? checkedColor : "white",
          }}
        >
          {checked ? (
            <View style={styles.checkedView}>
              <Image
                source={require("../../img/learning_icons/success.png")}
                style={styles.checkedImage}
              />
            </View>
          ) : null}
        </View>
        {label && (
          <AppText style={{ marginLeft: 20, flex: 1, fontWeight: bold }}>
            {label}
          </AppText>
        )}
      </TouchableOpacity>
    );
  }
}
