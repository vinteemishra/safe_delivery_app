import * as React from "react";
import {
  View,
  Button,
  Platform,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";
import { RootModalProps } from "../../Reducers/modalReducer";
import AnimatedCheckBox from "../AnimatedCheckBox";
import { analytics } from "../../Utils/analytics";
const PLAY_ICON = require("../../../img/media_270px_vid.png");

interface ModalProps extends RootModalProps {
  onPress(status: boolean): void;
}

export interface SelectiveDownloadWarningModalType {
  modalType: "SELECTIVE_DOWNLOAD_WARNING";
  modalProps?: ModalProps;
}

interface OwnProps extends ModalProps {
  getTextFromCMS(screenKey: string, fallback: string): string;
  onRequestClose(): void;
}
const ANIMATION_TIME = 300;

export class SelectiveDownloadWarningModal extends React.Component<
  OwnProps,
  { checked: boolean }
> {
  opacityValue: any;

  constructor(props: OwnProps) {
    super(props);
    this.opacityValue = new Animated.Value(0);
    this.state = {
      checked: false,
    };
  }

  private onPrimaryPress() {
    const { onPress, onRequestClose } = this.props;
    const { checked } = this.state;
    onPress(checked);
    onRequestClose();
  }

  private onSecondaryPress() {
    const { onRequestClose } = this.props;

    onRequestClose();
  }

  private checkedChange() {
    // analytics.event("onboarding", `:check_accept:${JSON.stringify(newCheckedState)}:`);
    //Set the checked state
    this.setState({ checked: !this.state.checked });
  }

  private renderSecondaryButton() {
    const { getTextFromCMS } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          this.onSecondaryPress();
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <AppText style={[{ color: ColorTheme.PRIMARY }]}>
            {getTextFromCMS("cancel", "Cancel")}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }

  public render() {
    const { getTextFromCMS } = this.props;
    return (
      <View
        style={{
          backgroundColor: ColorTheme.SECONDARY,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: ColorTheme.SECONDARY,
          paddingTop: 24,
          paddingBottom: 16,
          alignItems: "center",
        }}
      >
        <Image
          key="play"
          source={PLAY_ICON}
          style={{ height: 76, width: 81, marginBottom: 30 }}
        />
        <AppText
          style={{
            fontSize: ColorTheme.FONT_SIZE * 1.1,
            textAlign: "center",
            marginBottom: 15,
            fontWeight: "bold",
          }}
        >
          {getTextFromCMS(
            "selective_download_warning_title",
            "Watching online"
          )}
        </AppText>
        <AppText
          style={{
            fontSize: ColorTheme.FONT_SIZE,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {getTextFromCMS(
            "selective_download_warning_message",
            "Videos are not downloaded to device. They will require internet and can involve additional data charges."
          )}
        </AppText>

        <View style={{ width: "100%", marginTop: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <AnimatedCheckBox
              borderColor={ColorTheme.PRIMARY}
              checkedFillColor={ColorTheme.PRIMARY}
              iconTintColor={ColorTheme.SECONDARY}
              borderWidth={1.5}
              animated={true}
              onPress={(a) => this.checkedChange()}
              checked={this.state.checked}
            />

            <AppText style={styles.toggleLabel}>
              Do not show this message again
            </AppText>
          </View>
          <FramedButton
            label={getTextFromCMS("watch_online", "Watch online")}
            style={[{ width: "100%", minWidth: 180 }]}
            onPress={() => this.onPrimaryPress()}
          />
          {this.renderSecondaryButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toggleLabel: {
    flex: 1,
    paddingTop: 10,
  },
});
