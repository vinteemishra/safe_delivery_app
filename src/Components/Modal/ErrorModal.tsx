import * as React from 'react';
import { View } from 'react-native';
import AppText from '../AppText';
import ColorTheme from '../../Constants/ColorTheme';

interface OwnProps {
  getTextFromCMS(key: string, fallback: string): string;
  modalType?: string;
}

export default class ErrorModal extends React.Component<OwnProps> {
  render() {
    const { getTextFromCMS, modalType } = this.props;
    let errorDescription = '';
    switch (modalType) {
      case 'COULD_NOT_CREATE_PROFILE':
        errorDescription = getTextFromCMS(
          'could_not_create_user',
          'could not create user'
        );
        break;
      case 'PROFILE_EXISTS_WHATS_APP':
        errorDescription = getTextFromCMS(
          'whatsApp_user_exists',
          'a user with this WhatsApp number already exists'
        );
        break;
      case 'PROFILE_EXISTS_EMAIL':
        errorDescription = getTextFromCMS(
          'lp:email_already_exists_error',
          'a user with this email already exists'
        );
        break;
      case 'PROFILE_DO_NOT_EXIST':
        errorDescription = getTextFromCMS(
          'lp:network_call_invalid_user',
          'user does not exist'
        );
        break;
      case 'PASSWORD_DOES_NOT_MATCH_WHATS_APP':
        errorDescription = getTextFromCMS(
          'whatsApp_password_do_not_match',
          'password do not match the one sent to WhatsApp!'
        );
        break;
      case 'PASSWORD_COULD_NOT_BE_RESET':
        errorDescription = getTextFromCMS(
          'password_reset_failed',
          'the password could not be reset!'
        );
        break;
      case 'COULD_NOT_CONNECT_TO_NETWORK':
        errorDescription = getTextFromCMS(
          'lp:network_error',
          'could not connect to the network'
        );
        break;
      case 'COULD_NOT_SEND_CODE':
        errorDescription = getTextFromCMS(
          'password_sent_failed',
          'could not send code'
        );
        break;
      case 'INVALID_USER':
        errorDescription = getTextFromCMS(
          'lp:share_cert_invalid_user',
          'invalid user'
        );
        break;
      case 'NETWORK_ERROR':
        errorDescription = getTextFromCMS(
          'lp:share_cert_network_error',
          'network error'
        );
        break;
      case 'EMAIL_IN_USE':
        errorDescription = getTextFromCMS(
          'lp:update_account_email_in_use',
          'email already in use'
        );
        break;
      case 'WHATSAPP_IN_USE':
        errorDescription = getTextFromCMS(
          'lp:update_account_whatsapp_in_use',
          'whatsapp already in use'
        );
        break;
      case 'COULD_NOT_UPDATE_PASSWORD':
        errorDescription = getTextFromCMS(
          'lp:update_account_invalid_user_or_pass',
          'invalid user or password'
        );
        break;
      case 'COULD_NOT_SEND_CERTIFICATE':
        errorDescription = getTextFromCMS(
          'could_not_share_certificate',
          'could not share the certificate!'
        );
        break;
      default:
        errorDescription = getTextFromCMS('lp:error', 'error');
        break;
    }

    const error = getTextFromCMS('lp:error', 'error');

    return (
      <View style={{ paddingTop: 20, paddingBottom: 20 }}>
        <AppText
          style={{
            textAlign: 'center',
            fontSize: ColorTheme.FONT_SIZE * 1.2,
            marginTop: 12,
            marginLeft: 16,
            marginRight: 16,
            fontWeight: 'bold'
          }}
        >
          {error}
        </AppText>
        <AppText
          style={{
            textAlign: 'center',
            margin: 16,
            color: ColorTheme.WARNING,
            fontSize: ColorTheme.FONT_SIZE
          }}
        >
          {errorDescription}
        </AppText>
      </View>
    );
  }
}
