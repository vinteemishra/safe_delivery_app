//Use for BugSnag
import { Client, Configuration } from "bugsnag-react-native";
import moment from "moment";
import * as React from "react";
import {
  AppRegistry,
  AppState,
  Linking,
  Platform,
  View,
  Text,
  TextInput,
} from "react-native";
import "react-native-gesture-handler";
// import Orientation from 'react-native-orientation';
import Orientation from "react-native-orientation-locker";
import * as PushNotification from "react-native-push-notification";
import VersionNumber from "react-native-version-number";
import { Provider } from "react-redux";
import { Unsubscribe } from "redux";
import { persistStore } from "redux-persist";
import FilesystemStorage from "redux-persist-filesystem-storage";
import {
  fetchIndexIfNeeded,
  invalidateIndex,
  setAppState,
  setAskedForPermissionTimestamp,
} from "./Actions/actions";
import { invalidateAnnouncementInfo } from "./Actions/announcementActions";
import { lookupCountryIfMissing } from "./Actions/countryActions";
import {
  fetchFeatureFlagIfNeeded,
  invalidateFeatureFlagInfo,
} from "./Actions/featureFlagActions";
import { openModal } from "./Actions/modalActions";
import {
  syncProfilesDone,
  syncProfilesInitial,
} from "./Actions/syncProfilesActions";
import { App } from "./App";
import LightBoxModal from "./Components/LightBoxModal";
import ModalRoot from "./Components/Modal/ModalRoot";
import NavigationService from "./Components/NavigationService";
import { BUGSNAG_KEY, CHEAT, USE_LOCAL_CONTENT } from "./Config/config";
import { NOTIFICATION_ID } from "./Constants/Constants";
import { DownloadRehydrationTransform } from "./Reducers/downloadReducer";
import { profileMigrate } from "./Reducers/profileMigration";
import { StoreState } from "./Reducers/reducers";
import { storageMigrate } from "./Reducers/storageMigration";
import { ProfileMigrationTransform } from "./Reducers/transforms";
import { analytics } from "./Utils/analytics";
import { FEATURE_FLAGS } from "./Utils/featureFlag";
import * as helpers from "./Utils/helpers";
import { LanguageConfig } from "./Utils/LanguageConfig";
import { getRouteFromLink, parseAppLink } from "./Utils/Linking/AppLinking";
import { profile } from "./Utils/profile";
import { store } from "./Utils/store";

if (!__DEV__) {
  const configuration = new Configuration(BUGSNAG_KEY); //TODO - the API key might need to be saved somewhere better and more secure!!!
  // configuration.consoleBreadcrumbsEnabled = true; //Makes a breadcrumb for every console.log, but the outbut will be sent and desplayed within the BugSnag dashbord and Breadcrumb tab when viewing a bug report!!!
  const bugsnag = new Client(configuration);

  //Test if there is access to the BunSnag dashboard
  // bugsnag.notify(new Error("Test error"));
}

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
interface TextInputWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}

((Text as unknown) as TextWithDefaultProps).defaultProps =
  ((Text as unknown) as TextWithDefaultProps).defaultProps || {};
((Text as unknown) as TextWithDefaultProps).defaultProps!.allowFontScaling =
  false;

((TextInput as unknown) as TextInputWithDefaultProps).defaultProps =
  ((TextInput as unknown) as TextInputWithDefaultProps).defaultProps || {};
(
  (TextInput as unknown) as TextInputWithDefaultProps
).defaultProps!.allowFontScaling = false;

console.disableYellowBox = true;

/*
 * Application startup:
 *   - Fresh start?
 *      o  Starting from asset-version?
 *      o  Otherwise show lang list with download etc.
 *
 *   - Already set up
 *      o  Should disclaimer be shown?
 *      o  Just start the app normally
 *
 *                                                    +-----------------+
 *                                                +-->| Language Screen |-- downloading --+
 *                                             NO |   +-----------------+                 |
 *                                                |                                       |
 *                                         +-------------+                      +-------------------+
 *                                 +------>| Has Assets? |                      | Onboarding screen |
 *                                 |       +-------------+                      +-------------------+
 *                              NO |              |                                       |
 *                                 |          YES |   +--------------+                    |
 *                                 |              +-->| Setup Assets |--- setup ----------+
 *                                 |                  +--------------+                    |
 *   +-----------+    +-------------------------+                                         |   +-------------+
 *   | App Start |--->| Has language installed? |                                         +-->| Main Screen |
 *   +-----------+    +-------------------------+                                         |   +-------------+
 *                                 |                                                      |
 *                            YES  |   +--------------------------+   YES                 |
 *                                 +-->| Has completed onboarding |-----------------------+
 *                                     +--------------------------+                       |
 *                                                   |                                    |
 *                                                NO |   +-------------------+            |
 *                                                   +-->| Onboarding screen |------------+
 *                                                       +-------------------+
 */

interface ILocalState {
  isAppInitialized: boolean;
  notificationVisible: boolean;
  notificationContent: any;
}
class SafeDeliveryApp extends React.Component<{}, ILocalState> {
  public unsubscribe: Unsubscribe | undefined;
  persistor: any;
  constructor(props: {}) {
    super(props);

    // if (!__DEV__) {
    //     console.log = () => { };
    // }
    this.state = {
      isAppInitialized: false,
      notificationVisible: false,
      notificationContent: (
        <View style={{ height: 100, width: 100, backgroundColor: "blue" }} />
      ),
    };

    this.isRehydrated = this.isRehydrated.bind(this);
    this.initializeGlobalState = this.initializeGlobalState.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.configureNotifications = this.configureNotifications.bind(this);
    this.setVisibilityState = this.setVisibilityState.bind(this);
  }

  componentDidMount() {
    Linking.addEventListener("url", this.handleDeepLink);
    this.persistor = persistStore(
      store,
      {
        storage: FilesystemStorage,
        // storage: AsyncStorage,
        blacklist: [
          "isFetchingIndex",
          "aboutLearning",
          "modalReducer",
          "installFromAssets",
        ],
        // blacklist: ['isFetchingIndex', 'aboutLearning', 'announcementReducer'],
        transforms: [DownloadRehydrationTransform, ProfileMigrationTransform],
      },
      this.isRehydrated
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    Linking.removeEventListener("url", this.handleDeepLink);
  }

  private handleDeepLink({ url }: { url: string }) {
    console.log("linking", url);
    //ex: link: safedelivery://active-management-of-third-stage-labour_1487678773861/video/India/Active management of third stage labour/early_breastfeeding?src=Mantra
    //src value after ? in the url
    if (url.indexOf("?") > 0) {
      var Qindex = url.lastIndexOf("?");
      var eindex = url.lastIndexOf("=");
      var linkSrc = url.substring(eindex + 1, url.length);
      console.log("Link Src", Qindex);
      analytics.event("deepLinkSrc", linkSrc);
      url = url.substring(0, Qindex);
    }

    const matches = parseAppLink(url);
    const state: StoreState = store.getState();
    analytics.event("handleLink", `:${url}:`);
    const result = getRouteFromLink(matches, state);
    const { routeActions, dispatchActions, analyticsErrorMessage } = result;

    //Handle dispatches to redux store
    dispatchActions.map((a) => store.dispatch(a));

    //Navigate based on returned path of navigation steps
    NavigationService.deepNavigate(routeActions);

    const eventData = analyticsErrorMessage
      ? `:${analyticsErrorMessage}:`
      : "::";
    analytics.event("finishedLinkNavigation", eventData);
  }

  async isRehydrated(fsError: any, fsResult: any) {
    await storageMigrate(fsError, store.getState(), this.persistor);
    console.log("storageMigrate");
    const updatedState = profileMigrate(store.getState());
    if (updatedState) {
      this.persistor.rehydrate(updatedState, { serial: false });
    }

    console.log("changing state isRehydrated...");
    await this.initializeGlobalState(store.getState());

    //Flag that initalization is complete and ready to render application
    this.setState({ isAppInitialized: true });
    this.getInitialUrl();
  }

  async getInitialUrl() {
    const url = await Linking.getInitialURL();
    console.log("getInitalUrl", url);
    if (url) {
      this.handleDeepLink({ url });
    }
  }

  async initializeGlobalState(state) {
    // Set global language
    LanguageConfig.Instance.selectedLang = state.selectedLang;
    helpers.updateRTL(state.selectedLang);

    Orientation.lockToPortrait();
    // console.log("analytics init");
    this.requestLocationPermission(state);
    await analytics.init();
    this.initializeProfile();
    this.trackAppLaunch();

    //TODO - Maybe run the store.dispatch(setupNotifications()); here to initialize the user if any, when opgrading the app, and AppLoadingscreen is maybe not loaded!

    setTimeout(() => this.configureNotifications(), 500); // Timeout to match notification animation time.
    // await this.checkThatAllContentIsDownloaded(state);

    AppState.addEventListener("change", this.handleAppStateChange);

    const lastIndex = new Date().getTime() - state.index.updateTime;

    let INVALIDATION_PERIOD = 300000;

    if (__DEV__) {
      INVALIDATION_PERIOD = 3000;
    }

    // Check if index file should be updated
    if (lastIndex > INVALIDATION_PERIOD || isNaN(lastIndex)) {
      // if (lastIndex > 86400000 || lastIndex == NaN) {
      store.dispatch(invalidateIndex()); //86400000 - a day in miliseconds
    }

    const mode = "content";
    fetchIndexIfNeeded(mode);

    //Check if featureflag file should be updated
    const timeSinceLastFeatureFlagUpdate =
      moment().valueOf() - state.featureFlag.lastUpdateTimestamp;

    if (
      timeSinceLastFeatureFlagUpdate > INVALIDATION_PERIOD ||
      isNaN(timeSinceLastFeatureFlagUpdate)
    ) {
      store.dispatch(invalidateFeatureFlagInfo());
    }
    store.dispatch(fetchFeatureFlagIfNeeded());

    // Check if announcement file should be update
    const lastAnnouncementUpdate =
      moment().valueOf() - state.announcementReducer.lastUpdateTimestamp;
    console.log("invalidateAnnouncement", lastAnnouncementUpdate);
    if (
      lastAnnouncementUpdate > INVALIDATION_PERIOD ||
      isNaN(lastAnnouncementUpdate)
    ) {
      console.log("invalidateAnnouncement before dispatch");
      store.dispatch(invalidateAnnouncementInfo());
    }

    // Check if we need to lookup country
    store.dispatch(lookupCountryIfMissing());
  }

  //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
  // async checkThatAllContentIsDownloaded(state) {

  //     let langId = state ? state.selectedLang : "NA";
  //     if (langId === "NA") {
  //         return;
  //     }

  //     if (!state.contentByLanguage) {
  //         return;
  //     }

  //     let originalFilesToDownload = [...state.contentByLanguage[langId].videos, ...state.contentByLanguage[langId].images];

  //     originalFilesToDownload = originalFilesToDownload.map((item, index) => {
  //         return item.src
  //     });

  //     //For testing purs´pose only!!
  //     // originalFilesToDownload.push("/content/assets/videos/english%20WHO/Infection%20prevention/intro_TEEEST.mp4");
  //     // originalFilesToDownload.push("/content/assets/images/english%20WHO/Infection%20prevention/intro_TEEEST.png");

  //     // originalFilesToDownload.map((file, index) => {
  //     //     if (file === "/content/assets/videos/english%20WHO/Infection%20prevention/intro.mp4") {
  //     //         originalFilesToDownload.splice(index, 1);
  //     //     }
  //     // })

  //     const downloadedFiles = [];
  //     const missingFiles = [];
  //     for (let file of originalFilesToDownload) {
  //         if (await fs.exists(fs.DocumentDirectoryPath + file)) {
  //             downloadedFiles.push(file);
  //         } else {
  //             missingFiles.push(file);
  //         }
  //     }

  //     //If the are files that needed to get downloaded, then set the flag within the language in the store
  //     if (missingFiles.length > 0) {
  //         store.dispatch(setMissingFilesToDownload({ contentByLanguage: state.contentByLanguage, missingFilesToDownload: true, langId: langId }));

  //     }
  //     else {
  //         store.dispatch(setMissingFilesToDownload({ contentByLanguage: state.contentByLanguage, missingFilesToDownload: false, langId: langId }));
  //     }
  // }

  handleAppStateChange(nextState) {
    if (store.getState().appState === "background" && nextState === "active") {
      console.log("App has come to the foreground!");
      analytics.init();
      this.initializeProfile();
    } else if (
      store.getState().appState === "active" &&
      nextState !== "active"
    ) {
      analytics.event("appBackground", "::");
      analytics.destroy();
    }

    // Sync profile
    if (nextState === "background" || nextState === "inactive") {
      const storeState = store.getState();
      const { userProfiles, selectedCountry } = storeState;

      const sync = profile.syncOnlineProfiles(
        userProfiles,
        selectedCountry,
        store.dispatch
      ); // Ignore result

      if (sync) {
        store.dispatch(syncProfilesDone());
      } else {
        store.dispatch(syncProfilesInitial());
      }
    }
    store.dispatch(setAppState(nextState));
  }

  private setVisibilityState(component) {
    this.setState({
      notificationVisible: true,
      notificationContent: component,
    });
  }

  configureNotifications() {
    PushNotification.requestPermissions();
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification: any) => {
        console.log("NOTIFICATION:", notification);
        const DATA_PROPERTY = Platform.OS === "android" ? "userInfo" : "data";

        if (notification.userInteraction || __DEV__ || CHEAT) {
          // NOTE: If user taps notification, while application is in foreground notification.userInteraction will be false
          if (notification[DATA_PROPERTY]) {
            if (notification[DATA_PROPERTY].bodyText) {
              store.dispatch(
                openModal({
                  modalType: "BASE_NOTIFICATION_MODAL",
                  modalProps: {
                    icon: notification[DATA_PROPERTY].icon,
                    headerText: notification[DATA_PROPERTY].headerText,
                    bodyText: notification[DATA_PROPERTY].bodyText,
                    bodyText2: notification[DATA_PROPERTY].bodyText2,
                    label: notification[DATA_PROPERTY].label,
                    buttonFunction: notification[DATA_PROPERTY].buttonFunction,
                    time_left_in_seconds:
                      notification[DATA_PROPERTY].time_left_in_seconds,
                    score: notification[DATA_PROPERTY].score,
                  },
                })
              );

              // const notificationContent = (
              //     <NotificationsModal
              //         icon={notification[DATA_PROPERTY].icon}
              //         headerText={notification[DATA_PROPERTY].headerText}
              //         bodyText={notification[DATA_PROPERTY].bodyText}
              //         bodyText2={notification[DATA_PROPERTY].bodyText2}
              //         label={notification[DATA_PROPERTY].label}
              //         buttonFunction={notification[DATA_PROPERTY].buttonFunction}
              //         time_left_in_seconds={notification[DATA_PROPERTY].time_left_in_seconds}
              //         score={notification[DATA_PROPERTY].score}
              //         onRequestClose={() => {
              //             this.setState({ notificationVisible: false });
              //         }}
              //     >
              //     </NotificationsModal>
              // )
              // this.setVisibilityState(notificationContent);
            } else if (
              notification[DATA_PROPERTY] &&
              notification[DATA_PROPERTY].id !==
                NOTIFICATION_ID.DELIVERIES_SURVEY
            ) {
              const data = notification[DATA_PROPERTY];
              console.log("Weekly notification", data);
              store.dispatch(
                openModal({
                  modalType: "ANNOUNCEMENT_MODAL",
                  modalProps: {
                    message: data.message,
                    link: data.link,
                  },
                })
              );

              // const notificationContent = (
              //     <NotificationMessage title={data.title}
              //         link={data.link}
              //         message={data.message}
              //         onRequestClose={() => {
              //             this.setState({ notificationVisible: false });
              //         }} onRequestReopen={() => this.setState({ notificationVisible: true })} />
              // )
              // this.setVisibilityState(notificationContent);
            } else if (
              notification[DATA_PROPERTY] &&
              notification[DATA_PROPERTY].notificationType ===
                NOTIFICATION_ID.DELIVERIES_SURVEY
            ) {
              NavigationService.navigate("UserSurveyQuestionsScreen", {
                from: "index",
                hideBackButton: true,
              });
            }
          }
        } else if (
          notification[DATA_PROPERTY] &&
          (notification[DATA_PROPERTY].id ===
            NOTIFICATION_ID.MY_LEARNING_PROGRESS ||
            notification[DATA_PROPERTY].id === NOTIFICATION_ID.EXAM_UNLOCKED ||
            notification[DATA_PROPERTY].id ===
              NOTIFICATION_ID.RETAKE_EXAM_PREP ||
            notification[DATA_PROPERTY].id ===
              NOTIFICATION_ID.DEV_RETAKE_EXAM_PREP ||
            notification[DATA_PROPERTY].id ===
              NOTIFICATION_ID.RETAKE_EXAM_UNLOCKED)
        ) {
          store.dispatch(
            openModal({
              modalType: "BASE_NOTIFICATION_MODAL",
              modalProps: {
                icon: notification[DATA_PROPERTY].icon,
                headerText: notification[DATA_PROPERTY].headerText,
                bodyText: notification[DATA_PROPERTY].bodyText,
                bodyText2: notification[DATA_PROPERTY].bodyText2,
                label: notification[DATA_PROPERTY].label,
                buttonFunction: notification[DATA_PROPERTY].buttonFunction,
                time_left_in_seconds:
                  notification[DATA_PROPERTY].time_left_in_seconds,
                score: notification[DATA_PROPERTY].score,
              },
            })
          );

          //     < NotificationsModal
          //         icon = { notification[DATA_PROPERTY].icon }
          // headerText = { notification[DATA_PROPERTY].headerText }
          // bodyText = { notification[DATA_PROPERTY].bodyText }
          // bodyText2 = { notification[DATA_PROPERTY].bodyText2 }
          // label = { notification[DATA_PROPERTY].label }
          // buttonFunction = { notification[DATA_PROPERTY].buttonFunction }
          // time_left_in_seconds = { notification[DATA_PROPERTY].time_left_in_seconds }
          // score = { notification[DATA_PROPERTY].score }
          // onRequestClose = {() => {
          //     this.setState({ notificationVisible: false });
          // }
        }
        // >
        //                 </NotificationsModal >
        //             )
        // this.setVisibilityState(notificationContent);
        //         }
        //     },
      },
      requestPermissions: false,
    });
  }

  trackAppLaunch() {
    //Analytics
    const state = store.getState();
    let appVersion = VersionNumber.appVersion;
    let OS = Platform.OS;
    let OSVersion = Platform.Version;
    let langId = state ? state.selectedLang : "NA";
    let langVersion: number | string;
    try {
      langVersion = state.contentByLanguage[langId].version;
    } catch (e) {
      langVersion = "NA";
    }
    const features = [];
    for (const feature in FEATURE_FLAGS) {
      features.push(FEATURE_FLAGS[feature]);
    }
    analytics.event(
      "appLaunch",
      ":" +
        appVersion +
        ":" +
        OS +
        ":" +
        OSVersion +
        ":" +
        langId +
        ":" +
        langVersion +
        ":"
    );
    analytics.event("featureFlags", `:${JSON.stringify(features)}:`);
  }

  async requestLocationPermission(state) {
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    if (new Date().getTime() - state.askedForLocationPermission > ONE_WEEK) {
      const languageState = state.contentByLanguage[state.selectedLang];
      //TODO - Make the brlow text come from the CMS!
      const title = helpers.getTextFromCMS(
        languageState,
        "request_location_title",
        "Help improve our content"
      );
      const message = helpers.getTextFromCMS(
        languageState,
        "request_location_message",
        "Your location is requested to help us understand " +
          "what parts of the world are most in need of support when addressing " +
          "issues related to maternal and neonatal mortality."
      );
      const buttonLabel = helpers.getTextFromCMS(
        languageState,
        "request_location_button_label",
        "Ok"
      );
      const granted = await analytics.requestLocationPermission(
        title,
        message,
        buttonLabel
      );
      if (!granted) {
        console.log("request denied. Need to save to redux");
        store.dispatch(setAskedForPermissionTimestamp(new Date().getTime()));
      } else {
        console.log("Good to go");
      }
    } else {
      console.log("do not asked permission");
    }
  }

  async initializeProfile() {
    // get any newly updated profile from via server
    const updatedProfiles = await profile.loadAndDeleteUpdated();

    profile.upsertAllProfilesHelper(store.dispatch, updatedProfiles);

    try {
      const { userProfiles, selectedCountry } = store.getState();
      const syncedProfiles = await profile.syncOnlineProfiles(
        userProfiles,
        selectedCountry
      );
      profile.upsertAllProfilesHelper(store.dispatch, syncedProfiles);
    } catch (e) {
      console.log("Couldn't update syncOnlineProfiles during initialization");
    }
  }

  handleNavigationChange(prevState, newState, action) {
    console.log("handleNavigationChange", prevState, newState, action);
  }

  render() {
    const { isAppInitialized } = this.state;

    const language =
      store.getState().contentByLanguage[store.getState().selectedLang];

    if (!isAppInitialized) {
      return null;
    }
    // return (<View style={{ flex: 1, backgroundColor: "orange" }}>
    //     <AnimatedRadioButton
    //         checked={true}
    //         borderAndBackgoundColor={"blue"}
    //         disabledTintColor={"gray"} />
    // </View>)
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <App />
          <ModalRoot />
          <LightBoxModal
            visible={this.state.notificationVisible}
            onRequestClose={() => this.setState({ notificationVisible: false })}
            floatingCloseButtonVisible={true}
            closeText={language.screen.close ? language.screen.close : "close"}
          >
            {this.state.notificationContent}
          </LightBoxModal>
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent("SafeDelivery", () => SafeDeliveryApp);
