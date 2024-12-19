import React from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  I18nManager,
  Linking,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import ModuleItem from '../Components/ModuleItem';
import { getArrayItem } from '../Utils/helpers';
import {
  selectModule,
  dismissedUpgradeMessage,
  cheatDowngradeLanguageVersion
} from '../Actions/actions';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import * as helpers from '../Utils/helpers';
import FramedButton from '../Components/FramedButton';
import NotificationMessage from '../Components/NotificationMessage';
import LightBoxModal from '../Components/LightBoxModal';
import {
  fetchAnnouncementsIfNeeded,
  markAnnouncementAsRead,
  resetAnnouncementReducer,
  showPendingAnnouncement
} from '../Actions/announcementActions';
import { openModal, closeModal } from '../Actions/modalActions';
import { CHEAT } from '../Config/config';
import fs from 'react-native-fs';
import { deleteModuleVideos } from '../Actions/removeContentActions';
import {
  getOfflineModules,
  getStreamingModules,
  getVideosToUpdate
} from '../Sagas/downloadSaga';

//Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
// import FramedButton from '../Components/FramedButton';
// import LightBoxModal from '../Components/LightBoxModal';
// import DownloadService, { ServiceStatusCode } from '../Utils/download-service';
// import setDownloadStatus from "../Actions/downloadActions";
// import downloadMissingFiles from "../Sagas/downloadSaga";
// import { startDownloadOfMissingFIles, cancelDownload, resumeDownload, setMissingFilesToDownload } from '../Actions/downloadActions';
// import { getDownloadPercentage } from '../Reducers/downloadReducer';
// import DownloadIndicator from '../Components/DownloadIndicator';
// import RightHeaderButton from "../Components/RightHeaderButton";

class MainScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: false
  };

  //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
  // static navigationOptions = ({ navigation }) => {

  //     return {
  //         headerRight: (
  //             <View style={{ flexDirection: "row", alignItems: "center" }}>
  //                 {navigation.getParam("showDownloadIcon") === true ? <Animated.View style={{ opacity: navigation.getParam("animate") }}>
  //                     <TouchableOpacity style={{ padding: 10 }} onPress={navigation.getParam("showLightBoxModal")}>
  //                         <Image source={require("../../img/download-red.png")} style={{ marginRight: 6, tintColor: "white" }} />
  //                     </TouchableOpacity>
  //                 </Animated.View> : null}
  //                 <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("drugList", { module: false, title: navigation.getParam("title") })}>
  //                     <Image source={require("../../img/nav_icons/drugs_selected.png")} style={{ marginRight: 6 }} />
  //                 </TouchableOpacity>
  //             </View>
  //         )
  //     }
  // }

  constructor(props) {
    super(props);
    this.state = {
      showUpgradeMessage: this.showUpgradeMessage(props)

      //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
      // missingFilesToDownload: false,
      // animate: new Animated.Value(0),
      // missingFiles: [],
      // downloading: this.props.downloadStatus === "missingMedia" ? true : false,
    };
  }
  componentDidUpdate(prevProps) {
    const { currentAnnouncements, announcementsMarkedAsRead } = this.props;
    if (
      currentAnnouncements !== prevProps.currentAnnouncements ||
      announcementsMarkedAsRead !== prevProps.announcementsMarkedAsRead
    ) {
      this.props.dispatch(showPendingAnnouncement());
      this.props.dispatch(fetchAnnouncementsIfNeeded());
    }
  }

  async componentDidMount() {
    this.props.dispatch(showPendingAnnouncement());

    try {
      //Check if update is needed
      let neededUpdate = false;

      let languages = this.props.index.languages;
      for (let i = 0; i < languages.length; i++) {
        if (languages[i].id == this.props.selectedLang) {
          let language = languages[i];
          if (
            language.version > this.props.language.version ||
            this.props.language.didInvalidate
          ) {
            neededUpdate = true;
            break;
          } else {
            neededUpdate = false;
            break;
          }
        }
      }

      const NO_OTHER_MODAL_SHOWING = !this.props.modalType;
      if (neededUpdate && NO_OTHER_MODAL_SHOWING) {
        const updateTitle = this.props.screen.upgrade_title
          ? this.props.screen.upgrade_title
          : 'update';
        const updateBody = this.props.screen.upgrade_text
          ? this.props.screen.upgrade_text
          : 'update modified content';
        const positiveButton = this.props.screen.accept
          ? this.props.screen.accept
          : 'Accept';
        const negativeButton = this.props.screen.cancel
          ? this.props.screen.cancel
          : 'Cancel';
        const positiveCallback = () => {
          this.props.dispatch(closeModal());
          this.props.navigation.navigate('LanguageScreen', {
            title: this.props.getTextFromCMS(
              'choose_version_title',
              'choose version'
            ),
            updateCurrent: true
          });
        };
        const negativeCallback = () => this.props.dispatch(closeModal());
        this.props.dispatch(
          openModal({
            modalType: 'CONTENT_UPDATE_AVALIABLE',
            modalProps: {
              title: updateTitle,
              body: updateBody,
              negativeButton,
              positiveButton,
              negativeCallback,
              positiveCallback
            }
          })
        );
      }
    } catch (error) {
      console.log('No fetching of index needed');
    }

    this.props.dispatch(fetchAnnouncementsIfNeeded());
    // If selected langauge is arabic, show the disclamer
    if (this.props.selectedLang === '5f06426b-f7f4-ced1-66e3-d8ab3d0881bd') {
      this.props.dispatch(
        openModal({
          modalType: 'ARABIC_DISCLAMER'
        })
      );
    }
  }

  //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
  // async componentDidMount() {

  //     //For use in the static navigationOptions to control the animation and onPress
  //     this.props.navigation.setParams(
  //         {
  //             animate: this.state.animate,
  //             showLightBoxModal: this._showLightBoxModal,
  //             title: this.props.screen["drug_title"],
  //             // showDownloadIcon: this.props.downloadState.status === "missingMedia" ? true : false,
  //         });

  //     if (this.props.downloadStatus === "missingMedia") {

  //         this._animateIn();
  //         this.props.navigation.setParams(
  //             {
  //                 showDownloadIcon: this.props.downloadState.status === "missingMedia" ? true : false,
  //             });
  //     }

  //     // If there are missing files, then show a modal telling the user so, with the option to start the download
  //     if (this.state.missingFilesToDownload === false && this.props.language.missingFilesToDownload === true && this.props.downloadState.status !== "missingMedia") {

  //         this.setState({ missingFilesToDownload: true })

  //         let originalFilesToDownload = [...this.props.language.videos, ...this.props.language.images];

  //         originalFilesToDownload = originalFilesToDownload.map((item) => {
  //             return item.src
  //         });

  //         const downloadedFiles = [];
  //         const missingFiles = [];
  //         for (let file of originalFilesToDownload) {
  //             if (await fs.exists(fs.DocumentDirectoryPath + file)) {
  //                 downloadedFiles.push(file);
  //             } else {
  //                 missingFiles.push(file);
  //             }
  //         }

  //         if (missingFiles.length > 0) {
  //             this.setState({ missingFiles: missingFiles });
  //         }
  //     }

  //     // If the user restarts the app wihile downloading the missing files, then resume the download
  //     if (this.props.downloadState.status === "missingMedia" && this.props.downloadState.status !== "finished") {
  //         this.props.dispatch(resumeDownload());
  //     }
  // }

  // componentDidUpdate() {
  //     if (this.props.downloadStatus === "canceled" && this.state.missingFilesToDownload === true) {
  //         this.setState({ missingFilesToDownload: false });
  //         this.props.navigation.setParams({ showDownloadIcon: false });
  //     }
  // }

  // componentWillReceiveProps(nextProps) {

  //     //Remove the download icon and close the modal when downloading of the missing files is complete
  //     if (this.props.downloadStatus === "missingMedia" && nextProps.downloadState.status === "finished") {

  //         // this.props.dispatch(setMissingFilesToDownload({ contentByLanguage: this.props.contentByLanguage, missingFilesToDownload: false, langId: this.props.selectedLang }));
  //         this.props.navigation.setParams({ showDownloadIcon: false });
  //         // setTimeout(() => this.setState({ missingFilesToDownload: false }), 350);
  //     }

  //     // if (this.props.downloadStatus === "canceled") {
  //     //     this.setState({ missingFilesToDownload: false });
  //     //     this.props.navigation.setParams({ showDownloadIcon: false });
  //     // }

  // }

  // _showLightBoxModal() {
  //     this.setState({ missingFilesToDownload: true });
  // }

  // _animateIn() {
  //     return Animated.timing(this.state.animate, {
  //         toValue: 1,
  //         duration: 1500,
  //         isInteraction: false
  //     }).start(this._animateOut.bind(this));
  // }

  // _animateOut() {
  //     return Animated.timing(this.state.animate, {
  //         toValue: 0.3,
  //         duration: 1500,
  //         isInteraction: false
  //     }).start(this._animateIn.bind(this));
  // }

  showUpgradeMessage(props) {
    if (
      props.currentUser &&
      props.currentUser.profileEmail === null &&
      !props.currentUser.dismissedUpgradeMessage &&
      this.hasEnoughLearningProgress(
        props.currentUser.profileModuleScores,
        props.language.modules.length
      )
    ) {
      return true;
    }

    return false;
  }

  removeUpgradeMessage(props) {
    this.setState({ showUpgradeMessage: false });
    this.props.dispatch(
      dismissedUpgradeMessage(props.currentUser.profileId, true)
    );
  }

  //Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
  // async startDownloadMissingFiles() {

  //     this.setState({ downloading: true });

  //     const _missingFiles = ["/content/assets/videos/english%20WHO/Newborn%20management/danger_signs.mp4", "/content/assets/videos/english%20WHO/Newborn%20management/referral.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/intro.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/initial_care_of_the_low_birth_weight.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/kangaroo_mother_care.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/feeding.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/danger_signs.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/referral.mp4", "/content/assets/videos/english%20WHO/Low%20birth%20weight/respectful_care.mp4"];

  //     // Start the download of the missing files
  //     // await this.props.dispatch(startDownloadOfMissingFIles({ filesToDownload: _missingFiles, langId: this.props.language.langId }));
  //     await this.props.dispatch(startDownloadOfMissingFIles({ filesToDownload: this.state.missingFiles, langId: this.props.language.langId }));

  //     // SHow the donload icon and start the animation of it
  //     this.props.navigation.setParams({ showDownloadIcon: true });
  //     this._animateIn();
  // }

  // cancelDownload() {
  //     // console.log("cancel download");
  //     this.props.dispatch(cancelDownload());
  //     // this.setState({ missingFilesToDownload: false });
  //     // this.props.navigation.setParams({ showDownloadIcon: false });
  // }

  render() {
    const { language, selectedLang, answeredSurvey } = this.props;
    // const { status, previouslyActiveLanguage } = this.props.downloadState;

    // const progress = getDownloadPercentage(this.props.downloadState);

    // const downloadText = this.state.downloading && progress === 100 ? "Download finish" : "Downloading...";

    const modules =
      typeof language.modules !== 'undefined'
        ? language.modules.map((mod, index) => {
            let module = language[mod.id];
            let images = language.images;
            if (typeof module == 'object') {
              let icon = { src: undefined };
              if (
                this.props.downloadStatus === 'finished' ||
                this.props.downloadStatus === 'idle'
              ) {
                icon = getArrayItem(module.icon, images);
              }
              return (
                <ModuleItem
                  key={index}
                  lang={selectedLang}
                  icon={icon}
                  onPress={() => this.goToModule(mod.id, module.description)}
                >{`${module.description}`}</ModuleItem>
              );
            }
            console.log('return null');
            return null;
          })
        : null;

    const upgrade_profile_message = (
      <View style={{ padding: 12, backgroundColor: '#F5A623' }}>
        <TouchableOpacity onPress={() => this.removeUpgradeMessage(this.props)}>
          <Image
            style={{
              alignSelf: 'flex-end',
              height: 16,
              width: 16,
              marginLeft: 8
            }}
            source={require('../../img/notification_message/close.png')}
          />
        </TouchableOpacity>
        <AppText style={{ fontWeight: '500', color: ColorTheme.SECONDARY }}>
          {this.props.getTextFromCMS(
            'lp:mainScreen_userprofile_message',
            'save your profile'
          )}
        </AppText>
        <AppText style={{ color: ColorTheme.SECONDARY }}>
          {this.props.getTextFromCMS(
            'lp:mainScreen_userprofile_message_1',
            'next time you have internet connectivity please go to your user profile and add your e-mail addreess. in this way you can switch between devices'
          )}
        </AppText>
        <TouchableOpacity
          onPress={() => {
            this.removeUpgradeMessage(this.props);
            this.props.navigation.navigate('ShowProfileScreenFromSettings', {
              title: this.props.getTextFromCMS('userprofile', 'user profile')
            });
          }}
        >
          <View
            style={{
              marginTop: 24,
              alignSelf: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <AppText style={{ color: ColorTheme.SECONDARY }}>
              {this.props.getTextFromCMS(
                'lp:mainScreen_userprofile_message_2',
                'go to User Profile'
              )}
            </AppText>
            <Image
              style={{
                height: 10,
                width: 16,
                marginLeft: 8,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
              }}
              source={require('../../img/notification_message/arrow-right.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
    // console.log("this.props.currentUser", this.state.showUpgradeMessage)
    // console.log("render Mainscreen ", language.modules, this.state)
    return (
      //TODO - get the below texts from the CMS!
      <ScrollView
        style={{ backgroundColor: ColorTheme.TERTIARY }}
        alwaysBounceVertical={false}
      >
        <AnalyticsTracker eventType='main' eventData='::' />
        {this.state.showUpgradeMessage && upgrade_profile_message}
        {CHEAT && (
          <View>
            <FramedButton
              label='reset announcement state'
              onPress={() => this.props.dispatch(resetAnnouncementReducer())}
            />
            <FramedButton
              label='downgrade version number'
              onPress={() =>
                this.props.dispatch(
                  cheatDowngradeLanguageVersion(this.props.selectedLang)
                )
              }
            />
            <FramedButton
              label='Link'
              onPress={() =>
                Linking.openURL(
                  'safedelivery://hypertension_1487677992452/ac/emergency-referral---hypertension_1527674369336'
                )
              }
            />
            <FramedButton
              label='delete all videos'
              onPress={() => {
                const modules = this.props.language.modules.map((v) => v.id);
                modules.forEach((moduleId) =>
                  this.props.dispatch(deleteModuleVideos(moduleId))
                );
              }}
            />
            {/* <AppText style={{ color: "blue" }}>{JSON.stringify(this.props.currentAnnouncements)}</AppText>
                    <AppText>{JSON.stringify(this.props.announcementsMarkedAsRead)}</AppText> */}
          </View>
        )}
        {modules}

        {/* Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this */}
        {/* <LightBoxModal
                    visible={this.state.missingFilesToDownload}
                    floatingCloseButtonVisible={true}
                    closeText={this.props.screen.close ? this.props.screen.close : 'close'}
                    onRequestClose={() => this.setState({ missingFilesToDownload: false })}>
                    <View style={{ padding: 20, alignItems: 'center', backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY }}>
                        <AppText style={{ marginLeft: 16, marginRight: 16, textAlign: "center", fontWeight: "bold" }}>{"Missing media files"}</AppText>
                        <AppText style={{ marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: "center" }}>{"There are missing media files that need to be donwloaded!"}</AppText>
                        <AppText style={{ marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: "center" }}>{"Press the donwload button to donwload the missing files in the background while using the app"}</AppText>
                        {this.props.downloadState.status === "missingMedia" || this.state.downloading ? null : <FramedButton style={{ width: 200 }} label={"Download now"} onPress={() => this.startDownloadMissingFiles()} />}
                        {this.state.downloading && (this.props.downloadState.status === "missingMedia" || this.props.downloadState.status === "finished") ? <View style={{ marginLeft: 16, marginRight: 16, marginTop: 12 }}>
                            <DownloadIndicator isVisible={true}
                                progress={progress}
                                width={200}
                                style={{ borderTopWidth: 0 }}
                                text={downloadText}
                                doNotShowExtendIcon={true} />
                            {this.props.downloadState.status === "missingMedia" ? <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.cancelDownload()}>
                                <AppText style={{ color: ColorTheme.PRIMARY }}>
                                    {"Cancel download"}
                                </AppText>
                            </TouchableOpacity> : null}
                        </View> : null}
                    </View>
                </LightBoxModal> */}
        <LightBoxModal
          visible={this.state.showAnnouncement !== undefined}
          floatingCloseButtonVisible={true}
          closeText={
            this.props.screen.close ? this.props.screen.close : 'close'
          }
          onRequestClose={() => this.setState({ showAnnouncement: false })}
        >
          <NotificationMessage
            title={
              this.state.showAnnouncement
                ? this.state.showAnnouncement[this.props.selectedLang]
                : undefined
            }
            link={
              this.state.showAnnouncement
                ? this.state.showAnnouncement.link
                : undefined
            }
            message={
              this.state.showAnnouncement
                ? this.state.showAnnouncement[this.props.selectedLang]
                : undefined
            }
            onRequestClose={() => {
              this.setState({ showAnnouncement: false });
            }}
          />
        </LightBoxModal>
      </ScrollView>
    );
  }

  hasEnoughLearningProgress(moduleScores, numberOfModules) {
    const PROGRESS_NEEDED_FOR_MESSAGE = 0.25;
    const maxScore = numberOfModules * 11; // 11 is three stars in expert
    const sumValues = (obj) =>
      obj && Object.values(obj).reduce((a, b) => a + b, 0);
    let sum = sumValues(moduleScores);

    if (sum > maxScore * PROGRESS_NEEDED_FOR_MESSAGE) {
      return true;
    } else {
      return false;
    }
  }

  goToModule(module, description) {
    this.props.navigation.navigate('Module', {
      title: description,
      module,
      description
    });
    this.props.dispatch(selectModule(module));
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    currentUser,
    userProfiles,
    answeredSurvey
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications, learningPlatform } = language;

  return {
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    learningPlatform,
    currentUser: userProfiles[currentUser.currentUser]
      ? userProfiles[currentUser.currentUser]
      : undefined,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    downloadStatus: state.downloadReducer.status,
    currentAnnouncements: state.announcementReducer.currentAnnouncements,
    announcementsMarkedAsRead:
      state.announcementReducer.announcementsMarkedAsRead,
    // downloadState: state.downloadReducer,
    // contentByLanguage
    modalType: state.modalReducer.modalType,
    answeredSurvey
  };
}

export default connect(mapStateToProps)(MainScreen);
