import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from 'react-native';
import AppText from '../Components/AppText';
import fs from 'react-native-fs';
import * as helpers from '../Utils/helpers';
import ColorTheme from '../Constants/ColorTheme';

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    cardStyle: {
        marginBottom: 8,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 4,
            width: 3,
        },
    },
    imageStyle: {
        flex: 1,
        width: (width < height) ? width : height,
        height: (width < height) ? width / 16 * 9 : height / 16 * 9,
    },
    titleStyle: {
        fontSize: ColorTheme.FONT_SIZE,
        textAlign: 'center',
        marginRight: 8,
        marginLeft: 8,

    },
    subtitleStyle: {
        color: 'rgba(0,0,0,0.50)',
        textAlign: 'center',
        marginBottom: 8,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center'

    }

});

export default class LargeVideoButton extends React.Component {


    render() {
        const { icon, title, duration, video_count, screen, children } = this.props
        let duration_label = helpers.msToTime(duration)
        let url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon)
        if (typeof icon == 'undefined') url = 'placeholder_module'
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.cardStyle}>
                    <Image source={{ uri: url }}
                        resizeMode='contain'

                        style={styles.imageStyle}
                    >
                    </Image>
                    <View style={styles.imageOverlay}>
                        {children}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
LargeVideoButton.propTypes = {
    onPress: PropTypes.func.isRequired,
}