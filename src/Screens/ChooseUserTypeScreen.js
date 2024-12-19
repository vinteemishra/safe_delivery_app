import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import ColorTheme from '../Constants/ColorTheme';
import AddUserChoice from '../Components/AddUserChoice';
import * as helpers from '../Utils/helpers';
import AnalyticsTracker from '../Components/AnalyticsTracker';

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: ColorTheme.SECONDARY,
    paddingTop: 24
  }
});

class ChooseUserTypeScreen extends Component {
  constructor(props) {
    super(props);
  }

  onPressExisting() {
    if (this.props.navigation.state.params.fromSettingsScreenViewProfile) {
      this.props.navigation.navigate('LoginScreenModal', {
        titleImage: require('../../img/sda_title.png'),
        title: this.props.getTextFromCMS('add_user_title', 'add user'),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromSettingsScreenViewProfile: this.props.navigation.state.params
          .fromSettingsScreenViewProfile
      });
    } else {
      this.props.navigation.navigate('LoginScreen', {
        titleImage: require('../../img/sda_title.png'),
        title: this.props.getTextFromCMS('add_user_title', 'add user'),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromSettingsScreen: this.props.navigation.state.params
          .fromSettingsScreen,
        name: this.props.user.profileName
      });
    }
  }

  onPressNew() {
    if (this.props.navigation.state.params.fromSettingsScreenViewProfile) {
      this.props.navigation.navigate('CreateNewUserScreenModal', {
        titleImage: require('../../img/sda_title.png'),
        title: this.props.getTextFromCMS('add_user_title', 'add user'),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromSettingsScreenViewProfile: this.props.navigation.state.params
          .fromSettingsScreenViewProfile
      });
    } else {
      this.props.navigation.navigate('CreateNewUserScreen', {
        titleImage: require('../../img/sda_title.png'),
        title: this.props.getTextFromCMS('add_user_title', 'add user'),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromSettingsScreen: this.props.navigation.state.params
          .fromSettingsScreen
      });
    }
  }

  render() {
    const { getTextFromCMS } = this.props;
    console.log('Get started');
    // const headerText = this.props.screen['lp:get_started'] ? this.props.screen['lp:get_started'] : 'get started'
    const headerText = this.props.screen[
      'lp:certificate_center_notification_My_Learning_introduction_button_label'
    ]
      ? this.props.screen[
          'lp:certificate_center_notification_My_Learning_introduction_button_label'
        ]
      : 'get started';
    const btn1Label = getTextFromCMS(
      'lp:AddUserChoiceButtonLabel1',
      'new user'
    );
    const btn2Label = getTextFromCMS(
      'lp:AddUserChoiceButtonLabel2',
      'already a user'
    );

    return (
      <View style={styles.mainContainer}>
        <AnalyticsTracker eventType='settings' eventData={`::`} />
        <AddUserChoice
          headerText={headerText}
          btn1Label={btn1Label}
          btn2Label={btn2Label}
          buttonColor={ColorTheme.PRIMARY}
          headerColor={ColorTheme.BLACK}
          onPressExisting={() => this.onPressExisting()}
          onPressNew={() => this.onPressNew()}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { selectedLang, contentByLanguage, currentUser, userProfiles } = state;
  const language = contentByLanguage[selectedLang];
  const { screen } = language;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    screen,
    user,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

export default connect(mapStateToProps)(ChooseUserTypeScreen);
