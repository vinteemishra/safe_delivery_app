import * as React from "react";
import { View, Image } from "react-native";
import AppText from "../AppText";
import ColorTheme from "../../Constants/ColorTheme";
import { ModalType } from "../../Reducers/modalReducer";

interface OwnProps {
    getTextFromCMS(key: string, fallback: string): string;
    modalType?: ModalType;
}

export default class SuccessModal extends React.Component<OwnProps> {
    render() {

        const { getTextFromCMS, modalType } = this.props;

        let header = "";
        let body = undefined;

        switch (modalType) {
            case "SEND_PASSWORD_SUCCESS":
                header = getTextFromCMS("password_sent_success", "password has been sent");
                break;
            case "WHATSAPP_PASSWORD_RESET_SUCCESS":
                header = getTextFromCMS("whatsApp_password_has_reset", "the password has now been reset");
                break;
            case "EMAIL_PASSWORD_RESET_SUCCESS":
                header = getTextFromCMS('lp:network_call_resetting_password_succss', 'a new password has been sent to your email');
                break;
            case "CREATE_PROFILE_SUCCESS":
                header = getTextFromCMS('lp:network_call_success', 'sucess');
                body = getTextFromCMS('lp:network_call_success_add_user', 'welcome to your personal learning journey');
                break;
            case "UPDATE_ONLINE_PROFILE_SUCCESS":
                header = getTextFromCMS('lp:logout_done_message', 'user logged out');
                break;
            case "SEND_CERTIFICATE_SUCCESS":
                header = getTextFromCMS('lp:share_cert_email_sent', 'certificate sent');
                break;
            case "UPDATE_USER_NO_CHANGE":
                header = getTextFromCMS('lp:add_new_user_password_error', 'no information has been changed');
                break;
            case "UPDATE_USER_INFORMATION_SUCCESS":
                header = getTextFromCMS('lp:update_account_complete', 'user profile has been updated!');
                break;
            case "UPDATE_USER_PASSWORD_SUCCESS":
                header = getTextFromCMS('lp:update_password_complete', 'your password has been updated!');
                break;
            case "USER_LOGIN_SUCCESS":
                header = getTextFromCMS('lp:network_call_login_success', 'welcome back');
                break;
            default:
                header = getTextFromCMS('lp:network_call_success', 'success');
                break;
        }

        return (
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                {header && <AppText style={{ textAlign: 'center', fontSize: ColorTheme.FONT_SIZE * 1.2, marginLeft: 16, marginRight: 16, marginBottom: 16, fontWeight: body == undefined ? 'normal' : 'bold' }}>{header}</AppText>}
                <Image source={require('../../../img/learning_icons/success.png')} style={{ alignSelf: "center", width: 48, height: 36 }} />
                {body && <AppText style={{ textAlign: 'center', marginLeft: 16, marginRight: 16, marginTop: 20 }}>{body}</AppText>}
            </View>
        )
    }
}