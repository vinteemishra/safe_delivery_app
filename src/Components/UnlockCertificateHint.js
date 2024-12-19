import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';

export default class UnlockCertificateHint extends Component {

    render() {

        const { headerText, bodyText, style, icon } = this.props;

        if (icon == "lock_open") {
            internHeight = 70;
            internWidth = 70;
        }
        else if (icon == "lock_alt") {
            internHeight = 60;
            internWidth = 60;
        }

        return (
            <View style={[styles.container, style]}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    {
                        icon == undefined ?
                            <Image source={{ uri: 'placeholder_icon' }} style={[styles.imageStyle, { height: internHeight, width: internWidth }]} /> :
                            <Image source={{ uri: icon }} style={[styles.imageStyle, { height: internHeight, width: internWidth }]} />
                    }
                    <View style={{ margin: 20, }}>
                        <AppText style={{
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: ColorTheme.FONT_SIZE * 1.25,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 10
                        }}>
                            {headerText}
                        </AppText>
                        <AppText style={{
                            textAlign: 'center',
                            fontSize: ColorTheme.FONT_SIZE,
                        }}>
                            {bodyText}
                        </AppText>
                    </View>
                </View>
                <View>
                    {this.props.children}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginRight: 8,
        marginLeft: 8,
        backgroundColor: ColorTheme.SECONDARY,
        borderWidth: 1,
        borderColor: ColorTheme.SEPARATOR,
        borderTopWidth: 0
    },
    imageStyle: {
        resizeMode: 'contain'
    },
})