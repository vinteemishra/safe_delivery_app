import * as React from "react";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { StoreState } from "../../Reducers/reducers";
import { Case } from "../../Reducers/learningReducer";
import { ScrollView, View, BackHandler, Animated } from "react-native";
import ColorTheme from "../../Constants/ColorTheme";
import { getTextFromCMS, getArrayItem } from "../../Utils/helpers";
import FramedButton from "../../Components/FramedButton";
import LearningPoint from "../../Components/LearningPoint";
import {
  setCertificateAnswer,
  advanceQuizIdx,
  advanceCaseIdx,
  finishCertificateQuiz,
} from "../../Actions/learningActions";
import RightHeaderButton from "../../Components/RightHeaderButton";
import LightBoxModal from "../../Components/LightBoxModal";
import DismissQuiz from "../../Components/DismissQuiz";
import { analytics } from "../../Utils/analytics";
import { NavigationStackProp } from "react-navigation-stack";
import {
  getArrayOfQuestion,
  calculateCertificateResult,
} from "../../Sagas/learningSaga";
import _ from "lodash";

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

interface PropsFromState {
  certificateCases: Array<Case>;
  questionIdx: number;
  caseIdx: number;
  imagesInLanguage: Array<{ id: string; src: string; version: number }>;
  getTextFromCMS(screenKey: string, fallback: string): string;
  screen: { [key: string]: string };
  certificateId: string;
  currentDeadly: any;
}

interface PropsFromDispatch {
  setCertificateAnswer(
    caseIdx: number,
    questionIdx: number,
    answer: any,
    score: number
  ): void;
  advanceQuestionIdx(): void;
  advanceCaseIdx(): void;
  finishCertificateQuiz(): void;
}

interface State {
  clicks: number;
  answer: any;
  answerScore: number;
  showDismiss: boolean;
  opacityValue: Animated.Value;
  buttonDisabled: boolean;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class CertTest extends React.Component<Props, State> {
  static navigationOptions = (props) => ({
    headerRight: (
      <RightHeaderButton
        source={require("../../../img/notification_message/close.png")}
        onPress={() => props.navigation.state.params.dismissQuiz()}
      />
    ),
  });
  private didFocusSubscription;
  private willBlurSubscription;
  constructor(props: Props) {
    super(props);
    this.state = {
      answer: null,
      clicks: 0,
      answerScore: 0,
      showDismiss: false,
      opacityValue: new Animated.Value(0),
      buttonDisabled: true,
    };
    this.dismissQuiz = this.dismissQuiz.bind(this);
  }

  private dismissQuiz() {
    this.setState({ showDismiss: true });
    return true;
  }

  public componentDidMount() {
    console.log("componentDidMount");
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        );
      }
    );
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      (payload) => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        );
      }
    );
    this.props.navigation.setParams({
      // title: this.props.screen.certificate ? this.props.screen.certificate : 'Certification test',
      dismissQuiz: this.dismissQuiz,
    });
  }

  public componentWillUnmount() {
    console.log("componentWillUnmount");
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  private onBackButtonPressAndroid = () => {
    this.dismissQuiz();
    return true;
  };

  private onNext(caseIdx, questionIdx, numberOfCases, numberOfQuestions) {
    this.props.setCertificateAnswer(
      caseIdx,
      questionIdx,
      this.state.answer,
      this.state.answerScore
    );
    const caze = this.props.certificateCases[caseIdx];
    const question = caze.questions[questionIdx];
    const IS_CURRENT_SCORE_DEADLY = this.state.answerScore < 0;
    const currentDeadly = IS_CURRENT_SCORE_DEADLY
      ? this.props.currentDeadly + 1
      : this.props.currentDeadly;
    analyticsTrackAnswer(
      question,
      this.state.answer,
      this.state.answerScore,
      this.state.clicks,
      caze.id,
      this.props.certificateId,
      currentDeadly
    );
    if (questionIdx < numberOfQuestions - 1) {
      this.props.navigation.replace("CertTest");
      this.props.advanceQuestionIdx();
    } else if (caseIdx < numberOfCases - 1) {
      this.props.advanceCaseIdx();
      this.props.navigation.replace("CertCase");
    } else {
      this.props.navigation.replace("CertResult");
      this.props.finishCertificateQuiz();
    }
  }

  public render() {
    const { answer } = this.state;
    const {
      certificateCases,
      caseIdx,
      questionIdx,
      imagesInLanguage,
      getTextFromCMS,
      screen,
    } = this.props;
    const { answers, question, quizzType, image } = certificateCases[
      caseIdx
    ].questions[questionIdx];
    const imageObj = image ? getArrayItem(image, imagesInLanguage) : undefined;
    const imageSrc = imageObj !== undefined ? imageObj.src : null;

    let _disabled = true;
    if (quizzType === "oneCorrect") {
      _disabled =
        this.state.answer === null && _.isEmpty(this.state.answer)
          ? true
          : false;
    } else if (
      quizzType === "severalCorrect" ||
      quizzType === "severalCorrectWithResult"
    ) {
      _disabled =
        this.state.answer !== null &&
        (typeof answer === "object" && !_.isEmpty(this.state.answer))
          ? false
          : true;
    } else {
      _disabled =
        this.state.answer === null && _.isEmpty(this.state.answer)
          ? true
          : false;
    }
    console.log("CertTestRender");
    return (
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={{
          backgroundColor: ColorTheme.SECONDARY,
          flexGrow: 1,
        }}
      >
        <LearningPoint
          key={`lp_${questionIdx}`}
          screen={screen}
          answer={answer}
          questionIdx={questionIdx + 1}
          maxQuestions={certificateCases[caseIdx].questions.length}
          caseIdx={caseIdx + 1}
          maxCases={certificateCases.length}
          description={question}
          engineType={quizzType}
          engineData={answers}
          image={imageSrc}
          onChangeAnswer={(answer, score) => {
            let clicks = this.state.clicks + 1;
            this.setState({ answer: answer, answerScore: score, clicks });
          }}
        />
        <View style={{ backgroundColor: ColorTheme.TERTIARY }}>
          <FramedButton
            // disabled={this.state.answer !== null && (typeof answer === "object" && !_.isEmpty(this.state.answer)) ? false : true}
            disabled={_disabled}
            label={getTextFromCMS("next", "next")}
            onPress={() =>
              this.onNext(
                caseIdx,
                questionIdx,
                certificateCases.length,
                certificateCases[caseIdx].questions.length
              )
            }
            activeOpacity={_disabled ? 1 : 0.2}
          />
        </View>

        <LightBoxModal
          floatingCloseButtonVisible={true}
          visible={this.state.showDismiss}
          onRequestClose={() => this.setState({ showDismiss: false })}
          closeText={getTextFromCMS("close", "close")}
        >
          <DismissQuiz
            message={getTextFromCMS(
              "lp:quitting_test_warning",
              "you are about to quit the test. All progress on this quiz will be lost"
            )}
            header={getTextFromCMS("lp:leave", "leave")}
            confirmLabel={getTextFromCMS("lp:leave", "leave")}
            confirmDismiss={() => {
              this.setState({ showDismiss: false }),
                setTimeout(() => {
                  this.props.navigation.navigate("CertificateCentralScreen", {
                    title: this.props.getTextFromCMS(
                      "lp:certificate_center_title",
                      "certification center"
                    ),
                  });
                }, 350);
            }}
          />
        </LightBoxModal>
      </ScrollView>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  const { contentByLanguage, selectedLang, learningReducer } = state;
  const language = contentByLanguage[selectedLang];
  const { images, screen } = language;
  const temp = getArrayOfQuestion(learningReducer.currentCertificateQuestions);
  const currentDeadly = calculateCertificateResult(temp);
  return {
    certificateCases: learningReducer.currentCertificateQuestions,
    certificateId: learningReducer.currentCertificateQuiz,
    questionIdx: learningReducer.quizIdx,
    currentDeadly: currentDeadly.deadly,
    caseIdx: learningReducer.caseIdx,
    imagesInLanguage: images,
    screen: screen,
    getTextFromCMS: (screenKey, fallback) =>
      getTextFromCMS(screen, screenKey, fallback),
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  setCertificateAnswer: (caseIdx, questionIdx, answer, score) => {
    dispatch(setCertificateAnswer({ caseIdx, questionIdx, answer, score }));
  },
  advanceQuestionIdx: () => {
    dispatch(advanceQuizIdx());
  },
  advanceCaseIdx: () => {
    dispatch(advanceCaseIdx());
  },
  finishCertificateQuiz: () => {
    dispatch(finishCertificateQuiz());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CertTest);

function analyticsTrackAnswer(
  question,
  answer,
  answerScore,
  clicks,
  caseId,
  certificateId,
  currentDeadly
) {
  // let { answer, answerScore, caseIdx, questionIdx, clicks } = this.state;

  // let caze = this.certificate.cases[caseIdx];
  // let prevQuestion = caze.questions[questionIdx - 1];
  if (!question) {
    return;
  }

  let answers = question.answers;

  const clearText = (text) => {
    if (!text) {
      return "N/A";
    }
    return text.replace(/\,/g, "").replace(/:/g, "");
  };

  let answerText = "";
  // Handle numbers (single choice)
  if (typeof answer === "number") {
    answerText += answers[answer].value.replace(/\,/g, "");
  }
  // Handle arrays (order questions)
  else if (Object.prototype.toString.call(answer) === "[object Array]") {
    for (let ans of answer) {
      answerText += ", " + clearText(answers[ans].value);
    }
  }
  // Handle objects (multiple choice)
  else {
    for (let ans in answer) {
      if (answer[ans]) {
        answerText += ", " + clearText(answers[ans].value);
      }
    }
  }
  if (answerText.startsWith(",")) {
    answerText = answerText.substr(2);
  }
  const analyticsString =
    ":" +
    certificateId +
    ":" +
    caseId +
    ":" +
    question.id +
    ":" +
    answerScore +
    ":" +
    answerText +
    ":" +
    clicks +
    ":" +
    currentDeadly +
    ":";
  analytics.event("certAnswer", analyticsString);
}
