import * as React from 'react';
import LightBoxModal from '../LightBoxModal';
import { View } from 'react-native';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { StoreState } from '../../Reducers/reducers';
import { closeModal } from '../../Actions/modalActions';
// import CreateSimpleProfileSuccess from "./CreateSimpleProfileSuccessModal"
// import CreateProfileSuccessModal from "./CreateProfileSuccessModal"
import ErrorModal from './ErrorModal';
import CreateProfileFetchModal from './CreateProfileFetchModal';
// import WhatsAppFetchModal from "./WhatsAppFetchModal"
import ClaimCertificateModal from './ClaimCertificateModal';
// import DismissQuizModal from "./DismissQuizModal"
// import LogoutModal from "./LogoutModal"
// import DownloadConfirmModal from "./DownloadConfirmModal"
import { getTextFromCMS } from '../../Utils/helpers';
import NavigationService from '../NavigationService';
import { ModalType } from '../../Reducers/modalReducer';
import NotificationMessage from '../NotificationMessage';
import { ContentUpdateAvaliableModal } from './ContentUpdateAvaliableModal';
import NotificationsModal from '../NotificationsModal';
import SyncProfilesModal from '../SyncProfilesModal';
// import SendPasswordSuccessModal from "./SendPasswordSuccessModal"
import SuccessModal from './SuccessModal';
import FetchModal from './FetchModal';
import ShareCertModal from './ShareCertModal';
import SelectCountryModal from './SelectCountryModal';
import { LinkingErrorModal } from './LinkingErrorModal';
import { ExternalLinkWarning } from './ExternalLinkWarning';
import CreateSimpleProfileSuccessModal from './CreateSimpleProfileSuccessModal';
import NetworkCallModal from './NetworkCallModal';
import { DownloadVideoAssetsModal } from './DownloadVideoAssetsModal';
import { DeleteLanguageModal } from './DeleteLanguageModal';
import DownloadConfirmModal from './DownloadConfirmModal';
import { ConfirmSelectiveDownloadModal } from './ConfirmSelectiveDownloadModal';
import { SelectiveDownloadWarningModal } from './SelectiveDownloadWarningModal';
// import deleteConfirmModal from "./deleteConfirmModal"
// import FakeLocationModal from "./FakeLocationModal"
import ShareModuleCert from './ShareModuleCertModal';
import ArabicDisclamer from './ArabicDisclamer';
import SafeAbortionDisclamer from './SafeAbortionDisclamer';
interface OwnProps {}

interface PropsFromState {
  modalType: ModalType;
  modalProps?: { [key: string]: any };
  screen?: any;
}

interface PropsFromDispatch {
  onRequestClose(): void;
}

interface State {
  type: any;
  data: { [key: string]: any };
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class ModalRoot extends React.Component<Props, State> {
  private getText = (key: string, fallback: string): string => {
    return getTextFromCMS(this.props.screen, key, fallback);
  };

  private MODAL_COMPONENTS = {
    CREATE_SIMPLE_PROFILE_SUCCESS: CreateSimpleProfileSuccessModal,
    // // CREATE_PROFILE_SUCCESS: CreateProfileSuccessModal,
    CREATE_PROFILE_SUCCESS: SuccessModal,
    // UPDATE_USER_NO_CHANGE: SuccessModal,
    UPDATE_USER_INFORMATION_SUCCESS: SuccessModal,
    // UPDATE_USER_PASSWORD_SUCCESS: SuccessModal,
    USER_LOGIN_SUCCESS: SuccessModal,
    COULD_NOT_CONNECT_TO_NETWORK: ErrorModal,
    COULD_NOT_SEND_CERTIFICATE: ErrorModal,
    COULD_NOT_UPDATE_PASSWORD: ErrorModal,
    EMAIL_IN_USE: ErrorModal,
    WHATSAPP_IN_USE: ErrorModal,
    COULD_NOT_CREATE_PROFILE: ErrorModal,
    PROFILE_EXISTS_WHATS_APP: ErrorModal,
    PROFILE_EXISTS_EMAIL: ErrorModal,
    PROFILE_DO_NOT_EXIST: ErrorModal,
    PASSWORD_DOES_NOT_MATCH_WHATS_APP: ErrorModal,
    PASSWORD_COULD_NOT_BE_RESET: ErrorModal,
    CREATE_PROFILE_FETCH: CreateProfileFetchModal,
    SEND_WHATS_APP_NUMBER: FetchModal,
    SENDING_FETCH: FetchModal,
    UPDATE_USER_PROFILE_SUCCESS: FetchModal,
    USER_LOGIN: FetchModal,
    RESET_PASSWORD: FetchModal,
    COULD_NOT_SEND_CODE: ErrorModal,
    // SEND_PASSWORD_SUCCESS: SendPasswordSuccessModal,
    SEND_PASSWORD_SUCCESS: SuccessModal,
    WHATSAPP_PASSWORD_RESET_SUCCESS: SuccessModal,
    EMAIL_PASSWORD_RESET_SUCCESS: SuccessModal,
    SEND_CERTIFICATE_SUCCESS: SuccessModal,
    CLAIM_CERTIFICATE: ClaimCertificateModal,
    // DISMISS_QUIZ: DismissQuizModal,
    // UPDATE_ONLINE_PROFILE: FetchModal,
    // UPDATE_ONLINE_PROFILE_SUCCESS: SuccessModal,
    // LOGOUT_MODAL: LogoutModal,
    DOWNLOAD_LANGUAGE: DownloadConfirmModal,
    DELETE_LANGUAGE: DeleteLanguageModal,
    SHARE_CERTIFICATE: ShareCertModal,
    SELECT_COUNTRY: SelectCountryModal,
    // FAKE_LOCATION: FakeLocationModal,
    ANNOUNCEMENT_MODAL: NotificationMessage,
    CONTENT_UPDATE_AVALIABLE: ContentUpdateAvaliableModal,
    BASE_NOTIFICATION_MODAL: NotificationsModal,
    SYNC_PROFILES_MODAL: SyncProfilesModal,
    LINKING_ERROR: LinkingErrorModal,
    EXTERNAL_LINK_WARNING: ExternalLinkWarning,
    DOWNLOAD_VIDEO_ASSETS: DownloadVideoAssetsModal,
    NETWORK_CALL: NetworkCallModal,
    CONFIRM_SELECTIVE_DOWNLOAD: ConfirmSelectiveDownloadModal,
    SELECTIVE_DOWNLOAD_WARNING: SelectiveDownloadWarningModal,
    ARABIC_DISCLAMER: ArabicDisclamer,
    SHARE_MODULE_CERTIFICATE: ShareModuleCert,
    SAFE_ABORTION_DISCLAMER: SafeAbortionDisclamer
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      type: this.props.modalType,
      data: this.props.modalProps
    };
  }

  public componentDidUpdate(prevProps) {
    // console.log("componentDidUpdate", prevProps, "props", this.props)
    if (this.props.modalType != null && prevProps !== this.props) {
      this.setState({
        type: this.props.modalType,
        data: this.props.modalProps
      });
    }
  }

  private onRequestClose() {
    this.props.onRequestClose();
    if (this.state.data && this.state.data.onCloseModal) {
      console.log('in onCloseModal', this.state.data);
      this.state.data.onCloseModal();
    }
  }

  private handleModalHide() {
    this.setState({ type: null });
    if (this.state.data && this.state.data.onModalDidHide) {
      console.log('onModalDidHide', this.state.data);
      this.state.data.onModalDidHide();
    }
  }

  render() {
    const { modalType } = this.props;
    const { type, data } = this.state;
    console.log('modalType', type, 'modalRoot data', data);
    const SpecificModal =
      type !== null && this.MODAL_COMPONENTS[type]
        ? this.MODAL_COMPONENTS[type]
        : null;

    return (
      <LightBoxModal
        onModalHide={() => this.handleModalHide()}
        visible={modalType !== null}
        onRequestClose={() => this.onRequestClose()}
        floatingCloseButtonVisible={
          data.disableFloatingCloseButton ? false : true
        }
        disableOnBackDropPress={data.disableOnBackDropPress ? true : false}
        closeText={this.getText('close', 'close')}
      >
        <View
          style={{
            borderRadius: 5,
            paddingRight: 16,
            paddingLeft: 16,
            minHeight: 30
          }}
        >
          {SpecificModal && (
            <SpecificModal
              modalType={type}
              onRequestClose={() => this.onRequestClose()}
              getTextFromCMS={this.getText}
              navigateBack={() => NavigationService.pop()}
              {...data}
            />
          )}
        </View>
      </LightBoxModal>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => ({
  modalType: state.modalReducer.modalType,
  modalProps: state.modalReducer.modalProps,
  screen: state.contentByLanguage[state.selectedLang].screen
});

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch,
  props
) => ({
  onRequestClose: () => dispatch(closeModal())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalRoot);
