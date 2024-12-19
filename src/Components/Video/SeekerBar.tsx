import * as React from "react";
import {
    View,
    StyleSheet,
    PanResponder,
    PanResponderInstance
} from "react-native";

interface Props {
    onChange: (percent: number, isMoving: boolean) => void;
    duration: number;
    currentTime: number;
    theme?: object;
}

interface State {
    seeking: boolean;
    previousKnobPosition: number;
    knobPosition: number;
    seekerWidth: number;
    seekerHeight: number;
    circleSize: number;
}

const CIRCLE_HOTSPOT_SIZE = 60;
const CIRCLE_VISUAL_SIZE = 12;
const SEEKER_HOTSPOT_HEIGHT = 20;
const SEEKER_VISUAL_HEIGHT = 2;
const PRIMARY_COLOR = "PRIMARY_COLOR";
const SECONDARY_COLOR = "SECONDARY_COLOR";
const TERTIARY_COLOR = "TERTIARY_COLOR";

export default class SeekerBar extends React.Component<Props, State> {
    public panResponder: PanResponderInstance;

    constructor(props: Props) {
        super(props);
        this.state = {
            seeking: false,
            previousKnobPosition: 0,
            knobPosition: 0,
            seekerWidth: 0,
            seekerHeight: SEEKER_HOTSPOT_HEIGHT,
            circleSize: CIRCLE_VISUAL_SIZE,
        };

        // Setup PanResponder
        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: this.handlePanResponderGrant.bind(this),
            onPanResponderMove: this.handlePanResponderMove.bind(this),
            onPanResponderRelease: this.handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
        });
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (!this.state.seeking) {
            const percent = this.props.duration !== 0 ? nextProps.currentTime / this.props.duration : 0;
            this.setSeekerPosition(percent, this.state.seeking);
        }
    }

    private handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
        // Should we become active when the user presses down on the circle?
        return true;
    }

    private handleMoveShouldSetPanResponder(e: Object, gestureState: Object): boolean {
        // Should we become active when the user moves a touch over the circle?
        return true;
    }

    private handlePanResponderGrant(e: Object, gestureState: any): void {
        this.setState({ seeking: true });
    }

    private handlePanResponderMove(e: Object, gestureState: any): void {
        const percent = this.getProgressPercent(this.state.previousKnobPosition, gestureState.dx, this.state.seekerWidth); // this.constrainToSeekerMinMax(this.state.previousKnobPosition + (gestureState.dx / this.state.seekerWidth));
        this.setSeekerPosition(percent, this.state.seeking);
        this.props.onChange(this.constrainToSeekerMinMax(percent), true);
    }

    private handlePanResponderEnd(e: Object, gestureState: any): void {

        const percent = this.getProgressPercent(this.state.previousKnobPosition, gestureState.dx, this.state.seekerWidth); // this.constrainToSeekerMinMax(this.state.previousKnobPosition + (gestureState.dx / this.state.seekerWidth));

        this.props.onChange(this.constrainToSeekerMinMax(percent), false);
        this.setState({
            seeking: false,
        });
        this.setSeekerPosition(percent, false);
    }

    private calculateSeekerPosition(currentTime: number): number {
        let duration = this.props.duration;
        const percent = currentTime / duration;
        return this.state.seekerWidth * percent;
    }

    private getProgressPercent(previousPosition: number, dx: number, seekerWidth: number): number {
        if (this.state.seekerWidth === 0) {
            return 0;
        } else {
            return previousPosition + dx / seekerWidth;
        }

    }
    /**
     * Contrain the location of the knob to be within the seeker
     *
     * @param {float} value position of seeker knob
     * @return {float} contrained position of seeker handle in px
     */
    private constrainToSeekerMinMax(value = 0): number {
        if (value <= 0) {
            return 0;
        } else if (value > 1) {
            return 1;
        }
        return value;
    }

    /**
     * Set how much of the seekbar is filled and where the knob is placed on the bar
     * @param {float} position distance to leftside of seekbar.
     */
    private setSeekerPosition(percent = 0, seeking: boolean): void {
        percent = this.constrainToSeekerMinMax(percent);
        this.setState({
            knobPosition: percent,
        });
        if (!seeking) {
            this.setState({ previousKnobPosition: percent });
        }
    }

    private getColor(color: string, theme: any): string {
        if (this.props.theme && theme[color]) {
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

    public render() {
        return (
            <View style={{ flex: 1, marginLeft: 8, marginRight: 8 }}>
                <View style={{ flex: 1, height: this.state.seekerHeight, backgroundColor: "transparent", justifyContent: "center" }}
                    onLayout={event => {
                        this.setState({ seekerWidth: event.nativeEvent.layout.width - CIRCLE_VISUAL_SIZE });
                    }} >
                    <View style={{ height: SEEKER_VISUAL_HEIGHT, backgroundColor: this.getColor(SECONDARY_COLOR, this.props.theme), borderRadius: SEEKER_VISUAL_HEIGHT / 2 }}>
                        <View style={[styles.progressFill, { backgroundColor: this.getColor(SECONDARY_COLOR, this.props.theme), width: this.state.knobPosition * this.state.seekerWidth + CIRCLE_VISUAL_SIZE / 2 }]} />
                    </View>
                </View>
                <View style={[styles.circleHotspot, { left: this.state.knobPosition * this.state.seekerWidth - CIRCLE_HOTSPOT_SIZE / 2 + CIRCLE_VISUAL_SIZE / 2 }]}
                    {...this.panResponder.panHandlers}>
                    <View
                        style={[styles.circle, { backgroundColor: this.getColor(SECONDARY_COLOR, this.props.theme) }]}
                    />
                    {/* <View style={[styles.circle, { backgroundColor: this.getColor(PRIMARY_COLOR)}]}/> */}
                </View>
            </View>);
    }
}

const styles = StyleSheet.create({
    progressFill: {
        position: "absolute",
        height: SEEKER_VISUAL_HEIGHT,
        top: 0,
        borderRadius: SEEKER_VISUAL_HEIGHT / 2,
    },
    circle: {
        overflow: "visible",
        width: CIRCLE_VISUAL_SIZE,
        height: CIRCLE_VISUAL_SIZE,
        borderRadius: CIRCLE_VISUAL_SIZE / 2,
    },
    circleHotspot: {
        paddingTop: CIRCLE_VISUAL_SIZE / 4,
        width: CIRCLE_HOTSPOT_SIZE,
        height: CIRCLE_HOTSPOT_SIZE,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "transparent",
        top: SEEKER_HOTSPOT_HEIGHT / 2 - CIRCLE_HOTSPOT_SIZE / 2,
    },
});