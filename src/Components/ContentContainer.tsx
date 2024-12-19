import React, { Component } from 'react';
import ColorTheme from '../Constants/ColorTheme';
import {
    StyleSheet,
    View
} from 'react-native';

export default class ContentContainer extends Component{
    render(){
        return <View style={styles.mainContainer}>{this.props.children}</View>
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: ColorTheme.TERTIARY
    }
});