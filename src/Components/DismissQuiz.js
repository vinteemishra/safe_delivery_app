import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from './AppText';
import FramedButton from '../Components/FramedButton';

export default class DismissQuiz extends Component {

    render() {
        const { message, header, confirmLabel, confirmDismiss } = this.props;

        let width = Dimensions.get('window').width
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <View style={{ backgroundColor: ColorTheme.WHITE, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.WHITE }}>
                    <View style={{ margin: 25 }}>
                        <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.25, color: ColorTheme.BLACK, textAlign: "center", fontWeight: "bold" }}>
                            {header}
                        </AppText>
                        <AppText style={{ fontSize: ColorTheme.FONT_SIZE, color: ColorTheme.BLACK, textAlign: "center", marginTop: 12 }}>
                            {message}
                        </AppText>
                    </View>
                    <FramedButton label={confirmLabel} style={[, { marginTop: -25, width: 180 }]} onPress={() => confirmDismiss()} />
                </View>
            </View>
        );
    }
}



