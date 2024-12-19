import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
	TextStyle,
} from 'react-native';
import CardText from '../CardText';
import * as CONSTANTS from '../../Constants/Constants';

var styles = StyleSheet.create({
	container: {
		// marginTop: 8,
		// marginBottom: 8,
	}
});

interface Props {
	color: "red" | "blue";
	italic: string;
	centered?: boolean;
}
class ActioncardImportantText extends Component<Props> {

	styleComponent(color, italic): TextStyle {
		var style: TextStyle = {
			textAlign: 'center',
			marginLeft: 20,
			marginRight: 20,
			color,
			fontWeight: 'bold',
			fontStyle: undefined,
			marginBottom: 20,
			marginTop: 10
		};

		if (color === 'red') {
			style.color = CONSTANTS.COLOR.RED;
		} else if (color === "blue") {
			style.color = CONSTANTS.COLOR.BLUE;
		}

		if (italic == 'true'){
			style.fontStyle = 'italic';
		}

		return style;
	};

	render(){
		return (
				<View style={styles.container}>
					<CardText style={this.styleComponent(this.props.color, this.props.italic)}>
						<CardText>{this.props.children}</CardText>
					</CardText>
				</View>
			);
	}
};

export default ActioncardImportantText;
