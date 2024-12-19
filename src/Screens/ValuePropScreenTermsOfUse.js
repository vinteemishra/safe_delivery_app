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


class ValuePropScreenTermsOfUse extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onNavigatorEvent(navigator, screen, event) {
        helpers.navigatorEvents(navigator, screen, event)
    }

    render() {
        const { disclaimer } = this.props
        return (
            <ScrollView style={styles.card}
                alwaysBounceVertical={false}>
                <AnalyticsTracker eventType="onboarding" eventData={`:terms_of_use:`} />
                <RichText content={(disclaimer) ? disclaimer.chapters[0].content : 'No content'} centered={true} />
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
    return { disclaimer, screen }
}
export default connect(mapStateToProps)(ValuePropScreenTermsOfUse);