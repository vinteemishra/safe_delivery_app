import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { upsertProfile } from '../Actions/actions';
import AppText from '../Components/AppText';
import FramedButton from '../Components/FramedButton';
import ListHeader from '../Components/ListHeader';
import UserInputField from '../Components/UserInputField';
import ColorTheme from '../Constants/ColorTheme';
import { TIMINGS, WHATS_APP_REG, EMAIL_REG } from '../Constants/Constants';
import * as helpers from '../Utils/helpers';
import { updateAccountInfo, updatePassword } from '../Utils/updateProfile';
import { openModal, closeModal } from '../Actions/modalActions';
import AnimatedAvoidKeyboardContainer from '../Components/AnimatedAvoidKeyboardContainer';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: width - width / 4,
    borderColor: ColorTheme.PRIMARY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  spinner: {
    margin: 16,
    height: 100,
    width: 100,
    color: ColorTheme.SECONDARY
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: ColorTheme.FONT_SIZE * 1.25,
    fontWeight: '500',
    letterSpacing: 1.2
  },
  mainContainer: {
    backgroundColor: ColorTheme.TERTIARY,
    paddingTop: 12
  },
  card: {
    backgroundColor: ColorTheme.SECONDARY,
    padding: 16,
    borderTopColor: ColorTheme.SEPARATOR,
    borderTopWidth: 1,
    borderBottomColor: ColorTheme.SEPARATOR,
    borderBottomWidth: 1
  }
});

class EditProfileInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueError: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      profileName: this.props.navigation.state.params.profileName
        ? this.props.navigation.state.params.profileName
        : '',
      profileEmail: this.props.navigation.state.params.profileEmail
        ? this.props.navigation.state.params.profileEmail
        : '',
      profilePassword: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  componentWillMount() {}

  updateSimpleUser(value) {
    // Check if the user changed the name
    let profile = this.props.userProfiles[this.props.currentUser];

    //Validate the indput
    const validationResult = this._validateUserIndput(
      profile,
      value,
      undefined
    );

    //If validation failes early return
    if (!validationResult) {
      return;
    }

    this.props.dispatch(
      openModal({
        modalType: 'UPDATE_USER_PROFILE_SUCCESS',
        modalProps: {
          user: this.props.user,
          userProfiles: this.props.userProfiles
        }
      })
    );
    this.updateOfflineName(value);
    setTimeout(() => {
      this.props.dispatch(openModal({ modalType: 'CREATE_PROFILE_SUCCESS' }));
    }, TIMINGS.modalHangtimeWhileStoreUpdates);
    setTimeout(() => {
      this.props.dispatch(closeModal());
    }, TIMINGS.closeModalBeforeGobackOneScreen);
    setTimeout(() => {
      this.props.navigation.goBack(null);
    }, TIMINGS.goBackOneScreenAfterModalClose);
  }

  isNameFree(name) {
    let profiles = this.props.userProfiles;
    for (let profile in profiles) {
      if (
        profiles[profile].profileName == name &&
        profiles[this.props.currentUser].profileName !== name
      ) {
        return false;
      }
    }
    return true;
  }

  _validateUserIndput(profile, name, email, password) {
    // if ((profile.profileName == name && profile.profileEmail == email) || profile.profileName == name) {
    if (profile.profileName == name && profile.profileEmail == email) {
      this.props.dispatch(
        openModal({
          modalType: 'UPDATE_USER_NO_CHANGE',
          modalProps: {
            disableFloatingCloseButton: true,
            disableOnBackDropPress: true
          }
        })
      );
      setTimeout(() => {
        this.props.dispatch(closeModal());
      }, TIMINGS.modalHangtimeBeforeClose);
      setTimeout(() => {
        this.props.navigation.goBack(null);
      }, TIMINGS.closeModalBeforeGobackOneScreen);
      return false;
    }
    if (name.trim() == '') {
      this.setState({
        valueError: this.props.getTextFromCMS(
          'lp:add_user_name_error',
          'invalid name'
        )
      });
      return false;
    }
    if (!this.isNameFree(name)) {
      this.setState({
        valueError: this.props.screen['lp:user_already_exists_error']
          ? this.props.screen['lp:user_already_exists_error']
          : 'A user by this name already exists'
      });
      return false;
    }

    //Sinple user validation done. Early return before email, whatsApp, and password validation starts.
    if (email == undefined) {
      return true;
    }

    const reg = EMAIL_REG;
    const WhatsAppreg = WHATS_APP_REG;

    if (profile.method === 'Email') {
      if (!reg.test(email)) {
        this.setState({
          emailError: this.props.screen['lp:email_requirement_error']
            ? this.props.screen['lp:email_requirement_error']
            : 'you must enter an email address'
        });
        return false;
      } else {
        return true;
      }
    } else {
      if (!WhatsAppreg.test(email)) {
        this.setState({
          emailError: this.props.getTextFromCMS(
            'whatsApp_number_validation',
            'you must enter a valid WhatsApp number ie. +45 11223344'
          )
        });
        return false;
      }
    }

    if (password.length == 0) {
      this.setState({
        passwordError: this.props.screen['lp:password_requirement_error']
          ? this.props.screen['lp:password_requirement_error']
          : 'you must enter your account password'
      });
      return false;
    }

    return true;
  }

  async _updateAccountInfo(name, email, password) {
    const profile = this.props.userProfiles[this.props.currentUser];

    //Validate the indput
    const validationResult = this._validateUserIndput(
      profile,
      name,
      email,
      password
    );

    //If validation failes early return
    if (!validationResult) {
      return;
    }

    //Start the updating... modal
    this.props.dispatch(
      openModal({
        modalType: 'UPDATE_USER_PROFILE_SUCCESS',
        modalProps: {
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        }
      })
    );

    //Await the updateSccountInfo
    const updateAccountInfoResult = await updateAccountInfo(
      name,
      email,
      password,
      profile.method,
      this.props.currentUser
    );

    //If all went well update the store with the new user information
    if (updateAccountInfoResult) {
      if (updateAccountInfoResult.status == true) {
        if (profile.profileName !== name) {
          this.updateName(updateAccountInfoResult.profileName);
        }
        if (profile.profileEmail !== email) {
          this.updateEmail(updateAccountInfoResult.profileEmail);
        }

        //Show the success modal
        this.props.dispatch(
          openModal({
            modalType: 'UPDATE_USER_INFORMATION_SUCCESS',
            modalProps: {
              disableFloatingCloseButton: true,
              disableOnBackDropPress: true
            }
          })
        );

        //Clode the modal and go one screen back when success
        setTimeout(() => {
          this.props.dispatch(closeModal());
        }, TIMINGS.modalHangtimeBeforeClose);
        setTimeout(() => {
          this.props.navigation.goBack(null);
        }, TIMINGS.closeModalBeforeGobackOneScreen);
        return;
      }

      //If it went bad, inform the user
      else {
        switch (updateAccountInfoResult.result) {
          case 'mailAlreadyInUse':
            this.props.dispatch(
              openModal({
                modalType:
                  profile.method === 'Email'
                    ? 'EMAIL_IN_USE'
                    : 'WHATSAPP_IN_USE',
                modalProps: {
                  disableFloatingCloseButton: true,
                  disableOnBackDropPress: true
                }
              })
            );
            break;
          case 'invalidUserOrPassword':
            this.props.dispatch(
              openModal({
                modalType: 'COULD_NOT_UPDATE_PASSWORD',
                modalProps: {
                  disableFloatingCloseButton: true,
                  disableOnBackDropPress: true
                }
              })
            );
            break;
          default:
            console.log('error!');
            this.props.dispatch(
              openModal({
                modalType: 'COULD_NOT_CONNECT_TO_NETWORK',
                modalProps: {
                  disableFloatingCloseButton: true,
                  disableOnBackDropPress: true
                }
              })
            );
            break;
        }
        //Close the modal when finished
        return setTimeout(() => {
          this.props.dispatch(closeModal());
        }, TIMINGS.modalHangtimeBeforeClose);
      }
    }
  }

  async updatePassword(oldPassword, newPassword, confirmPassword) {
    if (oldPassword.length < 4) {
      this.setState({
        oldPasswordError: this.props.screen['lp:password_requirement_error']
          ? this.props.screen['lp:password_requirement_error']
          : 'you must enter your account password'
      });
      return;
    }
    if (newPassword.length < 4) {
      this.setState({
        newPasswordError: this.props.screen['lp:password_requirement_error']
          ? this.props.screen['lp:password_requirement_error']
          : 'you must enter your account password'
      });
      return;
    }
    if (confirmPassword != newPassword) {
      this.setState({
        confirmPasswordError: this.props.getTextFromCMS(
          'lp:update_password_comfirm_error',
          'passwords do not match'
        )
      });
      return;
    }

    //Start the updateing... modal
    this.props.dispatch(
      openModal({
        modalType: 'UPDATE_USER_PROFILE_SUCCESS',
        modalProps: {
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        }
      })
    );

    //Await the updatePassword
    const updatePasswordResult = await updatePassword(
      oldPassword,
      newPassword,
      this.props.currentUser
    );

    if (updatePasswordResult) {
      if (updatePasswordResult.status == true) {
        //Show the success modal
        this.props.dispatch(
          openModal({
            modalType: 'UPDATE_USER_PASSWORD_SUCCESS',
            modalProps: {
              disableFloatingCloseButton: true,
              disableOnBackDropPress: true
            }
          })
        );

        //Clode the modal and go one screen back when success
        setTimeout(() => {
          this.props.dispatch(closeModal());
        }, TIMINGS.modalHangtimeBeforeClose);
        setTimeout(() => {
          this.props.navigation.goBack(null);
        }, TIMINGS.closeModalBeforeGobackOneScreen);
        return;
      }
      //If it went bad, inform the user
      else {
        switch (updatePasswordResult.result) {
          case 'invalidUserOrPassword':
            this.props.dispatch(
              openModal({
                modalType: 'COULD_NOT_UPDATE_PASSWORD',
                modalProps: {
                  disableFloatingCloseButton: true,
                  disableOnBackDropPress: true
                }
              })
            );
            break;
          default:
            console.log('error!');
            this.props.dispatch(
              openModal({
                modalType: 'COULD_NOT_CONNECT_TO_NETWORK',
                modalProps: {
                  disableFloatingCloseButton: true,
                  disableOnBackDropPress: true
                }
              })
            );
            break;
        }
        //Close the modal when finished
        return setTimeout(() => {
          this.props.dispatch(closeModal());
        }, TIMINGS.modalHangtimeBeforeClose);
      }
    }
  }

  render() {
    let value_control = [];

    const _value = this.state.profileEmail;

    if (this.props.navigation.state.params.profileEmail) {
      value_control.push(
        <View key={1}>
          <ListHeader>
            {this.props.navigation.state.params.profileEmail
              ? this.props.getTextFromCMS(
                  'edit_user_information',
                  'Change user information'
                )
              : this.props.getTextFromCMS(
                  'lp:change_user_info_offline',
                  'change name'
                )}
          </ListHeader>
          <View style={styles.card}>
            {_value ? (
              <AppText style={{ marginBottom: 20, fontWeight: 'bold' }}>
                {_value}
              </AppText>
            ) : (
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
                editable={false}
                value={_value}
                onChangeText={(value) =>
                  this.setState({ profileEmail: value, emailError: '' })
                }
                error_message={this.state.emailError}
                whatsAppNumberField={
                  this.state.userLoginSelected === 'Email' ? false : true
                }
              />
            )}
            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'lp:input_placeholder_name',
                'enter name'
              )}
              value={this.state.profileName}
              onChangeText={(value) =>
                this.setState({ profileName: value, nameError: '' })
              }
              error_message={this.state.nameError || this.state.valueError}
            />

            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'lp:input_placeholder_password_1',
                'enter your password'
              )}
              secureTextEntry={true}
              onChangeText={(value) =>
                this.setState({ profilePassword: value, passwordError: '' })
              }
              error_message={this.state.passwordError}
              showEyeFunction={true}
            />
            <FramedButton
              label={this.props.getTextFromCMS(
                'lp:save_changes',
                'save changes'
              )}
              onPress={() =>
                this._updateAccountInfo(
                  this.state.profileName,
                  this.state.profileEmail,
                  this.state.profilePassword
                )
              }
            />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => this.pressForgotPassword()}>
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE * 0.8
                  }}
                >
                  {this.props.screen['lp:forgot_password']
                    ? this.props.screen['lp:forgot_password']
                    : 'forgot your password?'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
          <ListHeader>
            {this.props.getTextFromCMS('lp:change_password', 'change password')}
          </ListHeader>
          <View style={styles.card}>
            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'lp:input_placeholder_old_password',
                'enter old password'
              )}
              secureTextEntry={true}
              onChangeText={(value) =>
                this.setState({ oldPassword: value, oldPasswordError: '' })
              }
              error_message={this.state.oldPasswordError}
              showEyeFunction={true}
            />
            <View style={{ marginTop: 10 }}>
              <UserInputField
                placeholder={this.props.getTextFromCMS(
                  'lp:input_placeholder_password',
                  'enter password'
                )}
                secureTextEntry={true}
                onChangeText={(value) =>
                  this.setState({ newPassword: value, newPasswordError: '' })
                }
                error_message={this.state.newPasswordError}
                showEyeFunction={true}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              <UserInputField
                placeholder={this.props.getTextFromCMS(
                  'lp:input_placeholder_confirm_password',
                  'confirm your password'
                )}
                secureTextEntry={true}
                onChangeText={(value) =>
                  this.setState({
                    confirmPassword: value,
                    confirmPasswordError: ''
                  })
                }
                error_message={this.state.confirmPasswordError}
                showEyeFunction={true}
              />
            </View>
            <FramedButton
              label={this.props.getTextFromCMS(
                'lp:update_password_button_label',
                'change password'
              )}
              onPress={() =>
                this.updatePassword(
                  this.state.oldPassword,
                  this.state.newPassword,
                  this.state.confirmPassword
                )
              }
            />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() =>
                  this.pressForgotPassword(
                    this.state.oldPassword,
                    this.state.newPassword,
                    this.state.confirmPassword
                  )
                }
              >
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE * 0.8
                  }}
                >
                  {this.props.screen['lp:forgot_password']
                    ? this.props.screen['lp:forgot_password']
                    : 'forgot your password?'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <FramedButton
              label={'Delete User Profile'}
              onPress={() =>
                this.props.navigation.navigate('DeleteUserProfile')
              }
            />
          </View>
        </View>
      );
    } else {
      value_control.push(
        <View key={2}>
          <ListHeader>
            {this.props.getTextFromCMS('lp:change_name', 'change name')}
          </ListHeader>
          <View style={styles.card}>
            <UserInputField
              placeholder={this.props.getTextFromCMS(
                'lp:input_placeholder_name',
                'enter name'
              )}
              value={this.state.profileName}
              onChangeText={(value) =>
                this.setState({ profileName: value, nameError: '' })
              }
              error_message={this.state.valueError}
            />
            <FramedButton
              label={this.props.getTextFromCMS(
                'lp:save_changes',
                'save changes'
              )}
              onPress={() => this.updateSimpleUser(this.state.profileName)}
            />
          </View>
        </View>
      );
    }

    return (
      <AnimatedAvoidKeyboardContainer>
        <ScrollView
          style={{ backgroundColor: ColorTheme.TERTIARY }}
          contentContainerStyle={styles.mainContainer}
        >
          {value_control}
        </ScrollView>
      </AnimatedAvoidKeyboardContainer>
    );
  }
  /**
   * Opens ResetPasswordScreen
   * @param none
   */
  pressForgotPassword() {
    this.props.navigation.navigate('ResetPasswordScreen', {
      title: this.props.getTextFromCMS(
        'lp:reset_password_button',
        'reset password'
      ),
      titleImage: require('../../img/sda_title.png'),
      backButtonTitle: helpers.getBackText(this.props.screen.back)
    });
  }

  updateName(name) {
    let profile = this.props.userProfiles[this.props.currentUser];

    this.props.dispatch(
      upsertProfile(
        profile.profileId,
        profile.profileTimestamp,
        name,
        profile.profileEmail,
        profile.country,
        profile.profileQuestions,
        profile.profileModuleScores,
        profile.profileCertificates,
        profile.listOfShownNotifications,
        profile.dismissedUpgradeMessage,
        profile.cheatUsed,
        profile.method,
        profile.userSpecificNotificationScheduleList,
        profile.moduleCertificates
      )
    );
  }

  updateEmail(name) {
    let profile = this.props.userProfiles[this.props.currentUser];

    this.props.dispatch(
      upsertProfile(
        profile.profileId,
        profile.profileTimestamp,
        profile.profileName,
        name,
        profile.country,
        profile.profileQuestions,
        profile.profileModuleScores,
        profile.profileCertificates,
        profile.listOfShownNotifications,
        profile.dismissedUpgradeMessage,
        profile.cheatUsed,
        profile.method,
        profile.userSpecificNotificationScheduleList,
        profile.moduleCertificates
      )
    );
  }

  updateOfflineName(name) {
    let profile = this.props.userProfiles[this.props.currentUser];
    this.props.dispatch(
      upsertProfile(
        profile.profileId,
        profile.profileTimestamp,
        name,
        profile.profileEmail,
        profile.country,
        profile.profileQuestions,
        profile.profileModuleScores,
        profile.profileCertificates,
        profile.listOfShownNotifications,
        profile.dismissedUpgradeMessage,
        profile.cheatUsed,
        profile.method,
        profile.userSpecificNotificationScheduleList,
        profile.moduleCertificates
      )
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
  const { screen, notifications } = language;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    currentUser: currentUser.currentUser,
    userProfiles,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    user
  };
}

export default connect(mapStateToProps)(EditProfileInfoScreen);
