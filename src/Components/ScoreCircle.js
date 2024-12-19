import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';

export default class ScoreCircle extends Component {

    render() {
        let { score, width, height, fontSize } = this.props

        if (score < 50) {
            let angle = String(score * 180 / 50) + 'deg';
            // let angle_str = String(angle + 180) + 'deg';

            return (
                <View>
                    <ImageBackground style={{ width: width, height: height, }} key={1} source={{ uri: 'cert_score_red_full' }}>
                        <ImageBackground
                            key={2}
                            source={{ uri: 'cert_score_white_half' }} style={{}}
                            style={[styles.viewStyle, { transform: [{ rotate: '0deg' }], }]} >
                            <ImageBackground
                                key={3}
                                source={{ uri: 'cert_score_red_half' }}
                                style={[styles.viewStyle, { transform: [{ rotate: angle }], }]} >
                            </ImageBackground>
                        </ImageBackground>
                        <View style={styles.viewStyle}>
                            <AppText style={{ fontSize: fontSize, color: ColorTheme.SECONDARY, textAlign: 'center', backgroundColor: '#0000', }} >{Math.round(score)}%</AppText>
                        </View>
                    </ImageBackground>
                </View>
            );
        }
        else {
            // let angle = score * 180 / 50;
            // let angle_str = String(angle) + 'deg';
            let angle = String((score * 180 / 50) - 180) + 'deg';

            return (
                <View>
                    <ImageBackground style={{ width: width, height: height, }} key={1} source={{ uri: 'cert_score_red_full' }}>

                        <ImageBackground
                            key={2}
                            source={{ uri: 'cert_score_white_half' }}
                            style={[styles.viewStyle, { transform: [{ rotate: '0deg' }], }]} >
                        </ImageBackground>
                        {score === 100
                            ?
                            <ImageBackground
                                key={3}
                                source={{ uri: 'cert_score_white_half' }}
                                style={[styles.viewStyle, { transform: [{ rotate: '180deg' }], }]} />
                            :
                            <ImageBackground
                                key={3}
                                source={{ uri: 'cert_score_white_half' }}
                                style={[styles.viewStyle, { transform: [{ rotate: angle }], }]} />}
                        <View style={styles.viewStyle}>
                            <AppText style={{ fontSize: fontSize, color: ColorTheme.SECONDARY, textAlign: 'center', backgroundColor: '#0000', }} >{Math.round(score)}%</AppText>
                        </View>
                    </ImageBackground>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

})