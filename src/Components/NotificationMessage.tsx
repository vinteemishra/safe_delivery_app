import React, { Component } from "react";
import { Image, TouchableOpacity, View, Linking } from "react-native";
import { connect, MapDispatchToProps } from "react-redux";
import AppText from "./AppText";
import ColorTheme from "../Constants/ColorTheme";
import NavigationService from "./NavigationService";
// import AnalyticsTracker from '../Components/AnalyticsTracker';
import { analytics } from "../Utils/analytics";
import FramedButton from "./FramedButton";
import * as helpers from "../Utils/helpers";
import { selectModule } from "../Actions/actions";
import AnalyticsTracker from "./AnalyticsTracker";
interface OwnProps {
  onRequestClose(): void;
  onRequestReopen(): void;
  message: string;
  link: string;
  title: string;
}

interface PropsFromState {
  language: any;
  getTextFromCMS(screenKey: string, fallback: string): string;
}

interface PropsFromDispatch {
  setModule(module: string): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;
class NotificationMessage extends Component<Props> {
  clickDisabled: boolean;

  componentDidMount() {
    analytics.event("notificationMessage", `:${this.props.link}:`);
  }

  onClose() {
    this.props.onRequestClose();
  }

  onNext(link) {
    if (!this.clickDisabled) {
      let split = link.split(":");
      let prefix = split[0];
      let path = split[1];
      if (prefix === "video") {
        this.goToVideo(path);
      } else if (prefix === "action-card") {
        this.goToRichText(prefix, path);
      } else if (prefix === "drug") {
        this.goToRichText(prefix, path);
      } else if (prefix === "procedure") {
        this.goToRichText(prefix, path);
      } else if (prefix === "module") {
        if (this.props.language[path]) {
          Linking.openURL(`safedelivery://${path}`);
        }
        this.onClose();
      } else this.onClose();

      this.clickDisabled = true;
      setTimeout(() => {
        this.clickDisabled = false;
      }, 300);
    }
  }

  goToVideo(path) {
    let videos = this.props.language["videos"];
    for (let i = 0; i < videos.length; i++) {
      if (path !== "" && videos[i].id.includes(path)) {
        this.onClose();
        NavigationService.navigate("VideoChapterScreen", {
          playlist: [videos[i]],
          title: this.props.language.screen.videos,
          onBack: () => {
            NavigationService.pop();
            this.props.onRequestReopen();
          },
        });
        break;
      } else this.onClose();
    }
  }

  goToRichText(prefix, path) {
    this.onClose();
    if (this.props.language[path].chapters) {
      if (this.props.language[path].chapters.length === 1) {
        NavigationService.navigate("NotificationChapter", {
          title: this.props.language[path].description,
          content: this.props.language[path].chapters[0].content,
          contentType: prefix,
        });
      } else {
        NavigationService.navigate("NotificationLinkStack", {
          title: this.props.language[path].description,
          content: this.props.language[path].chapters,
          id: this.props.language[path].id,
          contentType: prefix,
        });
      }
    } else {
      NavigationService.navigate("NotificationChapter", {
        title: this.props.language[path].description,
        content: this.props.language[path].content,
        id: this.props.language[path].id,
        contentType: prefix,
      });
    }
  }
  render() {
    const { message, link, title, getTextFromCMS } = this.props;
    return (
      <View style={{ backgroundColor: ColorTheme.SECONDARY }}>
        <View style={{ padding: 10, paddingTop: 20, paddingBottom: 10 }}>
          {typeof title !== "undefined" && title != "" ? (
            <AppText
              style={{
                fontSize: ColorTheme.FONT_SIZE * 1.1,
                fontWeight: "700",
                marginTop: 10,
              }}
            >
              {title}
            </AppText>
          ) : null}
          <AppText style={{ flexWrap: "wrap", marginTop: 16 }}>
            {message}
          </AppText>
        </View>
        {link && (
          <FramedButton
            label={getTextFromCMS("learn_more", "learn more")}
            onPress={() => this.onNext(link)}
          />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  const getTextFromCMS = (screenKey, fallback) =>
    helpers.getTextFromCMS(language.screen, screenKey, fallback);
  return { language, getTextFromCMS };
}

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  setModule: (module) => {
    dispatch(selectModule(module));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationMessage);
