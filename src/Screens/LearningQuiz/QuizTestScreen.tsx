import * as React from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import LearningPoint from '../../Components/LearningPoint';
import _ from 'lodash';
import {
  getTextFromCMS,
  getArrayItem,
  getTotalScoreFromStore
} from '../../Utils/helpers';
import { StoreState } from '../../Reducers/reducers';
import { NavigationStackProp } from 'react-navigation-stack';
import FramedButton from '../../Components/FramedButton';
import { LearningPointEntry } from '../../Reducers/learningReducer';
import {
  advanceQuizIdx,
  setQuizAnswer,
  finishQuiz,
  finishPrepQuiz
} from '../../Actions/learningActions';
import ColorTheme from '../../Constants/ColorTheme';
import { analytics } from '../../Utils/analytics';
import { getLevelFromModuleScore } from '../../Utils/helpers';

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

interface PropsFromState {
  listOfQuestions: Array<LearningPointEntry>;
  screen: any;
  imagesInLanguage: Array<{ id: string; src: string; version: number }>;
  getTextFromCMS(screenKey: string, fallback: string): string;
  quizIdx;
  user;
  state;
  moduleKey: string;
  learningReducer: any;
  keyLearningPoints: string;
  learningModuleScore: number;
  modules: any;
}

interface PropsFromDispatch {
  advanceQuizIdx(): void;
  // setQuizAnswer(moduleKey, idx: number, answer: any, clicks: number, score: number, listOfQuestions: Array<LearningPointEntry>, isPrepQuiz?: boolean): void;
  setQuizAnswer(idx: number, answer: any, score: number): void;
  finishQuiz(): void;
  finishPrepQuiz(lastCertEntry: number, prepTestScore: number): void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

interface State {
  clicks: number;
  answer: any;
  answerScore: number;
  idx: number;
  buttonDisabled: boolean;
}

const INITIAL_STATE = {
  clicks: 0,
  answer: null,
  answerScore: 0
};

class QuizTestScreen extends React.Component<Props, State> {
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
    this.state = {
      ...INITIAL_STATE,
      idx: this.props.quizIdx,
      buttonDisabled: true
    };
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

  private onBackButtonPressAndroid = () => {
    this.props.navigation.dismiss();
    return true;
  };

  private answerLearningPoint(
    moduleKey: string,
    idx: number,
    answer: any,
    answerScore: number,
    clicks: number,
    listOfQuestions: Array<LearningPointEntry>,
    user: any,
    prepQuiz: boolean
  ) {
    const question_count = listOfQuestions.length;
    const icon = this.props.navigation.getParam('icon');

    const lastCertEntry = user.profileCertificates.length - 1;
    const PrepTestlearningModuleScore =
      user.profileCertificates[lastCertEntry].profilePrepTestScores;
    const prepTestScore = getTotalScoreFromStore(
      this.props.modules,
      PrepTestlearningModuleScore
    );

    const level = prepQuiz
      ? 3
      : getLevelFromModuleScore(this.props.learningModuleScore); //REVIEW
    const keyLearningPoint = this.props.keyLearningPoints[level]; //REVIEW - Sending level 3 question as analytics instead of prepTest questions for PrepTests

    // this.props.setQuizAnswer(moduleKey, idx, answer, clicks, answerScore, listOfQuestions, prepQuiz);
    this.props.setQuizAnswer(idx, answer, answerScore);
    analyticsTrackAnswer(
      moduleKey,
      listOfQuestions[idx],
      answer,
      clicks,
      answerScore,
      prepQuiz,
      keyLearningPoint
    ); //Track the answers

    if (this.state.idx + 1 === question_count) {
      this.props.navigation.push('QuizResult', {
        title: this.props.navigation.state.params.title,
        prepQuiz: prepQuiz,
        prepTestScore: prepTestScore,
        icon: icon
      });
      // this.props.finishQuiz();
      prepQuiz
        ? this.props.finishPrepQuiz(lastCertEntry, prepTestScore)
        : this.props.finishQuiz();
    } else {
      this.props.advanceQuizIdx();
      this.props.navigation.push('QuizTest', {
        title: this.props.navigation.state.params.title,
        preparePrepQuiz: prepQuiz,
        icon: icon
      });
    }
  }

  public render() {
    const {
      listOfQuestions,
      screen,
      imagesInLanguage,
      navigation,
      user
    } = this.props;
    const { answer, idx } = this.state;
    const preparePrepQuiz = this.props.navigation.getParam('preparePrepQuiz');

    if (!listOfQuestions[idx]) {
      return null;
    }

    const { quizzType, answers, image, question } = listOfQuestions[idx];

    const imageObj = image ? getArrayItem(image, imagesInLanguage) : undefined;
    const imageSrc =
      imageObj !== undefined ? imageObj.src : navigation.state.params.icon.src;

    let _disabled = true;
    if (quizzType === 'oneCorrect') {
      _disabled =
        this.state.answer === null && _.isEmpty(this.state.answer)
          ? true
          : false;
    } else if (quizzType === 'severalCorrect') {
      _disabled =
        this.state.answer !== null &&
        (typeof answer === 'object' && !_.isEmpty(this.state.answer))
          ? false
          : true;
    } else {
      _disabled =
        this.state.answer === null && _.isEmpty(this.state.answer)
          ? true
          : false;
    }

    const footerButton = () => (
      <View style={{ backgroundColor: ColorTheme.TERTIARY }}>
        <View>
          <View style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }} />
          <FramedButton
            disabled={_disabled}
            label={this.props.getTextFromCMS('next', 'next')}
            onPress={() =>
              this.answerLearningPoint(
                this.props.moduleKey,
                this.state.idx,
                this.state.answer,
                this.state.answerScore,
                this.state.clicks,
                listOfQuestions,
                user,
                preparePrepQuiz
              )
            }
            activeOpacity={_disabled ? 1 : 0.2}
          />
        </View>
      </View>
    );

    const learningPoint = () => (
      <LearningPoint
        key={`lp_${idx}`}
        screen={screen}
        answer={answer}
        questionIdx={idx + 1}
        maxQuestions={listOfQuestions.length}
        description={question}
        engineType={quizzType}
        engineData={answers}
        image={imageSrc}
        onChangeAnswer={(answer, score) => {
          let clicks = this.state.clicks + 1;
          this.setState({ answer: answer, answerScore: score, clicks });
        }}
      />
    );

    if (quizzType == 'chooseOrder') {
      return (
        <View key={`view_${idx}`} style={{ flex: 1 }}>
          {learningPoint()}
          {footerButton()}
        </View>
      );
    } else {
      return (
        <ScrollView
          key={`scll_${idx}`}
          alwaysBounceVertical={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {learningPoint()}
          {footerButton()}
        </ScrollView>
      );
    }
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  const {
    learningReducer,
    contentByLanguage,
    selectedLang,
    currentUser,
    userProfiles
  } = state;
  const { screen, images, modules } = contentByLanguage[selectedLang];
  // const { keyLearningPoints } = contentByLanguage[selectedLang][state.learningReducer.currentModule];

  //We might have seen a crash with the above line. So there is now intruduced a check.
  let keyLearningPoints = undefined;
  if (state.learningReducer.currentModule) {
    keyLearningPoints =
      contentByLanguage[selectedLang][state.learningReducer.currentModule]
        .keyLearningPoints;
  }

  let user = null;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }
  let learningModuleScore =
    user &&
    user.profileModuleScores &&
    learningReducer.currentModule &&
    user.profileModuleScores[learningReducer.currentModule]
      ? user.profileModuleScores[learningReducer.currentModule]
      : 0;

  return {
    moduleKey: learningReducer.currentModule,
    user,
    imagesInLanguage: images,
    screen: screen,
    listOfQuestions: learningReducer.currentQuizQuestions,
    quizIdx: learningReducer.quizIdx,
    state,
    learningReducer,
    getTextFromCMS: (screenKey, fallback) =>
      getTextFromCMS(screen, screenKey, fallback),
    keyLearningPoints,
    learningModuleScore,
    modules
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch,
  props
) => ({
  advanceQuizIdx: () => {
    dispatch(advanceQuizIdx());
  },
  setQuizAnswer: (idx, answer, score) => {
    dispatch(setQuizAnswer({ idx, answer, score }));
  },
  finishQuiz: () => {
    dispatch(finishQuiz());
  },
  finishPrepQuiz: (lastCertEntry, prepTestScore) => {
    dispatch(finishPrepQuiz({ lastCertEntry, prepTestScore }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizTestScreen);

function analyticsTrackAnswer(
  moduleKey,
  question: LearningPointEntry,
  answer: any,
  clicks: number,
  answerScore: number,
  isPrepQuiz: boolean,
  keyLearningPoint: string
) {
  let answers = question.answers;

  const clearText = (text) => {
    if (!text) {
      return 'N/A';
    }
    return text.replace(/\,/g, '').replace(/:/g, '');
  };

  let answerText = '';
  // Handle numbers (single choice)
  if (typeof answer === 'number') {
    answerText += answers[answer].value.replace(/\,/g, '');
  }
  // Handle arrays (order questions)
  else if (Object.prototype.toString.call(answer) === '[object Array]') {
    for (var ans of answer) {
      // answerText += ", " + clearText(answers[ans].value)
      answerText += ', ' + clearText(ans.value);
    }
  }
  // Handle objects (multiple choice)
  else {
    for (let ans in answer) {
      if (answer[ans]) {
        answerText += ', ' + clearText(answers[ans].value);
      }
    }
  }
  if (answerText.startsWith(',')) {
    answerText = answerText.substr(2);
  }
  const analyticsString =
    ':' +
    moduleKey +
    ':' +
    keyLearningPoint +
    ':' +
    question.id +
    ':' +
    answerText +
    ':' +
    clicks +
    ':' +
    answerScore +
    ':';

  if (isPrepQuiz) {
    analytics.event('prepTestAnswer', analyticsString);
  } else {
    analytics.event('klpAnswer', analyticsString);
  }
}
