import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ImageBackground,
} from 'react-native';
import AppText from './AppText';
import ColorTheme from '../Constants/ColorTheme';
import fs from 'react-native-fs';
import * as helpers from '../Utils/helpers';

const styles = StyleSheet.create({
    textContainer: {
        flex: 2,
        justifyContent: 'center',
        padding: 8, paddingLeft: 16,
    },
    buttonTitle: {

    },
    buttonSubtitle: {
        color: ColorTheme.SUB_LABEL,
        fontSize: ColorTheme.FONT_SIZE * 0.75
    },
});

interface OwnProps {
    icon: any;
    duration: number;
    onPress(): void;
    offlineAssets: boolean;
    offlineLabel: string;
}
export default class VideoListItem extends React.Component<OwnProps> {

    render() {
        const { icon, duration, onPress, offlineAssets, offlineLabel } = this.props
        let duration_label = '0:00'
        duration_label = helpers.msToTime(duration)

        let url = 'placeholder_chapter'
        if (typeof icon !== 'undefined' && icon.src) {
            url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src);
        }

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row', flex: 1, borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR, backgroundColor: ColorTheme.SECONDARY, minHeight: 90 }}>
                    <View style={styles.textContainer}>
                        <AppText style={styles.buttonTitle}>{this.props.children}</AppText>
                        {duration != undefined ? <AppText style={styles.buttonSubtitle}>{duration_label}</AppText> : null}
                    </View>
                    <View style={{ flex: 1, backgroundColor: ColorTheme.SEPARATOR }}>

                        <ImageBackground source={{ uri: url }}
                            resizeMode='cover'
                            style={{ flex: 1 }}>
                            {offlineAssets == false ? <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: ColorTheme.SECONDARY, opacity: 0.75, alignItems: "center", justifyContent: "flex-end", paddingBottom: 10 }} /> : null}
                            <View style={{ position: 'absolute', top: offlineAssets == false ? 17 : 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: 'media_270px_vid' }}
                                    style={{ height: 24, width: 24, margin: 6 }} />
                                {offlineAssets == false ? <AppText style={{ fontSize: ColorTheme.FONT_SIZE * .9, opacity: 0.6 }}>{offlineLabel}</AppText> : null}
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
