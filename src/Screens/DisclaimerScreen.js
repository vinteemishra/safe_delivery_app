import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import { connect } from 'react-redux';
import ColorTheme from '../Constants/ColorTheme';
import AppText from '../Components/AppText';
import RichText from '../Components/RichText';
import { analytics } from '../Utils/analytics';
import { approveDisclaimer } from '../Actions/actions';
import AnalyticsTracker from '../Components/AnalyticsTracker';

// customize the material design theme

const { width, height } = Dimensions.get('window')
// console.log('height:', height)
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: ColorTheme.TERTIARY
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: ColorTheme.SECONDARY,
        textAlign: 'center'
    },
    imageStyle: {
        width: (width < height) ? width : height,
        height: (width < height) ? width / 16 * 9 : height / 16 * 9,
    },
    header: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: ColorTheme.FONT_SIZE * 1.25,
        fontWeight: '500',
        letterSpacing: 1.2
    }

});

class DisclaimerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            radio: 'kings'
        }
    }

    goToNext() {
        if (!this.clickDisabled) {
            this.props.dispatch(approveDisclaimer());
            this.props.navigation.navigate("Welcome");
        }

        // console.log('analytics', 'acceptTerms', ':' + ':')
        analytics.event('acceptTerms', '::')
    }

    render() {
        
        const { disclaimer, screen } = this.props
        // console.log('render DisclaimerScreen:', disclaimer, screen);
        return (
            <ScrollView contentContainerStyle={styles.mainContainer}
                alwaysBounceVertical={false}>
                <AnalyticsTracker eventType="terms" eventData={`::`} />
                <RichText content={(disclaimer) ? disclaimer.chapters[0].content : 'No content'} centered />
                <View style={{ minHeight: 50, backgroundColor: ColorTheme.PRIMARY, flexDirection: 'row', padding: 16 }}>
                    <TouchableOpacity style={styles.button} onPress={() => this.goToNext()}>
                        <AppText style={styles.buttonText}>{(screen.accept) ? screen.accept : 'accept'}</AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state
    const { screen, disclaimer } = contentByLanguage[selectedLang]
    return { disclaimer, screen }
}
export default connect(mapStateToProps)(DisclaimerScreen);