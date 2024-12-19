import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import AppText from './AppText'
import ColorTheme from '../Constants/ColorTheme'
import withPreventDoublePress from "../Utils/withPreventDoublePress";

const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
    buttonText: {
        color: ColorTheme.SECONDARY,
        textAlign: 'center',
    }
});

interface OwnProps {
    onBack?(): void;
    onNext?(): void;
    next?: string;
    back?: string;
    active?: boolean;
}
export default class UserProfileFooterButtons extends Component<OwnProps> {

    public render() {
        const TouchableOpacityPreventDoublePress = withPreventDoublePress(TouchableOpacity);

        const { onBack, onNext, next, back, active } = this.props
        const backButton = () => {
            return (
                <TouchableOpacityPreventDoublePress style={styles.button} onPress={active ? () => onBack() : () => { }} >
                    <AppText style={styles.buttonText}>{(back) ? back : 'back'}</AppText>
                </TouchableOpacityPreventDoublePress>
            )
        }

        const nextButton = () => {
            // console.log("nextButton", active, "back", back, "next", next)
            return (
                <TouchableOpacityPreventDoublePress style={styles.button} onPress={active ? () => onNext() : () => { }}>
                    <AppText style={{ textAlign: 'center', color: active ? ColorTheme.SECONDARY : ColorTheme.SEPARATOR }}>{next ? next : 'next'}</AppText>
                </TouchableOpacityPreventDoublePress>
            )
        }

        return (
            <View style={{ minHeight: 50, backgroundColor: ColorTheme.PRIMARY, flexDirection: 'row' }}>
                {(back) ? backButton() : null}
                {(next) ? nextButton() : null}
            </View>
        )
    }
}