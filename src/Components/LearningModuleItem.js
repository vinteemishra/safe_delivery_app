import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import * as CONSTANTS from '../Constants/Constants';
import AppText from './AppText';
import fs from 'react-native-fs';
import ColorTheme from '../Constants/ColorTheme';


export default class LearningModuleItem extends React.Component {

  constructor() {
    super()
  }

  render() {

    const { icon, lang, style, preparePrepQuiz, activeOpacity } = this.props

    let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
    if (typeof icon.src == 'undefined') url = "placeholder_module";
    if (icon == 'infection') url = "infection_prevention";

    let level = Math.floor(this.props.score / 4) + 1;
    let score = this.props.score - (level - 1) * 4;
    let progress_url = 'learning_progress_1_0'
    let _activeOpacity = activeOpacity ? activeOpacity : 0.2;

    if (level == 4) progress_url = 'learning_progress_3_3'
    else if (this.props.score !== undefined && level !== undefined && score != undefined) {
      progress_url = 'learning_progress_' + level + '_' + score;
    }

    return (
      <TouchableOpacity onPress={this.props.onPress} activeOpacity={_activeOpacity}>
        <View style={[styles.cardStyle, style]}>
          {preparePrepQuiz && this.props.score === 11 ?
            <View style={{ marginLeft: -16 }}>
              <Image
                resizeMode={'contain'}
                source={require('../../img/learning_icons/success.png')}
                style={{ height: 12, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              </Image>
            </View>
            :
            null}
          <View style={{ flex: 3 }}>
            <AppText style={[styles.cardTitleStyle]}>{this.props.children}</AppText>
            {preparePrepQuiz !== true ?
              <Image
                resizeMode={'contain'}
                source={{ uri: progress_url }}
                style={{ height: 12, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              </Image>
              : null}
            {preparePrepQuiz !== true ?
              <View style={{ flexDirection: 'row', marginTop: 16, marginBottom: 16 }}>
                <AppText style={[styles.level_title, { color: level == 1 ? 'rgba(0,0,0,5)' : 'rgba(0,0,0,0.3)', }]}>{this.props.screen['lp:level_1'] ? this.props.screen['lp:level_1'] : 'familiar'}</AppText>
                <AppText style={[styles.level_title, { color: level == 2 ? 'rgba(0,0,0,5)' : 'rgba(0,0,0,0.3)', }]}>{this.props.screen['lp:level_2'] ? this.props.screen['lp:level_2'] : 'proficient'}</AppText>
                <AppText style={[styles.level_title, { color: level == 3 ? 'rgba(0,0,0,5)' : 'rgba(0,0,0,0.3)', }]}>{this.props.screen['lp:level_3'] ? this.props.screen['lp:level_3'] : 'expert'}</AppText>
              </View>
              : null}
          </View>
          <View style={{ flex: 1, alignItems: 'center' }} >
            <Image
              style={{ height: 56, width: 56, borderRadius: 28, borderWidth: 2, borderColor: CONSTANTS.COLOR.WHITE }}
              source={{ uri: url }}>
            </Image>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

LearningModuleItem.propTypes = {
  icon: PropTypes.object,
}

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    backgroundColor: ColorTheme.SECONDARY, //'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 70,
    borderColor: ColorTheme.SEPARATOR, //'rgba(100,100,100,0.25)',
  },
  cardTitleStyle: {
    fontSize: ColorTheme.FONT_SIZE,
    flexWrap: 'wrap',
    // textAlign: "center",
    // flex: 1,
    marginRight: 16, marginTop: 16, marginBottom: 16
  },
  level_title: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.30)'
  }
})