import * as React from "react";
import { Platform, View } from "react-native";
import fs from "react-native-fs";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import {
  setLastNotificationDate,
  invalidateLang,
  setPreBuild,
  initAssetsStart,
} from "../Actions/actions";
import { resumeDownload } from "../Actions/downloadActions";
import ColorTheme from "../Constants/ColorTheme";
import { DownloadState } from "../Reducers/downloadReducer";
import { StoreState } from "../Reducers/reducers";
import { setupNotifications } from "../Actions/notificationActions";
import { NavigationStackProp } from "react-navigation-stack";

interface PropsFromState {
  hasLanguage(): boolean;
  mustShowOnboarding: boolean;
  canShowOnboarding: boolean;
  downloadState: DownloadState;
  languageContent: any;
  showDeliveriesQuestionDate: number;
  isHealthCareWorker: boolean;
  contentByLanguage: any;
}

interface PropsFromDispatch {
  invalidateLang(id: string): void;
  resumeDownload(): void;
  isPreBuild(isPreBuild: boolean): void;
  setupNotifications(): void;
  installAssetsVersion(): void;
}

interface OwnProps {
  navigation: NavigationStackProp<any, any>;
}

type Props = PropsFromState & OwnProps & PropsFromDispatch;

class AppLoadingScreen extends React.Component<Props> {
  public async componentDidMount() {
    const {
      navigation,
      downloadState,
      resumeDownload,
      mustShowOnboarding,
      canShowOnboarding,
      hasLanguage,
      languageContent,
      showDeliveriesQuestionDate,
      isHealthCareWorker,
      contentByLanguage,
    } = this.props;

    //Checks to see if there is a language and/or assets than we need to use or not
    const hasAssetsVersion = await this.hasAssetsVersion();
    const noLauguageVersionsToInstall =
      !hasLanguage() &&
      !hasAssetsVersion &&
      (downloadState.status !== "bundle" && downloadState.status !== "media");
    const hasOnlyAssetsVersion =
      !hasLanguage() &&
      hasAssetsVersion &&
      (downloadState.status !== "bundle" && downloadState.status !== "media");
    const hasAssetsVersionAndInstalledLanguage =
      hasLanguage() &&
      hasAssetsVersion &&
      (downloadState.status !== "bundle" && downloadState.status !== "media");
    //If the is not any installed language versions or a assets version

    console.log("hasAssetsVersion", hasAssetsVersion);
    console.log("noLauguageVersionsToInstall", noLauguageVersionsToInstall);
    console.log("hasOnlyAssetsVersion", hasOnlyAssetsVersion);
    console.log(
      "hasAssetsVersionAndInstalledLanguage",
      hasAssetsVersionAndInstalledLanguage
    );

    if (noLauguageVersionsToInstall) {
      return navigation.navigate("InitialDownload");
    }
    //If the is a assets version and no installed language version, then install the assets version
    if (hasOnlyAssetsVersion) {
      return this.startFromAssets();
    }

    //If there is a language installed and a assets then check if we shall upgrade to the asstes version
    if (hasAssetsVersionAndInstalledLanguage) {
      //Read the bundle.json from the assets/version folder
      const readLocalApkBundle = await fs.readFileAssets("version/bundle.json");

      //Parse and get the data we need
      const parsedApkBundle = JSON.parse(readLocalApkBundle);
      const assetsVersionLanguageKey = parsedApkBundle.langId;
      const ApkLangVersion = parsedApkBundle.version;

      //Get the keys from contentByLanguage
      const keys = Object.keys(contentByLanguage);

      //Check if lang already installed
      const hasLang = keys.indexOf(assetsVersionLanguageKey) !== -1;
      if (!hasLang) {
        return this.startFromAssets();
      }

      //Run through the keys and check if there is a match between the installed languages and the assets one
      for (const k of keys) {
        if (k == assetsVersionLanguageKey) {
          //If the language is the same and the asstes has a bigger version, then install the asstes one
          if (contentByLanguage[k].version < ApkLangVersion) {
            return this.startFromAssets();
          }
        }
      }
    }

    // Check if we need to resume a running download
    if (
      downloadState.status !== "idle" &&
      downloadState.status !== "finished"
    ) {
      resumeDownload();
    }

    // Check if we need to show the disclaimer
    if (mustShowOnboarding) {
      if (canShowOnboarding) {
        navigation.navigate("Onboarding");
        return;
      } else {
        this.props.invalidateLang(languageContent.langId);
      }
    }

    // Check if we need to go to the download screen in case we didn't need to show onboarding
    if (
      downloadState.status !== "idle" &&
      downloadState.status !== "finished"
    ) {
      //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
      // if (downloadState.status !== "idle" && downloadState.status !== "finished" && downloadState.status !== "missingMedia") {

      // this.props.navigation.navigate('DownloadInfoScreen'); //noHeaderButton: true,
      this.props.navigation.navigate("DownloadInfoScreen", {
        noHeaderButton: true,
        // from: 'AppLoadingScreen',
      });
      return;
    }
    // Otherwise we know a version is already chosen as active and we need to start this.
    this.startActiveVersion(showDeliveriesQuestionDate, isHealthCareWorker);
  }

  private async startFromAssets() {
    // Show loading screen while we load content
    console.log("startFromAssets");
    this.props.isPreBuild(true);
    this.props.installAssetsVersion();
    this.props.navigation.navigate("AssetsLoading");
  }

  private async hasAssetsVersion() {
    if (Platform.OS === "ios") {
      return false;
    }
    return fs.existsAssets("version");
  }

  private startActiveVersion(showDeliveriesQuestionDate, isHealthCareWorker) {
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
    return <View style={{ flex: 1, backgroundColor: ColorTheme.PRIMARY }} />;
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  return {
    hasLanguage: () => {
      if (
        state.selectedLang !== "none" &&
        state.contentByLanguage.hasOwnProperty(state.selectedLang)
      ) {
        return true;
      }
      return false;
    },
    mustShowOnboarding:
      state.disclaimer.approved === false ||
      state.selectedCountry === "Unknown" ||
      (!state.answeredSurvey && Object.keys(state.userProfiles).length === 0),
    canShowOnboarding:
      state.contentByLanguage[state.selectedLang].onboarding &&
      state.contentByLanguage[state.selectedLang].onboarding[0] &&
      (state.contentByLanguage[state.selectedLang].onboarding[0].question ||
        state.contentByLanguage[state.selectedLang][
          state.contentByLanguage[state.selectedLang].onboarding[0].id
        ]),
    downloadState: state.downloadReducer,
    contentByLanguage: state.contentByLanguage,
    languageContent: state.contentByLanguage[state.selectedLang],
    showDeliveriesQuestionDate: state.showDeliveriesQuestionDate,
    isHealthCareWorker: state.isHealthCareWorker,
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  resumeDownload: () => dispatch(resumeDownload()),
  setLastNotificationDate: (timestamp) =>
    dispatch(setLastNotificationDate(timestamp)),
  invalidateLang: (id) => dispatch(invalidateLang(id)),
  setupNotifications: () => dispatch(setupNotifications()),
  isPreBuild: (isPreBuild) => dispatch(setPreBuild(isPreBuild)),
  installAssetsVersion: () => dispatch(initAssetsStart()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoadingScreen);
