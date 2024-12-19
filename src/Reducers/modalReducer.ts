import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { closeModal, openModal } from '../Actions/modalActions';
import { IndexLanguageType } from './downloadReducer';

import { SelectiveDownloadWarningModalType } from '../Components/Modal/SelectiveDownloadWarningModal';

type ErrorModalType =
  | 'COULD_NOT_CONNECT_TO_NETWORK'
  | 'COULD_NOT_CREATE_PROFILE'
  | 'PROFILE_EXISTS_WHATS_APP'
  | 'PROFILE_EXISTS_EMAIL'
  | 'PROFILE_DO_NOT_EXIST'
  | 'PASSWORD_DOES_NOT_MATCH_WHATS_APP'
  | 'PASSWORD_COULD_NOT_BE_RESET'
  | 'COULD_NOT_SEND_CODE'
  | 'INVALID_USER'
  | 'NETWORK_ERROR'
  | 'COULD_NOT_SEND_CERTIFICATE'
  | 'EMAIL_IN_USE'
  | 'LINKING_ERROR';

type SuccessModalType =
  | 'SEND_PASSWORD_SUCCESS'
  | 'CREATE_PROFILE_SUCCESS'
  | 'UPDATE_ONLINE_PROFILE_SUCCESS'
  | 'SEND_CERTIFICATE_SUCCESS';

type WarningModalType = 'EXTERNAL_LINK_WARNING' | 'SELECTIVE_DOWNLOAD_WARNING';

export type ModalType =
  | ErrorModalType
  | SuccessModalType
  | SuccessModalType
  | WarningModalType
  | 'CREATE_SIMPLE_PROFILE_SUCCESS'
  | 'CREATE_PROFILE_SUCCESS'
  | 'SEND_PASSWORD_SUCCESS'
  | 'WHATSAPP_PASSWORD_RESET_SUCCESS'
  | 'EMAIL_PASSWORD_RESET_SUCCESS'
  | 'CREATE_PROFILE_FETCH'
  | 'SENDING_FETCH'
  | 'CLAIM_CERTIFICATE'
  | 'DISMISS_QUIZ'
  | 'UPDATE_ONLINE_PROFILE'
  | 'LOGOUT_MODAL'
  | 'DOWNLOAD_LANGUAGE'
  | 'SHARE_CERTIFICATE'
  | 'SELECT_COUNTRY'
  | 'UPDATE_USER_INFORMATION_SUCCESS'
  | 'UPDATE_USER_NO_CHANGE'
  | 'UPDATE_USER_PROFILE_SUCCESS'
  | 'UPDATE_USER_PASSWORD_SUCCESS'
  | 'COULD_NOT_UPDATE_PASSWORD'
  | 'DELETE_LANGUAGE'
  | 'FAKE_LOCATION'
  | 'USER_LOGIN'
  | 'RESET_PASSWORD'
  | 'USER_LOGIN_SUCCESS'
  | 'BASE_NOTIFICATION_MODAL'
  | 'ANNOUNCEMENT_MODAL'
  | 'SYNC_PROFILES_MODAL'
  | 'DOWNLOAD_VIDEO_ASSETS'
  | 'NETWORK_CALL'
  | 'CONFIRM_SELECTIVE_DOWNLOAD'
  | 'SHARE_MODULE_CERTIFICATE'
  | 'SEND_WHATS_APP_NUMBER'
  | 'WHATSAPP_IN_USE'
  | null;

export type RootModalProps = {
  disableFloatingCloseButton?: boolean;
  disableOnBackDropPress?: boolean;
  onCloseModal?(): void;
  onModalDidHide?(): void;
  timedClose?: number;
};

export type ModalTypes = SelectiveDownloadWarningModalType;
export type ModalProps = {
  disableFloatingCloseButton?: boolean;
  disableOnBackDropPress?: boolean;
  language?: IndexLanguageType;
  name?: string;
  certId?: string;
  jobTitle?: string;
  shareLatest?: boolean;
  user?: any;
  link?: string;
  title?: string;
  body?: string;
  icon?: any;
  headerText?: string;
  bodyText?: string;
  bodyText2?: string;
  label?: string;
  buttonFunction?(...args: any): any;
  secondaryButtonFunction?(...args: any): string;
  onCloseModal?(): void;
  onModalDidHide?(): void;
  time_left_in_seconds?: number;
  score?: number;
  message?: string;
  fetchingDone?: boolean;
  timedClose?: number;
  moduleName?: string;
};

export interface ModalState {
  modalType: ModalType;
  modalProps: ModalProps;
}

const INITIAL_STATE = {
  modalType: null,
  modalProps: {}
};

export const modalReducer = (
  state: ModalState = { ...INITIAL_STATE },
  action: Action
): ModalState => {
  if (isType(action, openModal)) {
    console.log('action', action);
    return {
      modalType: action.payload.modalType,
      modalProps: action.payload.modalProps ? action.payload.modalProps : {}
    };
  }

  if (isType(action, closeModal)) {
    console.log('modalReducer closeModal');
    return {
      ...INITIAL_STATE
    };
  }
  return state;
};
