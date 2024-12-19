import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import AnimatedCheckBox from "./AnimatedCheckBox";
import * as CONSTANTS from '../Constants/Constants';
import ColorTheme from '../Constants/ColorTheme';
import { CHEAT } from '../Config/config';

class MultipleChoiceQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: this.props.selectedOptions !== null && this.props.selectedOptions !== undefined ? this.props.selectedOptions : {},
            correctAnswer: this.getCorrectAnswers(this.props.items)
        };
    }

    render() {
        const { items, disabled } = this.props;
        const { selectedOptions } = this.state;
        let options = [];
        for (let i = 0; i < items.length; i++) {
            let checked = false;
            let unchecked = false;
            if (selectedOptions && selectedOptions[i]) {
                checked = true;
            }
            else {
                unchecked = true;
            }

            let padding = 12;

            let item_text = items[i].value;
            if (CHEAT && items[i].correct)
                item_text += ' (correct)';
            if (CHEAT && items[i].result)
                item_text += ' (' + items[i].result + ')';

            let choiceItem = null
            choiceItem = (
                <View style={{ minHeight: 55, padding }} key={i}>
                    <AnimatedCheckBox
                        label={item_text.trim()}
                        onPress={() => this.checkedChange(i)}
                        checked={checked}
                        disabled={disabled}
                        animated={true}
                        borderColor={ColorTheme.PRIMARY}
                        disabledFillColor={disabled ? ColorTheme.SEPARATOR : null}
                        checkedFillColor={ColorTheme.PRIMARY}
                        iconTintColor={ColorTheme.SECONDARY}
                    />
                </View>
            )
            options.push(choiceItem);
        }

        return (
            <View ref="multiChoiceContainer" pointerEvents={disabled ? "none" : "auto"}>
                {options}
            </View>
        );
    }

    getCorrectAnswers(items) {
        let correctAnswers = {}
        for (let i = 0; i < items.length; i++) {
            if (items[i].correct || items[i].result == 'correct')
                correctAnswers = {
                    ...correctAnswers,
                    [i]: true,
                }
        }
        // console.log('correctAnswers MultipleChoice', correctAnswers)
        return correctAnswers;
    }
    checkedChange(idx) {
        // console.log('multipleChoiceCheckedChange:' + idx, checked);

        if (idx in this.state.selectedOptions) {
            let opts = this.state.selectedOptions;
            delete opts[idx];
            this.setState({ selectedOptions: opts });
        }
        else {
            let opts = this.state.selectedOptions;
            opts[idx] = true;
            this.setState({ selectedOptions: opts });
        }

        var options = [];
        for (var i = 0; i < this.props.items.length; i++)
            options.push(this.props.items[i].description)



        let score = 0
        if (this.props.engineType === "severalCorrectWithResult") {
            score = this.calcScore();
        } else {
            var are_equal = true;
            var ca = this.state.correctAnswer;
            var a = this.state.selectedOptions;
            var count = 0;
            for (var key in a) {
                // console.log('for key in a', key, a, ca)
                if (!(key in ca)) {
                    // console.log('if statement')
                    are_equal = false;
                }
                count++;
            }

            if (Object.keys(this.state.correctAnswer).length != count) {
                // console.log("ca.length != count", Object.keys(this.state.correctAnswer).length, count);
                are_equal = false;
            }

            if (are_equal) {
                score = 1;
            }

        }

        if (this.props.onChangeAnswer) {
            // console.log("multiple choice score", score);
            this.props.onChangeAnswer(this.state.selectedOptions, score);
        }
    }

    calcScore() {
        let result = 0;
        var a = this.state.selectedOptions;

        //Each correct answer gives the score of 1/(by numter of correct answers)
        let correct_add = 1.0 / Object.keys(this.state.correctAnswer).length;

        //adds all correct scores
        for (var key in a) {
            let item = this.props.items[key];
            if (item.correct || item.result == 'correct')
                result += correct_add;
        }

        //Adds penealties for harmful, critically harmful and deadly answers
        for (var key in a) {
            let item = this.props.items[key];
            if (item.result == 'harmful')
                result *= .5;
        }
        for (var key in a) {
            let item = this.props.items[key];
            if (item.result == 'critically_harmful')
                result = 0;
        }
        for (var key in a) {
            let item = this.props.items[key];
            if (item.result == 'deadly')
                result = -1;
        }

        return result;
    }
};

export default MultipleChoiceQuestion