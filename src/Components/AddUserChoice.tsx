import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import AppText from './AppText';
import ColorTheme from '../Constants/ColorTheme';
import FramedButton from './FramedButton';

interface OwnProps {
  headerText: string;
  btn1Label: string;
  btn2Label: string;
  headerColor: string;
  buttonColor: string;
  onPressNew(): void;
  onPressExisting(): void;
}

export default class AddUserChoice extends Component<OwnProps> {
  public render() {
    const {
      headerText,
      btn1Label,
      btn2Label,
      headerColor,
      buttonColor,
      onPressNew,
      onPressExisting
    } = this.props;

    return (
      <View style={styles.mainContainer}>
        <AppText style={[styles.header, { color: headerColor }]}>
          {headerText}
        </AppText>
        <FramedButton
          style={styles.button}
          color={buttonColor}
          label={btn1Label}
          onPress={onPressNew}
        />
        <FramedButton
          style={styles.button}
          color={buttonColor}
          label={btn2Label}
          onPress={onPressExisting}
        />
      </View>
    );
  }
}

interface Style {
  mainContainer: ViewStyle;
  header: TextStyle;
  button: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  mainContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    alignItems: 'center'
  },
  header: {
    color: ColorTheme.SECONDARY,
    fontWeight: '500',
    fontSize: ColorTheme.FONT_SIZE * 1.25
  },
  button: {
    marginBottom: 8,
    marginTop: 24
  }
});
