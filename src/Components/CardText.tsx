import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	TextStyle,
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import { getFont } from '../Utils/helpers';

interface OwnProps {
	normal?: string;
	style?: TextStyle | TextStyle[];
}

class CardText extends Component<OwnProps> {

	getStyles() {
		return StyleSheet.create({
			text: {
				fontFamily: this.props.normal ? getFont() : getFont('serif'),
				fontSize: ColorTheme.FONT_SIZE,
				// textAlign: "left", //Testing if it is OK to remove this one. It overrides the one that comes from the props style
			}
		})
	}

	render() {
		const styles = this.getStyles();
		return (
			<Text textBreakStrategy="simple" style={[styles.text, this.props.style]}>{this.props.children}</Text>
		);
	}
};

export default CardText;