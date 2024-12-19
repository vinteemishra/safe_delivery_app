import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from './AppText';

var styles = StyleSheet.create({
    testStyle: {
        color: ColorTheme.SECONDARY
    }
});

class TopSectionOfValueProps extends Component {

    render() {
        let { headerText, bodyText, bodyText1, icon } = this.props

        const dimensions = Dimensions.get('window');
        const imageHeight = Math.round(dimensions.width * 9 / 26);
        const imageRadius = imageHeight / 2;

        return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: "center", paddingLeft: 12, paddingRight: 12, }}>
                <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: ColorTheme.FONT_SIZE * 1.25 }]}>
                    {headerText}
                </AppText>
                <Image style={{ height: imageHeight, width: imageHeight, borderRadius: imageRadius, marginTop: 16, resizeMode: 'cover' }} source={{ uri: icon }}></Image>
                <AppText style={[styles.testStyle, { marginTop: 16, textAlign: 'center', fontSize: ColorTheme.FONT_SIZE, marginLeft: 25, marginRight: 25 }]}>
                    {bodyText}
                </AppText>
                <AppText style={[styles.testStyle, { marginTop: 12, textAlign: 'center', fontSize: ColorTheme.FONT_SIZE, marginLeft: 25, marginRight: 25 }]}>
                    {bodyText1}
                </AppText>
                <View style={[, { marginLeft: 10, marginRight: 10 }]}>
                    {this.props.children}
                </View>
            </View>
        );
    }
};

export default TopSectionOfValueProps;