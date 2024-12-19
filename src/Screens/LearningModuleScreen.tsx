import React, { Component } from 'react';
import {
  Dimensions,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import fs from 'react-native-fs';
import { connect, MapDispatchToProps } from 'react-redux';
import {
  setCheatHasBeenUsed,
  setProfileCertificate,
  setModuleScore
} from '../Actions/actions';
import AppText from '../Components/AppText';
import FramedButton from '../Components/FramedButton';
import ColorTheme from '../Constants/ColorTheme';
import * as CONSTANTS from '../Constants/Constants';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import { startQuiz as startQuizAction } from '../Actions/learningActions';
import {
  getArrayItem,
  getLevelFromModuleScore,
  getTextFromCMS as helperTextFromCMS
} from '../Utils/helpers';
import { analytics } from '../Utils/analytics';
import { CHEAT } from '../Config/config';
import { NavigationScreenProp } from 'react-navigation';
import { openModal } from '../Actions/modalActions';
import { FEATURE_FLAGS, hasFeature } from '../Utils/featureFlag';
import { UserProfile } from '../Reducers/reducers';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  level_title: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center'
  },
  button: {
    height: 50,
    width: width < height ? width - width / 4 : height - height / 4,
    borderColor: ColorTheme.PRIMARY,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 16
  },
  buttonText: {
    color: ColorTheme.PRIMARY
  }
});

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}
interface PropsFromState {
  selectedLang: string;
  language: any;
  screen: { [key: string]: string };
  learningModuleScore: any;
  currentUser: string;
  userProfiles: any;
  keyLearningPoints: any;
  icon: { [key: string]: any };
  getTextFromCMS: (screenKey: string, fallback: string) => string;
  description: string;
  moduleKey: string;
  country: string;
  user: UserProfile;
}

interface PropsFromDispatch {
  // dispatch(action: any): any;
  setLearningModuleScore: (
    currentUser: string,
    moduleId: string,
    score: number
  ) => void;
  startQuiz: (level, moduleKey, preparePrepQuiz) => void;
  setCheatHasBeenUsed: (user, hasCheated) => void;
  lockCertificate: (profileId: string) => void;
  share: (moduleName: string, moduleKey: string) => void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

class LearningModuleScreen extends Component<Props> {
  constructor(props) {
    super(props);
  }

  renderScoreIcons(url, progress_url, preparePrepQuiz, level, prepTestScore) {
    if (preparePrepQuiz === true) {
      return (
        prepTestScore === 11 && (
          <View
            style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: 'transparent'
              }}
              source={{ uri: url }}
            />
            {/* <AppText style={{ textAlign: 'center', marginTop: 12, marginBottom: 12 }}>{this.props.description}</AppText> */}
            <View style={{ marginTop: 12 }}>
              <Image
                resizeMode={'contain'}
                source={require('../../img/learning_icons/success.png')}
                style={{ height: 60, width: 60 }}
              />
            </View>
          </View>
        )
      );
    } else {
      return (
        <View
          style={{ flex: 6, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            style={{
              height: 96,
              width: 96,
              borderRadius: 48,
              borderWidth: 2,
              borderColor: CONSTANTS.COLOR.WHITE
            }}
            source={{ uri: url }}
          />
          <AppText
            style={{ textAlign: 'center', marginTop: 12, marginBottom: 12 }}
          >
            {this.props.description}
          </AppText>
          <View>
            <Image
              resizeMode={'contain'}
              source={{ uri: progress_url }}
              style={{
                height: 15,
                width: width < height ? width - width / 4 : height - height / 4,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
              }}
            />
            <View
              style={{ flexDirection: 'row', marginTop: 8, marginBottom: 16 }}
            >
              <AppText
                style={[
                  styles.level_title,
                  { fontWeight: level == 1 ? '500' : 'normal' }
                ]}
              >
                {this.props.getTextFromCMS('lp:level_1', 'familiar')}
              </AppText>
              <AppText
                style={[
                  styles.level_title,
                  { fontWeight: level == 2 ? '500' : 'normal' }
                ]}
              >
                {this.props.getTextFromCMS('lp:level_2', 'proficient')}
              </AppText>
              <AppText
                style={[
                  styles.level_title,
                  { fontWeight: level == 3 ? '500' : 'normal' }
                ]}
              >
                {this.props.getTextFromCMS('lp:level_3', 'expert')}
              </AppText>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    const {
      navigation,
      keyLearningPoints,
      learningModuleScore,
      screen,
      getTextFromCMS
    } = this.props;

    const { icon } = this.props;
    const preparePrepQuiz = navigation.getParam('preparePrepQuiz');
    const prepTestScore = navigation.getParam('prepTestScore');

    let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
    if (typeof icon.src == 'undefined') url = 'placeholder_module';

    let start = (
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.goToLearningTest(preparePrepQuiz, icon)}
      >
        <AppText style={{ color: ColorTheme.PRIMARY }}>
          {getTextFromCMS('lp:start_test', 'start test')}
        </AppText>
        <Image
          style={{
            marginLeft: 12,
            transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
          }}
          source={require('../../img/learning_icons/arrow-right-red-1.png')}
        />
      </TouchableOpacity>
    );
    let btn2 = null;

    if (learningModuleScore >= 11) {
      start = (
        <View style={{ marginTop: 12 }}>
          <AppText
            style={{
              fontSize: 16,
              fontWeight: '500',
              textAlign: 'center'
            }}
          >
            {screen['lp:module_completed']
              ? this.props.screen['lp:module_completed']
              : 'module completed!'}
          </AppText>
          {hasFeature(
            FEATURE_FLAGS.MODULE_CERTIFICATION,
            this.props.selectedLang
          ) &&
            this.props.user &&
            this.props.user.moduleCertificates &&
            Object.keys(
              this.props.userProfiles[this.props.currentUser].moduleCertificates
            ).filter((el) => el === this.props.moduleKey).length > 0 && (
              <FramedButton
                label='Download Expert Certificate'
                onPress={() =>
                  this.props.share(this.props.description, this.props.moduleKey)
                }
              />
            )}
        </View>
      );
      btn2 = (
        <FramedButton
          onPress={() => this.goToLearningTest(preparePrepQuiz, icon)}
          label={
            screen.retake_test ? this.props.screen.retake_test : 'Retake test'
          }
          icon={require('../../img/learning_icons/retake.png')}
        />
      );
    }

    if (keyLearningPoints.length < 1)
      start = (
        <View>
          <AppText>
            {this.props.screen.no_questions_module
              ? this.props.screen.no_questions_module
              : 'There are no questions for this module!'}
          </AppText>
        </View>
      );
    let cheat = preparePrepQuiz != true && (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        }}
      >
        <View style={{ flex: 1 }}>
          <FramedButton
            onPress={() => this.cheatDown()}
            label='Go down a level (cheat)'
            style={[, { width: 180 }]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FramedButton
            onPress={() => this.cheatUp()}
            label='Go up a level (cheat)'
            style={[, { width: 180 }]}
          />
        </View>
      </View>
    );

    let level = Math.floor(this.props.learningModuleScore / 4) + 1;
    let stars = this.props.learningModuleScore - (level - 1) * 4;
    let progress_url = 'learning_progress_1_0';
    if (level == 4) progress_url = 'learning_progress_3_3';
    else if (
      this.props.learningModuleScore != undefined &&
      level !== undefined &&
      stars != undefined
    ) {
      progress_url = 'learning_progress_' + level + '_' + stars;
    }

    let title = '';
    let subtitle = '';
    if (level < 4 && stars != 3) {
      subtitle = getTextFromCMS(
        'lp:module_message_subtitle_keep_improving',
        'keep improving to unlock the next level.'
      );
    } else if (this.props.learningModuleScore == undefined) {
      subtitle = getTextFromCMS(
        'lp:module_message_subtitle_first_time',
        'take quiz to earn stars and advance'
      );
    }

    if (level < 4 && stars == 0) {
      title = getTextFromCMS(
        'lp:module_message_title_0_stars',
        'room for improvement'
      );
    } else if (stars == 1) {
      title = getTextFromCMS('lp:module_message_title_1_stars', 'keep going');
    } else if (stars == 2) {
      title = getTextFromCMS('lp:module_message_title_2_stars', 'almost there');
    } else if (stars == 3) {
      title = getTextFromCMS('lp:module_message_title_3_stars', 'excellent');
    } else if (this.props.learningModuleScore == undefined) {
      title = getTextFromCMS(
        'lp:module_message_title_first_time',
        'get started'
      );
    }

    let learning_module_score = this.props.learningModuleScore;
    if (learning_module_score == undefined) learning_module_score = 0;
    return (
      <ScrollView
        style={{ backgroundColor: ColorTheme.SECONDARY }}
        alwaysBounceVertical={false}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        <AnalyticsTracker
          eventType='learningModule'
          eventData={`:${this.props.navigation.state.params.title}:`}
        />
        {this.renderScoreIcons(
          url,
          progress_url,
          preparePrepQuiz,
          level,
          prepTestScore
        )}
        <View
          style={{
            flex: 5,
            borderTopWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopColor: ColorTheme.SEPARATOR
          }}
        >
          {learning_module_score < 11 && (
            <View style={{ margin: 12 }}>
              <AppText
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  textAlign: 'center',
                  marginBottom: 8
                }}
              >
                {title}
              </AppText>
              <AppText style={{ fontSize: 14, textAlign: 'center' }}>
                {subtitle}
              </AppText>
            </View>
          )}
          {start}
          {btn2}
          {CHEAT ? cheat : null}
        </View>
      </ScrollView>
    );
  }

  cheatUp() {
    const {
      setLearningModuleScore,
      setCheatHasBeenUsed,
      moduleKey
    } = this.props;
    if (this.props.learningModuleScore == 11) {
      return;
    } else if (this.props.learningModuleScore >= 8) {
      setLearningModuleScore(this.props.currentUser, moduleKey, 11);
    } else if (this.props.learningModuleScore >= 4) {
      setLearningModuleScore(this.props.currentUser, moduleKey, 8);
    } else {
      setLearningModuleScore(this.props.currentUser, moduleKey, 4);
    }
    setCheatHasBeenUsed(this.props.currentUser, true); //Set cheat flag to true in the store. The certificate will then show that cheat has been used.
  }

  cheatDown() {
    const {
      setLearningModuleScore,
      setCheatHasBeenUsed,
      lockCertificate,
      moduleKey
    } = this.props;
    if (this.props.learningModuleScore <= 4) {
      setLearningModuleScore(this.props.currentUser, moduleKey, 0);
    } else if (this.props.learningModuleScore <= 8) {
      setLearningModuleScore(this.props.currentUser, moduleKey, 4);
    } else if (this.props.learningModuleScore <= 11) {
      setLearningModuleScore(this.props.currentUser, moduleKey, 8);
    }

    setCheatHasBeenUsed(this.props.currentUser, true); //Set cheat flag to true in the store. The certificate will then show that cheat has been used.
    lockCertificate(this.props.currentUser);
  }

  goToLearningTest(preparePrepQuiz, icon) {
    this.props.navigation.navigate('QuizTest', {
      title: this.props.description,
      preparePrepQuiz: preparePrepQuiz ? preparePrepQuiz : false,
      icon: icon
    });
    const level = getLevelFromModuleScore(this.props.learningModuleScore);
    this.props.startQuiz(level.toString(), this.props.moduleKey, false);
  }
}

function mapStateToProps(state, props) {
  const {
    selectedLang,
    contentByLanguage,
    currentUser,
    userProfiles,
    selectedLearningModule,
    selectedCountry
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, modules, images } = language;

  //get info of current selected module
  const moduleInfo: {
    id: string;
    version: number;
    icon: string;
    iconAlt: string;
    description: string;
    keyLearningPoints: string[];
    procedures: string[];
    videos: string[];
    drugs: string[];
    actionCards: string[];
  } = modules.find((m) => m.id === selectedLearningModule);
  const { keyLearningPoints, description, id } = moduleInfo;

  let user = null;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }

  let learningModuleScore =
    user &&
    user.profileModuleScores &&
    user.profileModuleScores[selectedLearningModule]
      ? user.profileModuleScores[selectedLearningModule]
      : 0;

  return {
    selectedLang,
    language,
    screen,
    learningModuleScore,
    currentUser: currentUser.currentUser,
    userProfiles,
    keyLearningPoints,
    icon: getArrayItem(moduleInfo.icon, images),
    getTextFromCMS: (screenKey, fallback) =>
      helperTextFromCMS(screen, screenKey, fallback),
    description,
    moduleKey: id,
    country: selectedCountry,
    user
  };
}

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => {
  return {
    share: (moduleName, moduleKey) => {
      const modalProps = {
        moduleName,
        moduleKey
      };

      dispatch(
        openModal({
          modalType: 'SHARE_MODULE_CERTIFICATE',
          modalProps
        })
      );
    },
    setLearningModuleScore: (profileId, moduleId, moduleScore) => {
      dispatch(setModuleScore(profileId, moduleId, moduleScore));
    },
    startQuiz: (level, moduleKey, preparePrepQuiz) => {
      analytics.event('klpStart', `:${moduleKey}:`);
      dispatch(startQuizAction({ level, moduleKey, preparePrepQuiz }));
    },
    setCheatHasBeenUsed: (user, hasCheated) => {
      dispatch(setCheatHasBeenUsed(user, hasCheated));
    },
    lockCertificate: (profileId) => {
      dispatch(
        setProfileCertificate(profileId, undefined, 0, false, false, null)
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LearningModuleScreen);
