import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import { connect } from 'react-redux';
import * as CONSTANTS from '../Constants/Constants';
import * as helpers from '../Utils/helpers';
import FramedButton from '../Components/FramedButton';
import UserInputField from '../Components/UserInputField';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import LightBoxModal from '../Components/LightBoxModal';
import FetchingBox from '../Components/FetchingBox';
import FetchingDoneBox from '../Components/FetchingDoneBox';
import { userLogin } from '../Utils/userLogin';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';
import { ScreenTexts } from '../Reducers/contentReducer';

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    margin: 16,
    fontSize: ColorTheme.FONT_SIZE * 1.25,
    fontWeight: '500',
    letterSpacing: 1.2
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: ColorTheme.SECONDARY,
    paddingTop: 24
  }
});

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface PropsFromState {
  mustShowOnboarding: boolean;
  getTextFromCMS(screenKey: string, fallback: string): string;
  hasLanguage(): boolean;
  screen: ScreenTexts;
}

interface PropsFromDispatch {
  dispatch(action: any): any;
  openConfirmDownload(modalProps): void;
  openConfirmDelete(modalProps): void;
  openConfirmSelectiveDownload(modalProps): void;
  openSelectiveDownloadWarning(modalProps): void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

interface State {
  emailError: string;
  email: string;
  password: string;
  fetching: boolean;
  fetchingDone: boolean;
  fetchError: string;
  detailsError: string;
  userLoginSelected: string;
  whatsAppNumber: string;
  whatsAppNumberError: string;
  confirm_password?: string;
}

class LoginScreen extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      emailError: '',
      email: '',
      password: '',
      confirm_password: '',
      fetching: false,
      fetchingDone: false,
      fetchError: '',
      detailsError: '',
      userLoginSelected: '',
      whatsAppNumber: '',
      whatsAppNumberError: ''
    };
  }

  render() {
    const { screen } = this.props;

    const { email: _value, userLoginSelected } = this.state;
    const isWhatsApp = userLoginSelected === 'WhatsApp';

    const isEmail = userLoginSelected === 'Email';

    return (
      <AnimatedAvoidKeyboardContainer>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{...styles.mainContainer}}
        >
          <AnalyticsTracker
            eventType='myLearningProfile'
            eventData={`:AddExistingAccount:`}
          />
          <View style={{ flex: 1 }}>
            <AppText style={styles.header}>
              {screen['lp:test_use_existing_account']
                ? screen['lp:test_use_existing_account']
                : 'Log in'}
            </AppText>

            <View
              style={{
                borderColor: ColorTheme.PRIMARY,
                borderWidth: 1,
                margin: 10,
                padding: 20,
                borderRadius: 5
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <AppText style={{ fontWeight: 'bold' }}>
                  {this.props.getTextFromCMS(
                    'choose_whatsApp_choose_method',
                    'Please choose a method'
                  )}
                </AppText>
              </View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
              >
                <TouchableOpacity
                  disabled={
                    this.state.userLoginSelected === 'Email' ? true : false
                  }
                  activeOpacity={
                    this.state.userLoginSelected === 'Email' ? 1 : 0.6
                  }
                  onPress={() =>
                    this.setState({
                      email: '',
                      password: '',
                      confirm_password: '',
                      userLoginSelected: 'Email'
                    })
                  }
                  style={{
                    height: 80,
                    width: 80,
                    margin: 12,
                    borderRadius: 80 / 2,
                    borderWidth:
                      this.state.userLoginSelected === 'Email' ? 2 : 1,
                    borderColor: ColorTheme.PRIMARY,
                    backgroundColor:
                      this.state.userLoginSelected === 'Email'
                        ? ColorTheme.PRIMARY
                        : ColorTheme.SECONDARY
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      margin: 12,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Image
                      source={require('../../img/settings/Email.png')}
                      style={{
                        height: 40,
                        width: 40,
                        tintColor: isEmail
                          ? ColorTheme.SECONDARY
                          : ColorTheme.PRIMARY
                      }}
                    />
                    <AppText
                      style={{
                        fontSize: 10,
                        color:
                          this.state.userLoginSelected === 'Email'
                            ? ColorTheme.SECONDARY
                            : ColorTheme.PRIMARY,
                        textAlign: 'center',
                        marginTop: -4
                      }}
                    >
                      {this.props.getTextFromCMS('lp:email', 'email')}
                    </AppText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isWhatsApp}
                  activeOpacity={isWhatsApp ? 1 : 0.6}
                  onPress={() =>
                    this.setState({
                      email: '',
                      password: '',
                      confirm_password: '',
                      userLoginSelected: 'WhatsApp'
                    })
                  }
                  style={{ alignContent: 'center', justifyContent: 'center' }}
                >
                  <Image
                    source={require('../../img/settings/WhatsApp_Logo_7.png')}
                    style={{
                      alignSelf: 'center',
                      height: 80,
                      width: 80,
                      borderRadius: 80 / 2,
                      borderWidth: 2,
                      borderColor: isWhatsApp
                        ? ColorTheme.PRIMARY
                        : ColorTheme.SECONDARY
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.userLoginSelected !== '' && (
              <>
                <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                  <UserInputField
                    placeholder={
                      isEmail
                        ? this.props.getTextFromCMS(
                            'lp:input_placeholder_email',
                            'enter email'
                          )
                        : this.props.getTextFromCMS(
                            'whatsApp_enter_number',
                            'enter your WhatsApp number'
                          )
                    }
                    onChangeText={(email) =>
                      this.setState({ email, emailError: '', detailsError: '' })
                    }
                    error_message={this.state.emailError}
                    value={_value}
                    whatsAppNumberField={isWhatsApp}
                  />
                  {isWhatsApp && (
                    <AppText
                      style={{
                        color: ColorTheme.SEPARATOR,
                        fontSize: 12
                      }}
                    >
                      {this.props.getTextFromCMS(
                        'whatsApp_number_form_hint',
                        'a whatsApp number consitst of a + sign, a landcode number, and a phonenumber ie. +4511223344'
                      )}
                    </AppText>
                  )}
                  <UserInputField
                    placeholder={
                      screen['lp:input_placeholder_password_1']
                        ? screen['lp:input_placeholder_password_1']
                        : 'enter your password'
                    }
                    secureTextEntry={true}
                    onChangeText={(password) =>
                      this.setState({
                        password,
                        detailsError: '',
                        emailError: ''
                      })
                    }
                    error_message={this.state.detailsError}
                    value={this.state.password}
                    showEyeFunction={true}
                  />
                </View>
              </>
            )}
            <FramedButton
              label={
                screen['lp:tap_to_connect']
                  ? screen['lp:tap_to_connect']
                  : 'log in'
              }
              onPress={() => this._pressAddExistingUser()}
              disabled={this.state.userLoginSelected === ''}
              activeOpacity={this.state.userLoginSelected == '' ? 1 : 0}
            />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => this.pressForgotPassword()}>
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE * 0.8
                  }}
                >
                  {screen['lp:forgot_password']
                    ? screen['lp:forgot_password']
                    : 'forgot your password?'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
          <LightBoxModal
            visible={this.state.fetching}
            onRequestClose={() => this.setState({ fetching: false })}
            floatingCloseButtonVisible={false}
          >
            {this.state.fetching && !this.state.fetchingDone && (
              <FetchingBox
                loadingText={this.props.getTextFromCMS(
                  'lp:network_call_logging_in',
                  'logging in...'
                )}
              />
            )}
            {this.state.fetchingDone && (
              <FetchingDoneBox
                fetchingDoneHeader={this.props.getTextFromCMS(
                  'lp:network_call_login_success',
                  'welcome back'
                )}
                fetchingErrorStatus={this.state.fetchError}
                fetchingErrorHeader={this.props.getTextFromCMS(
                  'lp:error',
                  'error'
                )}
              />
            )}
          </LightBoxModal>
        </ScrollView>
      </AnimatedAvoidKeyboardContainer>
    );
  }

  async _pressAddExistingUser() {
    //expression for correct email syntax
    let reg = CONSTANTS.EMAIL_REG;
    //expression for correct WhatsApp number syntax
    let WhatsAppreg = CONSTANTS.WHATS_APP_REG;

    if (this.state.userLoginSelected === 'Email') {
      if (!reg.test(this.state.email.trim())) {
        this.setState({
          emailError: this.props.screen['lp:email_requirement_error']
            ? this.props.screen['lp:email_requirement_error']
            : 'you must enter an email address'
        });
        return;
      }
    } else if (this.state.userLoginSelected === 'WhatsApp') {
      if (!WhatsAppreg.test(this.state.email.trim())) {
        this.setState({
          emailError: this.props.getTextFromCMS(
            'whatsApp_number_validation',
            'you must enter a valid WhatsApp number ie. +45 11223344'
          )
        });
        return;
      }
    }

    if (this.state.password.length == 0) {
      this.setState({
        detailsError: this.props.getTextFromCMS(
          'lp:password_requirement_error',
          'password not filled out'
        )
      });
      return;
    }

    const userLoginResult = await userLogin(
      this.state.email,
      this.state.password,
      this.props.name
    );

    if (userLoginResult) {
      if (this.props.navigation.state.params.fromSettingsScreen) {
        this.props.navigation.navigate('ShowProfileScreenFromSettings', {});
      } else if (this.props.navigation.state.params.fromMylearningScreen) {
        this.props.navigation.navigate('MyLearningHome', {});
      } else if (
        this.props.navigation.state.params.fromSettingsScreenViewProfile
      ) {
        // this.props.navigation.pop(2);
        setTimeout(() => (this.props.navigation as any).pop(), 200);
        setTimeout(() => (this.props.navigation as any).pop(), 150);
      } else {
        this.props.navigation.navigate('MyLearningHome', {});
        (this.props.navigation as any).pop();
      }
    }
  }

  pressForgotPassword() {
    this.props.navigation.navigate('ResetPasswordScreen', {
      title: this.props.getTextFromCMS('add_user_title', 'add user')
    });
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
  const { screen, notifications } = language;

  return {
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    currentUser,
    userProfiles,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback)
  };
}

export default connect(mapStateToProps)(LoginScreen);
