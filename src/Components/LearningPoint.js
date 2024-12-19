import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import * as helpers from '../Utils/helpers';
import fs from 'react-native-fs';
import ChoiceQuestion from '../Components/ChoiceQuestion';
import MultipleChoiceQuestion from '../Components/MultipleChoiceQuestion';
import OrderQuestion from '../Components/OrderQuestion';
import HintText from './HintText';

let { width, height } = Dimensions.get('window');

export default class LearningPoint extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { screen, engineType, engineData, image, active } = this.props

        let url = "placeholder_module";
        image !== undefined && 'file://' + fs.DocumentDirectoryPath + encodeURI(image) ? url = 'file://' + fs.DocumentDirectoryPath + encodeURI(image) : url
        // if (image != undefined) url = 'file://' + fs.DocumentDirectoryPath + encodeURI(image)
        let q = null;
        let reviewing = this.props.reviewing;
        let answer = this.props.answer;
        
        // Determine the type of question and assigns the matching component.
        if (this.props.engineType == "oneCorrect")
            q = <ChoiceQuestion
                key={1}
                items={engineData}
                order={answer}
                onChangeAnswer={(answer, score) => this.changeAnswer(answer, score)}
                selectedOption={answer}
                disabled={reviewing}
            />
        else if (this.props.engineType == "severalCorrect" || this.props.engineType == "severalCorrectWithResult")
            q = <MultipleChoiceQuestion
                key={2}
                items={engineData}
                onChangeAnswer={(answer, score) => this.changeAnswer(answer, score)}
                selectedOptions={answer}
                disabled={reviewing}
                engineType={this.props.engineType}
            />
        else if (this.props.engineType == "chooseOrder") {
            let order = this.getShuffledOrder(engineData)
            q = <OrderQuestion
                key={3}
                items={engineData}
                onChangeAnswer={(answer, score) => this.changeAnswer(answer, score)}
                order={answer ? answer : order}
                disabled={reviewing}
            />
        } else
            console.error("unknown engine type " + this.props.engineType);



        let comment = <HintText style={{ lineHeight: 25, height: 25, fontWeight: 'bold' }} showHint={false} >{screen['lp:hint_' + this.props.engineType] ? screen['lp:hint_' + this.props.engineType] : 'answer following'}</HintText>
            ;
        if (reviewing) {
            if (this.props.reviewCommentLinkText) {
                comment = (
                    <View style={[styles.reviewResultBar, { backgroundColor: this.props.reviewCommentColor }]}>
                        <AppText style={{ color: ColorTheme.SECONDARY }}>{this.props.reviewComment}</AppText>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 1.2, borderBottomColor: ColorTheme.SECONDARY, borderBottomWidth: 1.2 }} onPress={() => this.goToAbout()}>
                            <AppText style={{ color: ColorTheme.SECONDARY, fontWeight: '500' }}> {this.props.reviewCommentLinkText}</AppText>
                            <Image style={{ height: 10, width: 16, marginLeft: 8 }} source={require('../../img/notification_message/arrow-right.png')} />
                        </TouchableOpacity>
                    </View>)
            }
            else {
                comment = (
                    <View style={[styles.reviewResultBar, { backgroundColor: this.props.reviewCommentColor }]}>
                        <AppText style={{ color: ColorTheme.SECONDARY }}>{this.props.reviewComment}</AppText>
                    </View>)
            }
        }

        let link = [];
        if (this.props.linkText) {
            link =
                <View style={styles.linkStyle}>
                    <TouchableOpacity onPress={() => this.props.onPressLink()}>
                        <AppText style={{ textAlign: 'center', fontSize: 12, fontWeight: '500', color: ColorTheme.PRIMARY }}>{this.props.linkText}</AppText>
                    </TouchableOpacity>
                </View>
        }

        let idx = [];
        // Lists the progress through the quiz. If the quiz has cases it shows both progress on cases and questions in current case. Else it only renders progress through cases.
        if (this.props.caseIdx) {
            idx.push(<AppText key={1} style={{ position: 'absolute', top: 10, right: 10, fontSize: ColorTheme.FONT_SIZE * 0.8, fontWeight: '500', color: ColorTheme.SUB_LABEL }}>{this.props.screen['lp:case'] ? this.props.screen['lp:case'] : 'case'} {this.props.caseIdx}/{this.props.maxCases}</AppText>);
            idx.push(<AppText key={2} style={{ position: 'absolute', top: 25, right: 10, fontSize: ColorTheme.FONT_SIZE * 0.8, color: ColorTheme.SUB_LABEL }}>{this.props.screen['lp:question'] ? this.props.screen['lp:question'] : 'question'} {this.props.questionIdx}/{this.props.maxQuestions}</AppText>);
        }
        else {
            idx = <AppText key={3} style={{ position: 'absolute', top: 10, right: 10, fontSize: ColorTheme.FONT_SIZE * 0.8, color: ColorTheme.SUB_LABEL }}>{this.props.screen['lp:question'] ? this.props.screen['lp:question'] : 'question'} {this.props.questionIdx}/{this.props.maxQuestions}</AppText>;
        }

        return (
            <View style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }}>
                <View style={styles.cardStyle}>
                    <Image source={{ uri: url }}
                        resizeMode='contain'
                        style={styles.imageStyle}>
                    </Image>
                    <View style={styles.imageOverlay}>
                        {idx}
                        <AppText style={{ margin: 16, fontSize: ColorTheme.FONT_SIZE * 1.1, fontWeight: '500' }}>{this.props.description}</AppText>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {link}
                    {comment}
                    {q}
                </View>

            </View>);
    }


    getShuffledOrder(array) {
        let order = []
        for (let i = 0; i < array.length; i++) {
            order.push(i)
        }
        let allowSameOrder = false
        return helpers.shuffleArray(order, allowSameOrder)
    }

    /**
     *
     * @param {number} answer - The index of the question
     * @param {number} answer_score - The result of the answer
     */
    changeAnswer(answer, answer_score) {
        if (this.props.onChangeAnswer)
            this.props.onChangeAnswer(answer, answer_score);
    }

    goToAbout() {
        if (this.props.onGoToAbout)
            this.props.onGoToAbout();
    }
};

const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'

    },
    cardStyle: {
        marginBottom: 8,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            height: 4,
            width: 3,
        },
    },
    linkStyle: {
        height: 32,
        marginTop: 8,
        marginBottom: 8,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 4,
            width: 3,
        },
    },
    imageStyle: {
        flexGrow: 1,
        width: (width < height) ? width : height,
        height: (width < height) ? width / 16 * 9 : height / 16 * 9,
    },
    reviewResultBar: {
        height: 50,
        width: (width < height) ? width : height,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

    }
})