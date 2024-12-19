import * as React from "react";
import FetchingBox from "../FetchingBox";
interface OwnProps {
  getTextFromCMS(key: string, fallback: string): string;
  method?: string;
  modalType?: string;
}

export default class FetchModal extends React.Component<OwnProps> {
  render() {
    const { getTextFromCMS, method, modalType } = this.props;

    let loadingText = "";

    switch (modalType) {
      case "SENDING_FETCH":
        loadingText = getTextFromCMS("sending", "sending...");
        break;
      case "UPDATE_USER_PROFILE_SUCCESS":
        loadingText = getTextFromCMS("updating", "updating...");
        break;
      case "USER_LOGIN":
        loadingText = getTextFromCMS(
          "lp:network_call_logging_in",
          "logging in..."
        );
        break;
      case "RESET_PASSWORD":
        loadingText = getTextFromCMS(
          "lp:network_call_resetting_password",
          "resetting password..."
        );
        break;
      case "SUBMIT_FEEBACK":
        loadingText = "Submitting Feedback";
      default:
        loadingText = getTextFromCMS("fetching", "fetching...");
        break;
    }

    return <FetchingBox loadingText={loadingText} />;
  }
}
