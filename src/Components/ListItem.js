import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';

const styles = StyleSheet.create({
	textStyle: {
        flexWrap: 'wrap',
        marginLeft: 16, marginRight: 16, marginTop: 16, marginBottom: 16,
    },
});
export default class ListItem extends React.Component {

    render(){
        let style = {}
        const {backgroundColor, key} = this.props
        if(typeof backgroundColor === 'string') style = {backgroundColor}
		return (
        <TouchableOpacity key={key} onPress={this.props.onPress}>
                <View style={[{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR, backgroundColor: ColorTheme.SECONDARY, minHeight: 76}, style]}>
                    <AppText style={[styles.textStyle, {color: (typeof backgroundColor === 'string') ? ColorTheme.SECONDARY : ColorTheme.BLACK}]}>{this.props.children}</AppText>
                </View>
            </TouchableOpacity>
        )
	}
}
ListItem.propTypes = {
    onPress: PropTypes.func.isRequired,
}