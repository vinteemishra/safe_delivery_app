import * as React from 'react';
import { View, ScrollView, Animated, BackHandler, Alert } from 'react-native';
import AppText from '../../Components/AppText';
import { NavigationStackProp } from 'react-navigation-stack';
import { MapStateToProps, connect, MapDispatchToProps } from 'react-redux';
import { StoreState } from '../../Reducers/reducers';
import { LearningPointEntry } from '../../Reducers/learningReducer';
import LearningPoint from '../../Components/LearningPoint';
import { getArrayItem, getTextFromCMS } from '../../Utils/helpers';
import ColorTheme from '../../Constants/ColorTheme';
import { advanceQuizIdx, retractQuizIdx } from '../../Actions/learningActions';
import FramedButton from '../../Components/FramedButton';
import fs from 'react-native-fs';
import { analytics } from '../../Utils/analytics';
import * as helpers from '../../Utils/helpers';
import { FEATURE_FLAGS, hasFeature } from '../../Utils/featureFlag';
import { openModal } from '../../Actions/modalActions';
import { setStreamWarningDisabled } from '../../Actions/actions';
import { Video } from '../../Reducers/reducers';
import { SelectiveDownloadWarningModalType } from '../../Components/Modal/SelectiveDownloadWarningModal';

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

interface PropsFromState {
  videosInModule: Array<Video>;
  reviewData: Array<LearningPointEntry>;
  quizIdx: number;
  language: any;
  screen: any;
  getTextFromCMS(screenKey: string, fallback: string): string;
  certId: string;
  isStreamingWarningDisabled: any;
  hasSelectiveDownload: boolean;
}

interface PropsFromDispatch {
  advanceQuizIdx(): void;
  retractQuizIdx(): void;
  openWarningModal(
    modalProps?: SelectiveDownloadWarningModalType['modalProps']
  ): void;
  setStreamWarningDisabled(boolean): void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

interface State {
  isAbout: boolean;
  quizIdx: number;
  hasOfflineAssets: boolean;
  hasStudyNow: boolean;
}

class QuizReviewScreen extends React.Component<Props, State> {
  private didFocusSubscription;
  private willBlurSubscription;
  animatedValue;
  frontInterpolate;
  backInterpolate;
  value;

  constructor(props: Props) {
    super(props);
    this.state = {
      isAbout: false,
      quizIdx: this.props.quizIdx,
      hasOfflineAssets: true,
      hasStudyNow: false
    };
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.goToPrevReviewHardwareBAckPress
        );
      }
    );
  }

  private async setHasOfflineAssets() {
    const { videosInModule } = this.props;
    const hasOfflineAssets = await helpers.isAllAssetsOffline(videosInModule);
    this.setState({ hasOfflineAssets });
  }

  public async componentDidUpdate(prevProps) {
    const { hasSelectiveDownload } = this.props;
    if (this.props !== prevProps && hasSelectiveDownload) {
      this.setHasOfflineAssets();
    }
  }
  public async componentDidMount() {
    const { hasSelectiveDownload } = this.props;

    this.hasStudyNow();

    if (hasSelectiveDownload) {
      await this.setHasOfflineAssets();
    }
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.goToPrevReviewHardwareBAckPress
        );
      }
    );
  }

  public componentWillUnmount() {
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  public componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });

    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    });

    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    });
  }

  private goToNextReview(idx: number, numberOfQuestions: number) {
    const icon = this.props.navigation.getParam('icon');

    if (idx < numberOfQuestions - 1) {
      this.props.advanceQuizIdx();
      this.props.navigation.push('QuizReview', {
        title: this.props.navigation.state.params.title,
        icon: icon,
        prepQuiz: this.props.navigation.getParam('prepQuiz')
      });
    } else {
      this.props.navigation.push('QuizResult', {
        title: this.props.navigation.state.params.title,
        skipRender: true,
        prepQuiz: this.props.navigation.getParam('prepQuiz'),
        icon: icon
      });
    }
  }

  private goToPrevReview() {
    this.props.retractQuizIdx();
    this.props.navigation.pop();
  }

  private goToPrevReviewHardwareBAckPress = () => {
    this.goToPrevReview();
    return true;
  };

  private goToAbout() {
    if (this.value >= 90) {
      this.setState({ isAbout: false });
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 400
        // isInteraction: false
      }).start();
    } else {
      this.setState({ isAbout: true });
      Animated.timing(this.animatedValue, {
        toValue: 180,
        duration: 400
        // isInteraction: false
      }).start();
    }
  }

  private watchVideoOnline(isOffline, videoToPlay): void {
    const func = isOffline ? helpers.srcPathOnFilesystem : helpers.srcPathOnWeb;
    let playListWithSourcePath = [videoToPlay].map((v) => {
      console.log('V: ', v);
      return { ...v, src: func(v.src) };
    });
    console.log('Playlist with source path here: ', playListWithSourcePath);

    const playVideo = () => {
      this.props.navigation.navigate('VideoPlayerScreen', {
        playlist: playListWithSourcePath,
        onBack: () => this.props.navigation.pop()
      });
    };
    if (isOffline) {
      analytics.event('startOfflineVideo', '::');
      playVideo();
    } else {
      const onPress = (showWarningStatus: boolean) => {
        analytics.event('startStream', '::');
        this.props.setStreamWarningDisabled(showWarningStatus);
        playVideo();
      };
      if (this.props.isStreamingWarningDisabled) {
        analytics.event('startStream', '::');
        playVideo();
      } else {
        analytics.event('showStreamWarning', '::');
        this.props.openWarningModal({
          onPress,
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        });
      }
    }
  }

  private hasStudyNow() {
    const { reviewData } = this.props;
    const { quizIdx } = this.state;
    const quizEntry = reviewData[quizIdx];
    let split = quizEntry.link ? quizEntry.link.split(':') : undefined;
    let prefix = split ? split[0] : '';
    let path = split ? split[1] : '';

    if (prefix === 'video') {
      let { videosInModule } = this.props;
      const retval = this.getVideo(videosInModule, path);
      if (retval === undefined) {
        this.setState({ hasStudyNow: false });
      } else {
        this.setState({ hasStudyNow: true });
      }
    } else {
      this.setState({ hasStudyNow: true });
    }
  }

  private goToStudyNow(prefix, path) {
    if (prefix == 'video') {
      const { hasOfflineAssets } = this.state;
      let { videosInModule } = this.props;
      const retval = this.getVideo(videosInModule, path);
      if (retval === undefined) {
        Alert.alert(
          'Missing Resource',
          'The learning resource you have requested is currently missing. Please try again later.',
          [
            {
              text: 'Ok',
              onPress: () => {},
              style: 'cancel'
            }
          ]
        );
      } else {
        const videoToPlay = Object.assign({}, retval);
        if (!hasOfflineAssets) {
          this.watchVideoOnline(hasOfflineAssets, videoToPlay);
        } else {
          this.watchVideoOffline(videoToPlay);
        }
      }
    } else if (
      prefix == 'action-card' ||
      prefix == 'drug' ||
      prefix == 'procedure'
    ) {
      this.goToRichText(path);
    } else {
      console.log('could not recognize link prefix');
    }
  }

  private goToReview() {
    this.goToAbout();
  }

  private getVideo(videos, path) {
    for (let i = 0; i < videos.length; i++) {
      console.log('Checking path: ', path, ' to: ', videos[i].id);

      if (path !== '' && videos[i].id.includes(path)) {
        return videos[i];
      }
    }
  }

  private watchVideoOffline(video) {
    const videoToPlay = Object.assign({}, video);
    videoToPlay.src =
      'file://' + fs.DocumentDirectoryPath + encodeURI(videoToPlay.src);
    this.props.navigation.navigate('VideoPlayerScreen', {
      playlist: [videoToPlay],
      onBack: () => {
        this.props.navigation.goBack(null);
      }
    });
  }

  private goToRichText(path) {
    if (
      this.props.language &&
      this.props.language[path] &&
      this.props.language[path].chapters
    ) {
      if (this.props.language[path].chapters.length == 1) {
        this.props.navigation.navigate('QuizReviewLearnMore', {
          title: this.props.language[path].description,
          content: this.props.language[path].chapters[0].content
        });
      } else {
        this.props.navigation.navigate('QuizReviewLearnMoreChapterOptions', {
          title: this.props.language[path].description,
          content: this.props.language[path].chapters,
          id: this.props.language[path].id,
          fromMyLearning: true
        });
      }
    } else {
      this.props.navigation.navigate('QuizReviewLearnMore', {
        title: this.props.language[path].description,
        content: this.props.language[path].content,
        id: this.props.language[path].id
      });
    }
  }

  public render() {
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: this.frontInterpolate
        }
      ]
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: this.backInterpolate
        }
      ]
    };

    const { reviewData, language, getTextFromCMS } = this.props;
    const { quizIdx, hasStudyNow } = this.state;
    const { screen } = language;
    const quizEntry = reviewData[quizIdx];

    if (!quizEntry) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AppText>An error occured</AppText>
          <AppText>Sorry for the inconvenience</AppText>
        </View>
      );
    }
    console.log('quizEntry', quizEntry);
    // let questions = this.keyLearningPoints[level][idx].questions;
    let image = quizEntry.image
      ? getArrayItem(quizEntry.image, this.props.language.images)
      : undefined;
    image =
      image !== undefined
        ? image.src
        : this.props.navigation.state.params.icon.src;
    // console.log('image', image)
    let desc = quizEntry.question;
    let engine_type = quizEntry.quizzType;
    let engine_data = quizEntry.answers;

    let comment = getTextFromCMS('lp:review_wrong', 'wrong.');
    let commentLinkText = null;
    let reviewCommentColor = ColorTheme.PRIMARY;
    if (quizEntry.answerScore == 1) {
      comment = getTextFromCMS('lp:review_correct', 'correct! good job!');
      reviewCommentColor = 'green';
    }

    if ('link' in quizEntry) {
      if (quizEntry.answerScore == 1) {
        commentLinkText = getTextFromCMS('learn_more', 'learn more');
      } else {
        commentLinkText = getTextFromCMS('lp:see_why', 'see why');
      }
    }
    let lp_count = reviewData.length;

    const learningPoint = () => (
      <LearningPoint
        screen={screen}
        questionIdx={quizIdx + 1}
        maxQuestions={lp_count}
        reviewing={true}
        reviewComment={comment}
        reviewCommentColor={reviewCommentColor}
        reviewCommentLinkText={commentLinkText}
        description={desc}
        engineType={engine_type}
        engineData={engine_data}
        image={image}
        answer={quizEntry.answer}
        onGoToAbout={() => this.goToAbout()}
        hasStudyNow={hasStudyNow}
      />
    );

    const footerButton = () => (
      <View
        style={{
          backgroundColor: ColorTheme.TERTIARY,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        {quizIdx > 0 ? (
          <FramedButton
            style={{ width: 130, height: 50 }}
            label={getTextFromCMS('back', 'back')}
            onPress={() => this.goToPrevReview()}
          />
        ) : null}
        <FramedButton
          style={{ width: quizIdx > 0 ? 130 : 200, height: 50 }}
          label={getTextFromCMS('next', 'next')}
          onPress={() => this.goToNextReview(quizIdx, reviewData.length)}
        />
      </View>
    );

    // if (engine_type == 'chooseOrder') {
    //     return (
    //         <View style={{ flex: 1 }}>
    //             {learningPoint()}
    //             {footerButton()}
    //         </View>
    //     )
    // } else {
    const renderChooseOrder = (
      <View style={{ flex: 1 }}>
        {learningPoint()}
        {footerButton()}
      </View>
    );

    const renderOther = (
      <View style={{ flex: 1 }}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {learningPoint()}
        </ScrollView>
        {footerButton()}
      </View>
    );

    let split = quizEntry.link ? quizEntry.link.split(':') : undefined;
    let prefix = split ? split[0] : '';
    let path = split ? split[1] : '';

    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            { flex: 1, backfaceVisibility: 'hidden' },
            frontAnimatedStyle
          ]}
        >
          {engine_type == 'chooseOrder' ? renderChooseOrder : renderOther}
        </Animated.View>
        <Animated.View
          pointerEvents={this.state.isAbout ? 'auto' : 'none'}
          style={[
            {
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backfaceVisibility: 'hidden'
            },
            backAnimatedStyle
          ]}
        >
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: ColorTheme.TERTIARY,
              padding: 36,
              justifyContent: 'space-between'
            }}
          >
            <View>
              <AppText
                style={{
                  fontWeight: '500',
                  fontSize: ColorTheme.FONT_SIZE * 1.2,
                  marginBottom: 20
                }}
              >
                {getTextFromCMS('lp:about_question', 'about this question')}
              </AppText>
              <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1 }}>
                {quizEntry.description}
              </AppText>
            </View>
            <View style={{ alignItems: 'center' }}>
              {path.length > 0 && hasStudyNow && (
                <FramedButton
                  onPress={() => {
                    analytics.event(
                      'learnMore',
                      `:${prefix || ''}:${path || ''}`
                    );
                    this.goToStudyNow(prefix, path);
                  }}
                  label={getTextFromCMS('lp:study_now', 'study now')}
                />
              )}
              <FramedButton
                onPress={() => this.goToReview()}
                label={getTextFromCMS('back', 'back')}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  const { selectedModule, selectedLang, contentByLanguage } = state;

  const language = contentByLanguage[selectedLang];
  const { videos, screen } = language;

  let module_videos = [];
  if (
    contentByLanguage[selectedLang] &&
    contentByLanguage[selectedLang][selectedModule]
  ) {
    module_videos = contentByLanguage[selectedLang][selectedModule].videos;
  }
  const videosInModule = helpers.getVideosInModule(module_videos, videos);

  return {
    reviewData: state.learningReducer.currentQuizQuestions,
    quizIdx: state.learningReducer.quizIdx,
    language: language,
    screen,
    getTextFromCMS: (screenKey, fallback) =>
      getTextFromCMS(screen, screenKey, fallback),
    certId: props.navigation.getParam('certId'),
    hasSelectiveDownload: hasFeature(
      FEATURE_FLAGS.SELECTIVE_DOWNLOAD,
      selectedLang
    ),
    isStreamingWarningDisabled: state.isStreamingWarningDisabled,
    videosInModule
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  advanceQuizIdx: () => {
    dispatch(advanceQuizIdx());
  },
  retractQuizIdx: () => {
    dispatch(retractQuizIdx());
  },
  openWarningModal: (modalProps) => {
    dispatch(
      openModal({
        modalType: 'SELECTIVE_DOWNLOAD_WARNING',
        modalProps: modalProps
      })
    );
  },
  setStreamWarningDisabled: (value: boolean) => {
    if (value) {
      analytics.event('disableStreamWarning', '::');
      dispatch(setStreamWarningDisabled(value));
    }
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizReviewScreen);
