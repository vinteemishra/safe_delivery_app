import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import { connect } from 'react-redux';
import { TIMINGS, WHATS_APP_REG, EMAIL_REG } from '../Constants/Constants';
import * as helpers from '../Utils/helpers';
import UserInputField from '../Components/UserInputField';
import FramedButton from '../Components/FramedButton';
import { sendNewPasswordToWhatsApp, resetPassword } from '../Utils/addProfile';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';
import AnalyticsTracker from '../Components/AnalyticsTracker';

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: ColorTheme.FONT_SIZE * 1.25,
    fontWeight: '500',
    letterSpacing: 1.2
  },
  mainContainer: {
    flex: 1,
    backgroundColor: ColorTheme.SECONDARY,
    paddingTop: 24
  }
});

class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      fetching: false,
      fetchingDone: false,
      fetchError: '',
      emailError: '',
      whatsAppNumberError: '',
      userLoginSelected:
        this.props.user && this.props.user.method ? this.props.user.method : '',
      sendingDone: false,
      sendingDone: '',
      sendError: '',
      _passwordSent: this.props.passwordSent ? this.props.passwordSent : false,
      fetchingSendingDoneMessage: '',
      fetchingSendingErrorMessage: ''
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({ email: this.props.user.profileEmail });
    }
  }

  renderChooseMethod() {
    return (
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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
        >
          <TouchableOpacity
            disabled={this.state.userLoginSelected === 'Email' ? true : false}
            activeOpacity={this.state.userLoginSelected === 'Email' ? 1 : 0.6}
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
              borderWidth: this.state.userLoginSelected === 'Email' ? 2 : 1,
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
                  tintColor:
                    this.state.userLoginSelected === 'Email'
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
            disabled={
              this.state.userLoginSelected === 'WhatsApp' ? true : false
            }
            activeOpacity={
              this.state.userLoginSelected === 'WhatsApp' ? 1 : 0.6
            }
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
                borderColor:
                  this.state.userLoginSelected === 'WhatsApp'
                    ? ColorTheme.PRIMARY
                    : ColorTheme.SECONDARY
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSingleMethod() {
    const { user } = this.props;

    if (user) {
      if (user.method !== this.state.userLoginSelected) {
        this.setState({ userLoginSelected: user.method });
      }
    }

    return (
      <View style={{ marginTop: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 20
          }}
        >
          {user.method === 'Email' ? (
            <TouchableOpacity
              disabled={true}
              activeOpacity={1}
              style={{
                height: 80,
                width: 80,
                margin: 12,
                borderRadius: 80 / 2,
                borderWidth: 2,
                borderColor: ColorTheme.PRIMARY,
                backgroundColor: ColorTheme.PRIMARY
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
                    tintColor: ColorTheme.SECONDARY
                  }}
                />
                <AppText
                  style={{
                    fontSize: 10,
                    color: ColorTheme.SECONDARY,
                    textAlign: 'center',
                    marginTop: -4
                  }}
                >
                  {this.props.getTextFromCMS('lp:email', 'email')}
                </AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={true}
              activeOpacity={1}
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
                  borderColor: ColorTheme.PRIMARY
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  render() {
    const _value = this.state.email;

    return (
      <AnimatedAvoidKeyboardContainer>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{
            paddingTop: 24,
            backgroundColor: ColorTheme.SECONDARY
          }}
        >
          <AnalyticsTracker
            eventType='myLearningProfile'
            eventData={`:ResetPasswordScreen:`}
          />
          <View style={{ flex: 1 }}>
            <AppText style={styles.header}>
              {this.props.screen['lp:reset_password']
                ? this.props.screen['lp:reset_password']
                : 'reset you password'}
            </AppText>
            {this.props.user
              ? this.renderSingleMethod()
              : this.renderChooseMethod()}
            {this.state.userLoginSelected !== '' && (
              <View style={{ padding: 24 }}>
                <UserInputField
                  placeholder={
                    this.state.userLoginSelected === 'Email'
                      ? this.props.screen['lp:input_placeholder_email']
                        ? this.props.screen['lp:input_placeholder_email']
                        : 'enter your email'
                      : this.props.getTextFromCMS(
                          'whatsApp_enter_number',
                          'enter your WhatsApp number'
                        )
                  }
                  onChangeText={(email) =>
                    this.setState({ email, emailError: '', detailsError: '' })
                  }
                  error_message={
                    this.state.userLoginSelected === 'Email'
                      ? this.state.emailError
                      : this.state.whatsAppNumberError
                  }
                  whatsAppNumberField={
                    this.state.userLoginSelected == 'Email' ? false : true
                  }
                  value={_value}
                />
                {this.state.userLoginSelected === 'WhatsApp' && (
                  <AppText
                    style={{
                      color: ColorTheme.SEPARATOR,
                      paddingBottom: 10,
                      fontSize: 12
                    }}
                  >
                    {this.props.getTextFromCMS(
                      'whatsApp_number_form_hint',
                      'a whatsApp number consitst of a + sign, a landcode number, and a phonenumber ie. +45 11223344'
                    )}
                  </AppText>
                )}
                {(this.state._passwordSent === false &&
                  this.state.userLoginSelected === 'WhatsApp') ||
                this.state.userLoginSelected === 'Email' ||
                this.state.userLoginSelected === '' ? null : (
                  <UserInputField
                    placeholder={
                      this.state.userLoginSelected === 'Email'
                        ? this.props.getTextFromCMS(
                            'lp:input_placeholder_password',
                            'enter a password'
                          )
                        : 'Enter the received password'
                    }
                    secureTextEntry={true}
                    onChangeText={(password) =>
                      this.setState({ password, passwordError: '' })
                    }
                    error_message={this.state.passwordError || ''}
                    value={this.state.password}
                    showEyeFunction={true}
                  />
                )}
                {this.state._passwordSent &&
                  this.state.userLoginSelected === 'WhatsApp' && (
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                      <TouchableOpacity
                        onPress={() => this.sendNewPasswordToWhatsApp()}
                      >
                        <AppText
                          textAlign={'center'}
                          style={{
                            color: ColorTheme.PRIMARY,
                            fontSize: ColorTheme.FONT_SIZE * 0.8,
                            textAlign: 'center',
                            marginHorizontal: 20,
                            marginTop: 10
                          }}
                        >
                          {this.props.getTextFromCMS(
                            'whatsApp_lost_password_send_new_one',
                            'i have lost my password! Please send me a new one'
                          )}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  )}
                {this.state.userLoginSelected === 'WhatsApp' &&
                this.state._passwordSent === false ? (
                  <FramedButton
                    disabled={this.state.userLoginSelected == '' ? true : false}
                    activeOpacity={this.state.userLoginSelected == '' ? 1 : 0}
                    label={this.props.getTextFromCMS(
                      'whatsApp_send_new_password_button',
                      'send new password on WhatsApp'
                    )}
                    onPress={() => this.sendNewPasswordToWhatsApp()}
                  />
                ) : (
                  <FramedButton
                    disabled={this.state.userLoginSelected == '' ? true : false}
                    activeOpacity={this.state.userLoginSelected == '' ? 1 : 0}
                    label={this.props.getTextFromCMS(
                      'lp:reset_password_button',
                      'reset password'
                    )}
                    onPress={() => this.resetPassword()}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </AnimatedAvoidKeyboardContainer>
    );
  }

  async resetPassword() {
    //expression for correct Email syntax
    let reg = EMAIL_REG;
    //expression for correct WhatsApp number syntax
    let WhatsAppreg = WHATS_APP_REG;

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
        return this.setState({
          emailError: this.props.getTextFromCMS(
            'whatsApp_number_validation',
            'you must enter a valid WhatsApp number ie. +45 11223344'
          )
        });
      }
    }

    const resetPasswordResult = await resetPassword(
      this.state.email.trim(),
      this.state.userLoginSelected === 'WhatsApp' ? true : undefined,
      this.state.userLoginSelected === 'WhatsApp'
        ? this.state.password
        : undefined
    );

    if (resetPasswordResult) {
      setTimeout(
        () => this.props.navigation.pop(),
        TIMINGS.modalCloseAnimationTime
      );
    }
  }

  async sendNewPasswordToWhatsApp() {
    let WhatsAppreg = /^\+[1-9]\d{1,14}$/;

    if (!WhatsAppreg.test(this.state.email.trim())) {
      return this.setState({
        emailError: this.props.getTextFromCMS(
          'whatsApp_number_validation',
          'you must enter a valid WhatsApp number ie. +45 11223344'
        )
      });
    }

    const response = await sendNewPasswordToWhatsApp(
      this.state.email.trim(),
      true
    );

    if (response && response.passwordSent === true) {
      return this.setState({ _passwordSent: true });
    }

    this.setState({ response });
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    passwordSent,
    passwordSentMethod,
    currentUser,
    userProfiles,
    selectedCountry
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications } = language;

  let user = null;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }

  return {
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    passwordSent,
    passwordSentMethod,
    user,
    selectedCountry
  };
}

export default connect(mapStateToProps)(ResetPasswordScreen);
