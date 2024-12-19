import React, { Component } from 'react';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import AvatarListItem from '../Components/AvatarListItem';
import ListHeader from '../Components/ListHeader';
import ColorTheme from '../Constants/ColorTheme';
import * as helpers from '../Utils/helpers';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import { CHEAT } from '../Config/config';
import { setLastSyncTimestamp } from '../Actions/syncProfilesActions';
import { openModal, openSetCountryModal } from '../Actions/modalActions';
import { countryInfo } from '../Utils/countries';
import { selectCountry } from '../Actions/actions';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { appId: null };
    var fs = require('react-native-fs');
    var fn = fs.DocumentDirectoryPath + '/app_id.json';
    fs.readFile(fn).then((content) => {
      this.setState({ appId: content });
    });
  }

  goToCard(id, description) {
    // console.log('goToCard', Date.now())

    if (this.props.language[id] === undefined) {
      return;
    }

    let content = this.props.language[id].chapters || [];

    if (content.length == 1) {
      this.props.navigation.navigate('ActioncardScreenSettings', {
        title: description,
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        content: content[0].content,
        contentType: 'setting',
        id,
        index: 0
      });
    } else {
      this.props.navigation.navigate('ChapterOptionScreenSettings', {
        title: description,
        backButtonTitle: getBackText(this.props.screen.back),
        content,
        contentType: 'setting',
        id
      });
    }
  }

  goToUserFeedback() {
    this.props.navigation.navigate('UserFeedback', {
      title: this.props.getTextFromCMS(
        'ufq:user_feedback_title',
        'User Feedback'
      )
    });
  }

  goToProfile() {
    this.props.navigation.navigate('ShowProfileScreenFromSettings', {
      title: this.props.getTextFromCMS('lp:user_profile', 'user profile'),
      fromSettingsScreen: true
    });
  }

  changeLanguage(screen) {
    this.props.navigation.navigate('LanguageScreen', {
      title: this.props.getTextFromCMS(
        'choose_version_title',
        'choose version'
      ),
      backButtonTitle: helpers.getBackText(this.props.screen.back),
      showEdit: true
    });
  }

  devNotification() {
    this.props.navigation.navigate('DevNotifications');
  }
  devAnalytics() {
    this.props.navigation.navigate('DevAnalytics');
  }
  testHowManyDeliveries() {
    this.props.navigation.navigate('UserSurveyQuestionsScreen', {
      from: 'index',
      hideBackButton: true
    });
  }

  handleShowSafeAbortionDisclamer() {
    this.props.openModal({
      modalType: 'SAFE_ABORTION_DISCLAMER',
      modalProps: {}
    });
  }

  renderCountryInfo() {
    const { country } = this.props;

    let countryLabel = country;
    try {
      countryLabel = countryInfo.countries[countryLabel].name;
    } catch (e) {}

    return (
      <TouchableOpacity onPress={this.props.setCountry}>
        <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.75 }}>
          {`Country: `}
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 0.75,
              color: 'blue',
              textDecorationLine: 'underline'
            }}
          >
            {countryLabel || 'N/A'}
          </AppText>
        </AppText>
      </TouchableOpacity>
    );
  }

  render() {
    const { screen, language } = this.props;

    let user_profile = [];
    if (this.props.learningPlatform) {
      user_profile = (
        <AvatarListItem
          icon={'user_profile'}
          onPress={() => this.goToProfile()}
        >
          {screen['userprofile'] ? screen['userprofile'] : 'user profile'}
        </AvatarListItem>
      );
    }
    let identifier = Platform.OS == 'android' ? 'a' : 'i';

    return (
      <View style={{ flex: 1 }}>
        <AnalyticsTracker eventType='settings' eventData={`::`} />
        <ScrollView
          style={{ backgroundColor: ColorTheme.TERTIARY }}
          alwaysBounceVertical={false}
        >
          {(CHEAT || __DEV__) && (
            <View
              style={{
                backgroundColor: ColorTheme.PRIMARY,
                marginTop: 0,
                paddingBottom: 10
              }}
            >
              <ListHeader style={{ color: ColorTheme.SECONDARY }}>
                DEBUG Settings
              </ListHeader>
              <AvatarListItem onPress={() => this.devNotification()}>
                DEV Notifications
              </AvatarListItem>
              <AvatarListItem onPress={() => this.devAnalytics()}>
                DEV Analytics
              </AvatarListItem>
              <AvatarListItem onPress={() => this.testHowManyDeliveries()}>
                DEV test how many deliveries...
              </AvatarListItem>
              <AvatarListItem
                onPress={() => this.props.setLastSyncTimestamp(1560556800)}
              >
                CHEAT - LastSync set in past{' '}
              </AvatarListItem>
              <AvatarListItem onPress={() => this.props.resetCountry()}>
                Set device country to null
              </AvatarListItem>
              <AvatarListItem
                onPress={() => this.handleShowSafeAbortionDisclamer()}
              >
                Show Safe Abortion Disclaimer
              </AvatarListItem>
            </View>
          )}
          <View>
            <ListHeader>
              {this.props.getTextFromCMS('setup', 'setup')}
            </ListHeader>
            {user_profile}
            <AvatarListItem
              icon={'change_language'}
              onPress={() => this.changeLanguage(screen)}
            >
              {screen.language}
            </AvatarListItem>
            <AvatarListItem
              icon={'feedback'}
              onPress={() => this.goToUserFeedback()}
            >
              {this.props.getTextFromCMS(
                'ufq:user_feedback_title',
                'User Feedback'
              )}
            </AvatarListItem>
            {this.props.language['feedback-and-troubleshooting'] ? (
              <AvatarListItem
                tintColor={'#694C3C'}
                icon={'question_mark'}
                onPress={() =>
                  this.goToCard(
                    'feedback-and-troubleshooting',
                    this.props.getTextFromCMS(
                      'f_and_q',
                      'feedback and troubleshooting'
                    )
                  )
                }
              >
                {this.props.getTextFromCMS(
                  'f_and_q',
                  'feedback and troubleshooting'
                )}
              </AvatarListItem>
            ) : null}
          </View>
          <View>
            <ListHeader>
              {this.props.getTextFromCMS('about', 'about')}
            </ListHeader>
            <AvatarListItem
              icon={'introduction'}
              onPress={() =>
                this.goToCard('introduction', screen['introduction'])
              }
            >
              {screen['introduction']}
            </AvatarListItem>
            <AvatarListItem
              icon={'developers'}
              onPress={() => this.goToCard('developers', screen['developers'])}
            >
              {screen['developers']}
            </AvatarListItem>
            <AvatarListItem
              icon={'thank_you'}
              onPress={() => this.goToCard('thankyou', screen['thankyou'])}
            >
              {screen['thankyou']}
            </AvatarListItem>
            <AvatarListItem
              icon={'copyright'}
              onPress={() => this.goToCard('copyright', screen['copyright'])}
            >
              {screen['copyright']}
            </AvatarListItem>
            <AvatarListItem
              icon={'disclaimer'}
              onPress={() => this.goToCard('disclaimer', screen['disclaimer'])}
            >
              {screen['disclaimer']}
            </AvatarListItem>
          </View>
          <View style={{ padding: 16 }}>
            <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.75 }}>
              {'App v.' + VersionNumber.appVersion + identifier}
            </AppText>
            <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.75 }}>
              {language.description + ' v.' + language.version}
            </AppText>
            <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.75 }}>
              {'App ID: ' + this.state.appId}{' '}
            </AppText>
            {this.renderCountryInfo()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { selectedLang, contentByLanguage, selectedCountry } = state;
  const { about, screen = { language: 'Change Language' } } = contentByLanguage[
    selectedLang
  ];
  // const { about, screen, language } = props.navigation.state.params;

  const learningPlatform = contentByLanguage[selectedLang]['learningPlatform'];

  return {
    about,
    screen,
    language: contentByLanguage[selectedLang],
    country: selectedCountry,
    learningPlatform,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLastSyncTimestamp: (value) => {
      console.log('setLastSyncTimestamp', value);
      dispatch(setLastSyncTimestamp(value));
    },

    setCountry: () => {
      dispatch(openSetCountryModal());
    },
    resetCountry: () => {
      dispatch(selectCountry(null));
    },
    openModal: (data) => {
      dispatch(openModal(data));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
