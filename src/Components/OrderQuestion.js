import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from './AppText';
import * as CONSTANTS from '../Constants/Constants';
import SortableList from './SortableList';
import DraggableFlatList from "../Components/SortableList/SortableFlatList";

let styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
        marginTop: 2, marginBottom: 2,
        padding: 8,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 4,
            width: 3,
        },
    },
    textStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: ColorTheme.FONT_SIZE * .7
    },
})
class OrderQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: null,
            width: 0,
            height: 0,
        };
    }
    render() {
        if (!this.props.order || !Array.isArray(this.props.order)) {
            return null;
        }
        let sortableList = null
        if (this.state.height > 10) {
            let rearrange_disabled = require('../../img/learning_icons/rearrange-disabled.png')
            let rearrange = require('../../img/learning_icons/rearrange.png')

            sortableList = (<DraggableFlatList
                data={this.props.order}
                renderItem={({ item, index, move, moveEnd, isActive }) => {
                    return (
                        <TouchableOpacity onPressIn={move} onPressOut={moveEnd}>
                            {/* <View style={{ width: this.state.width, height: this.state.height / 4, backgroundColor: this.props.disabled ? ColorTheme.DISABLED : isActive ? "orange" : "yellow", flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR }}> */}
                            <View style={{ width: this.state.width, height: this.state.height / 4, backgroundColor: this.props.disabled ? ColorTheme.DISABLED : ColorTheme.SECONDARY, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: ColorTheme.SEPARATOR }}>
                                <Image source={this.props.disabled ? rearrange_disabled : rearrange}
                                    style={{ height: 18, width: 8, opacity: 1, marginRight: 12, marginLeft: 16 }} />
                                <AppText style={styles.textStyle}>{item.value}</AppText>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                order={this.props.order}
                scrollEnabled={false}
                onMoveEnd={(nextOrder) => {
                    this.orderChange(nextOrder)
                }}
            />);
        }
        return (
            <View style={{ flex: 1 }} onLayout={this._onLayout.bind(this)} pointerEvents={this.props.disabled ? "none" : "auto"}>
                {sortableList}
            </View>
        );
    }

    _onLayout(event) {
        if (Platform.OS == 'android') {
            if (this.state.height == 0 && event.nativeEvent.layout.height > 10) {
                this.setState({ width: event.nativeEvent.layout.width, height: Math.floor(event.nativeEvent.layout.height) })
            }
        }
        else {
            this.setState({ width: event.nativeEvent.layout.width, height: Math.floor(event.nativeEvent.layout.height) })
        }

    }

    orderChange(new_order) {
        let a = new_order.data;

        // if the user never rearranged, it will be null
        if (a == undefined) {
            a = this.props.order;
        }
        // // The correct answer will always be [0, 1, 2, 3]
        // let ca = [0, 1, 2, 3];

        var are_equal = true;
        //Compare a with the correct answer
        for (var i = 0; i < a.length; i++) {
            if (a[i].value != this.props.items[i].value) {
                are_equal = false;
            }
        }
        let score = 0;
        if (are_equal)
            score = 1;

        if (this.props.onChangeAnswer) {
            this.props.onChangeAnswer(new_order.data, score);
        }
    }
};

export default OrderQuestion

