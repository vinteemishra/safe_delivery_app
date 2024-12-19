import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ImagePropertiesSourceOptions,
  ActivityIndicator,
  Animated,
} from "react-native";
import SeekerBar from "./SeekerBar";
import { ControlIcon } from "./ControlIcon";

interface VideoThemeObject {
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  TERTIARY_COLOR: string;
  FONT_FAMILY: string;
  [color: string]: string;
}

interface Props {
  onPlayButtonPress: () => void;
  paused: boolean;
  duration: number;
  currentTime: number;
  onSeekbarChange: (percent: number, isMoving: boolean) => void;
  onFullScreenChange: () => void;
  theme?: VideoThemeObject;
  isBuffering: boolean;
  error: boolean;
  onBack: () => void;
  isFullscreen: boolean;
  title?: string;
  listener: any;
}

interface State {
  showControls: boolean;
  controlFadeAnim: Animated.Value;
  controlPanelWidth: number;
}

const TIMEOUT_DELAY = 2700;

const CONTROL_PADDING = 12;

const PRIMARY_COLOR = "PRIMARY_COLOR";
const SECONDARY_COLOR = "SECONDARY_COLOR";
const TERTIARY_COLOR = "TERTIARY_COLOR";

export default class ControlPanel extends React.Component<Props, State> {
  private controls = {
    timeout_delay: 0,
    controlTimeout: -1,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showControls: false,
      controlFadeAnim: new Animated.Value(0),
      controlPanelWidth: 0,
    };
    this.controls.timeout_delay = TIMEOUT_DELAY;
    this.resetControlTimeout();
  }

  public componentWillUnmount() {
    clearTimeout(this.controls.controlTimeout);
  }
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.paused !== this.props.paused) {
      this.setState({ showControls: this.props.paused });
    }
  }

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   * Default is 2.7s
   */
  private resetControlTimeout() {
    clearTimeout(this.controls.controlTimeout);
    this.controls.controlTimeout = setTimeout(() => {
      if (!this.props.paused && !this.props.isBuffering) {
        this.hideControls();
      }
    }, TIMEOUT_DELAY);
  }

  /**
   * Function to hide the controls. Sets our
   * state then calls the animation.
   */
  private hideControls() {
    this.setState({ showControls: false });
    // this.hideControlAnimation();
  }

  private wrapInTimeout(func: Function) {
    return (...args: any[]) => {
      this.resetControlTimeout();
      func(...args);
    };
  }

  private getColor(color: string, theme?: VideoThemeObject): string {
    if (theme && theme[color]) {
      return theme[color];
    }

    switch (color) {
      case PRIMARY_COLOR:
        return "blue";
      case SECONDARY_COLOR:
        return "white";
      case TERTIARY_COLOR:
        return "gray";
      default:
        return "white";
    }
  }

  /**
   * Converts seconds to the format hours:minutes:seconds
   * @param {number} duration - number in seconds
   */
  private secondsToTime(secs: number) {
    secs = Math.round(secs);
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds < 10 ? `0${seconds}` : seconds,
    };
    if (obj.h <= 0) {
      return `${obj.m}:${obj.s}`;
    } else {
      return `${obj.h}:${obj.m}:${obj.s}`;
    }
  }

  private getFont(theme?: VideoThemeObject): string | undefined {
    if (this.props.theme && this.props.theme.FONT_FAMILY) {
      return this.props.theme.FONT_FAMILY;
    }

    return undefined;
  }

  private renderBufferIcon(theme?: VideoThemeObject) {
    if (this.props.isBuffering) {
      return (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      );
    } else {
      return;
    }
  }

  private renderErrorIcon() {
    if (this.props.error) {
      return (
        <View style={[styles.backdrop]}>
          <VideoErrorMessage />
          {this.renderTopControls(this.props.theme)}
        </View>
      );
    } else {
      return;
    }
  }
  private renderBottomControls(theme?: VideoThemeObject) {
    return (
      <View
        style={{
          padding: CONTROL_PADDING,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: this.getFont(theme),
            marginLeft: 12,
            color: this.getColor(SECONDARY_COLOR, theme),
          }}
        >
          {this.secondsToTime(
            this.props.currentTime < this.props.duration
              ? this.props.currentTime
              : this.props.duration
          )}
        </Text>
        <SeekerBar
          duration={this.props.duration}
          currentTime={this.props.currentTime}
          onChange={this.wrapInTimeout(this.props.onSeekbarChange)}
          theme={this.props.theme}
        />
        <Text
          style={{
            fontFamily: this.getFont(theme),
            color: this.getColor(SECONDARY_COLOR, this.props.theme),
          }}
        >
          {this.secondsToTime(this.props.duration)}
        </Text>
        <ControlIcon
          name={this.props.isFullscreen ? "exit_fullscreen" : "fullscreen"}
          onPress={this.props.onFullScreenChange}
          size={24}
          color={this.getColor(SECONDARY_COLOR)}
          style={{ marginRight: 12, marginLeft: 12 }}
        />
      </View>
    );
  }

  private renderTopControls(theme?: VideoThemeObject) {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ControlIcon
            name="back"
            onPress={this.props.onBack}
            size={24}
            color={this.getColor(SECONDARY_COLOR)}
            style={{
              marginBottom: 12,
              marginTop: 12,
              marginLeft: 16,
              marginRight: 12,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: this.getFont(theme),
              color: this.getColor(SECONDARY_COLOR, theme),
            }}
          >
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
  private renderMiddleControls(theme?: VideoThemeObject) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            this.hideControls();
            console.log("hideControls press");
          }}
          style={[styles.backdrop, { backgroundColor: "transparent" }]}
        />
        <ControlIcon
          name={
            this.props.currentTime < this.props.duration
              ? this.props.paused
                ? "play"
                : "pause"
              : "replay"
          }
          onPress={this.wrapInTimeout(() => this.props.onPlayButtonPress())}
          size={56}
          color={this.getColor(SECONDARY_COLOR)}
          style={{ marginRight: 12, marginLeft: 12 }}
        />
        {/* <ControlIcon
                    source={this.props.currentTime < this.props.duration ? this.props.paused ? this.PLAY_BUTTON_IMAGE : this.PAUSE_BUTTON_IMAGE : this.REPLAY_BUTTON_IMAGE}
                    onPress={this.wrapInTimeout(() => this.props.onPlayButtonPress())}
                    style={{ height: 55, width: 55 }}
                /> */}
      </View>
    );
  }

  private renderLoading() {
    if (this.props.duration === 0.0 && !this.props.error) {
      return (
        <View style={[styles.backdrop]}>
          <View
            style={[
              styles.backdrop,
              {
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
          {this.renderTopControls(this.props.theme)}
        </View>
      );
    } else {
      return;
    }
  }

  private prevShowControls = false;
  private renderControls(showControls: boolean) {
    if (this.prevShowControls !== showControls) {
      console.log("fade controls", showControls ? "in" : "out");
      Animated.timing(this.state.controlFadeAnim, {
        toValue: showControls ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    this.prevShowControls = showControls;
    return (
      <Animated.View
        style={[styles.backdrop, { opacity: this.state.controlFadeAnim }]}
      >
        {this.renderTopControls(this.props.theme)}
        {this.renderMiddleControls(this.props.theme)}
        {this.renderBottomControls(this.props.theme)}
      </Animated.View>
    );
  }

  public render() {
    const {
      PRIMARY_COLOR,
      SECONDARY_COLOR,
      TERTIARY_COLOR,
      FONT_FAMILY,
    } = this.props.theme;

    return (
      <View
        style={styles.container}
        onLayout={(event) => {
          console.log("onLayout");
          this.setState({ controlPanelWidth: event.nativeEvent.layout.width });
        }}
      >
        {this.renderControls(
          this.state.showControls &&
            this.props.duration > 0 &&
            !this.props.error
        )}
        {/* {this.renderBufferIcon()}*/}
        {this.renderErrorIcon()}
        {this.renderLoading()}
        {!this.state.showControls &&
        !this.props.error &&
        this.props.duration > 0 ? (
          <TouchableWithoutFeedback
            onPress={this.wrapInTimeout(() => {
              this.setState({ showControls: true });
            })}
          >
            <View
              style={[styles.container, { backgroundColor: "transparent" }]}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 3,
                  backgroundColor: SECONDARY_COLOR,
                  width:
                    this.state.controlPanelWidth *
                    (this.props.currentTime / this.props.duration),
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }
}

// interface IconProps {
//     onPress?: () => void;
//     source: ImagePropertiesSourceOptions;
//     style?: any;
//     tintColor?: string;
// }
// function ControlIcon({ onPress, source, style, tintColor }: IconProps) {
//     return (
//         <TouchableOpacity onPress={onPress}>
//             {/* <Image style={[{ marginRight: 12, marginLeft: 12, height: 24, tintColor: tintColor ? tintColor : "#fff" }, style]} resizeMode="contain" source={source} /> */}
//         </TouchableOpacity>
//     );
// }

const VideoErrorMessage = () => {
  return (
    <View style={[styles.container]}>
      <Text style={{ fontSize: 24, color: "white" }}>An error occured</Text>
      <Text style={{ color: "white" }}>The video could not be loaded</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
