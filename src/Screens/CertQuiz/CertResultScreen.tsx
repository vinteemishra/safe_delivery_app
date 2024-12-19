import * as React from 'react';
import { View, ScrollView, BackHandler, Image, StyleSheet } from 'react-native';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { StoreState, UserProfile } from '../../Reducers/reducers';
import {
  getTextFromCMS as getText,
  getContentByLanguageProperty
} from '../../Utils/helpers';
import ColorTheme from '../../Constants/ColorTheme';
import AppText from '../../Components/AppText';
import FramedButton from '../../Components/FramedButton';
import { setProfileCertificate } from '../../Actions/actions';
import { NavigationStackProp } from 'react-navigation-stack';
import AnalyticsTracker from '../../Components/AnalyticsTracker';
import { getArrayOfQuestion } from '../../Sagas/learningSaga';
import * as CONSTANTS from '../../Constants/Constants';
import ContentContainer from '../../Components/ContentContainer';

import { openModal } from '../../Actions/modalActions';
import { Language } from '../../Reducers/contentReducer';

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}
interface PropsFromState {
  currentScore: number;
  currentDeadly: number;
  passRate: number;
  deadlyLimit: number;
  user: UserProfile;
  certificateId: string;
  getTextFromCMS(screenKey: string, fallback: string): string;
  screen: { [key: string]: string };
  profileId: string;
  language: Language;
  maxScore: number;
  certificates: any;
}

interface PropsFromDispatch {
  openModal(modalType: string, modalProps?: object): void;
}

type Props = PropsFromState & OwnProps & PropsFromDispatch;
class CertResultScreen extends React.Component<Props> {
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
    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove();
    }
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  }

  private onBackButtonPressAndroid = () => {
    this.props.navigation.dismiss();
    return true;
  };

  private claim() {
    const certificate = getContentByLanguageProperty(
      this.props.certificates,
      this.props.language
    )[0];
    this.props.openModal('CLAIM_CERTIFICATE', {
      disableFloatingCloseButton: false,
      disableOnBackDropPress: false,
      user: this.props.user || undefined,
      certId: certificate.id
    });
  }

  private renderPassed() {
    const { getTextFromCMS, user } = this.props;

    const lastCertEntry = user.profileCertificates.length - 1;
    const roundedScore = Math.round(
      user.profileCertificates[lastCertEntry].score
    );

    return (
      <View style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
        <ScrollView>
          <AppText
            style={{
              fontWeight: '500',
              fontSize: 20,
              marginTop: 20,
              textAlign: 'center'
            }}
          >
            {getTextFromCMS('lp:congratulations', 'congratulations!')}
          </AppText>
          <AppText
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
              textAlign: 'center'
            }}
          >
            {getTextFromCMS(
              'lp:your_certificate_score',
              'you got a total score of:'
            )}
          </AppText>
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 2,
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
              textAlign: 'center'
            }}
          >
            {/* {currentScore}% */}
            {roundedScore}%
          </AppText>
          <AppText
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
              marginBottom: 20,
              textAlign: 'center'
            }}
          >
            {getTextFromCMS(
              'lp:certificate_unlocked_message',
              'you have unlocked the Safe Delivery Champion Certificate.'
            )}
          </AppText>
          <FramedButton label={'Next'} onPress={() => this.claim()} />
        </ScrollView>
      </View>
    );
  }

  private renderFailed(successOnDeadly, successOnScore, currentScore) {
    const { user, getTextFromCMS } = this.props;

    let failed_on_deadly = getTextFromCMS(
      'lp:certificate_failed_deadly_message',
      'unfortunately you had too many deadly answers and can therefore not pass'
    );
    let failed_on_rating = getTextFromCMS(
      'lp:certificate_failed_message',
      'you did not score well enough to earn the Safe Delivery Certificate'
    );

    const lastCertEntry = user.profileCertificates.length - 1;
    const roundedScore =
      user.profileCertificates[lastCertEntry].passed === true
        ? Math.round(user.profileCertificates[lastCertEntry].score)
        : Math.round(currentScore);

    return (
      <ContentContainer>
        <ScrollView contentContainerStyle={styles.card}>
          <View
            style={[
              styles.shadowSeperator,
              {
                backgroundColor: ColorTheme.SECONDARY,
                borderColor: ColorTheme.SEPARATOR
              }
            ]}
          >
            <AppText
              style={{
                fontWeight: '500',
                fontSize: 20,
                marginTop: 20,
                textAlign: 'center'
              }}
            >
              {getTextFromCMS('lp:certificate_failed_title', 'unfortunate')}
            </AppText>
            {!successOnDeadly ? null : (
              <View>
                <AppText
                  style={{
                    marginRight: 20,
                    marginLeft: 20,
                    marginTop: 10,
                    textAlign: 'center'
                  }}
                >
                  {getTextFromCMS(
                    'lp:your_certificate_score',
                    'you got a total score of:'
                  )}
                </AppText>
                <AppText
                  style={{
                    fontSize: ColorTheme.FONT_SIZE * 2,
                    marginRight: 20,
                    marginLeft: 20,
                    marginTop: 10,
                    textAlign: 'center'
                  }}
                >
                  {/* {currentScore}% */}
                  {roundedScore}%
                </AppText>
              </View>
            )}
            {!successOnDeadly || !successOnScore ? (
              <AppText
                style={{
                  marginLeft: 12,
                  marginRight: 12,
                  marginBottom: 20,
                  marginTop: 10,
                  textAlign: 'center'
                }}
              >
                {' '}
                {!successOnDeadly ? failed_on_deadly : failed_on_rating}
              </AppText>
            ) : null}
          </View>
          <View style={[styles.viewStyle, { marginTop: 8 }]}>
            <AppText
              style={{ margin: 12, textAlign: 'center', fontWeight: 'bold' }}
            >
              {getTextFromCMS(
                'lp:certificate_failed_title_1',
                'keep going at it'
              )}
            </AppText>
            <AppText style={{ margin: 12, marginTop: -4, textAlign: 'center' }}>
              {getTextFromCMS(
                'lp:certificate_failed_message_1',
                'you can get the information needed and train your skills for the exam, within the Home and MyLearning tab'
              )}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 12,
                marginBottom: 20
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
                  justifyContent: 'center'
                }}
              >
                <Image
                  source={require('../../../img/nav_icons/my_learning_selected.png')}
                  style={{ alignSelf: 'center', width: 35, height: 35 }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ContentContainer>
    );
  }

  public render() {
    const {
      currentDeadly,
      currentScore,
      deadlyLimit,
      passRate,
      certificateId,
      maxScore
    } = this.props;

    const successOnDeadly = currentDeadly < deadlyLimit;
    const successOnScore = currentScore >= passRate;
    const passed = successOnDeadly && successOnScore;

    let score = Math.round((maxScore * currentScore) / 100);

    return (
      <View style={{ flex: 1 }}>
        <AnalyticsTracker
          eventType={'certDone'}
          eventData={`:${certificateId}:${score}:${maxScore}:${currentScore}:${passRate}:${passed}:${currentDeadly}:${deadlyLimit}:`}
        />
        {passed
          ? this.renderPassed()
          : this.renderFailed(successOnDeadly, successOnScore, currentScore)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadowSeperator: {
    // backgroundColor: ColorTheme.TERTIARY,
    borderColor: ColorTheme.SEPARATOR,
    ...CONSTANTS.cardShadowStyle
  },
  card: {
    backgroundColor: ColorTheme.TERTIARY,
    borderColor: ColorTheme.SEPARATOR,
    borderWidth: 1,
    borderBottomWidth: 0,
    ...CONSTANTS.cardShadowStyle
  },
  viewStyle: {
    backgroundColor: ColorTheme.SECONDARY,
    borderColor: ColorTheme.SEPARATOR
  }
});

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => {
  const {
    contentByLanguage,
    selectedLang,
    learningReducer,
    userProfiles,
    currentUser
  } = state;
  const {
    currentCertDeadly,
    currentCertScore,
    certPassRate,
    deadly
  } = learningReducer;
  const { screen, certificates } = contentByLanguage[selectedLang];
  const language = contentByLanguage[selectedLang];
  const profileId = currentUser.currentUser;
  return {
    maxScore: getArrayOfQuestion(learningReducer.currentCertificateQuestions)
      .length,
    currentScore: currentCertScore,
    currentDeadly: currentCertDeadly,
    passRate: certPassRate,
    deadlyLimit: deadly,
    user: userProfiles[profileId],
    profileId: profileId,
    certificateId: state.learningReducer.currentCertificateQuiz,
    getTextFromCMS: (screenKey, fallback) => {
      return getText(screen, screenKey, fallback);
    },
    screen: screen,
    language,
    certificates
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => {
  return {
    openModal: (modalType: any, modalProps?: any) => {
      dispatch(openModal({ modalType, modalProps }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CertResultScreen);
