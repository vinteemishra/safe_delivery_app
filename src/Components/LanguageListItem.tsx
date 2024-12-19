import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';

interface OwnProps {
  key?: string;
  text: String;
  subText: String;
  isActive: String;
  isDownloaded: String;
  isEdit: Boolean;
  backgroundColor?: String;
  onPress(): void;
}

export default class LanguageListItem extends React.Component<OwnProps> {
  render() {
    let style = {};
    const isActive = this.props.isActive;
    const isDownloaded = this.props.isDownloaded;
    const isEdit = this.props.isEdit;
    const text = this.props.text;
    const subText = this.props.subText;

    const rightText = isActive
      ? 'Active'
      : isDownloaded && !isEdit
      ? 'Installed'
      : '';
    const showDownloadIcon = !isActive && !isDownloaded && !isEdit;
    const showRemoveIcon = isDownloaded && isEdit;

    const textColor =
      isEdit && !isDownloaded ? ColorTheme.SUB_LABEL : ColorTheme.BLACK;
    const editActiveLanguageColor =
      isEdit && isDownloaded ? ColorTheme.SUB_LABEL : ColorTheme.BLACK;

    const { backgroundColor } = this.props;
    if (typeof backgroundColor === 'string') style = { backgroundColor };
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.container, style]}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <AppText style={[styles.textStyle, { color: textColor }]}>
              {text}
            </AppText>
            <AppText
              style={[
                styles.subTextStyle,
                {
                  color:
                    typeof backgroundColor === 'string'
                      ? ColorTheme.SECONDARY
                      : ColorTheme.SUB_LABEL,
                },
              ]}
            >
              {subText}
            </AppText>
          </View>
          <View style={{ flex: 0 }}>
            <AppText
              style={[
                styles.rightTextStyle,
                { color: editActiveLanguageColor },
              ]}
            >
              {rightText}
            </AppText>
          </View>
          {showDownloadIcon && (
            <View style={{ flex: 0 }}>
              <Image
                style={{
                  marginRight: 20,
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                }}
                source={require('../../img/download-red.png')}
              />
            </View>
          )}
          {showRemoveIcon && (
            <View style={{ flex: 0 }}>
              <Image
                style={{ marginRight: 20, width: 20, height: 20 }}
                source={require('../../img/close-red.png')}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

interface Styles {
  container: ViewStyle;
  textStyle: TextStyle;
  subTextStyle: TextStyle;
  rightTextStyle: TextStyle;
}
const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: ColorTheme.SEPARATOR,
    backgroundColor: ColorTheme.SECONDARY,
    minHeight: 76,
    marginBottom: Platform.OS == 'android' ? 1 : 0,
  },
  textStyle: {
    flexWrap: 'wrap',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 12,
    marginBottom: 2,
  },
  subTextStyle: {
    flexWrap: 'wrap',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 2,
    marginBottom: 12,
    fontSize: 14,
  },
  rightTextStyle: {
    flexWrap: 'wrap',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});
