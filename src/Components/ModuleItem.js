import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  I18nManager,
  Text
} from 'react-native';
import AppText from './AppText';
import fs from 'react-native-fs';
import ColorTheme from '../Constants/ColorTheme';


export default class ModuleItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    const { icon, lang } = this.props
    let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
    if (icon.src === undefined) {
      url = "placeholder_module";
    }
    return (
      <TouchableOpacity style={styles.cardStyle} onPress={this.props.onPress}>
        <AppText style={[styles.cardTitleStyle]}>{this.props.children}</AppText>
        <View >
          <Image
            style={{ minHeight: 84, height: 84, width: 84, borderRadius: 42, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            source={{ uri: url }}>
          </Image>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    flex: 3,
    flexDirection: "row",
    backgroundColor: ColorTheme.SECONDARY,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderColor: ColorTheme.SEPARATOR, //'rgba(100,100,100,0.25)',
  },
  cardTitleStyle: {
    fontSize: ColorTheme.FONT_SIZE,
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 16
  }
})