import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Picker,
  ActivityIndicator,
  TabBarIOSItem,
} from "react-native";

import NetInfo from "@react-native-community/netinfo";
import fs from "react-native-fs";

import RNRestart from "react-native-restart";
import LanguageListItem from "../Components/LanguageListItem";
import ListHeader from "../Components/ListHeader";
import * as CONSTANTS from "../Constants/Constants";
import ColorTheme from "../Constants/ColorTheme";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import {
  selectMode,
  fetchIndex,
  setConnectionStatus,
  clearCurrentDownloadProcess,
  setLastNotificationDate,
  selectLangAsync,
  selectLang,
} from "../Actions/actions";
import { analytics } from "../Utils/analytics";
import * as helpers from "../Utils/helpers";
import AppText from "../Components/AppText";
import { OkCancelModal } from "../Components/OkCancelModal";
import * as notifications from "../Utils/notifications";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import {
  startDownload,
  startUpdate,
  resetDownloadStatus,
} from "../Actions/downloadActions";
import LightBoxModal from "../Components/LightBoxModal";
import FramedButton from "../Components/FramedButton";
import {
  StackActions,
  NavigationActions,
  NavigationScreenProp,
} from "react-navigation";
import { resetEngagementNotifications } from "../Actions/notificationActions";
import { CHEAT, HAS_PREVIEW } from "../Config/config";
import { deleteLanguage } from "../Actions/removeContentActions";
import { openModal } from "../Actions/modalActions";
import { lang } from "moment";
import { StoreState } from "../Reducers/reducers";
import {
  ContentState,
  Language,
  ScreenTexts,
} from "../Reducers/contentReducer";
import { ModalProps } from "../Reducers/modalReducer";
import { IndexLanguageType } from "../Reducers/downloadReducer";
import { Action } from "redux";
import {
  isThereEnoughDiskSpace,
  startLanguageDownload,
} from "../Utils/downloadLanguage";
import { FEATURE_FLAGS, hasFeature } from "../Utils/featureFlag";

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface PropsFromState {
  selectedLang: string;
  isFetchingIndex: boolean;
  currentDownloadProcess: any;
  lastUpdated: number;
  index: any;
  language: Language;
  screen: ScreenTexts;
  selectedMode: string;
  isConnected: boolean;
  disclaimer: any;
  contentByLanguage: ContentState;
  notifications: any;
  mustShowOnboarding: boolean;
  getTextFromCMS(screenKey: string, fallback: string): string;
  hasLanguage(): boolean;
}

interface PropsFromDispatch {
  dispatch(action: any): any;
  openConfirmDownload(modalProps): void;
  openConfirmDelete(modalProps): void;
  openConfirmSelectiveDownload(modalProps): void;
  openSelectiveDownloadWarning(modalProps): void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

interface State {
  country: any;
  showAllLanguages: boolean;
  editMode: boolean;
  showDownloadConfirmModal: boolean;
  // fakeLocation: "NONE",
  showFakeLocationModal: boolean;
  downloadLanguage: IndexLanguageType;
  showDeleteConfirmModal: boolean;
  isDeleting: boolean;
  deleteLanguage: IndexLanguageType;
  downloadProgressWidth: number;
  notEnoughSpaceOnDevice: boolean;
  checkForEnoughDiskSpace: boolean;
  deviceStorageSize: number;
  hasLanguage: boolean;
  eventState?: any;
  showAcceptUpdateModal: boolean;
}
const WHO_LANGUAGES = [
  "7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da", // English
  "6a146956-9f21-206a-98cf-55db7b0a8301", // French
];

const FAKE_COUNTRIES = [
  { key: "NONE", value: "Don't fake" },
  { key: "DK", value: "Denmark" },
  { key: "EG", value: "Egypt" },
  { key: "ET", value: "Ethiopia" },
  { key: "DE", value: "Germany" },
  { key: "GH", value: "Ghana" },
  { key: "IN", value: "India" },
  { key: "LA", value: "Laos" },
  { key: "MD", value: "Moldova" },
  { key: "MM", value: "Myanmar" },
  { key: "ZA", value: "South Africa" },
  { key: "SE", value: "Sweden" },
  { key: "TZ", value: "Tanzania" },
];
const prettyPrintFakeCountry = (key) =>
  FAKE_COUNTRIES.find((fake) => fake.key === key).value;
let global: any;
const dummyLang = {
  id: "none",
  description: "",
  version: 1,
  countryCode: "DK",
  href: "string",
  hrefZip: "string",
  latitude: 0,
  longitude: 0,
};
const fakeSize = (langId) => {
  return (parseInt(langId, 16) % 7) + 75;
};

class LanguageScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: () => (
        <View style={{ marginRight: 16, flexDirection: "row" }}>
          {HAS_PREVIEW && navigation.state.params && (
            <TouchableOpacity
              onPress={navigation.state.params.toggleShowPreview}
            >
              <AppText style={{ marginRight: 12, color: ColorTheme.SECONDARY }}>
                {navigation.state.params.labelPreview}
              </AppText>
            </TouchableOpacity>
          )}

          {/* {navigation.state.params && navigation.state.params.showEdit ? <TouchableOpacity onPress={navigation.state.params.toggleEditMode}> */}
          {navigation.state.params && navigation.state.params.hasLanguage && (
            <TouchableOpacity onPress={navigation.state.params.toggleEditMode}>
              <AppText style={{ color: ColorTheme.SECONDARY }}>
                {navigation.state.params.label}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      ),
      headerTitleStyle: { marginRight: HAS_PREVIEW ? 52 : 0 }, //To prevent that the above 2 text's and the title are overlapping on IOS, when both Edit and Preview are present.
    };
  };

  state = {
    country: undefined,
    showAllLanguages: false,
    editMode: false,
    showDownloadConfirmModal: false,
    // fakeLocation: "NONE",
    showFakeLocationModal: false,
    downloadLanguage: dummyLang,
    showDeleteConfirmModal: false,
    isDeleting: false,
    deleteLanguage: dummyLang,
    downloadProgressWidth: 300,
    notEnoughSpaceOnDevice: false,
    checkForEnoughDiskSpace: false,
    deviceStorageSize: 0,
    hasLanguage: false,
    eventState: undefined,
    showAcceptUpdateModal: false,
  };

  constructor(props) {
    super(props);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleShowPreview = this.toggleShowPreview.bind(this);
    this.getAnalyticsData = this.getAnalyticsData.bind(this);

    this.handleUpdateCurrentLang(props);
  }

  componentDidUpdate(prevProps) {
    const prevProgress = prevProps.currentDownloadProcess;
    const currProgress = this.props.currentDownloadProcess;

    // Report if the update included a new index file
    if (this.props.index.version !== prevProps.index.version) {
      analytics.event("chooseVersionList", `:${this.props.index.version}:`);
    }
    // Should we continue to next screen?
    if (
      prevProgress.lang !== undefined &&
      currProgress.lang === undefined &&
      currProgress.error === undefined &&
      !currProgress.canceled
    ) {
      const lang = this.props.contentByLanguage[prevProgress.lang];
      if (!lang.didInvalidate) {
        this.continue.call(
          this,
          prevProgress.lang,
          lang.version,
          this.props.dispatch
        );
      }
      return;
    }

    console.log(
      "componentWillUpdate",
      Object.keys(this.props.contentByLanguage).length,
      this.state.hasLanguage
    );
    if (
      Object.keys(this.props.contentByLanguage).length == 2 &&
      this.state.hasLanguage == true
    ) {
      console.log(
        "will update if",
        this.state.hasLanguage,
        this.state.editMode
      );
      // this.toggleEditMode();
      this.setState({ hasLanguage: false });
      console.log("setPrams", this.state.hasLanguage);
      this.props.navigation.setParams({
        hasLanguage: false,
      });
    }
  }

  componentDidMount() {
    if (Platform.OS == "android") {
      NetInfo.isConnected.fetch().then((isConnected) => {
        // console.log('First, is ' + (isConnected ? 'online' : 'offline'))
        this.props.dispatch(setConnectionStatus(isConnected));
      });
    }
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    this.props.dispatch(fetchIndex(this.props.selectedMode));

    if (
      this.state.hasLanguage === false &&
      Object.keys(this.props.contentByLanguage).length > 2
    ) {
      this.setState({ hasLanguage: true });
    }

    analytics.event("chooseVersionList", `:${this.props.index.version}:`);
    this.props.navigation.setParams({
      labelPreview:
        this.props.selectedMode == "content" ? "Preview" : "Published",
      label: this.props.getTextFromCMS("lp:edit", "Edit"),
      hasLanguage:
        Object.keys(this.props.contentByLanguage).length > 2 ? true : false,
      toggleEditMode: this.toggleEditMode,
      toggleShowPreview: this.toggleShowPreview,
    });
    this.updateLocationInfo();
  }

  // componentWillUpdate(nextProps) {

  // }

  toggleEditMode() {
    const nextEditMode = !this.state.editMode;
    console.log("toggleEditMode", nextEditMode);
    this.setState({ editMode: nextEditMode });
    const headerButtonLabel = nextEditMode
      ? this.props.getTextFromCMS("done", "Done")
      : this.props.getTextFromCMS("lp:edit", "Edit");
    this.props.navigation.setParams({ label: headerButtonLabel });
  }

  toggleShowPreview() {
    this.props.dispatch(
      selectMode(
        this.props.selectedMode == "content" ? "devcontent" : "content"
      )
    );
    // this.props.fetchIndex(((this.props.selectedMode == 'content') ? 'devcontent' : 'content'));
    this.props.dispatch(
      fetchIndex(
        this.props.selectedMode == "content" ? "devcontent" : "content"
      )
    );
    // this.props.fetchIndex(this.props.selectedMode);
    const headerButtonLabel =
      this.props.selectedMode !== "content" ? "Preview" : "Published";
    this.props.navigation.setParams({ labelPreview: headerButtonLabel });
  }

  // componentWillMount() {

  // }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange(isConnected) {
    // console.log('Then, is ' + (isConnected ? 'online' : 'offline'))
    this.props.dispatch(setConnectionStatus(isConnected));
  }

  isFetchingCountry() {
    return this.state.country === undefined;
  }

  async updateLocationInfo() {
    const ipInfo: any = await Promise.race([
      helpers.getIpInfo(),
      helpers.promiseDelay(2000),
    ]);

    if (ipInfo) {
      this.setState({ country: ipInfo.country });
    } else {
      this.setState({ country: "N/A" });
    }
  }

  renderItemList(dispatch, language, selectedMode, isActive, isDownloaded) {
    //
    const clickHandler = () => {
      // Handle delete
      if (this.state.editMode) {
        if (isDownloaded) {
          const modalProps = {
            buttonFunction: () => {
              this.handleDeleteLanguage(language.id);
            },
            title: language.description,
          };
          // this.setState({ showDeleteConfirmModal: true, deleteLanguage: language });
          this.props.openConfirmDelete(modalProps);
        }
        return;
      }
      if (isDownloaded) {
        if (this.isLanguageUpToDate(language.id)) {
          this.continue(language.id, language.version, this.props.dispatch);
        } else {
          this.setState({
            showAcceptUpdateModal: true,
            downloadLanguage: language,
          });
        }
      } else {
        if (hasFeature(FEATURE_FLAGS.SELECTIVE_DOWNLOAD, language.id)) {
          this.confirmSelectiveDownload(language);
        } else {
          this.confirmDownload(language);
        }
        // this.setState({ showDownloadConfirmModal: true, downloadLanguage: language });
      }
    };

    const text =
      language.description + (selectedMode == "devcontent" ? " (DRAFT)" : "");
    // const subText = fakeSize(language.id) + " MB";

    //Make the subset ie. the size of the language more procise, and with fallback to the calculated one
    let subText = "";
    const sizeItem = CONSTANTS.LANGUAGE_SIZE.find(
      (item, index) => item.languageID === language.id
    );

    if (sizeItem) {
      subText =
        sizeItem.size +
        CONSTANTS.DUMMY_IMAGE_ZIP_FILE_SIZE +
        " " +
        this.props.getTextFromCMS("unit_megabyte", "MB");
    } else {
      subText =
        fakeSize(language.id) +
        " " +
        this.props.getTextFromCMS("unit_megabyte", "MB");
    }

    return (
      <LanguageListItem
        key={language.id}
        text={text}
        subText={subText}
        isActive={isActive}
        isDownloaded={isDownloaded}
        isEdit={this.state.editMode}
        onPress={clickHandler}
      />
    );
  }

  renderShowMoreButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showAllLanguages: true });
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 76,
          }}
        >
          <AppText style={[{ color: ColorTheme.PRIMARY }]}>
            Show more languages
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }

  renderShowLocationMatchesButton(locationMatches) {
    // Only render this button if there anything to show
    if (locationMatches.length == 0) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showAllLanguages: false });
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 76,
          }}
        >
          <AppText style={[{ color: ColorTheme.PRIMARY }]}>Show less</AppText>
        </View>
      </TouchableOpacity>
    );
  }

  isLanguageActive(langId) {
    const { selectedLang } = this.props;
    return langId == selectedLang;
  }

  isLanguageDownloaded(langId) {
    const { contentByLanguage } = this.props;
    return langId in contentByLanguage;
  }

  isLanguageUpToDate(langId) {
    const { contentByLanguage } = this.props;
    return !contentByLanguage[langId].didInvalidate;
  }

  renderNationalLanguagesHeader() {
    if (CHEAT) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ListHeader>
            {this.props.getTextFromCMS(
              "languagescreen_national_header",
              "National versions"
            )}
          </ListHeader>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showFakeLocationModal: true });
            }}
          >
            <ListHeader style={{ color: ColorTheme.PRIMARY }}>
              Fake location:
              {prettyPrintFakeCountry(global.fakeLocation || "NONE")}
            </ListHeader>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ListHeader>
        {this.props.getTextFromCMS(
          "languagescreen_national_header",
          "National versions"
        )}
      </ListHeader>
    );
  }

  renderLanguageList() {
    const { index, dispatch, selectedMode } = this.props;

    const whoLanguages = index.languages.filter((l) => l.countryCode === "WHO");
    const localLanguages = index.languages.filter(
      (l) => l.countryCode !== "WHO"
    );

    const comparisonCountry =
      global.fakeLocation !== "NONE" && global.fakeLocation !== undefined
        ? global.fakeLocation
        : this.state.country;
    const countryMatches = index.languages.filter(
      (l) => l.countryCode === comparisonCountry
    );
    // console.log("Matched languages:", countryMatches);

    const renderedWHO = (
      <React.Fragment>
        <ListHeader>
          {this.props.getTextFromCMS(
            "languagescreen_global_header",
            "Global versions"
          )}
        </ListHeader>
        {whoLanguages.map((lang) => {
          const active = this.isLanguageActive(lang.id);
          const downloaded = this.isLanguageDownloaded(lang.id);
          return this.renderItemList(
            dispatch,
            lang,
            selectedMode,
            active,
            downloaded
          );
        })}
      </React.Fragment>
    );

    const renderedLocalLanguages = (
      <React.Fragment>
        {this.renderNationalLanguagesHeader()}
        {localLanguages.map((lang) => {
          const active = this.isLanguageActive(lang.id);
          const downloaded = this.isLanguageDownloaded(lang.id);
          return this.renderItemList(
            dispatch,
            lang,
            selectedMode,
            active,
            downloaded
          );
        })}
        {this.renderShowLocationMatchesButton(countryMatches)}
      </React.Fragment>
    );

    const renderedLocationMatches = (
      <React.Fragment>
        {this.renderNationalLanguagesHeader()}
        {countryMatches.map((lang) => {
          const active = this.isLanguageActive(lang.id);
          const downloaded = this.isLanguageDownloaded(lang.id);
          return this.renderItemList(
            dispatch,
            lang,
            selectedMode,
            active,
            downloaded
          );
        })}
        {this.renderShowMoreButton()}
      </React.Fragment>
    );

    const renderedNationals =
      !this.state.showAllLanguages && countryMatches.length > 0
        ? renderedLocationMatches
        : renderedLocalLanguages;

    const eventState = this.state.eventState
      ? this.state.eventState.map((item, index) => {
          return (
            <View
              style={{
                padding: 5,
                backgroundColor:
                  index % 2 === 0 ? ColorTheme.SECONDARY : ColorTheme.SEPARATOR,
              }}
            >
              <AppText style={{ fontWeight: "bold" }}>{item.eventType}</AppText>
              <AppText>{item.eventData}</AppText>
            </View>
          );
        })
      : null;
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.mainContainer}>
        {__DEV__ && (
          <View style={{ minHeight: 80 }}>
            {eventState}
            <FramedButton
              label="Get Analytics Events"
              onPress={this.getAnalyticsData}
            />
          </View>
        )}
        {renderedWHO}
        {renderedNationals}
        {this.renderDownloadModals()}
        {this.renderFakeLocationModal()}
      </ScrollView>
    );
  }

  navigateToDownload() {
    const { mustShowOnboarding } = this.props;

    if (mustShowOnboarding) {
      this.props.navigation.navigate("OnboardingStack", {
        routeName: "OnboardingStack",
        action: this.props.navigation.navigate({
          routeName: "OnboardingDownloadGettingReadyScreenStack",
        }),
        downloadLanguage: this.state.downloadLanguage.description,
      });
    } else {
      this.props.navigation.navigate("DownloadInfoScreen", {
        noHeaderButton: true,
        downloadLanguage: this.state.downloadLanguage.description,
      });
    }
  }

  // async isThereEnoughDiskSpace(selectedLanguage) {

  //   //Get the disk space info from the device
  //   const diskSpace = await fs.getFSInfo();
  //   let freeSpaceNeeded = "";

  //   //Map through the language sizes and find the one matching the selected language to install. Return the size
  //   if (diskSpace.freeSpace) {
  //     CONSTANTS.LANGUAGE_SIZE.map((item, index) => {
  //       if (item.languageID === selectedLanguage.id) {
  //         freeSpaceNeeded = item.size + 12 + "e6";
  //       }
  //     })
  //   }

  //   //Chesk if the free space on the device is >= the size that the selected language will need
  //   if (diskSpace.freeSpace) {
  //     if (diskSpace.freeSpace >= freeSpaceNeeded) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return false;
  // }

  // async downloadLanguage() {

  //   //Set the spinner active while we check if there is enough space on the device for installation of the selected language
  //   this.setState({ checkForEnoughDiskSpace: true });
  //   //Get the true or false if there is enough space on the device
  //   const isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage = await this.isThereEnoughDiskSpace(this.state.downloadLanguage);

  //   //If the is not enough space on the device, then show a warning and do not start download
  //   if (isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage != true) {
  //     return this.setState({ notEnoughSpaceOnDevice: true, checkForEnoughDiskSpace: false });
  //   }

  //   //If there os enough space on the device, then start the download and installation
  //   this.setState({ showDownloadConfirmModal: false });
  //   this.props.dispatch(startDownload(this.state.downloadLanguage))

  //   // console.log('analytics', 'versionChosen', `:${this.state.downloadLanguage.id}:${this.state.downloadLanguage.version}:`)
  //   analytics.event('versionChosen', `:${this.state.downloadLanguage.id}:${this.state.downloadLanguage.version}:`)
  //   this.navigateToDownload()
  // }

  renderDownloadModals() {
    return (
      <View>
        {/* {this.renderConfirmDownload()} */}
        {this.renderAcceptUpdate()}
        {/* {this.renderDeleteConfirmModal()} */}
      </View>
    );
  }

  confirmDownload(language: IndexLanguageType) {
    console.log("confirmDownload", language, CONSTANTS.LANGUAGE_SIZE);
    //Make the subset ie. the size of the language more procise, and with fallback to the calculated one
    let subText = "";
    const sizeItem = CONSTANTS.LANGUAGE_SIZE.find(
      (item, index) => item.languageID === language.id
    );
    console.log("confirmDownload", sizeItem);
    if (sizeItem) {
      subText =
        sizeItem.size +
        CONSTANTS.DUMMY_IMAGE_ZIP_FILE_SIZE +
        " " +
        this.props.getTextFromCMS("unit_megabyte", "MB");
    } else {
      subText =
        fakeSize(language.id) +
        " " +
        this.props.getTextFromCMS("unit_megabyte", "MB");
    }
    const modalProps: ModalProps = {
      language: language,
      label: subText,
      buttonFunction: () => this.startDownload(language),
    };
    this.props.openConfirmDownload(modalProps);
  }

  private async downloadLanguage(
    downloadLanguage: IndexLanguageType,
    isSelectiveDownload?: boolean
  ) {
    // Set the spinner active while we check if there is enough space on the device for installation of the selected language
    this.setState({ checkForEnoughDiskSpace: true });

    // Get the true or false if there is enough space on the device
    console.log("isThereEnoughDiskSpaceOnDevice");
    const isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage = await isThereEnoughDiskSpace(
      downloadLanguage
    );

    // If the is not enough space on the device, then show a warning and skip download process.
    if (isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage !== true) {
      this.setState({
        notEnoughSpaceOnDevice: true,
        checkForEnoughDiskSpace: false,
      });
      //Early return because not enough space on device
      return;
    }

    // If there is enough space on the device, then close the modal and start the download and installation
    // startLanguageDownload(downloadLanguage, isSelectiveDownload);

    // analytics.event("versionChosen", `:${downloadLanguage.id}:${downloadLanguage.version}:`);
    // this._navigateToDownload(downloadLanguage);
  }

  private startDownload(
    downloadLanguage: IndexLanguageType,
    isSelectiveDownload?: boolean
  ) {
    //If there is enough space on the device, then close the modal and start the download and installation
    startLanguageDownload(downloadLanguage, isSelectiveDownload);

    analytics.event(
      "versionChosen",
      `:${downloadLanguage.id}:${downloadLanguage.version}:`
    );
    this._navigateToDownload(downloadLanguage);
  }

  private _navigateToDownload(language: IndexLanguageType) {
    const { mustShowOnboarding, navigation } = this.props;

    if (mustShowOnboarding) {
      navigation.navigate("OnboardingScreens", {});
      navigation.navigate("OnboardingDownloadGettingReadyScreenStack");
    } else {
      navigation.navigate("DownloadInfoScreen", {
        noHeaderButton: true,
        downloadLanguage: language.description,
      });
    }
  }

  private confirmSelectiveDownload(language: IndexLanguageType) {
    const modalProps: ModalProps = {
      buttonFunction: () => this.startDownload(language),
      secondaryButtonFunction: (isSelectiveDownload) => {
        this.startDownload(language, isSelectiveDownload);
        // const modalProps: ModalProps = { disableFloatingCloseButton: true, disableOnBackDropPress: true };
        // this.props.openSelectiveDownloadWarning(modalProps);
        return "";
      },
      language: language,
    };
    this.props.openConfirmSelectiveDownload(modalProps);
  }

  renderAcceptUpdate() {
    return (
      <OkCancelModal
        visible={this.state.showAcceptUpdateModal}
        closeButtonText={this.props.getTextFromCMS("close", "close")}
        okText={this.props.getTextFromCMS("accept", "accept")}
        onOK={() => {
          this.props.dispatch(
            startUpdate({ language: this.state.downloadLanguage })
          );
          this.navigateToDownload();
        }}
        cancelText={this.props.getTextFromCMS("skip", "skip")}
        onCancel={() => {
          this.setState({ showAcceptUpdateModal: false });
          this.continue(
            this.state.downloadLanguage.id,
            this.state.downloadLanguage.version,
            this.props.dispatch
          );
        }}
        onClose={() => {
          this.setState({ showAcceptUpdateModal: false });
        }}
      >
        <View>
          <AppText>
            {this.props.getTextFromCMS(
              "upgrade_title",
              "there is an update available"
            )}
          </AppText>
        </View>
      </OkCancelModal>
    );
  }

  // renderDeleteConfirmModal() {
  //   return (
  //     <LightBoxModal
  //       visible={this.state.showDeleteConfirmModal}
  //       onRequestClose={() => this.setState({ showDeleteConfirmModal: false })
  //       }
  //       floatingCloseButtonVisible={true}
  //       closeText={this.props.language.screen.close ? this.props.language.screen.close : 'close'}
  //     >
  //       <View style={{ backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY, padding: 16, paddingTop: 24, flexDirection: "column", }} >
  //         <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.1, textAlign: 'center', marginBottom: 15, fontWeight: "bold" }}>{this.props.getTextFromCMS('language_delete', 'delete language')}</AppText>
  //         <AppText style={{ fontSize: ColorTheme.FONT_SIZE, textAlign: 'center' }}>{this.props.getTextFromCMS('language_delete_warning', 'you are about to delete')}</AppText>
  //         <AppText style={{ fontSize: ColorTheme.FONT_SIZE, fontWeight: 'bold', textAlign: 'center' }}>{this.state.deleteLanguage.description}</AppText>
  //         <AppText style={{ fontSize: ColorTheme.FONT_SIZE, marginTop: 10, textAlign: 'center' }}>{this.props.getTextFromCMS('language_delete_warning_1', 'do you want to continue?')}</AppText>
  //         <FramedButton label={this.props.getTextFromCMS('delete', 'Delete')} style={[, { width: 180, marginTop: 12, marginBottom: -16 }]} onPress={() => this.handleDeleteLanguage()} />
  //       </View>
  //     </LightBoxModal>
  //   )
  // }

  renderFakeLocationModal() {
    return (
      <LightBoxModal
        visible={this.state.showFakeLocationModal}
        onRequestClose={() => this.setState({ showFakeLocationModal: false })}
        floatingCloseButtonVisible={true}
        closeText={"Close"}
      >
        <View
          style={{
            backgroundColor: ColorTheme.SECONDARY,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: ColorTheme.SECONDARY,
            padding: 16,
            marginBottom: 24,
            flexDirection: "column",
            minHeight: 280,
          }}
        >
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 1.1,
              textAlign: "center",
            }}
          >
            Fake location?
          </AppText>
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 0.8,
              color: ColorTheme.SUB_LABEL,
              textAlign: "center",
            }}
          >
            Choose country below
          </AppText>
          <Picker
            selectedValue={global.fakeLocation || "NONE"}
            style={{ height: 120 }}
            onValueChange={(itemValue) => {
              this.setState({ showFakeLocationModal: false });
              global.fakeLocation = itemValue;
            }}
          >
            {FAKE_COUNTRIES.map((f) => (
              <Picker.Item key={f.key} label={f.value} value={f.key} />
            ))}
          </Picker>
        </View>
      </LightBoxModal>
    );
  }

  handleDeleteLanguage(langId) {
    console.log("handle delete language langId", langId);
    //Determine if the selected landuage to delete is the active one
    const isLanguageActive = this.isLanguageActive(langId);

    //If the user is deleting the active language, then navigate to standard first languageScreen(InitialDownload) before removal of the active landuage!
    if (isLanguageActive) {
      //Navigate to InitialDownload witch is on its own navigationstack
      this.props.navigation.navigate("InitialDownload", {
        // title: this.props.getTextFromCMS('choose_version_title', 'choose version'),
        // backButtonTitle: helpers.getBackText(this.props.screen.back),
        showEdit: true,
      });

      //Reset the downloadReducer so it is "idle"
      this.props.dispatch(resetDownloadStatus());

      //Set the selected language to the default 'none'
      this.props.dispatch(selectLang("none"));

      //Remove the active language
      this.props.dispatch(deleteLanguage(langId));

      // .then(() => {
      //   this.setState({ showDeleteConfirmModal: false, downloadLanguage: dummyLang, showDeleteConfirmModal: false, deleteLanguage: dummyLang, country: undefined, });
      // });
    }

    //If the selected language to delete is not the active one, then just remove the language
    this.setState({ isDeleting: true });
    this.props.dispatch(deleteLanguage(langId));
    // .then(() => {
    //   this.setState({ showDeleteConfirmModal: false, isDeleting: false });
    // });
  }

  renderFetchingIndexOrCountry() {
    return (
      <View style={styles.fetchContainer}>
        <AppText
          style={{
            color: "white",
            fontSize: ColorTheme.FONT_SIZE,
            textAlign: "center",
          }}
        >
          {this.props.getTextFromCMS("please_wait", "Please wait")}
        </AppText>
      </View>
    );
  }

  getAnalyticsData() {
    console.log("getAnalyticsData");
    const fn = fs.DocumentDirectoryPath + "/analytics.json";

    fs.readFile(fn)
      .then((content) => {
        const data = JSON.parse(content);
        this.setState({ eventState: data });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }

  render() {
    const { isFetchingIndex, index, isConnected } = this.props;
    console.log("render languageScreen", this.state.editMode);

    // Fetching index or country?
    if (isConnected && (isFetchingIndex || this.isFetchingCountry())) {
      return this.renderFetchingIndexOrCountry();
    }

    // If we have no internet and haven't downloaded a language list already
    // we need to show an error message
    if (!isConnected && index.languages.length == 0) {
      return (
        <View
          style={[
            styles.mainContainer,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <AppText
            style={{
              padding: 16,
              textAlign: "center",
              fontSize: ColorTheme.FONT_SIZE * 1.2,
            }}
          >
            {this.props.getTextFromCMS(
              "language_download_internet_falied",
              "The application could not connect to the internet"
            )}
          </AppText>
          <AppText
            style={{
              padding: 16,
              textAlign: "center",
              fontSize: ColorTheme.FONT_SIZE * 0.75,
            }}
          >
            {this.props.getTextFromCMS(
              "language_download_internet_falied_1",
              "Check the connection"
            )}
          </AppText>
        </View>
      );
    }
    return this.renderLanguageList();
  }

  continue(id, version, dispatch) {
    let pre_id = this.props.selectedLang;
    dispatch(clearCurrentDownloadProcess());

    // Select lang and restart if needed
    dispatch(selectLangAsync(id)).then(() => {
      helpers.updateRTL(id);
      const prevRTL = helpers.isRTL(pre_id);
      const currRTL = helpers.isRTL(id);
      if (pre_id !== "none" && prevRTL !== currRTL) {
        RNRestart.Restart();
      }
    });

    // if (this.props.hasLanguage() && this.props.disclaimer.approved) {
    if (!this.props.mustShowOnboarding) {
      // console.log("continue after download");
      const resetAction = StackActions.reset({
        index: 0,
        key: "SettingsTab",
        actions: [NavigationActions.navigate({ routeName: "SettingsHome" })],
      });

      this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate("LanguageScreen", {
        title: this.props.getTextFromCMS(
          "choose_version_title",
          "choose version"
        ),
        backButtonTitle: helpers.getBackText(this.props.screen.back),
        showEdit: true,
      });

      //Reset the weekly notifications so there will be scheduled new ones that contain the new selected language!
      this.props.dispatch(resetEngagementNotifications());

      this.props.navigation.navigate("MainTab");
    } else {
      //Reset the weekly notifications so there will be scheduled new ones that contain the new selected language!
      this.props.dispatch(resetEngagementNotifications());

      this.props.navigation.navigate("Onboarding");
    }

    console.log("pre_id: ", pre_id, "id: ", id);
    if (pre_id !== id) {
      // console.log('analytics', 'versionChosen', `:${id}:${version}:`)
      analytics.event("versionChosen", `:${id}:${version}:`);
      notifications.initNotifications(
        this.props.contentByLanguage[id].notifications,
        (arg) => this.props.dispatch(setLastNotificationDate(arg))
      );
    }
  }

  //Is run if the user has navigated to languageScreen through an 'update language'-alert
  handleUpdateCurrentLang(props) {
    if (
      props.navigation.state.params &&
      props.navigation.state.params.updateCurrent
    ) {
      let languages = props.index.languages;
      for (let i = 0; i < languages.length; i++) {
        if (languages[i].id == props.selectedLang) {
          let language = languages[i];
          this.props.dispatch(startUpdate({ language }));
          this.navigateToDownload();
        }
      }
    }
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state
) => {
  const {
    selectedLang,
    contentByLanguage,
    index,
    currentDownloadProcess,
    isFetchingIndex,
    selectedMode,
    isConnected,
    disclaimer,
  } = state;
  const { lastUpdated, screen, notifications } = contentByLanguage[
    selectedLang
  ];
  const language = contentByLanguage[selectedLang];

  return {
    selectedLang,
    isFetchingIndex,
    currentDownloadProcess,
    lastUpdated,
    index,
    language,
    screen,
    selectedMode,
    isConnected,
    disclaimer,
    contentByLanguage,
    notifications,
    mustShowOnboarding:
      state.disclaimer.approved === false &&
      Object.keys(state.userProfiles).length === 0,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    hasLanguage: () => {
      if (
        state.selectedLang !== "none" &&
        state.contentByLanguage.hasOwnProperty(state.selectedLang)
      ) {
        return true;
      }
      return false;
    },
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  dispatch: (action) => {
    return dispatch(action);
  },
  openConfirmDownload: (modalProps) => {
    dispatch(openModal({ modalType: "DOWNLOAD_LANGUAGE", modalProps }));
  },
  openConfirmDelete: (modalProps) => {
    dispatch(openModal({ modalType: "DELETE_LANGUAGE", modalProps }));
  },
  openConfirmSelectiveDownload: (modalProps) => {
    dispatch(
      openModal({ modalType: "CONFIRM_SELECTIVE_DOWNLOAD", modalProps })
    );
  },
  openSelectiveDownloadWarning: (modalProps) => {
    dispatch(
      openModal({ modalType: "SELECTIVE_DOWNLOAD_WARNING", modalProps })
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageScreen);

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: ColorTheme.TERTIARY,
  },
  fetchContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: ColorTheme.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
});
