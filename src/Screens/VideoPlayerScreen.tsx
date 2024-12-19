import * as React from "react";
import { StatusBar, View } from "react-native";
import VideoPlayer from "../Components/Video/VideoPlayer";
import ColorTheme from "../Constants/ColorTheme";
import { NavigationStackProp } from "react-navigation-stack";
import fs from "react-native-fs";
import SafeAreaView from "react-native-safe-area-view";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { ENDPOINT_HOST } from "../Config/config";
import { BASE_URL } from "../Constants/Constants";
import { Video } from "../Reducers/reducers";

interface PropsFromState {}

interface OwnProps {
  navigation: NavigationStackProp<
    any,
    { playlist: Array<Video>; onBack(): void }
  >;
}

interface DispatchProps {}

type Props = PropsFromState & OwnProps & DispatchProps;

interface State {
  videoContainerLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
    screen_height: number;
    screen_width: number;
  };
  index: number;
  playList: Array<Video>;
}

class VideoPlayerScreen extends React.Component<Props, State> {
  private videoPlayerRef: React.RefObject<VideoPlayer>;
  public static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };
  constructor(props: Props) {
    super(props);
    this.videoPlayerRef = React.createRef();
    this.state = {
      playList: [],
      videoContainerLayout: {
        x: 0,
        y: 0,
        width: 375,
        height: 200,
        screen_height: 568,
        screen_width: 375,
      },
      index: 0,
    };
  }

  public componentWillMount() {
    const placeholderVideoInfo = {
      src: "",
      description: "No video",
      id: "none",
      icon: "none",
      version: 1,
    };
    console.log(
      "videoPlayerScreen params",
      this.props.navigation.getParam("playlist")
    );
    this.setState({
      playList: this.props.navigation.getParam("playlist") || [
        placeholderVideoInfo,
      ],
    });
  }

  private onEnd(videoPlayer: any) {
    if (this.state.playList.length > this.state.index + 1) {
      this.setState({ index: this.state.index + 1 });
      videoPlayer.seek(0);
    } else if (this.state.playList.length > 1) {
      this.props.navigation.goBack(null);
    } else {
      if (this.videoPlayerRef.current) {
        this.videoPlayerRef.current.pauseVideo();
      }
    }
  }

  public render() {
    console.log("this.state.playlist", this.state.playList);
    const { src, description, id } = this.state.playList[this.state.index];
    console.log("source of video", src);
    return (
      <SafeAreaView
        forceInset={{ top: "always" }}
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
          }}
          onLayout={(event) => {
            let { x, y, width, height } = event.nativeEvent.layout;
            this.setState({
              videoContainerLayout: {
                ...this.state.videoContainerLayout,
                screen_height: height,
                screen_width: width,
              },
            });
          }}
        >
          <StatusBar hidden={true} />
          {this.state.playList.length > 1 ? (
            <AnalyticsTracker eventType="videoFull" eventData={`::`} />
          ) : (
            <AnalyticsTracker eventType="videoChapter" eventData={`:${id}:`} />
          )}

          <View
            style={{ width: "100%", aspectRatio: 16 / 9 }}
            onLayout={(event) => {
              let { x, y, width, height } = event.nativeEvent.layout;
              this.setState({
                videoContainerLayout: {
                  ...this.state.videoContainerLayout,
                  x,
                  y,
                  width,
                  height,
                },
              });
            }}
          />
          <VideoPlayer
            ref={this.videoPlayerRef}
            alwaysFullScreen={true}
            title={description ? description : ""}
            containerLayout={this.state.videoContainerLayout}
            addOrientationListener={true}
            onBack={() => this.props.navigation.goBack(null)}
            theme={{
              PRIMARY_COLOR: ColorTheme.PRIMARY,
              SECONDARY_COLOR: ColorTheme.SECONDARY,
              TERTIARY_COLOR: ColorTheme.TERTIARY,
              FONT_FAMILY: "Rubik",
            }}
            source={src}
            onEnd={(playerRef) => this.onEnd(playerRef)}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default VideoPlayerScreen;
