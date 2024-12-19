// import * as React from "react"
import * as React from "react"
import { View, TouchableOpacity, Image, Animated, ViewStyle, StyleSheet, LayoutAnimation } from "react-native";
import AppText from "./AppText";
import ColorTheme from "../Constants/ColorTheme";

interface OwnProps {
    borderAndBackgoundColor: string;
    disabled?: boolean;
    disabledTintColor: string;
    checked: any;
    animated?: boolean;
    style?: ViewStyle;
}

interface State {
    animate: Animated.Value;
}

const ANIMATION_TIME = 400;

export default class AnimatedRadioButton extends React.Component<OwnProps, State> {

    static defaultProps = {
        checked: false,
        animated: true,
        borderAndBackgoundColor: ColorTheme.PRIMARY
    };

    constructor(props: OwnProps) {
        super(props)
        this.state = {
            animate: new Animated.Value(props.checked ? 1 : 0),
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.checked !== this.props.checked) {
            this.animateOpacity();
        }
    }

    animateOpacity = () => {
        const { animated, checked, } = this.props;

        if (animated) {
            Animated.timing(this.state.animate, {
                toValue: checked | 0,
                duration: ANIMATION_TIME,
                useNativeDriver: true,
                // isInteraction: false
            }).start();
        } else {
            this.state.animate.setValue(checked | 0);
        }
    }

    render() {
        const { borderAndBackgoundColor, disabledTintColor, disabled, checked } = this.props;

        const enabledColor = borderAndBackgoundColor ? borderAndBackgoundColor : "#1F5099";
        const disabledColor = disabledTintColor ? disabledTintColor : "rgba(105, 105, 105, .6)";
        const checkedColor = disabled ? disabledColor : enabledColor;

        return (
            <View style={[styles.outerContainer, { borderColor: checkedColor }, this.props.style]}>
                <Animated.View opacity={this.state.animate} style={[styles.innerContainer, { backgroundColor: checked ? checkedColor : "transparent" }]} />
            </View >
        );
    }
}

interface Style {
    outerContainer: ViewStyle;
    innerContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    outerContainer: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    }
});