import * as React from "react"
import { View, TouchableOpacity, Image, Animated } from "react-native";
import AppText from "./AppText";
import ColorTheme from "../Constants/ColorTheme";

interface OwnProps {
    iconTintColor?: string;
    fillColor?: string;
    disabled?: boolean;
    label?: string;
    checked: any;
    animated?: boolean;
    activeOpacity?: number;
    onPress(checked): void;
    children?: any;
    disabledFillColor?: string;
    checkedFillColor?: string;
    borderColor: string;
    image?: any;
    borderWidth?: number;
    animateFontSize?: boolean;
}

interface State {
    animate: Animated.Value;
    pointerEvents: any;
    disabled: boolean;
}

const ANIMATION_TIME = 250;

export default class AnimatedCheckBox extends React.Component<OwnProps, State> {

    static defaultProps = {
        checked: false,
        animated: true,
        activeOpacity: 0.6, //Control the blink efect when an item is selected
        children: null,
        image: null,
        onPress: null,
        iconTintColor: ColorTheme.SECONDARY,
        borderColor: ColorTheme.PRIMARY,
        borderWidth: 1,
        animateFontSize: false,
    };

    constructor(props: OwnProps) {
        super(props)
        this.state = {
            animate: new Animated.Value(props.checked ? 1 : 0),
            pointerEvents: this.getPointerEvents(props.onPress),
            disabled: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.onPress &&
            nextProps.onPress !== this.props.onPress
        ) {
            this.setState({
                pointerEvents: this.getPointerEvents(nextProps.onPress),
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.checked !== this.props.checked) {
            this.animateOpacity();
        }
    }

    onPress = () => {
        const { onPress, checked, } = this.props;

        if (onPress) {
            onPress(!checked);
        }
    }

    getPointerEvents = (onPress) => {
        if (onPress) {
            return 'auto';
        }
        return 'none';
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
        const { children, activeOpacity, disabled, iconTintColor, borderColor, checkedFillColor, disabledFillColor, image, borderWidth, checked, animateFontSize } = this.props;

        const enabledColor = checkedFillColor ? checkedFillColor : "#1F5099";
        const disabledColor = disabledFillColor ? disabledFillColor : "rgba(105, 105, 105, .6)";
        const checkedColor = disabled ? disabledColor : enabledColor;
        const fontWeight = animateFontSize ? checked ? "bold" : "normal" : "normal";

        return (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 10 }} onPress={this.onPress} activeOpacity={activeOpacity} >
                <View style={{ width: 20, height: 20, borderColor: !disabled ? borderColor : disabledColor, borderWidth: borderWidth, borderRadius: 2, backgroundColor: checked ? checkedColor : "transparent", marginRight: children ? 12 : 0 }}>
                    <Animated.View opacity={this.state.animate} style={{ flex: 1, backgroundColor: checkedColor, justifyContent: "center", alignItems: "center" }}>
                        {image || <Image source={require('../../img/learning_icons/success.png')} style={{ height: '80%', width: '80%', tintColor: iconTintColor, resizeMode: 'contain' }} />}
                    </Animated.View>
                </View>
                {children || this.props.label && <AppText style={{ marginLeft: 10, flex: 1, fontWeight: fontWeight, alignItems: "center", }}>{this.props.label}</AppText>}
            </TouchableOpacity>
        );
    }
}