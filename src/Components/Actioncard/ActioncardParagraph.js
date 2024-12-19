import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import * as CONSTANTS from '../../Constants/Constants';
import CardText from '../CardText';

// var styles = StyleSheet.create({
// 	container: {
// 		marginTop: 5,
// 		marginBottom: 5,
// 	}
// });

class ActioncardParagraph extends Component {
	styleText(color, bold) {
		style = {
			marginBottom: 20,
			// marginTop: 8
		};
		switch (color) {
			case 'RED':
				style.color = CONSTANTS.COLOR.RED;
				break;
			case 'BLUE':
				style.color = CONSTANTS.COLOR.BLUE;
				break;
			case 'NEW_BLUE':
				style.color = CONSTANTS.COLOR.THEME2_BLUE;
				break;
			case 'NEW_RED':
				style.color = CONSTANTS.COLOR.NEW_RED;
				break;
			default:
				style.color = color;
				break;
		}
		if (bold == 'true') {
			style.fontWeight = 'bold';
		}
		return style;
	};
	render() {
		return (
			<CardText normal={this.props.normal} style={this.styleText(this.props.color, this.props.bold)}><CardText>{this.props.children}</CardText></CardText>
		);
	}
};

module.exports = ActioncardParagraph;