import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import * as CONSTANTS from '../../Constants/Constants';
import CardText from '../CardText';
import AppText from '../AppText';
import { getFont } from '../../Utils/helpers';
import ColorTheme from '../../Constants/ColorTheme';

var styles = StyleSheet.create({
	container: {
		marginTop: 5,
		marginBottom: 5,
	},
});

class ActioncardHeadline extends Component {

	render() {
		// const _styles = this.getStyles();

		return (
			<View style={styles.container}>
				{/* <Text style={[_styles.text, ]}>{this.props.children}</Text> */}
				<Text style={{
					marginTop: 8,
					marginBottom: 8,
					letterSpacing: 1.2,
					fontWeight: 'bold',
					// fontSize: (this.props.fontSize != undefined) ? this.props.fontSize : ColorTheme.fontSize,
					fontSize: 8,
					// textAlign: 'left',
					textAlign: this.props.centered ? 'center' : 'left',
					color: (this.props.color != undefined) ? this.props.color : CONSTANTS.COLOR.BLACK,
					// fontFamily: this.props.normal ? getFont() : getFont('serif')
					// fontFamily: getFont('serif')
					fontFamily: "Merriweather",
				}}>{this.props.children}</Text>
				{/* <CardText normal={this.props.normal} style={[_styles]}>{this.props.children}</CardText> */}
			</View>
		);
	}
};

ActioncardHeadline.propTypes = {
	type: PropTypes.string.isRequired,
	fontSize: PropTypes.number,
	color: PropTypes.string,
}

module.exports = ActioncardHeadline;