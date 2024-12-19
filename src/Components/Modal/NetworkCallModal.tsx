import * as React from "react";
import FetchingDoneBox from "../FetchingDoneBox";
import FetchingBox from "../FetchingBox";

interface OwnProps {
  getTextFromCMS(key: string, fallback: string): string;
  fetchingDone: boolean;
  name?: string;
  fetchError?: String;
  timedClose?: number;
  onRequestClose: () => void;
}

type Props = OwnProps;

export default class NetworkCallModal extends React.Component<Props> {
  private closeTimer: any;
  componentDidMount() {
    console.log("NetworkCallModel didMount", this.props.timedClose);
    clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
    if (this.props.timedClose) {
      this.closeTimer = setTimeout(() => {
        console.log("timedClose NetworkCallModal");
        this.props.onRequestClose();
      }, this.props.timedClose);
      console.log("closeTimer", this.closeTimer);
    }
  }

  componentDidUpdate(prevProps: Props) {
    console.log("NetworkCallModel didUpdate", this.props.timedClose);
    if (prevProps.timedClose !== this.props.timedClose) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
      if (this.props.timedClose) {
        this.closeTimer = setTimeout(() => {
          console.log("timedClose NetworkCallModal");
          this.props.onRequestClose();
        }, this.props.timedClose);
      }
    }
  }
  public render() {
    const { getTextFromCMS, fetchingDone, name, fetchError } = this.props;
    console.log("fetchingDone", fetchingDone);
    return (
      <>
        {fetchingDone === false ? (
          <FetchingBox
            loadingText={getTextFromCMS(
              "lp:network_call_logging_in",
              "logging in..."
            )}
          />
        ) : (
          <FetchingDoneBox
            profileName={name}
            fetchingDoneHeader={getTextFromCMS(
              "lp:network_call_success",
              "sucess"
            )}
            fetchingDoneHeader2={getTextFromCMS(
              "lp:network_call_success_upgrade_user",
              "account upgraded"
            )}
            fetchingDoneBody={getTextFromCMS(
              "lp:network_call_success_add_user",
              "welcome to your personal learning journey"
            )}
            fetchingErrorStatus={fetchError}
            fetchingErrorHeader={getTextFromCMS("lp:error", "error")}
          />
        )}
      </>
    );
  }
}
