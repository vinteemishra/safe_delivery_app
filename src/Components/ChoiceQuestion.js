import React, { Component } from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import AppText from './AppText';
import AnimatedRadioButton from './AnimatedRadioButton';
import ColorTheme from '../Constants/ColorTheme';
import { CHEAT } from '../Config/config';

class ChoiceQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: -1,
            height: 0,
        };
    }

    render() {
        let options = [];

        for (let i = 0; i < this.props.items.length; i++) {
            let checked = false;

            if (i == this.props.selectedOption) {
                checked = true;
            }

            let item_text = this.props.items[i].value;
            if (CHEAT && this.props.items[i].correct) {
                item_text += ' (correct)';
            }

            let padding = 12
            let key = "item_" + i;
            console.log("choiceQuestion answer", item_text);
            options.push(
                <View key={key} style={{ minHeight: 60, padding }}>
                    <TouchableOpacity activeOpacity={0.6} disabled={this.props.disabled} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { this.checkedChange(i) }}>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <AnimatedRadioButton ref={i}
                                checked={checked}
                                tintColor={ColorTheme.PRIMARY}
                                disabledColor={ColorTheme.SEPARATOR}
                                disabled={this.props.disabled}
                            />
                        </View>
                        <AppText style={{ flex: 1, textAlign: "auto", flexWrap: 'wrap', fontWeight: (this.refs[i] && this.refs[i].state.checked) ? '500' : 'normal' }}>{item_text.trim()}</AppText>
                    </TouchableOpacity>
                </View>);
        }

        return (
            <View style={{ flex: 1 }} ref="choiceContainer" onLayout={(event) => {
                this.setState({ height: event.nativeEvent.layout.height });
            }}>
                {options}
            </View>
        );
    }

    //Change choosen answer
    checkedChange(idx) {
        if (idx !== this.state.idx) {
            this.setState({ selectedOption: idx });

            // calc score
            let score = 0;

            if (this.props.items[idx].correct)
                score = 1;

            if (this.props.onChangeAnswer) {
                this.props.onChangeAnswer(idx, score);
            }
        }
    }
};

export default ChoiceQuestion

