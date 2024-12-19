import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as helpers from '../Utils/helpers';
import AvatarListItem from '../Components/AvatarListItem';
import ColorTheme from '../Constants/ColorTheme';
import fs from 'react-native-fs';
import AnalyticsTracker from '../Components/AnalyticsTracker';

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorTheme.TERTIARY
  }
});

class CardOptionScreen extends Component {
  onOptionPressed(content, description, id, contentType) {
    // console.log('onPressCard', contentType)
    if (content.length == 1) {
      this.props.navigation.navigate('ActioncardScreen', {
        title: description,
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        content: content[0].content,
        id,
        contentType,
        index: 0
      });
    } else {
      // console.log('content.chap', content)
      this.props.navigation.navigate('ChapterOptionScreen', {
        title: description,
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        content,
        id,
        contentType
      });
    }
  }

  render() {
    const { content, lang, contentType } = this.props;
    const menu = content
      ? content.map((item, index) => {
          item = lang[item];
          if (typeof item !== 'undefined') {
            let icon = helpers.getArrayItem(item.icon, lang.images);
            let src;
            if (typeof icon !== 'undefined' && icon.src)
              src = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
            return (
              <AvatarListItem
                key={index}
                icon={src}
                onPress={() =>
                  this.onOptionPressed(
                    item.chapters,
                    item.description,
                    item.id,
                    contentType
                  )
                }
              >
                {item.description}
              </AvatarListItem>
            );
          }
          return null;
        })
      : null;

    return (
      <ScrollView style={styles.mainContainer} alwaysBounceVertical={false}>
        {this.props.contentType == 'actioncard' && (
          <AnalyticsTracker eventType='actioncardList' eventData={`::`} />
        )}
        {this.props.contentType == 'procedure' && (
          <AnalyticsTracker eventType='procedureList' eventData={`::`} />
        )}
        {menu}
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const { content, contentType } = props.navigation.state.params;
  const { selectedLang, contentByLanguage } = state;
  const lang = contentByLanguage[selectedLang] || {};
  const { screen } = contentByLanguage[selectedLang];

  return { content, contentType, lang, screen };
}

export default connect(mapStateToProps)(CardOptionScreen);
