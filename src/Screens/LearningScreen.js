import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  I18nManager,
  Platform
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import { connect } from 'react-redux';
import * as CONSTANTS from '../Constants/Constants';
import * as helpers from '../Utils/helpers';
import {
  selectLearningModule,
  setProfileCertificate,
  setCheatHasBeenUsed,
  setModuleScore
} from '../Actions/actions';
import LearningModuleItem from '../Components/LearningModuleItem';
import { getArrayItem } from '../Utils/helpers';
import AddUserChoice from '../Components/AddUserChoice';
import _ from 'lodash';
import ScoreCircle from '../Components/ScoreCircle';
import FramedButton from '../Components/FramedButton';
import RichText from '../Components/RichText';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import { StackActions, NavigationActions } from 'react-navigation';
import { CHEAT } from '../Config/config';
import RightHeaderButtonSyncProfile from '../Components/RightHeaderButtonSyncProfile';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: ColorTheme.FONT_SIZE,
    fontWeight: '500',
    letterSpacing: 1.2,
    margin: 24
  },
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(192, 15, 72, 0.90)'
  },
  button: {
    height: 50,
    width: width < height ? width - width / 4 : height - height / 4,
    borderColor: ColorTheme.PRIMARY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    flexDirection: 'row'
  },
  buttonText: {
    color: ColorTheme.PRIMARY
  }
});

class LearningScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () =>
        navigation.getParam('hasProfile') ? (
          <RightHeaderButtonSyncProfile openModalType={'SYNC_PROFILES_MODAL'} />
        ) : null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      certLayoutWidth: 1,
      certLayoutHeight: 1,
      atZero: false
    };
  }

  componentDidMount() {
    if (this.props.user !== undefined) {
      this.props.navigation.setParams({ hasProfile: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== undefined && nextProps.user === undefined) {
      this.props.navigation.setParams({ hasProfile: false });

      const resetAction = StackActions.reset({
        index: 0,
        key: 'MyLearningTab',
        actions: [
          NavigationActions.navigate({ routeName: 'MyLearningHome' })
          // NavigationActions.navigate({ routeName: 'SettingsHome' }),
        ]
      });
      this.props.navigation.dispatch(resetAction);

      this.props.navigation.navigate('ShowProfileScreenFromSettings', {
        title: this.props.getTextFromCMS('add_user_title', 'add user')
      });
    }

    if (this.props.user === undefined && nextProps.user !== undefined) {
      this.props.navigation.setParams({ hasProfile: true });
    }
  }

  onLayoutCert(event) {
    this.setState({
      certLayoutWidth: event.nativeEvent.layout.width,
      certLayoutHeight: event.nativeEvent.layout.height
    });
  }

  onPressExisting() {
    if (!_.isEmpty(this.props.userProfiles)) {
      this.props.navigation.navigate('ChooseProfileScreen', {
        title: this.props.getTextFromCMS(
          'lp:AddUserChoiceButtonLabel2',
          'already a user'
        ),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        no_active_user: true,
        fromMylearningScreen: true
      });
    } else {
      this.props.navigation.navigate('LoginScreenFromMyLearning', {
        title: this.props.getTextFromCMS(
          'lp:AddUserChoiceButtonLabel2',
          'already a user'
        ),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        fromMylearningScreen: true
      });
    }
  }

  onPressNew() {
    this.props.navigation.navigate('CreateNewUserScreenFromMyLearning', {
      title: this.props.getTextFromCMS('add_user_title', 'add user'),
      fromMylearningScreen: true
    });
  }

  renderNoUserOverlay() {
    // If a user already exists - don't render "no user overlay"
    if (this.props.user !== undefined) {
      return null;
    }

    const { getTextFromCMS } = this.props;

    const headerText = getTextFromCMS(
      'lp:certificate_center_notification_My_Learning_introduction_button_label',
      'get started'
    );
    const btn1Label = getTextFromCMS(
      'lp:AddUserChoiceButtonLabel1',
      'new user'
    );
    const btn2Label = getTextFromCMS(
      'lp:AddUserChoiceButtonLabel2',
      'already a user'
    );

    return (
      <View style={styles.absoluteContainer}>
        <AddUserChoice
          headerText={headerText}
          btn1Label={btn1Label}
          btn2Label={btn2Label}
          buttonColor={ColorTheme.SECONDARY}
          headerColor={ColorTheme.SECONDARY}
          onPressExisting={() => this.onPressExisting()}
          onPressNew={() => this.onPressNew()}
        />
      </View>
    );
  }

  render() {
    const { language, selectedLang, user } = this.props;

    if (!this.props.learningPlatform) {
      //Is this used any more?
      return (
        <RichText
          content={this.props.comingsoon.chapters[0].content}
          centered
        />
      );
    }

    const modules =
      typeof language.modules !== 'undefined'
        ? language.modules.map((mod, index) => {
            let module = language[mod.id];
            let images = language.images;

            // let neverRunQuiz = false;
            let score =
              this.props.learningModuleScores &&
              mod &&
              mod.id &&
              Object.keys(this.props.learningModuleScores).indexOf(mod.id) > -1
                ? this.props.learningModuleScores[mod.id]
                : 0;

            if (typeof module == 'object') {
              let icon = getArrayItem(module.icon, images);
              return (
                <LearningModuleItem
                  key={index}
                  lang={selectedLang}
                  icon={icon}
                  score={score}
                  screen={language.screen}
                  style={{ borderBottomWidth: 1 }}
                  onPress={() =>
                    this.goToLearningModule(mod.id, module.description)
                  }
                >
                  {module.description}
                </LearningModuleItem>
              );
            }
            return null;
          })
        : null;

    let cert_score =
      user !== null && user !== undefined
        ? helpers.getTotalScoreFromStore(
            language.modules,
            user.profileModuleScores
          )
        : 0;

    return (
      <View style={{ flex: 1 }}>
        <AnalyticsTracker eventType='myLearning' eventData={`::`} />
        <ScrollView
          style={{ backgroundColor: ColorTheme.TERTIARY }}
          alwaysBounceVertical={false}
        >
          {this.renderCert(cert_score)}
          {this.renderCheat(cert_score)}
          {modules}
        </ScrollView>
        {this.renderNoUserOverlay()}
      </View>
    );
  }

  getInformationFromStore() {
    let unlocked = false;
    let passed = false;
    let claimed = false;

    let user = this.props.userProfiles[this.props.currentUser];
    const lastCertEntry = user ? user.profileCertificates.length - 1 : -1; //REVIEW

    if (this.props.user && this.props.user.profileCertificates[lastCertEntry]) {
      if (this.props.user.profileCertificates[lastCertEntry].unlockTimestamp) {
        unlocked = true;
      }
      if (this.props.user.profileCertificates[lastCertEntry].passed)
        passed = true;
      if (this.props.user.profileCertificates[lastCertEntry].claimed)
        claimed = true;
    }

    return { unlocked, claimed, passed };
  }

  renderCheat(score) {
    let cert = this.getInformationFromStore();

    if (score < 100) {
      if (CHEAT) {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <FramedButton
              onPress={() => this.cheatAll()}
              label='Cheat all modules'
            />
          </View>
        );
      }
    }
    if (score === 100) {
      if (CHEAT) {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <FramedButton
              onPress={() => this.uncheatAll()}
              label='Uncheat all modules'
            />
          </View>
        );
      }
    }

    if (cert.claimed || cert.passed) {
      if (CHEAT) {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <FramedButton
              onPress={() => this.uncheatAll()}
              label='Uncheat all modules'
            />
          </View>
        );
      }
    }
  }

  renderCert(score) {
    if (CONSTANTS.HAS_CERTIFICATE === false) {
      return null;
    }

    let name_range_from_top = this.state.certLayoutHeight / 10;
    let more_range_from_top = (this.state.certLayoutHeight / 11) * 8;

    let cert_draw_size = this.state.certLayoutHeight / 5;

    let user = this.props.userProfiles[this.props.currentUser];
    const lastCertEntry = user ? user.profileCertificates.length - 1 : -1; //REVIEW

    return (
      <TouchableOpacity onPress={() => this.goToAboutCertificate()}>
        <ImageBackground
          style={{
            height: width < height ? width * 0.7 : height * 0.7,
            width: width < height ? width : height,
            backgroundColor: ColorTheme.TERTIARY
          }}
          source={require('../../img/learning_icons/certificate.png')}
          resizeMode='contain'
          onLayout={(event) => this.onLayoutCert(event)}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              backgroundColor: '#ffffffee'
            }}
          />
          <AppText
            style={{
              position: 'absolute',
              top: name_range_from_top,
              width: this.state.certLayoutWidth,
              backgroundColor: 'transparent',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 12,
              color: '#6668'
            }}
          >
            {this.props.user && this.props.user.profileName}
          </AppText>
          <View
            style={{
              top: 50,
              alignItems: 'center'
            }}
          >
            <ScoreCircle
              score={score}
              width={cert_draw_size}
              height={cert_draw_size}
              fontSize={12}
            />
          </View>
          {this.props.user &&
          this.props.user.profileCertificates &&
          this.props.user.profileCertificates[lastCertEntry] &&
          this.props.user.profileCertificates[lastCertEntry].claimed ? null : (
            <AppText
              style={{
                backgroundColor: 'transparent',
                position: 'absolute',
                top: (this.state.certLayoutHeight / 14) * 8,
                width: this.state.certLayoutWidth,
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 14,
                color: '#666f'
              }}
            >
              {this.props.screen['lp:certificate_title']
                ? this.props.screen['lp:certificate_title']
                : 'safe delivery champion certificate'}
            </AppText>
          )}
          <View //The new layout of the cert screen, that takes you to the Certification center.
            style={{
              position: 'absolute',
              top: more_range_from_top - 15,
              width: this.state.certLayoutWidth
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <AppText
                style={{
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: 14,
                  color: ColorTheme.PRIMARY
                }}
              >
                {this.props.getTextFromCMS(
                  'lp:certificate_center_Go_to_CC_label',
                  'go to the Certificate Center'
                )}
              </AppText>
              <Image
                style={{
                  height: 12,
                  width: 20,
                  marginLeft: 8,
                  marginTop: 2,
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
                }}
                source={require('../../img/learning_icons/arrow-right-red-1.png')}
              />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  goToAboutCertificate() {
    this.props.navigation.navigate('CertificateCentralScreen', {
      title: this.props.getTextFromCMS(
        'lp:certificate_center_title',
        'certification center'
      ),
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
  }

  goToLearningModule(module, description) {
    console.log('goToLearningModule', module);
    this.props.navigation.navigate('LearningModuleScreen', {
      title: description,
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
    this.props.dispatch(selectLearningModule(module));
  }

  cheat() {
    let ts = this.props.user.profileCertificate.unlockTimestamp;
    if (ts) {
      ts -= 5 * 24 * 60 * 60 * 1000;
      this.props.dispatch(
        setProfileCertificate(
          this.props.currentUser,
          ts,
          87,
          this.props.user.profileCertificate.passed,
          this.props.user.profileCertificate.claimed,
          this.props.user.profileName
        )
      );
    }

    this.props.setCheatHasBeenUsed(this.props.currentUser, true); //Set cheat flag to true in the store. The certificate will then show that cheat has been used.
  }

  //Cheat or uncheat all KLP modules
  cheatAll() {
    const { language, user, currentUser } = this.props;
    this.props.setCheatHasBeenUsed(currentUser, true);
    const modules =
      typeof language.modules !== 'undefined' ||
      typeof language.modules === 'undefined'
        ? language.modules.map((mod, index) => {
            let module = language[mod.id];

            if (
              typeof module == 'object' &&
              user &&
              user.profileModuleScores &&
              user.profileModuleScores[mod.id] &&
              user.profileModuleScores[mod.id] < 11
            ) {
              this.props.dispatch(setModuleScore(currentUser, mod.id, 11));
            } else this.props.dispatch(setModuleScore(currentUser, mod.id, 11));
            return modules;
          })
        : null;
  }

  uncheatAll() {
    const { language, currentUser } = this.props;
    this.props.setCheatHasBeenUsed(currentUser, false);
    const modules =
      typeof language.modules !== 'undefined'
        ? language.modules.map((mod, index) => {
            let module = language[mod.id];

            if (typeof module == 'object') {
              this.props.dispatch(
                setModuleScore(this.props.currentUser, mod.id, 0)
              );
            }
            return modules;
          })
        : null;
    this.props.dispatch(
      setProfileCertificate(this.props.currentUser, 0, 0, false, false, null)
    );
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    currentUser,
    userProfiles
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications, learningPlatform } = language;

  let user = undefined;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }

  const learningModuleScores = user
    ? Object.assign({}, user.profileModuleScores)
    : null;
  const comingsoon = contentByLanguage[selectedLang]['comingsoon'];

  return {
    userProfiles,
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    learningModuleScores,
    currentUser: currentUser.currentUser,
    user,
    state,
    learningPlatform,
    comingsoon,
    // lastCertEntry,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
    setCheatHasBeenUsed: (user, hasCheated) => {
      dispatch(setCheatHasBeenUsed(user, hasCheated));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LearningScreen);
