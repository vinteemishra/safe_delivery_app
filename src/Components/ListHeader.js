import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';

const styles = StyleSheet.create({
    textStyle: {
        flexWrap: 'wrap',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        marginBottom: 16,
        fontWeight: '400',
        fontSize: 14,
    },
    headerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: ColorTheme.TERTIARY,
        minHeight: 55
    }
});
export default class ListHeader extends React.Component {

    render() {
        // let text = this.props.text || "Header";
        return (
            <View style={[styles.headerStyle, {backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'transparent'}]}>
                <AppText style={[styles.textStyle, this.props.style]}>{this.props.children}</AppText>
            </View>
        )
    }
}