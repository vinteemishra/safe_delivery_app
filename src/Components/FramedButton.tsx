import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, ImagePropertiesSourceOptions, ViewStyle, TextStyle, StyleProp, ImageStyle, ImageURISource } from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from './AppText';
import withPreventDoublePress from "../Utils/withPreventDoublePress";
const { width, height } = Dimensions.get('window')

interface OwnProps {
  label: string;
  onPress(): void;
  disabled?: boolean;
  icon?: string | ImageURISource;
  style?: StyleProp<ViewStyle>;
  color?: string;
  activeOpacity?: number;
  labelStyle?: TextStyle;
}
export default class FramedButton extends React.Component<OwnProps> {

  render() {
    let { icon, onPress, disabled, label, style, color, activeOpacity, labelStyle } = this.props;
    const TouchableOpacityPreventDoublePress = withPreventDoublePress(TouchableOpacity);
    // const TouchableOpacityPreventDoublePress = TouchableOpacity
    const source = typeof icon === "string" ? { uri: icon } : icon;

    return (
      <View style={styles.container}>
        <TouchableOpacityPreventDoublePress activeOpacity={activeOpacity} style={[styles.button, style, { borderColor: color ? color : disabled ? ColorTheme.DISABLED : ColorTheme.PRIMARY } as ViewStyle]} onPress={() => !disabled && onPress()}>
          <View style={{ alignItems: 'center' }}>
            <AppText style={[styles.label, { marginRight: source ? 57 : 20, marginLeft: source ? 57 : 20, color: color ? color : disabled ? ColorTheme.DISABLED : ColorTheme.PRIMARY } as TextStyle, labelStyle]}>{label}</AppText>
          </View>
          {!icon ? null :
            <View style={styles.viewStyle}>
              <Image source={source} style={styles.imageStyle} />
            </View>
          }
        </TouchableOpacityPreventDoublePress>
      </View>
    )
  }
}


interface Style {
  container: ViewStyle;
  button: ViewStyle;
  imageStyle: ImageStyle;
  viewStyle: ViewStyle;
  label: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    alignItems: 'center',
    margin: 16,
  },
  button: {
    height: 50,
    // width: width - width / 4,
    width: (width < height) ? width - width / 4 : height - height / 4,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageStyle: {
    width: 15,
    height: 15,
    marginLeft: 12,
    resizeMode: 'contain'
  },
  viewStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 30
  },
  label: {
    textAlign: "center"
  }
})