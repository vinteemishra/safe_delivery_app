import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native';
import AppText from './AppText'
import fs from 'react-native-fs';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    cardStyle:{
        marginBottom: 8,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 2,
        },
    },
    imageStyle:{

        width: (width < height) ? width : height,
        height: (width < height) ? width/16*9 : height/16*9,
    },
    textStyle:{
        flexWrap: 'wrap',
        flex: 1,
        marginRight: 16, marginTop: 16, marginBottom: 16,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right:0,

        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'flex-end'

    }

});

export default class VidButton extends React.Component {
    render(){

        const {icon} = this.props
        let url = ''
        if(typeof icon == 'undefined' || typeof icon.src == 'undefined') url = "placeholder_module"
        else url = 'file://' + fs.DocumentDirectoryPath + encodeURI(icon.src)
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.cardStyle}>
                    <Image source={{uri: url}}
                            resizeMode='contain'
                            style={styles.imageStyle}
                            >
                    </Image>
                    <View style={styles.imageOverlay}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={{uri: 'media_270px_vid'}}
                                style={{height: 48, width: 48, margin: 18}}/>
                            <AppText style={styles.textStyle}>{this.props.children}</AppText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
		)
	}
}
VidButton.propTypes = {
    onPress: PropTypes.func.isRequired,
}