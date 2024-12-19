import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Image } from "react-native";
import {
  connect,
  MapDispatchToProps,
  MapStateToProps,
  Store,
} from "react-redux";
import LargeVideoButton from "../Components/LargeVideoButton";
import VideoListItem from "../Components/VideoListItem";
import * as helpers from "../Utils/helpers";
import ColorTheme from "../Constants/ColorTheme";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { NavigationScreenProp } from "react-navigation";
import { StoreState, Video } from "../Reducers/reducers";
import AppText from "../Components/AppText";
import { openModal } from "../Actions/modalActions";
import { ModalProps } from "../Reducers/modalReducer";
import FramedButton from "../Components/FramedButton";
import { cardShadow } from "../Constants/Constants";
import { deleteModuleVideos } from "../Actions/removeContentActions";
import { downloadVideos } from "../Actions/downloadActions";
import { FEATURE_FLAGS, hasFeature } from "../Utils/featureFlag";
import { analytics } from "../Utils/analytics";
import { SelectiveDownloadWarningModalType } from "../Components/Modal/SelectiveDownloadWarningModal";
import { setStreamWarningDisabled } from "../Actions/actions";
const DOWNLOAD_ICON = require("../../img/download-red-large.png");
const ARCHIVE_ICON = require("../../img/archive.png");
const PLAY_ICON = require("../../img/media_270px_vid.png");
var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: ColorTheme.TERTIARY,
  },
  titleStyle: {
    fontSize: ColorTheme.FONT_SIZE,
    textAlign: "center",
    marginRight: 8,
    marginLeft: 8,
  },
  subtitleStyle: {
    color: "rgba(0,0,0,0.50)",
    textAlign: "center",
    marginBottom: 8,
  },
});

interface OwnProps {
  navigation: NavigationScreenProp<
    any,
    { title: string; playlist?: Array<Video>; hasOfflineAssets?: boolean }
  >;
}

interface PropsFromState {
  // module_videos: Array<any>;
  // videos: Array<any>;
  videosInModule: Array<Video>;
  images: Array<any>;
  iconAlt: any;
  durations: any;
  description: string;
  screen: { [key: string]: string };
  selectedModule: string;
  selectedLang: string;
  // offlineAssets: boolean;
  getTextFromCMS(screenKey: string, fallback: string): string;
  hasSelectiveDownload: boolean;
  isStreamingWarningDisabled: boolean;
}

interface PropsFromDispatch {
  openDownloadModal(modalProps: ModalProps): void;
  deleteVideos(moduleId: string): void;
  downloadVideos(list: Array<string>, langId: string): void;
  openWarningModal(
    modalProps?: SelectiveDownloadWarningModalType["modalProps"]
  ): void;
  setStreamWarningDisabled(status: boolean): void;
}

interface State {
  hasOfflineAssets: boolean;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;
class VideoChapterScreen extends React.Component<Props, State> {
  static navigatorButtons = {
    rightButtons: [
      {
        // title: this.props.getTextFromCMS('drug_title', 'drugs'),
        icon: require("../../img/nav_icons/drugs_selected.png"),
        id: "drugs",
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = {
      hasOfflineAssets: true,
    };
  }

  private renderVideoList(
    videos: Array<any>,
    durations: Array<any>,
    images: Array<any>,
    offlineAssets: boolean,
    offlineLabel
  ): Array<JSX.Element> {
    const videoList = videos.map((item, index) => {
      let icon = helpers.getArrayItem(item.id, images);
      let item_duration =
        durations && durations[item.id]
          ? durations[item.id].duration
          : undefined;

      return (
        <VideoListItem
          offlineAssets={offlineAssets}
          icon={icon}
          duration={item_duration}
          key={index}
          onPress={() =>
            this.goToVideoPlayer([item], this.state.hasOfflineAssets)
          }
          offlineLabel={offlineLabel}
        >
          {item.description}
        </VideoListItem>
      );
    });

    return videoList;
  }

  private getTotalDuration(videos, durations): number {
    if (!videos || !durations) {
      return 0;
    }

    const sumOfDurations = videos
      .map((v) => {
        const duration = durations[v.id];
        if (duration && duration.duration) {
          return duration.duration;
        }
      })
      .reduce((acc, current) => acc + current);
    return sumOfDurations;
  }

  public async componentDidMount() {
    const { hasSelectiveDownload, navigation } = this.props;
    if (hasSelectiveDownload) {
      await this.setHasOfflineAssets();
    }

    if (navigation.getParam("playlist")) {
      const playlist = navigation.getParam("playlist");
      this.goToVideoPlayer(playlist, this.state.hasOfflineAssets);
    }
  }

  public async componentDidUpdate(prevProps) {
    const { hasSelectiveDownload } = this.props;
    if (this.props !== prevProps && hasSelectiveDownload) {
      this.setHasOfflineAssets();
    }
  }

  private async setHasOfflineAssets() {
    const { videosInModule } = this.props;
    const hasOfflineAssets = await helpers.isAllAssetsOffline(videosInModule);
    this.setState({ hasOfflineAssets });
  }

  public render() {
    const {
      videosInModule,
      images,
      iconAlt,
      description,
      screen,
      durations,
      getTextFromCMS,
    } = this.props;
    if (videosInModule.length < 1) {
      //Early return no videos to show in module or no videos in language
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <AppText>Something went wrong</AppText>
          <AppText>No videos found</AppText>
        </View>
      );
    }

    let all_videos_duration = 0;
    let alt_icon = helpers.getArrayItem(iconAlt, images);
    if (typeof alt_icon !== "undefined") {
      alt_icon = alt_icon.src;
    }

    all_videos_duration = this.getTotalDuration(videosInModule, durations);
    const duration_label = helpers.msToTime(all_videos_duration);
    const PLAY_FULL_VIDEO_OVERLAY = (
      <View style={{ alignItems: "center", paddingTop: 38 }}>
        <Image
          key="play"
          source={PLAY_ICON}
          style={{ height: 76, width: 76, marginBottom: 8 }}
        />
        <AppText style={styles.titleStyle}>{description}</AppText>
        <AppText style={styles.subtitleStyle}>
          {videosInModule.length}
          {getTextFromCMS("videos", "videos").toLowerCase()} ({duration_label})
        </AppText>
      </View>
    );

    const DOWNLOAD_VIDEOS_OVERLAY = (
      <View style={{ alignItems: "center", paddingTop: 38 }}>
        <Image
          key="download"
          source={DOWNLOAD_ICON}
          style={{ height: 76, width: 81, marginBottom: 8 }}
        />
        <AppText style={styles.titleStyle}>
          {getTextFromCMS("download_module_videos_button", "Download videos")}
        </AppText>
        <AppText style={styles.subtitleStyle}>
          {videosInModule.length}
          {getTextFromCMS("videos", "videos").toLowerCase()} ({duration_label})
        </AppText>
      </View>
    );

    const OVERLAY = this.state.hasOfflineAssets
      ? PLAY_FULL_VIDEO_OVERLAY
      : DOWNLOAD_VIDEOS_OVERLAY;

    return (
      <View style={{ flex: 1 }}>
        <AnalyticsTracker eventType="videoList" eventData={`::`} />
        <ScrollView style={styles.mainContainer} alwaysBounceVertical={false}>
          <LargeVideoButton
            title={description}
            duration={all_videos_duration}
            icon={alt_icon}
            screen={screen}
            onPress={() => {
              if (this.state.hasOfflineAssets) {
                this.goToVideoPlayer(
                  videosInModule,
                  this.state.hasOfflineAssets
                );
              } else {
                const modalProps = {
                  title: getTextFromCMS("download_module", "Download"),
                  body: getTextFromCMS(
                    "download_module_videos_message",
                    "Download videos to watch when offline without using data."
                  ),
                  label: getTextFromCMS(
                    "download_module_videos_button",
                    "Download videos"
                  ),
                  buttonFunction: () => {
                    const listOfVideos = this.props.videosInModule.map(
                      (v) => v.src
                    );
                    analytics.event(
                      "confirmDownloadModuleVideos",
                      `${this.props.selectedLang}:${this.props.selectedModule}`
                    );
                    this.props.downloadVideos(
                      listOfVideos,
                      this.props.selectedLang
                    );
                  },
                  icon: DOWNLOAD_ICON,
                };
                analytics.event(
                  "showDownloadModuleVideos",
                  `${this.props.selectedLang}:${this.props.selectedModule}`
                );
                this.props.openDownloadModal(modalProps);
              }
            }}
          >
            {OVERLAY}
          </LargeVideoButton>
          {this.renderVideoList(
            videosInModule,
            durations,
            images,
            this.state.hasOfflineAssets,
            getTextFromCMS("watch_online", "Watch online")
          )}
          {this.state.hasOfflineAssets && this.props.hasSelectiveDownload ? (
            <FramedButton
              icon={ARCHIVE_ICON}
              style={{
                borderWidth: 0,
                ...cardShadow,
                backgroundColor: ColorTheme.SECONDARY,
                borderRadius: 5,
              }}
              label={getTextFromCMS("remove_videos", "Remove videos")}
              onPress={() => {
                const modalProps = {
                  title: getTextFromCMS("remove_videos", "Remove videos"),
                  body: getTextFromCMS(
                    "remove_video_message",
                    "Remove videos for this module from your device."
                  ),
                  label: getTextFromCMS("remove_videos", "Remove videos"),
                  icon: ARCHIVE_ICON,
                  buttonFunction: () => {
                    analytics.event(
                      "confirmDeleteModuleVideos",
                      `${this.props.selectedLang}:${this.props.selectedModule}`
                    );
                    this.props.deleteVideos(this.props.selectedModule);
                  },
                };
                analytics.event(
                  "showDeleteModuleVideos",
                  `${this.props.selectedLang}:${this.props.selectedModule}`
                );
                this.props.openDownloadModal(modalProps);
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    );
  }

  private goToVideoPlayer(playlist: Array<Video>, isOffline): void {
    console.log("goToVideoPlayer", playlist);
    if (!Array.isArray(playlist)) {
      // Early return. The input playlist is not in format of an array.
      return;
    }
    if (playlist.length == 0) {
      // Early return. The playlist is empty. No videos to play.
      console.log("There is no videos to play");
      return;
    }

    const func = isOffline ? helpers.srcPathOnFilesystem : helpers.srcPathOnWeb;
    let playListWithSourcePath = playlist.map((v) => {
      return { ...v, src: func(v.src) };
    });

    const playVideo = () => {
      this.props.navigation.navigate("VideoPlayerScreen", {
        playlist: playListWithSourcePath,
        onBack: () => this.props.navigation.pop(),
      });
    };
    if (isOffline) {
      analytics.event("startOfflineVideo", "::");
      playVideo();
    } else {
      const onPress = (showWarningStatus: boolean) => {
        analytics.event("startStream", "::");
        this.props.setStreamWarningDisabled(showWarningStatus);
        playVideo();
      };
      if (this.props.isStreamingWarningDisabled) {
        analytics.event("startStream", "::");
        playVideo();
      } else {
        analytics.event("showStreamWarning", "::");
        this.props.openWarningModal({
          onPress,
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true,
        });
      }
    }
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (
  state,
  props
) => {
  const { selectedModule, selectedLang, contentByLanguage } = state;
  let module_videos = [];
  if (
    contentByLanguage[selectedLang] &&
    contentByLanguage[selectedLang][selectedModule]
  ) {
    module_videos = contentByLanguage[selectedLang][selectedModule].videos;
  }
  const language = contentByLanguage[selectedLang];
  const { durations } = contentByLanguage;
  const { videos, images, screen } = language;
  const { iconAlt, description } = language[selectedModule] || {
    iconAlt: undefined,
    description: undefined,
  };
  const videosInModule = helpers.getVideosInModule(module_videos, videos);

  return {
    videosInModule,
    images,
    iconAlt,
    description,
    screen,
    selectedModule,
    durations,
    selectedLang,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    hasSelectiveDownload: hasFeature(
      FEATURE_FLAGS.SELECTIVE_DOWNLOAD,
      selectedLang
    ),
    isStreamingWarningDisabled: state.isStreamingWarningDisabled,
  };
};

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (
  dispatch
) => ({
  openDownloadModal: (modalProps) => {
    dispatch(
      openModal({
        modalType: "DOWNLOAD_VIDEO_ASSETS",
        modalProps,
      })
    );
  },
  deleteVideos: (moduleId) => {
    dispatch(deleteModuleVideos(moduleId));
  },
  downloadVideos: (list, langId) => {
    dispatch(downloadVideos({ filesToDownload: list, langId }));
  },
  openWarningModal: (modalProps) => {
    dispatch(
      openModal({
        modalType: "SELECTIVE_DOWNLOAD_WARNING",
        modalProps: modalProps,
      })
    );
  },
  setStreamWarningDisabled: (value: boolean) => {
    if (value) {
      analytics.event("disableStreamWarning", "::");
      dispatch(setStreamWarningDisabled(value));
    }
  },
});

// module.exports = connect(mapStateToProps)(VideoChapterScreen);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoChapterScreen);
