import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect, MapStateToProps } from 'react-redux';
import { closeModal, openModal } from '../../Actions/modalActions';
import AppText from '../AppText';
import UserInputField from '../UserInputField';
import ColorTheme from '../../Constants/ColorTheme';
import { TIMINGS, WHATS_APP_REG } from '../../Constants/Constants';
import * as helpers from '../../Utils/helpers';
import { sendCertificate } from '../../Utils/sendMessage';
import FramedButton from '../FramedButton';
import { setMemberIdOnCert } from '../../Actions/actions';
import { StoreState, UserProfile } from '../../Reducers/reducers';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  buttonText: {
    color: ColorTheme.SECONDARY,
    textAlign: 'center'
  }
});

interface OwnProps {
  userId?: string;
  uniqueId?: string;
  memberId?: string;
  shareLatest?: boolean;
  moduleName?: string;
  moduleKey?: string;
}

type State = {
  member: string;
  emailError: string;
  whatsAppError: string;
  name: string;
  jobTitle: string;
  nameError: string;
  jobTitleError: string;
  userLoginSelected: string;
  sendToAddressIdentifier: string;
};

interface PropsFromDispatch {
  closeModal(): void;
  openModal(modalType: string, modalProps?: object): void;
  setMemberIdOnCert(
    profileId: string,
    memberId: string,
    certUniqueId: string
  ): void;
}

interface PropsFromState {
  profileId: string;
  screen: { [key: string]: string };
  language: { [key: string]: string };
  user: UserProfile;
  selectedCountry?: string;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;
class ShareModuleCertModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      jobTitle: '',
      member: props.memberId || '',
      emailError: '',
      whatsAppError: '',
      nameError: '',
      jobTitleError: '',
      sendToAddressIdentifier: '',
      userLoginSelected:
        this.props.user && this.props.user.method
          ? this.props.user.method
          : 'Email'
    };
  }
  _getTextFromCMS(screenKey, fallback) {
    return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
  }
  private async _sendCertificate() {
    // Start the fetching modal
    this.props.openModal('SENDING_FETCH', {
      disableFloatingCloseButton: true,
      disableOnBackDropPress: true
    });

    const {
      language,
      user,
      moduleKey,
      selectedCountry,
      moduleName
    } = this.props;
    const {
      member,
      name,
      jobTitle,
      userLoginSelected,
      sendToAddressIdentifier
    } = this.state;
    const sendCertificateResult = await sendCertificate(
      language,
      sendToAddressIdentifier,
      member,
      name,
      jobTitle,
      user.profileId,
      user.moduleCertificates[moduleKey].id,
      selectedCountry,
      moduleName,
      userLoginSelected,
      moduleKey
    );

    if (sendCertificateResult) {
      // If the sending of the certificate went well, show the success modal, and after a while close it
      if (sendCertificateResult.status === true) {
        // Load the success modal
        this.props.openModal('SEND_CERTIFICATE_SUCCESS', {
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        });

        // Close the modal after a while
        return setTimeout(
          () => this.props.closeModal(),
          TIMINGS.modalHangtimeBeforeClose
        );
      } else {
        // Load the different error modals depending of the error result
        switch (sendCertificateResult.result) {
          case 'invalidUser':
            this.props.openModal('INVALID_USER', {
              disableFloatingCloseButton: true,
              disableOnBackDropPress: true
            });
            break;
          case 'certificateCouldNotBeSent':
            this.props.openModal('COULD_NOT_SEND_CERTIFICATE', {
              disableFloatingCloseButton: false,
              disableOnBackDropPress: false
            });
            break;
          case 'errorNoConnection':
            this.props.openModal('COULD_NOT_CONNECT_TO_NETWORK', {
              disableFloatingCloseButton: true,
              disableOnBackDropPress: true
            });
            break;
          default:
            this.props.openModal('NETWORK_ERROR', {
              disableFloatingCloseButton: true,
              disableOnBackDropPress: true
            });
            break;
        }

        // Close the modal after a while
        setTimeout(
          () => this.props.closeModal(),
          TIMINGS.modalHangtimeBeforeClose
        );
      }
    }
  }

  send() {
    const emailError = this._getTextFromCMS(
      'lp:claim_cert_name_error',
      'you need to enter a valid email for the certificate'
    );
    const whatsAppError = this._getTextFromCMS(
      'whatsApp_number_validation',
      'you must enter a valid WhatsApp number ie. +45 11223344'
    );

    // expression for correct WhatsApp number syntax
    let WhatsAppreg = WHATS_APP_REG;

    if (this.state.userLoginSelected === 'Email') {
      if (
        this.state.sendToAddressIdentifier.length < 3 ||
        this.state.sendToAddressIdentifier.indexOf('@') < 0 ||
        this.state.sendToAddressIdentifier[0] === '@' ||
        this.state.sendToAddressIdentifier[
          this.state.sendToAddressIdentifier.length - 1
        ] === '@'
      )
        return this.setState({ emailError });
    } else if (this.state.userLoginSelected === 'WhatsApp') {
      if (!WhatsAppreg.test(this.state.sendToAddressIdentifier.trim())) {
        return this.setState({ whatsAppError });
      }
    } else if (this.state.name.length === 0) {
      return this.setState({ nameError: 'Please enter a valid name' });
    } else if (this.state.jobTitle.length === 0) {
      return this.setState({ jobTitleError: 'Please enter a valid job title' });
    }
    this._sendCertificate();
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: ColorTheme.WHITE,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: ColorTheme.WHITE
        }}
      >
        <View style={{ margin: 12 }}>
          <View
            style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
          >
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE * 1.25,
                fontWeight: '500',
                textAlign: 'center'
              }}
            >
              {this.props.screen['lp:share_certificate']
                ? this.props.screen['lp:share_certificate']
                : 'share certificate'}
            </AppText>
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                marginTop: 12,
                marginBottom: 12,
                textAlign: 'center'
              }}
            >
              {this.props.screen['lp:share_certificate_body']
                ? this.props.screen['lp:share_certificate_body']
                : 'here you can get or share your certificate'}
            </AppText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <AppText style={{ fontWeight: 'bold' }}>
              {this._getTextFromCMS(
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
                  sendToAddressIdentifier: '',
                  userLoginSelected: 'Email',
                  whatsAppError: '',
                  emailError: ''
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
                  source={require('../../../img/settings/Email.png')}
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
                  {this._getTextFromCMS('lp:email', 'email')}
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
                  sendToAddressIdentifier: '',
                  userLoginSelected: 'WhatsApp',
                  whatsAppError: '',
                  emailError: ''
                })
              }
              style={{ alignContent: 'center', justifyContent: 'center' }}
            >
              <Image
                source={require('../../../img/settings/WhatsApp_Logo_7.png')}
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
          <UserInputField
            placeholder={
              this.props.screen['lp:input_placeholder_name']
                ? this.props.screen['lp:input_placeholder_name']
                : 'enter your name'
            }
            onChangeText={(name) => this.setState({ name, nameError: '' })}
            value={this.state.name}
            error_message={this.state.nameError}
          />
          <UserInputField
            placeholder={
              this.props.screen['lp:input_placeholder_job_title']
                ? this.props.screen['lp:input_placeholder_job_title']
                : 'enter your job_title'
            }
            onChangeText={(jobTitle) =>
              this.setState({ jobTitle, jobTitleError: '' })
            }
            value={this.state.jobTitle}
            error_message={this.state.jobTitleError}
          />
          <UserInputField
            value={this.state.member}
            placeholder={
              this.props.screen['lp:input_placeholder_member']
                ? this.props.screen['lp:input_placeholder_member']
                : 'member id (optional)'
            }
            onChangeText={(member) => this.setState({ member })}
            error_message={''}
          />
          {this.state.userLoginSelected === '' ? null : (
            <View>
              <UserInputField
                placeholder={
                  this.state.userLoginSelected === 'Email'
                    ? this.props.screen['lp:input_placeholder_email']
                      ? this.props.screen['lp:input_placeholder_email']
                      : 'enter your email'
                    : 'Enter your WhatsApp'
                }
                onChangeText={(WhatsApp) =>
                  this.setState({
                    sendToAddressIdentifier: WhatsApp,
                    whatsAppError: ''
                  })
                }
                error_message={
                  this.state.userLoginSelected === 'WhatsApp'
                    ? this.state.whatsAppError
                    : this.state.emailError
                }
                whatsAppNumberField={
                  this.state.userLoginSelected === 'Email' ? false : true
                }
                value={this.state.sendToAddressIdentifier}
              />
              {this.state.userLoginSelected !== 'WhatsApp' ? null : (
                <AppText
                  style={{
                    textAlign: 'left',
                    color: ColorTheme.SEPARATOR,
                    marginBottom: 10,
                    fontSize: 12
                  }}
                >
                  {this._getTextFromCMS(
                    'whatsApp_number_form_hint',
                    'a whatsApp number consitst of a + sign, a landcode number, and a phonenumber ie. +45 11223344'
                  )}
                </AppText>
              )}
            </View>
          )}
          <View style={{ alignItems: 'center' }}>
            <FramedButton
              label={
                this.props.screen['lp:share_certificate']
                  ? this.props.screen['lp:share_certificate']
                  : 'share'
              }
              style={Object.assign(Object.assign({}, styles.buttonText), {
                width: 250
              })}
              onPress={() => this.send()}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => {
  const { currentUser, userProfiles } = state;
  let user = null;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }
  return {
    screen: state.contentByLanguage[state.selectedLang].screen,
    language: state.contentByLanguage[state.selectedLang],
    profileId: state.currentUser.currentUser,
    user,
    selectedCountry: state.selectedCountry
  };
};
const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  setMemberIdOnCert: (profileId, member, certUniqueId) =>
    dispatch(setMemberIdOnCert(profileId, member, certUniqueId)),
  openModal: (modalType, modalProps) => {
    dispatch(openModal({ modalType, modalProps }));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModuleCertModal);
