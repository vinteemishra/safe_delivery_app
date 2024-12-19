import * as React from "react";
import {
    View,
    StyleSheet,
    ViewStyle,
} from "react-native";
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import Video from "react-native-video";
import ColorTheme from "../../Constants/ColorTheme";
import AppText from "../AppText";
import ControlPanel from "./ControlPanel";
// import { isTablet } from "../Utils";

const isTablet = () => false;

interface Props {
    source: string;
    theme?: VideoThemeObject;
    onBack: () => void;
    style?: ViewStyle | ViewStyle[];
    addOrientationListener?: boolean;
    containerLayout: { x: number, y: number, width: number, height: number, screen_height: number, screen_width: number };
    title?: string;
    listener?: (event: string, currentTime: number, duration: number) => void;
    startPoint?: number;
    alwaysFullScreen?: boolean;
    onEnd?(playerRef: any): void;
}

interface VideoThemeObject {
    PRIMARY_COLOR: string;
    SECONDARY_COLOR: string;
    TERTIARY_COLOR: string;
    FONT_FAMILY: string;
    [color: string]: string;

}

interface State {
    rate: number;
    volume: number;
    duration: number;
    paused: boolean;
    repeat: boolean;
    currentTime: number;
    seeking: boolean;
    isFullscreen: boolean;
    orientation: any;
    isBuffering: boolean;
    error: boolean;
    timeout: boolean;
    systemRotationLock: boolean;
}

class VideoPlayer extends React.Component<Props, State> {
    public player: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            rate: 1,
            volume: 1,
            duration: 0.0,
            paused: false,
            repeat: false,
            currentTime: 0.0,
            seeking: false,
            // isFullscreen: this.props.alwaysFullScreen ? true : false,
            isFullscreen: false,
            orientation: isTablet() ? "LANDSCAPE" : "PORTRAIT",
            isBuffering: false,
            error: false,
            timeout: false,
            systemRotationLock: false
        };

        this.onProgress = this.onProgress.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
        this.onError = this.onError.bind(this);
        this.notifyListener = this.notifyListener.bind(this);
        this._onOrientationDidChange = this._onOrientationDidChange.bind(this);
        this.calculateTimeFromSeekerPosition = this.calculateTimeFromSeekerPosition.bind(this);
    }

    _onOrientationDidChange = (orientation: OrientationType) => {
        if (this.state.systemRotationLock) { //This is to prevent rotation on Android if the system autolock is disabled on the device. Works out of the box on IOS.
            if (orientation === "PORTRAIT") {
                this.leaveFullscreen();
            }
            if (orientation === 'LANDSCAPE-LEFT') {
                this.enterFullscreen();
            }
            if (orientation === "LANDSCAPE-RIGHT") {
                this.setState({ isFullscreen: true });
                Orientation.lockToLandscapeRight();
            }
        }
    };

    componentDidMount() {
        //Check to see if the system autolock is enabled or not.
        Orientation.getAutoRotateState((rotationLock) => this.setState({ systemRotationLock: rotationLock }));

        //Add the device orientation listener. And start the video in portrait mode
        if (this.props.addOrientationListener) {
            Orientation.addDeviceOrientationListener(this._onOrientationDidChange);
            Orientation.lockToPortrait();
        }
        this.notifyListener("start");
    }

    public componentWillUnmount() {
        //Remove the listener when unmount, and set the screen to portrait
        if (this.props.addOrientationListener) {
            Orientation.removeDeviceOrientationListener(this._onOrientationDidChange);
            Orientation.lockToPortrait();
        }
        this.notifyListener("leave");
    }

    private leaveFullscreen() {
        this.setState({ isFullscreen: false, });
        Orientation.lockToPortrait();
        Orientation.unlockAllOrientations();
    }

    private enterFullscreen() {
        this.setState({ isFullscreen: true });
        Orientation.lockToLandscapeLeft();
    }

    private notifyListener(event: string, currentTime?: number, duration?: number): void {
        if (this.props.listener) {
            const time = currentTime === undefined ? this.state.currentTime : currentTime;
            const dur = duration === undefined ? this.state.duration : duration;
            this.props.listener(event, time, dur);
        }
    }

    /**
     * Set how much of the seekbar is filled and where the knob is placed on the bar
     * @param {float} position distance to leftside of seekbar.
     */
    private onProgress(data: any): void {
        if (!this.state.seeking) {
            this.setState({ currentTime: data.currentTime });
        }
    }

    /**
     * Return the time that the video should be at
     * based on where the seeker handle is.
     *
     * @return {float} time in ms based on seekerPosition.
     */
    private calculateTimeFromSeekerPosition(percent: number, isMoving: boolean): void {
        console.log("calculateTimeFromSeekerPosition");
        if (!isMoving) {
            console.log("percent", this.state.duration, percent);
            const currentTime = this.state.duration * percent;
            this.setState({ currentTime });
            console.log("seekerStoppedMoving", currentTime, this.state.duration, percent);

            this.player.seek(Math.floor(currentTime), 20);

            this.notifyListener("seekerChange", currentTime);
        }
    }

    private onLoadStart(data) {
        console.log("onLoadStart", data);
    }

    private onLoad(data: { duration: number }): void {
        console.log("onLoad", data.duration);
        let startPoint = 0.0;
        if (this.props.startPoint) {
            console.log("progress - there is progress", this.props.startPoint);
            startPoint = (data.duration * this.props.startPoint) / 100;
            this.player.seek(startPoint);
        }
        console.log("progress -  currentTime", startPoint)
        this.setState({ duration: data.duration, currentTime: startPoint });
    }

    private onEnd() {
        if (this.props.onEnd) {
            this.setState({ currentTime: this.state.duration });
            this.props.onEnd(this.player);
        } else {
            console.log("onEnd() is undefined");
            this.setState({ paused: true });

        }
    }

    private onError(data: any): void {
        console.log("onError", data);
        this.notifyListener("error");
        this.setState({ error: true });
    }

    private onBuffer(data: { isBuffering: boolean }): void {
        console.log("onBuffer", data);
        this.setState({ isBuffering: data.isBuffering });
    }

    private handlePlayButton(): void {
        if (Math.ceil(this.state.currentTime) >= Math.ceil(this.state.duration)) {
            this.player.seek(0);
            this.setState({ currentTime: 0.0 });
        }
        const paused = !this.state.paused;
        if (paused) {
            this.notifyListener("pausePressed");
        } else {
            this.notifyListener("playPressed");
        }
        this.setState({ paused });
    }

    public pauseVideo() {
        this.setState({ paused: true });
    }

    private toggleFullScreen(isFullscreen: boolean): void {
        if (isFullscreen) {
            this.leaveFullscreen();
        } else {
            this.enterFullscreen();
        }
        this.notifyListener(isFullscreen ? "fullscreenExit" : "fullscreenEnter");
    }

    public render() {

        const { x, y, width, height, screen_height, screen_width } = this.props.containerLayout;
        const absoluteBottom = screen_height - height - y;
        const absoluteRight = screen_width - width - x;
        const absoluteLeft = this.props.containerLayout.x;
        const absoluteTop = this.props.containerLayout.y;
        const isConnected = true;
        return (
            <View style={this.state.isFullscreen || this.props.alwaysFullScreen ? styles.fullscreen_container : [styles.mobile_portrait_container, { left: absoluteLeft, top: absoluteTop, right: absoluteRight, bottom: absoluteBottom }]} >
                {/* <View style={this.state.isFullscreen ? styles.fullscreen_container : [styles.mobile_portrait_container, { left: this.props.containerLayout.x, top: this.props.containerLayout.y, right: screen_width - this.props.containerLayout.width, bottom: screen_height - this.props.containerLayout.height }]} > */}
                {/* <View style={this.state.isFullscreen ? styles.fullscreen_container : [styles.mobile_portrait_container, { right: "35%", bottom: 200 }]} > */}
                <Video
                    ref={(ref) => { this.player = ref; }}
                    source={{ uri: this.props.source, type: "mp4" }} // Real source
                    repeat={this.state.repeat}
                    paused={this.state.paused}
                    rate={this.state.rate}
                    volume={this.state.volume}
                    resizeMode={"contain"}
                    onEnd={() => {
                        this.notifyListener("finished");
                        this.onEnd();
                    }}
                    style={styles.videoPlayerStyle}
                    onProgress={this.onProgress}
                    onLoad={this.onLoad}
                    onLoadStart={this.onLoadStart}
                    ignoreSilentSwitch={"ignore"}
                    onBuffer={this.onBuffer}
                    onError={(data) => this.onError(data)}
                // onTimedMetadata={() => console.log("metadata")}
                />
                <ControlPanel
                    onPlayButtonPress={() => this.handlePlayButton()}
                    currentTime={this.state.currentTime}
                    duration={this.state.duration}
                    onSeekbarChange={this.calculateTimeFromSeekerPosition}
                    paused={this.state.paused}
                    onFullScreenChange={() => this.toggleFullScreen(this.state.isFullscreen)}
                    theme={this.props.theme}
                    isBuffering={this.state.isBuffering}
                    error={this.state.error}
                    onBack={this.props.onBack}
                    isFullscreen={this.state.isFullscreen}
                    title={this.props.title}
                    listener={this.notifyListener} />
                {/* {this.props.source.includes("https://") ? this.renderConnectionError(isConnected) : null} */}
            </View>
        );
    }
}

export default VideoPlayer;

const styles = StyleSheet.create({
    mobile_portrait_container: {
        position: "absolute",
        top: 0, left: 0,
        // width: isTablet() ? "65%" : "100%",
        // aspectRatio: (16 / 9),
        backgroundColor: "black",
        elevation: 2,
        zIndex: 2,
    },
    fullscreen_container: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "black",
        zIndex: 2,
        elevation: 2,
        overflow: "visible",
    },
    videoPlayerStyle: {
        flex: 1,
    },
});






