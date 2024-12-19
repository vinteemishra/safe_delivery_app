import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import ColorTheme from '../../Constants/ColorTheme';
import AppText from '../../Components/AppText';
import UserInputField from '../../Components/UserInputField';
import FramedButton from '../../Components/FramedButton';
import { TIMINGS, WHATS_APP_REG } from '../../Constants/Constants';
import { closeModal, openModal } from '../../Actions/modalActions';
import * as helpers from '../../Utils/helpers';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { StoreState } from '../../Reducers/reducers';
import { sendCertificate } from '../../Utils/sendMessage';
import { store } from '../../Utils/store';
import { setMemberIdOnCert } from '../../Actions/actions';

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

function getLatestCert(userId: string) {
  const profiles = store.getState().userProfiles;
  const profile = profiles[userId];
  const latestCertificate = [...(profile.profileCertificates || [])].pop();
  return latestCertificate;
}
function getProfileCountry(userId: string) {
  const profiles = store.getState().userProfiles;
  const profile = profiles[userId];
  return profile && profile.country ? profile.country : undefined;
}

interface OwnProps {
  screen: { [key: string]: string };
  language: { [key: string]: string };
  name: string;
  jobTitle: string;
  user: any;
  uniqueId?: string;
  memberId?: string;
  shareLatest?: boolean;
  userId?: string;
}

type State = {
  sendToAddressIdentifier: string;
  userLoginSelected: string;
  emailError: string;
  whatsAppError: string;
  member: string;
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
  screen: { [key: string]: string };
  language: { [key: string]: string };
  profileId: string;
  selectedCountry?: string;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

class ShareCertModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      sendToAddressIdentifier: '',
      userLoginSelected:
        this.props.user && this.props.user.method
          ? this.props.user.method
          : 'Email',
      emailError: '',
      whatsAppError: '',
      member: props.memberId || ''
    };
  }

  componentDidMount() {
    if (this.props.shareLatest) {
      const latest = getLatestCert(this.props.userId);
      this.setState({ member: latest.memberId || '' });
    }
  }

  private _getTextFromCMS(screenKey, fallback) {
    return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
  }

  private async _sendCertificate() {
    // Start the fetching modal
    this.props.openModal('SENDING_FETCH', {
      disableFloatingCloseButton: true,
      disableOnBackDropPress: true
    });

    const { language, userId, shareLatest, profileId } = this.props;
    let { name, jobTitle, uniqueId } = this.props;
    if (shareLatest === true) {
      const latest = getLatestCert(userId);
      name = latest.name;
      jobTitle = latest.jobTitle;
      uniqueId = latest.uniqueId;
    }

    const country = getProfileCountry(userId);

    // Await the sending of the certificate
    const { sendToAddressIdentifier, member } = this.state;
    const sendCertificateResult = await sendCertificate(
      language,
      sendToAddressIdentifier,
      member,
      name,
      jobTitle,
      userId,
      uniqueId,
      country || this.props.selectedCountry,
      undefined,
      this.state.userLoginSelected
    );
    this.props.setMemberIdOnCert(profileId, member, uniqueId);

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

  public send() {
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
    }

    this._sendCertificate();
  }

  public render() {
    return (
      // <AnimatedAvoidKeyboardContainer>
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
                fontWeight: 'bold',
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
                marginBottom: 20,
                textAlign: 'center'
              }}
            >
              {this.props.screen['lp:share_certificate_body']
                ? this.props.screen['lp:share_certificate_body']
                : 'here you can get or share your certificate'}
            </AppText>
            <UserInputField
              value={this.state.member}
              placeholder={
                this.props.screen['lp:input_placeholder_member']
                  ? this.props.screen['lp:input_placeholder_member']
                  : 'member id (optional)'
              }
              onChangeText={(member) => this.setState({ member })}
              error_message={undefined}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
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
              justifyContent: 'space-evenly',
              marginBottom: 20
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
          {this.state.userLoginSelected === '' ? null : (
            <View style={{ marginTop: -15 }}>
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
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <FramedButton
                  label={
                    this.props.screen['lp:share_certificate']
                      ? this.props.screen['lp:share_certificate']
                      : 'share'
                  }
                  style={[
                    {
                      ...styles.buttonText,

                      width: 250
                    }
                  ]}
                  onPress={() => this.send()}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      // </AnimatedAvoidKeyboardContainer>
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

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  closeModal: () => dispatch(closeModal()),
  openModal: (modalType: any, modalProps?: any) => {
    dispatch(openModal({ modalType, modalProps }));
  },
  setMemberIdOnCert: (profileId, member, certUniqueId) =>
    dispatch(setMemberIdOnCert(profileId, member, certUniqueId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareCertModal);
