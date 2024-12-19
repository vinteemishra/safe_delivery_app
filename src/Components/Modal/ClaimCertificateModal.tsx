import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AppText from '../AppText';
import FramedButton from '../FramedButton';
import ColorTheme from '../../Constants/ColorTheme';
import UserInputField from '../../Components/UserInputField';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { StoreState } from '../../Reducers/reducers';
import { TIMINGS } from '../../Constants/Constants';
import NavigationService from './../NavigationService';

import { closeModal, openModal } from '../../Actions/modalActions';
import AnimatedAvoidKeyboardContainer from '../AnimatedAvoidKeyboardContainer';
import { claimCertificate } from '../../Actions/learningActions';
import { getTextFromCMS } from '../../Utils/helpers';
import { ModalProps, ModalType } from '../../Reducers/modalReducer';

type OwnProps = {
  onRequestClose: () => void;
  navigateBack: () => void;
  onClaim: (name: string, jobTitle: string) => void;
  user: any;
  certId: any;
};

type State = {
  name: string;
  jobTitle: string;
  nameError: string;
  jobTitleError: string;
};

interface PropsFromDispatch {
  closeModal(): void;
  openModal(modalType: ModalType, modalProps?: ModalProps): void;
  claimCertificate(name: string, jobTitle: string, certId: string): void;
}

interface PropsFromState {
  getTextFromCMS(screnKey: string, fallback: string): string;
  selectedCountry: string;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

class ClaimCertificateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      jobTitle: '',
      nameError: '',
      jobTitleError: ''
    };
  }

  closeAndShare() {
    //Close the Claim certificate modal
    this.props.closeModal();

    //Load the CertificateCentralScreen
    setTimeout(() => {
      NavigationService.navigate('CertificateCentralScreen', {
        title: this.props.getTextFromCMS(
          'lp:certificate_center_title',
          'certification center'
        )
      });
    }, TIMINGS.modalTimningBeforeOpenNewModal);

    if (this.props.user && this.props.user.profileCertificates) {
      const modalProps = {
        shareLatest: true,
        userId: this.props.user.profileId
      };

      if (
        this.props.selectedCountry == null ||
        this.props.selectedCountry === 'Unknown'
      ) {
        const selectCountryProps = {
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true,
          onModalDidHide: () => {
            this.props.openModal('SHARE_CERTIFICATE', modalProps);
          }
        };
        setTimeout(
          () => this.props.openModal('SELECT_COUNTRY', selectCountryProps),
          TIMINGS.modalTimningBeforeOpenNewModal + 350
        );
      } else {
        //Load the share certificate modal
        setTimeout(
          () => this.props.openModal('SHARE_CERTIFICATE', modalProps),
          TIMINGS.modalTimningBeforeOpenNewModal + 350
        );
      }
    }
  }

  claim() {
    const { getTextFromCMS, certId } = this.props;

    let valid = true;

    if (this.state.name.trim().length <= 0) {
      valid = false;
      this.setState({
        nameError: getTextFromCMS(
          'lp:claim_cert_name_error',
          'you need to enter a name for the certificate'
        )
      });
    }
    if (this.state.jobTitle.trim().length <= 0) {
      valid = false;
      this.setState({
        jobTitleError: getTextFromCMS(
          'lp:claim_cert_jobtitle_error',
          'you have not entered your job title'
        )
      });
    }
    if (this.state.name.trim().length > 18) {
      valid = false;
      this.setState({
        nameError: getTextFromCMS(
          'lp:claim_cert_char_error',
          'you have entered more than the maximum 18 chars allowed'
        )
      });
    }
    if (this.state.jobTitle.trim().length > 18) {
      valid = false;
      this.setState({
        jobTitleError: getTextFromCMS(
          'lp:claim_cert_char_error',
          'you have entered more than the maximum 18 chars allowed'
        )
      });
    }

    if (valid) {
      this.claimComplete(this.state.name, this.state.jobTitle, certId);
    }
  }

  claimComplete(name, job_title, certId) {
    this.props.claimCertificate(name, job_title, certId);
    setTimeout(() => this.closeAndShare(), 350);
  }

  render() {
    const { getTextFromCMS } = this.props;

    return (
      // <AnimatedAvoidKeyboardContainer>
      <View
        style={{
          backgroundColor: ColorTheme.SECONDARY,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: ColorTheme.SECONDARY
        }}
      >
        <View style={{ margin: 20 }}>
          <View
            style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
          >
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE * 1.25,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {getTextFromCMS('lp:claim_cert_header', 'claim your certificate')}
            </AppText>
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE,
                marginTop: 8,
                marginBottom: 12,
                textAlign: 'center'
              }}
            >
              {getTextFromCMS(
                'lp:claim_permanent_warning',
                'the information will appear on the certificate and cannot be changed after pressing "Claim".'
              )}
            </AppText>
          </View>
          <UserInputField
            placeholder={getTextFromCMS(
              'lp:input_placeholder_name',
              'enter your name'
            )}
            onChangeText={(name) =>
              this.setState({ name: name, nameError: '' })
            }
            error_message={this.state.nameError}
            value={this.state.name}
          />
          <UserInputField
            placeholder={getTextFromCMS(
              'lp:input_placeholder_job_title',
              'enter your job title'
            )}
            onChangeText={(jobTitle) =>
              this.setState({ jobTitle: jobTitle, jobTitleError: '' })
            }
            error_message={this.state.jobTitleError}
            value={this.state.jobTitle}
          />
        </View>
        <FramedButton
          label={getTextFromCMS(
            'lp:certificate_center_hint_claim_button',
            'claim'
          )}
          style={[, { marginTop: -25, marginBottom: 12, width: 150 }]}
          onPress={() => this.claim()}
        />
      </View>
      // </AnimatedAvoidKeyboardContainer>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => ({
  selectedCountry: state.selectedCountry,
  getTextFromCMS: (screenKey, fallback) => {
    const screen = state.contentByLanguage[state.selectedLang].screen;
    return getTextFromCMS(screen, screenKey, fallback);
  }
});

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  closeModal: () => dispatch(closeModal()),
  openModal: (modalType, modalProps?) => {
    dispatch(openModal({ modalType, modalProps }));
  },
  claimCertificate: (name, jobTitle, certId) => {
    dispatch(claimCertificate({ name, jobTitle, certId }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimCertificateModal);
