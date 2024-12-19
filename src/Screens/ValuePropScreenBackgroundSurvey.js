import React, { Component } from 'react';
import {
    ScrollView,
    View,
    StyleSheet
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import * as helpers from '../Utils/helpers';
import { connect } from 'react-redux';
import * as CONSTANTS from '../Constants/Constants';
import RichText from '../Components/RichText';
import AnalyticsTracker from '../Components/AnalyticsTracker';


class ValuePropScreenBackgroundSurvey extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onNavigatorEvent(navigator, screen, event) {
        helpers.navigatorEvents(navigator, screen, event)
    }

    render() {
        const { backgroundSurvey, screen } = this.props
        
        return (
            <ScrollView style={styles.card}
                alwaysBounceVertical={false}>
                <AnalyticsTracker eventType="onboarding" eventData={`:background_survey:`} />
                <RichText content={(backgroundSurvey) ? backgroundSurvey.chapters[0].content : 'No content'} centered={true} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: ColorTheme.TERTIARY,
        borderColor: ColorTheme.SEPARATOR,
        borderWidth: 1,
        borderBottomWidth: 0,
        ...CONSTANTS.cardShadowStyle,
        flexGrow: 1,
    }
})

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state
    const { screen, disclaimer } = contentByLanguage[selectedLang]
    const backgroundSurvey = contentByLanguage[selectedLang]['background-survey']
    return { backgroundSurvey, screen }
}

export default connect(mapStateToProps)(ValuePropScreenBackgroundSurvey);