import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import * as CONSTANTS from '../../Constants/Constants';
import CardText from '../CardText';


//var items = ["Dette er et punkt", "Dette er også et punkt", "Det her er det tredje punkt","Og det sidste"];

var styles = StyleSheet.create({
	container: {
	},
	item: {
		color: CONSTANTS.COLOR.BLUE,
	},
});

class ActioncardList extends Component {

	render() {
		return (
			<View style={styles.container}>
				{this.props.items.map(function (list_item, index) {
					return <CardText normal={this.props.normal} key={index}><CardText style={styles.item}>{index + 1}. </CardText>{list_item}</CardText>
				})
				}
			</View>
		);
	}
};

ActioncardList.propTypes = {
	items: PropTypes.array.isRequired,
};

module.exports = ActioncardList;