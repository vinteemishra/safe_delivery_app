import React, { Component } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import uuid from 'react-native-uuid';
import { connect } from 'react-redux';
import { setCurrentUser, upsertProfile } from '../Actions/actions';
import AppText from '../Components/AppText';
import FramedButton from '../Components/FramedButton';
import UserInputField from '../Components/UserInputField';
import ColorTheme from '../Constants/ColorTheme';
import * as helpers from '../Utils/helpers';
import { openModal } from '../Actions/modalActions';
import {
  createProfileWithEmail,
  createProfileWithWhatsApp,
  sendNewPasswordToWhatsApp
} from '../Utils/addProfile';
import { setupNotifications } from '../Actions/notificationActions';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 8,
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

class CreateNewUserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.navigation.state.params.name
        ? this.props.navigation.state.params.name
        : '',
      password: '',
      email: '',
      whatsAppError: '',
      whatsAppNumberError: '',
      passwordError: '',
      account: this.props.navigation.state.params.name ? true : false,
      animation: 'auto',
      animationHeight: 0,
      userLoginSelected: '',
      whatsAppNumber: '',
      whatsAppCode: '',
      shouldAnimateOut: false,
      prevUserLoginSelected: '',
      passwordSent: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.userLoginSelected !== this.state.userLoginSelected &&
      this.state.userLoginSelected === ''
    ) {
      this.setState({ prevUserLoginSelected: prevState.userLoginSelected });
    }
  }

  // componentDidMount() {
  // if (this.props.passwordSentMethod) {
  //     this.setState({ userLoginSelected: this.props.passwordSentMethod });
  // }
  // }

  async pressCreate() {
    console.log('pressCreate');
    let alreadyUserByName = false;
    for (p in this.props.userProfiles) {
      if (
        this.props.userProfiles[p].profileName == this.state.name &&
        this.state.name !== this.props.navigation.state.params.name
      ) {
        alreadyUserByName = true;
        break;
      }
    }
    if (alreadyUserByName) {
      return this.setState({
        nameError: this.props.getTextFromCMS(
          'lp:user_already_exists_error',
          'a user by this name already exists'
        )
      });
    } else if (this.state.name.trim() == '' || this.state.name == undefined) {
      return this.setState({
        nameError: this.props.getTextFromCMS(
          'lp:add_user_name_error',
          'invalid name'
        )
      });
    }

    if (this.state.userLoginSelected !== '') {
      const {
        name,
        email,
        password,
        confirm_password,
        whatsAppNumber,
        whatsAppCode
      } = this.state;
      const {
        paramsName = name,
        fromSettingsScreenViewProfile
      } = this.props.navigation.state.params;
      console.log(
        'whatsAppNumber',
        whatsAppNumber,
        'whatsAppCode',
        whatsAppCode
      );
      const newState =
        this.state.userLoginSelected === 'Email'
          ? await createProfileWithEmail(
              name,
              email,
              password,
              confirm_password,
              this.props.userProfiles,
              paramsName,
              fromSettingsScreenViewProfile
            )
          : await createProfileWithWhatsApp(
              name,
              whatsAppNumber,
              whatsAppCode,
              paramsName,
              fromSettingsScreenViewProfile
            );
      // console.log("newState", newState);
      this.setState(newState);
    } else {
      this.createSimpleUser();
    }
  }

  createSimpleUser() {
    // let alreadyUserByName = false
    // for (p in this.props.userProfiles) {
    //     if (this.props.userProfiles[p].profileName == this.state.name) {
    //         alreadyUserByName = true;
    //         break;
    //     }
    // }

    // if (alreadyUserByName) {
    //     // console.log("name taken")
    //     this.setState({ nameError: this.props.getTextFromCMS("lp:user_already_exists_error", "a user by this name already exists") });
    // } else if (this.state.name.trim() == "" || this.state.name == undefined) {
    //     this.setState({ nameError: this.props.getTextFromCMS("lp:add_user_name_error", "invalid name") });
    // } else {
    //     // console.log("ELSE!!");
    //     let user_id = uuid.v4()
    //     this.props.dispatch(upsertProfile(user_id, 0, this.state.name, null, {}, {}, undefined)); // null = no email, local user only
    //     this.props.dispatch(setCurrentUser(user_id));
    //     // this.setState({ success_simple_user: true });
    //     this.props.dispatch(openModal({ modalType: "CREATE_SIMPLE_PROFILE_SUCCESS", modalProps: { alternativeClose: this.props.navigation.state.params.fromSettingsScreenViewProfile, disableFloatingCloseButton: true, disableOnBackDropPress: true } }));
    // }

    // console.log("ELSE!!");
    let user_id = uuid.v4();
    this.props.dispatch(
      upsertProfile(
        user_id,
        0,
        this.state.name,
        null,
        this.props.selectedCountry,
        {},
        {},
        undefined
      )
    ); // null = no email, local user only
    this.props.dispatch(setCurrentUser(user_id));
    this.props.dispatch(setupNotifications()); //Setup the notifications on the newly created
    // this.setState({ success_simple_user: true });
    this.props.dispatch(
      openModal({
        modalType: 'CREATE_SIMPLE_PROFILE_SUCCESS',
        modalProps: {
          alternativeClose: this.props.navigation.state.params
            .fromSettingsScreenViewProfile,
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        }
      })
    );

    // let user_id = uuid.v4()
    // this.props.dispatch(upsertProfile(user_id, 0, this.state.name, null, {}, {}, undefined)); // null = no email, local user only
    // this.props.dispatch(setCurrentUser(user_id));
    // // this.setState({ success_simple_user: true });
    // this.props.dispatch(openModal({ modalType: "CREATE_SIMPLE_PROFILE_SUCCESS", modalProps: { alternativeClose: this.props.navigation.state.params.fromSettingsScreenViewProfile, disableFloatingCloseButton: true, disableOnBackDropPress: true } }));
  }

  animateIn(value) {
    const ANIMATION_HEGHT =
      value !== 'Email'
        ? (Dimensions.get('screen').height / 100) *
          (Platform.OS === 'ios' ? 16 : 22)
        : (Dimensions.get('screen').height / 100) *
          (Platform.OS === 'ios' ? 21 : 32);
    this.setState({ account: true, shouldAnimateOut: false });
    // this.state.animation.setValue(0.01);
    Animated.spring(
      // Animate over time
      this.state.animation, // The animated value to drive
      {
        useNativeDriver: false,
        speed: 4,
        // toValue: this.state.animationHeight,
        toValue: ANIMATION_HEGHT, //TODO - changes this back to dynamic like above. Problem that it only animates to WhatsApp value
        bounciness: 4 // Animate to opacity: 1 (opaque)
      }
    ).start();
  }

  animateOut() {
    this.setState({ account: false, userLoginSelected: '' });
    // console.log("else", this.state.animation)
    this.state.animation.setValue(this.state.animationHeight);
    Animated.spring(this.state.animation, {
      useNativeDriver: false,
      toValue: 0,
      speed: 4,
      bounciness: -10
    }).start();
  }

  checkedChange(value, animates) {
    const { userLoginSelected } = this.state;

    if (this.state.shouldAnimateOut || userLoginSelected === value) {
      return this.animateOut();
    }

    if (animates) {
      this.animateIn(value);
    } else {
      this.state.animation.setValue(this.state.animationHeight);
    }
    this.setState({
      password: '',
      confirm_password: '',
      userLoginSelected: value
    });
  }

  //Gets the rendered height of the Animated View before hidding it, so it can be reapplied when the Animated View is displayed.
  setAnimationHeight(event) {
    const ANIMATION_HEGHT =
      this.state.userLoginSelected && this.state.userLoginSelected !== 'Email'
        ? (Dimensions.get('screen').height / 100) *
          (Platform.OS === 'ios' ? 15 : 10)
        : (Dimensions.get('screen').height / 100) *
          (Platform.OS === 'ios' ? 20 : 30);
    if (this.state.animation == 'auto' && event.nativeEvent.layout.height > 0) {
      console.log('setAnimationHeight', event.nativeEvent.layout);
      const isOpen = this.state.userLoginSelected !== '';
      this.setState({
        // animationHeight: event.nativeEvent.layout.height,
        animationHeight: ANIMATION_HEGHT,
        animation: isOpen
          ? new Animated.Value(event.nativeEvent.layout.height)
          : new Animated.Value(0.01)
      });
    }
  }

  renderChooseMethod(animates) {
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
          <AppText style={{ textAlign: 'center' }}>
            {this.props.getTextFromCMS(
              'lp:save_progress_option',
              'save your progress on different devices'
            )}
            <AppText style={{ fontStyle: 'italic' }}>
              {this.props.getTextFromCMS(
                'lp:save_requires_internet',
                '(requires internet connectivity)'
              )}
            </AppText>
          </AppText>
          <AppText style={{ marginTop: 20, fontWeight: 'bold' }}>
            {this.props.getTextFromCMS(
              'lp:login_choose_method',
              'Please choose a method'
            )}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: -10
          }}
        >
          <TouchableOpacity
            onPress={() => this.checkedChange('Email', true)}
            style={{
              height: 80,
              width: 80,
              margin: 12,
              borderRadius: 80 / 2,
              borderWidth: this.state.userLoginSelected === 'Email' ? 2 : 1,
              borderColor: ColorTheme.PRIMARY,
              backgroundColor:
                this.state.userLoginSelected === 'Email' && this.state.account
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
                    this.state.userLoginSelected === 'Email' &&
                    this.state.account
                      ? ColorTheme.SECONDARY
                      : ColorTheme.PRIMARY
                }}
              />
              <AppText
                style={{
                  fontSize: 10,
                  color:
                    this.state.userLoginSelected === 'Email' &&
                    this.state.account
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
            onPress={() => this.checkedChange('WhatsApp', true)}
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

  renderEmailForm(state, getTextFromCMS) {
    const {
      email,
      emailError,
      password,
      passwordError,
      confirm_password,
      confirmPasswordError
    } = state;
    return (
      <View style={{ flexDirection: 'column', paddingTop: 10 }}>
        <UserInputField
          placeholder={getTextFromCMS(
            'lp:input_placeholder_email',
            'enter email'
          )}
          onChangeText={(email) =>
            this.setState({ email, emailError: '', detailsError: '' })
          }
          error_message={emailError || ''}
          value={email}
        />
        <UserInputField
          placeholder={getTextFromCMS(
            'lp:input_placeholder_password',
            'enter a password'
          )}
          secureTextEntry={true}
          onChangeText={(password) =>
            this.setState({ password, passwordError: '' })
          }
          error_message={passwordError}
          value={password}
          showEyeFunction={true}
        />
        <UserInputField
          placeholder={this.props.getTextFromCMS(
            'lp:input_placeholder_confirm_password',
            'confirm your password'
          )}
          secureTextEntry={true}
          onChangeText={(confirm_password) =>
            this.setState({ confirm_password, confirmPasswordError: '' })
          }
          error_message={confirmPasswordError}
          value={confirm_password}
          showEyeFunction={true}
        />
      </View>
    );
  }

  renderWhatsAppForm(state, getTextFromCMS) {
    const {
      whatsAppNumber,
      whatsAppCode,
      whatsAppNumberError,
      passwordError,
      whatsAppError,
      passwordSent
    } = state;

    const _value = whatsAppNumber;

    return (
      <View>
        <UserInputField
          placeholder={this.props.getTextFromCMS(
            'whatsApp_enter_number',
            'enter your WhatsApp number'
          )}
          onChangeText={(whatsAppNumber) =>
            this.setState({ whatsAppNumber, whatsAppNumberError: '' })
          }
          error_message={whatsAppNumberError || ''}
          whatsAppNumberField={true}
          value={_value}
          style={{ flex: 1 }}
        />
        {!passwordSent && (
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
        {passwordSent && (
          <View style={{ marginBottom: 16 }}>
            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'whatsApp_type_received_code',
                'please enter the received code'
              )}
              onChangeText={(whatsAppCode) =>
                this.setState({
                  whatsAppCode,
                  whatsAppCodeError: '',
                  whatsAppNumberError: '',
                  passwordError: ''
                })
              }
              error_message={passwordError}
              value={whatsAppCode}
              secureTextEntry={true}
              showEyeFunction={true}
            />
            <TouchableOpacity
              onPress={() => this.getWhatsAppPassword(whatsAppNumber)}
            >
              <AppText
                style={{
                  color: ColorTheme.PRIMARY,
                  fontSize: ColorTheme.FONT_SIZE * 0.8,
                  textAlign: 'center',
                  marginHorizontal: 5
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
      </View>
    );
  }

  async getWhatsAppPassword(whatsAppNumber) {
    this.setState({ whatsAppNumberError: '', passwordError: '' });
    await sendNewPasswordToWhatsApp(whatsAppNumber).then((response) =>
      this.setState(response)
    );
  }

  renderConfirmButton() {
    const sendPasswordHeader = this.props.getTextFromCMS(
      'whatsApp_message_password_header',
      'here is your new requested activation code'
    );
    const sendPasswordBody = this.props.getTextFromCMS(
      'whatsApp_message_password_body',
      'you can always get a new code or change your code to a personal one within The Safe Delivery App'
    );

    return (
      <View>
        {this.state.userLoginSelected === 'WhatsApp' &&
        this.state.passwordSent === false ? (
          <FramedButton
            disabled={this.state.name.trim().length == 0}
            label={this.props.getTextFromCMS(
              'whatsApp_send_new_password_button',
              'send new password on WhatsApp'
            )}
            onPress={() =>
              this.getWhatsAppPassword(
                this.state.whatsAppNumber,
                sendPasswordHeader,
                sendPasswordBody
              )
            }
          />
        ) : (
          <FramedButton
            disabled={this.state.name.trim().length == 0}
            label={this.props.getTextFromCMS('lp:create_user', 'create user')}
            onPress={() => this.pressCreate()}
          />
        )}
      </View>
    );
  }

  renderUpgradeUser() {
    return (
      <View>
        <AppText style={styles.header}>
          {this.props.getTextFromCMS('lp:upgrade_profile', 'upgrade profile')}
        </AppText>
        <View style={{ flex: 1, padding: 16 }}>
          <View>
            {this.renderChooseMethod(this.state.userLoginSelected === '')}
            <Animated.View
              style={{
                height: this.state.animation,
                overflow: 'hidden',
                zIndex: 1
              }}
              onLayout={(event) => this.setAnimationHeight(event)}
            >
              {this.state.userLoginSelected == 'Email' ||
              (this.state.userLoginSelected === '' &&
                this.state.prevUserLoginSelected == 'Email')
                ? this.renderEmailForm(this.state, this.props.getTextFromCMS)
                : this.renderWhatsAppForm(
                    this.state,
                    this.props.getTextFromCMS
                  )}
            </Animated.View>
          </View>
        </View>
        {this.renderConfirmButton()}
      </View>
    );
  }

  renderCreateUser() {
    return (
      <View>
        <AppText style={styles.header}>
          {this.props.getTextFromCMS('lp:user_profile', 'user profile')}
        </AppText>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}>
          <View>
            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'lp:input_placeholder_username',
                'enter username'
              )}
              onChangeText={(name) => {
                this.setState({ name, nameError: '' });
              }}
              error_message={this.state.nameError || ''}
            />
            {this.renderChooseMethod(this.state.userLoginSelected === '')}
            <Animated.View
              style={{
                height: this.state.animation,
                overflow: 'hidden',
                zIndex: 1
              }}
              onLayout={(event) => this.setAnimationHeight(event)}
            >
              {this.state.userLoginSelected == 'Email' ||
              (this.state.userLoginSelected === '' &&
                this.state.prevUserLoginSelected == 'Email')
                ? this.renderEmailForm(this.state, this.props.getTextFromCMS)
                : this.renderWhatsAppForm(
                    this.state,
                    this.props.getTextFromCMS
                  )}
            </Animated.View>
          </View>
        </View>
        {this.renderConfirmButton()}
      </View>
    );
  }

  render() {
    const userToUpgrade = this.props.navigation.state.params.name;

    return (
      <AnimatedAvoidKeyboardContainer>
        <ScrollView
          contentContainerStyle={styles.mainContainer}
          alwaysBounceVertical={false}
        >
          {userToUpgrade ? this.renderUpgradeUser() : this.renderCreateUser()}
        </ScrollView>
      </AnimatedAvoidKeyboardContainer>
    );
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    userProfiles,
    currentUser,
    selectedCountry
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications } = language;
  return {
    selectedLang,
    language,
    notifications,
    index,
    screen,
    selectedMode,
    userProfiles,
    currentUser,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    selectedCountry
  };
}

export default connect(mapStateToProps)(CreateNewUserScreen);
