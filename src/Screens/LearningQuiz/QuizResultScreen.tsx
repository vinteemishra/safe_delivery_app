import * as React from 'react';
import { View, BackHandler, Image } from 'react-native';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { NavigationStackProp } from 'react-navigation-stack';
import { StoreState, UserProfile } from '../../Reducers/reducers';
import AppText from '../../Components/AppText';
import LearningAnimScore from '../../Components/LearningAnimScore';
import {
  getTextFromCMS,
  getLevelFromModuleScore,
  getTotalScoreFromStore,
  getLevelToRender,
  checkIfModuleContainsEssentialQuestion
} from '../../Utils/helpers';
import ColorTheme from '../../Constants/ColorTheme';
import FramedButton from '../../Components/FramedButton';
import {
  startQuiz,
  retractQuizIdx,
  setQuizIdx
} from '../../Actions/learningActions';
import { addNewCertificate } from '../../Actions/actions';
import fs from 'react-native-fs';
import { analytics } from '../../Utils/analytics';
import AnalyticsTracker from '../../Components/AnalyticsTracker';

// 0-19% = 0 stjerner Room for Improvement
// 20-59% = 1 stjerne Keep Goint
// 60-99% = 2 stjerner Almost there
// 100% = 3 stjerner Excellent

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

interface PropsFromState {
  reviewData: Array<any>;
  getTextFromCMS(screenKey: string, fallback: string): string;
  moduleScore: number;
  prepModuleScore: number;
  prevModuleScore: number;
  currentPrepQuizModuleScore: number;
  currentQuizModuleScore: number;
  moduleKey: string;
  user: any;
  state: StoreState;
  currentUser;
  isPrepQuiz: boolean;
  title: string;
  moduleIcon: any;
  modules: any;
  language: any;
}

interface PropsFromDispatch {
  startQuiz(level: string, moduleKey: string, preparePrepQuiz?: boolean): void;
  retractQuizIdx(): void;
  addNewCertificate(profileId: string, score: number, passed: boolean): void;
  resetQuizIndex(): void;
}

interface State {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class QuizResultScreen extends React.Component<Props, State> {
  private didFocusSubscription;
  private willBlurSubscription;

  constructor(props: Props) {
    super(props);
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        );
      }
    );
  }

  public componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        );
      }
    );
  }

  public componentWillUnmount() {
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  private reviewResults() {
    analytics.event('reviewResults', `:${this.props.moduleKey}:`);
    this.props.resetQuizIndex();
    this.props.navigation.push('QuizReview', {
      title: this.props.navigation.state.params.title,
      prepQuiz: this.props.isPrepQuiz,
      icon: this.props.moduleIcon
    });
  }

  private retakeTest(level: string) {
    analytics.event('retakeTest', `:${this.props.moduleKey}:`);
    this.props.navigation.push('QuizTest', {
      title: this.props.navigation.state.params.title,
      preparePrepQuiz: this.props.isPrepQuiz,
      icon: this.props.moduleIcon
    });
    this.props.startQuiz(level, this.props.moduleKey, this.props.isPrepQuiz);
  }

  private proceedToNextLevel(level: string) {
    this.retakeTest(level);
  }

  private onBackButtonPressAndroid = () => {
    this.props.navigation.dismiss();
    return true;
  };

  private renderScoreIcons(prepQuiz, level, stars, prevStars, skipRender) {
    return (
      <View style={{ flex: 1 }}>
        <LearningAnimScore
          level={level}
          stars={stars}
          prevStars={!skipRender ? prevStars : stars}
        />
      </View>
    );
  }

  private renderPrepQuizResult() {
    const {
      reviewData,
      getTextFromCMS,
      prepModuleScore,
      currentPrepQuizModuleScore
    } = this.props;

    const icon = this.props.moduleIcon;

    let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
    if (typeof icon.src == 'undefined') url = 'placeholder_module';
    if (icon == 'infection') url = 'infection_prevention';

    const rightAnswers = reviewData.filter((item) => {
      if (item.answerScore === 1) {
        return true;
      }
      return false;
    });

    let resultScore = prepModuleScore;
    if (reviewData.length === rightAnswers.length && resultScore < 11) {
      resultScore = resultScore - 1;
    }

    const progress = currentPrepQuizModuleScore % 4;
    const level = 3;

    let comment = '';
    let btn2 = (
      <FramedButton
        onPress={() => this.retakeTest(level.toString())}
        label={getTextFromCMS('lp:retake_test', 'retake test')}
        icon={require('../../../img/learning_icons/retake.png')}
      />
    );

    let level_completed = getTextFromCMS(
      'lp:module_completed',
      'module completed'
    );

    if (progress == 0)
      comment = getTextFromCMS(
        'lp:module_message_title_0_stars',
        'room for improvement'
      );
    else if (progress == 1)
      comment = getTextFromCMS('lp:module_message_title_1_stars', 'keep going');
    else if (progress == 2)
      comment = getTextFromCMS(
        'lp:module_message_title_2_stars',
        'almost there'
      );
    else if (progress == 3) {
      comment = getTextFromCMS('lp:module_message_title_3_stars', 'excellent!');
    }

    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
          padding: 20,
          borderTopColor: ColorTheme.SEPARATOR,
          borderTopWidth: 1
        }}
      >
        {currentPrepQuizModuleScore < 11 ? (
          <View style={{ marginBottom: 24 }}>
            <AppText
              style={{
                textAlign: 'center',
                fontWeight: '500',
                marginBottom: 12
              }}
            >
              {comment}
            </AppText>
            <AppText style={{ textAlign: 'center', fontSize: 14 }}>
              {getTextFromCMS('lp:quiz_result_text', 'you got')}
              {rightAnswers.length}
              {getTextFromCMS('lp:quiz_result_text_1', 'of')}
              {reviewData.length}
              {getTextFromCMS('lp:quiz_result_text_2', 'correct answers.')}
            </AppText>
            <AppText
              style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: level == 3 && progress == 3 ? '500' : '300',
                marginTop: 12
              }}
            >
              {progress != 3 &&
                currentPrepQuizModuleScore < 11 &&
                level_completed}
            </AppText>
          </View>
        ) : null}
        {currentPrepQuizModuleScore === 11 ? (
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
            <Image
              resizeMode={'contain'}
              source={require('../../../img/learning_icons/success.png')}
              style={{ height: 60, width: 60, marginTop: 12 }}
            />
            <View
              style={{
                marginBottom: 24,
                marginTop: 24,
                justifyContent: 'center'
              }}
            >
              <AppText
                style={{
                  textAlign: 'center',
                  fontWeight: '500',
                  marginBottom: 12
                }}
              >
                {comment}
              </AppText>
              <AppText style={{ textAlign: 'center', fontSize: 14 }}>
                {getTextFromCMS('lp:quiz_result_text', 'you got')}{' '}
                {rightAnswers.length}{' '}
                {getTextFromCMS('lp:quiz_result_text_1', 'of')}{' '}
                {reviewData.length}{' '}
                {getTextFromCMS('lp:quiz_result_text_2', 'correct answers.')}{' '}
              </AppText>
              {/* <AppText style={{ textAlign: 'center', fontSize: 14 }}>You got {rightAnswers.length} of {reviewData.length} correct answers.</AppText> */}
              <AppText
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: level == 3 && progress == 3 ? '500' : '300',
                  marginTop: 12
                }}
              >
                {progress != 3 && currentPrepQuizModuleScore < 11
                  ? null
                  : level_completed}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={{}}>
            <AppText
              style={{ margin: 12, marginTop: -20, textAlign: 'center' }}
            >
              {getTextFromCMS(
                'lp:certificate_failed_message_1',
                'you can get the information needed and train your skills for the exam, within the Home and MyLearning tab'
              )}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 12
              }}
            >
              <View
                style={{
                  width: 65,
                  height: 65,
                  backgroundColor: ColorTheme.PRIMARY,
                  borderRadius: 70 / 2,
                  alignContent: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  source={require('../../../img/nav_icons/main_selected.png')}
                  style={{ alignSelf: 'center', width: 35, height: 35 }}
                />
              </View>
              <View
                style={{
                  width: 65,
                  height: 65,
                  alignContent: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  source={require('../../../img/nav_icons/double_arrow.png')}
                  style={{
                    alignSelf: 'center',
                    width: 35,
                    height: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    tintColor: ColorTheme.PRIMARY
                  }}
                />
              </View>
              <View
                style={{
                  width: 65,
                  height: 65,
                  backgroundColor: ColorTheme.PRIMARY,
                  borderRadius: 70 / 2,
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <Image
                  source={require('../../../img/nav_icons/my_learning_selected.png')}
                  style={{ alignSelf: 'center', width: 35, height: 35 }}
                />
              </View>
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            alignItems: 'flex-end'
          }}
        >
          <FramedButton
            onPress={() => this.reviewResults()}
            label={getTextFromCMS('lp:review_results', 'review results')}
            icon={require('../../../img/learning_icons/results.png')}
          />
          {btn2}
        </View>
      </View>
    );
  }

  public render() {
    const {
      reviewData,
      getTextFromCMS,
      moduleScore,
      prevModuleScore,
      navigation,
      isPrepQuiz,
      user,
      modules,
      language
    } = this.props;

    if (!user) {
      return null;
    }

    const prepQuiz = this.props.isPrepQuiz;
    const lastCertEntry = user.profileCertificates
      ? this.props.user.profileCertificates.length - 1
      : -1;
    const profilePrepTestScores =
      lastCertEntry >= 0
        ? user.profileCertificates[lastCertEntry].profilePrepTestScores
        : {};
    const modulesForPreptest = modules.filter((m) =>
      checkIfModuleContainsEssentialQuestion(m.id, language)
    );
    const prepTestScore = getTotalScoreFromStore(
      modulesForPreptest,
      profilePrepTestScores
    );

    if (prepQuiz && prepTestScore === 100) {
      this.props.addNewCertificate(user.profileId, 0, false);
    }

    const { skipRender } = navigation.state.params;
    const rightAnswers = reviewData.filter((item) => {
      if (item.answerScore === 1) {
        return true;
      }
      return false;
    });

    const resultScore = moduleScore ? moduleScore : 0;
    let adjustedResultScore = resultScore;
    /** For certain conditions the result page render the incorrect score icons.
        We catch these here and adjust the score used for rendering. **/
    if (reviewData.length === rightAnswers.length && resultScore < 11) {
      adjustedResultScore = adjustedResultScore - 1;
    }
    const stars = adjustedResultScore % 4; //Use the result saved on the profile, and not the current result of a taken test
    // const stars = currentQuizModuleScore % 4; //Use the current result of a taken test, and not the one save on the profile
    const prevStars = prevModuleScore % 4; //Use the result saved on the profile, and not the current result of a taken test
    // const prevStars = currentQuizModuleScore % 4; //Use the current result of a taken test, and not the ond save on the profile
    const renderedLevel = getLevelToRender(adjustedResultScore); //Use the result saved on the profile, and not the current result of a taken test
    const actualLevel = getLevelFromModuleScore(resultScore);
    // let level = getLevelFromModuleScore(currentQuizModuleScore); //Use the current result of a taken test, and not the ond save on the profile

    let comment = '';
    let btn2 = (
      <FramedButton
        onPress={() => this.retakeTest(actualLevel.toString())}
        label={getTextFromCMS('lp:retake_test', 'retake test')}
        icon={require('../../../img/learning_icons/retake.png')}
      />
    );

    let keep_improving = getTextFromCMS(
      'lp:module_message_subtitle_keep_improving',
      'keep improving to unlock the next level'
    );
    let level_completed = getTextFromCMS(
      'lp:level_completed',
      'you have completed this level!'
    );
    if (stars == 0)
      comment = getTextFromCMS(
        'lp:module_message_title_0_stars',
        'room for improvement'
      );
    else if (stars == 1)
      comment = getTextFromCMS('lp:module_message_title_1_stars', 'keep going');
    else if (stars == 2)
      comment = getTextFromCMS(
        'lp:module_message_title_2_stars',
        'almost there'
      );
    else if (stars == 3) {
      comment = getTextFromCMS('lp:module_message_title_3_stars', 'excellent!');
      if (renderedLevel < 3) {
        btn2 = (
          <FramedButton
            onPress={() => this.proceedToNextLevel(actualLevel.toString())}
            label={getTextFromCMS(
              'lp:proceed_next_level',
              'proceed to next level'
            )}
            icon={require('../../../img/learning_icons/arrow-right-red-1.png')}
          />
        );
      } else {
        level_completed = getTextFromCMS(
          'lp:module_completed',
          'module completed'
        );
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
        <AnalyticsTracker
          eventType={isPrepQuiz ? 'prepTestResult' : 'klpResult'}
          eventData={`:${this.props.moduleKey}:${renderedLevel}:${stars}:${
            this.props.moduleScore
          }}:`}
        />
        {!prepQuiz
          ? this.renderScoreIcons(
              prepQuiz,
              renderedLevel,
              stars,
              prevStars,
              skipRender
            )
          : null}
        {prepQuiz ? (
          this.renderPrepQuizResult()
        ) : (
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              padding: 16,
              borderTopColor: ColorTheme.SEPARATOR,
              borderTopWidth: 1
            }}
          >
            <View style={{ marginBottom: 24, marginTop: 24 }}>
              <AppText
                style={{
                  textAlign: 'center',
                  fontWeight: '500',
                  marginBottom: 12
                }}
              >
                {comment}
              </AppText>
              {/* <AppText style={{ textAlign: 'center', fontSize: 14 }}>You got {rightAnswers.length} of {reviewData.length} correct answers.</AppText> */}
              <AppText style={{ textAlign: 'center', fontSize: 14 }}>
                {getTextFromCMS('lp:quiz_result_text', 'you got')}{' '}
                {rightAnswers.length}{' '}
                {getTextFromCMS('lp:quiz_result_text_1', 'of')}{' '}
                {reviewData.length}{' '}
                {getTextFromCMS('lp:quiz_result_text_2', 'correct answers.')}
              </AppText>
              <AppText
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: renderedLevel == 3 && stars == 3 ? '500' : '300'
                }}
              >
                {stars != 3 && moduleScore < 11
                  ? keep_improving
                  : level_completed}
              </AppText>
            </View>
            <FramedButton
              onPress={() => this.reviewResults()}
              label={getTextFromCMS('lp:review_results', 'review results')}
              icon={require('../../../img/learning_icons/results.png')}
            />
            {btn2}
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  console.log('MapStateToProps QuizResult', props.navigation.state.params);
  const { prepQuiz, title, icon } = props.navigation.state.params;
  const {
    contentByLanguage,
    selectedLang,
    currentUser,
    userProfiles,
    learningReducer
  } = state;
  const { screen, modules } = contentByLanguage[selectedLang];
  const user: UserProfile = userProfiles[currentUser.currentUser];
  const moduleScore = getModuleScore(learningReducer.currentModule, user);
  const prepModuleScore = getPrepTestModuleScore(
    learningReducer.currentModule,
    user
  );
  const currentPrepQuizModuleScore = learningReducer.currentPrepQuizModuleScore;
  const currentQuizModuleScore = learningReducer.currentQuizModuleScore;
  return {
    moduleIcon: icon,
    isPrepQuiz: prepQuiz,
    title: title,
    reviewData: state.learningReducer.currentQuizQuestions,
    moduleKey: state.learningReducer.currentModule,
    moduleScore: moduleScore,
    prepModuleScore: prepModuleScore,
    currentPrepQuizModuleScore: currentPrepQuizModuleScore,
    currentQuizModuleScore: currentQuizModuleScore,
    prevModuleScore: state.learningReducer.prevModuleScore,
    getTextFromCMS: (screenKey, fallback) =>
      getTextFromCMS(screen, screenKey, fallback),
    user,
    state,
    currentUser: currentUser.currentUser,
    modules,
    language: contentByLanguage[selectedLang]
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  startQuiz: (level, moduleKey, preparePrepQuiz) => {
    if (preparePrepQuiz) {
      analytics.event('prepTestStart', `:${moduleKey}:`);
    } else {
      analytics.event('klpStart', `:${moduleKey}:`);
    }
    dispatch(
      startQuiz({
        level: level,
        moduleKey: moduleKey,
        preparePrepQuiz: preparePrepQuiz
      })
    );
  },
  retractQuizIdx: () => {
    dispatch(retractQuizIdx());
  },
  addNewCertificate: (profileId, score, passed) => {
    dispatch(addNewCertificate(profileId, score, passed));
  },
  resetQuizIndex: () => {
    dispatch(setQuizIdx(0));
  }
});

function getModuleScore(moduleKey: string, user: UserProfile): number {
  if (!user) {
    return 0;
  }

  const profileModuleScores: { [key: string]: number } =
    user.profileModuleScores;
  return profileModuleScores ? profileModuleScores[moduleKey] : 0;
}

function getPrepTestModuleScore(moduleKey: string, user: UserProfile): number {
  if (!user) {
    return 0;
  }

  const lastCertEntry = user.profileCertificates.length - 1;

  const profileModuleScores =
    user.profileCertificates[lastCertEntry].profilePrepTestScores;
  return profileModuleScores && profileModuleScores[moduleKey]
    ? profileModuleScores[moduleKey]
    : 0;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizResultScreen);
