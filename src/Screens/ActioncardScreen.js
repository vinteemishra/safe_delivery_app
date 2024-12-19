import React, { Component } from 'react';
import { connect } from 'react-redux';
import RichText from '../Components/RichText';
import { View } from 'react-native';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import { RWANDA, RWANDA_FRENCH } from '../Utils/helpers';
import { HappyBirthdayCheckmarks } from '../Components/HappyBirthdayCheckmarks';
import { FEATURE_FLAGS, hasFeature } from '../Utils/featureFlag';
import ZoomableView from '../Components/ZoomableView';

class ActioncardScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      language,
      selectedLang,
      content,
      contentType,
      index,
      id,
      chapterId,
      showCheckmarks
    } = this.props;
    const canZoom =
      hasFeature(FEATURE_FLAGS.ZOOMABLE_VIEWS, selectedLang) &&
      (contentType == 'actioncard' ||
        contentType == 'procedure' ||
        contentType == 'drug' ||
        contentType == 'drugs');

    let extraComponent = undefined;
    if (showCheckmarks) {
      extraComponent = (
        <HappyBirthdayCheckmarks
          selectedLang={selectedLang}
          trackingInfo={`:${id}:${index}:${chapterId}:`}
        />
      );
    }

    return (
      <ZoomableView canZoom={canZoom}>
        <View style={{ flex: 1 }}>
          {contentType == 'actioncard' && (
            <AnalyticsTracker
              eventType='actioncard'
              eventData={`:${id}:${index}:${chapterId}:`}
            />
          )}
          {contentType == 'procedure' && (
            <AnalyticsTracker
              eventType='procedure'
              eventData={`:${id}:${index}:${chapterId}:`}
            />
          )}
          {contentType == 'setting' && (
            <AnalyticsTracker
              eventType='setting'
              eventData={`:${id}:${index}:`}
            />
          )}
          <RichText
            language={language}
            content={content}
            extraComponent={extraComponent}
          />
        </View>
      </ZoomableView>
    );
  }
}

function showCheckmarksFromState(state, contentType, acId) {
  const { selectedModule, selectedLang } = state;
  console.log(
    'showCheckmarksFromState',
    JSON.stringify({ selectedLang, selectedModule, acId })
  );

  if ((acId || '').indexOf('-session') === -1) {
    return false;
  }

  if (
    contentType !== 'actioncard' ||
    (selectedLang !== RWANDA && selectedLang !== RWANDA_FRENCH)
  ) {
    return false;
  }
  return (
    selectedModule.startsWith('post-partum-hemorrhage') ||
    selectedModule.startsWith('hypertension') ||
    selectedModule.startsWith('neonatal-resuscitation')
  );
}

function mapStateToProps(state, props) {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  const { screen } = contentByLanguage[selectedLang];
  const {
    content,
    index,
    contentType,
    id,
    chapterId
  } = props.navigation.state.params;
  const showCheckmarks = showCheckmarksFromState(state, contentType, id);
  return {
    screen,
    selectedLang,
    language,
    content,
    contentType,
    index,
    id,
    chapterId,
    showCheckmarks
  };
}

export default connect(mapStateToProps)(ActioncardScreen);
