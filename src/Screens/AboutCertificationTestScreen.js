import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet
} from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import * as helpers from '../Utils/helpers';
import { connect } from 'react-redux';
import * as CONSTANTS from '../Constants/Constants';
import RichText from '../Components/RichText';

class AboutCertificationTestScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <ScrollView style={styles.card}
                alwaysBounceVertical={false}>
                <RichText content={this.props.about_certificate} />
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
    const { selectedLang, contentByLanguage } = state;
    const language = contentByLanguage[selectedLang];
    const { screen, certificates } = language

    return {
        about_certificate: helpers.getContentByLanguageProperty(certificates, language)[0].content,
        language,
        screen,
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback)
    };
}

export default connect(mapStateToProps)(AboutCertificationTestScreen)