import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
import * as CONSTANTS from "../Constants/Constants";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { connect, MapDispatchToProps } from "react-redux";
import * as helpers from "../Utils/helpers";
import { invalidateLang, setPreBuild } from "../Actions/actions";
import { NavigationStackProp } from "react-navigation-stack";
import { setupNotifications } from "../Actions/notificationActions";

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

interface PropsFromDispatch {
  invalidateLang(langId: string);
  isPreBuild(isPreBuild: boolean): void;
  setupNotifications(): void;
}

interface PropsFromState {
  getTextFromCMS(screenKey: string, fallback: string): void;
  mustShowOnboarding: boolean;
  canShowOnboarding: boolean;
  languageContent: any;
  installInProgress: boolean;
  showDeliveriesQuestionDate: number;
  isHealthCareWorker: boolean;
  installSucceeded: boolean;
}

type Props = PropsFromState & OwnProps & PropsFromDispatch;
class AssetsLoadingScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.checkIfInstallFinished();
  }
  public componentDidUpdate(prevProps, prevState) {
    this.checkIfInstallFinished();
  }

  private checkIfInstallFinished() {
    const {
      mustShowOnboarding,
      canShowOnboarding,
      navigation,
      invalidateLang,
      showDeliveriesQuestionDate,
      isHealthCareWorker,
    } = this.props;
    if (this.props.installInProgress) {
      return;
    }

    if (!this.props.installSucceeded) {
      return this.props.navigation.navigate("InitialDownload");
    }

    if (mustShowOnboarding) {
      if (canShowOnboarding) {
        this.props.navigation.navigate("Onboarding");
        return;
      } else {
        console.log("could not show onboarding");
        invalidateLang(this.props.languageContent.langId);
      }
    }
    this.props.setupNotifications();
    this.props.navigation.navigate("App");
    if (
      new Date().getTime() >= showDeliveriesQuestionDate &&
      isHealthCareWorker === true
    ) {
      //The getTime() needs to be >= showDeliveriesQuestionDate and the user has to answer "Yes" to the health care worker question in the onboarding!
      this.props.navigation.navigate("UserSurveyQuestionsScreen", {
        from: "AppLoadingScreen",
        hideBackButton: true,
      });
    }
  }

  public render() {
    return (
      <View style={styles.fetchContainer}>
        <AnalyticsTracker eventType="assetsLoading" eventData={`::`} />
        <AppText
          style={{
            color: "white",
            fontSize: ColorTheme.FONT_SIZE,
            textAlign: "center",
          }}
        >
          {this.props.getTextFromCMS("loading_content", "Setting up content..")}
        </AppText>
        <ActivityIndicator
          style={{ margin: 24 }}
          color={ColorTheme.SECONDARY}
          size={"large"}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  const { screen } = language;

  return {
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    mustShowOnboarding:
      state.disclaimer.approved === false ||
      (!state.answeredSurvey && Object.keys(state.userProfiles).length === 0),
    canShowOnboarding:
      state.contentByLanguage[state.selectedLang].onboarding &&
      (state.contentByLanguage[state.selectedLang].onboarding[0].question ||
        state.contentByLanguage[state.selectedLang][
          state.contentByLanguage[state.selectedLang].onboarding[0].id
        ]),
    languageContent: state.contentByLanguage[state.selectedLang],
    installInProgress: state.installFromAssets.installInProgress,
    installSucceeded: state.installFromAssets.didSucceed,
    showDeliveriesQuestionDate: state.showDeliveriesQuestionDate,
    isHealthCareWorker: state.isHealthCareWorker,
  };
}

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => {
  return {
    invalidateLang: (id) => dispatch(invalidateLang(id)),
    setupNotifications: () => dispatch(setupNotifications()),
    isPreBuild: (isPreBuild) => dispatch(setPreBuild(isPreBuild)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetsLoadingScreen);

const styles = StyleSheet.create({
  fetchContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: CONSTANTS.COLOR.RED,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    margin: 16,
    height: 100,
    width: 100,
  },
});
