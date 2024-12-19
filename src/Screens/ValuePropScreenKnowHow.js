import React, { Component, PureComponent } from 'react';
import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import DownloadIndicator from '../Components/DownloadIndicator';
import TopSectionOfValueProps from '../Components/TopSectionOfValueProps';
import ValuePropIndicator from '../Components/ValuePropIndicator';
import ColorTheme from '../Constants/ColorTheme';
import { getDownloadPercentage } from '../Reducers/downloadReducer';
import * as helpers from '../Utils/helpers';
import { analytics } from '../Utils/analytics';
import { getFont } from '../Utils/helpers';
import AnalyticsTracker from '../Components/AnalyticsTracker';
import AnimatedCheckBox from "../Components/AnimatedCheckBox";

const { width, height } = Dimensions.get('window');

const ANIMATION_TIME = 300;

var styles = StyleSheet.create({
    container: {
        borderColor: ColorTheme.SEPARATOR,
        backgroundColor: ColorTheme.PRIMARY,
        flexDirection: "column",
        borderWidth: 1,
        borderTopWidth: 0,
        flex: 1
    },
    testStyle: {
        color: ColorTheme.SECONDARY,
        fontFamily: getFont(),
    },
    buttonStyle: {
        width: width - width / 1.5,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});

class ValuePropScreenKnowHow extends PureComponent {

    constructor(props) {
        super(props)
        this.opacityValue = new Animated.Value(0);
        this.state = {
            checked: false
        };
    }

    opacity() {
        this.opacityValue.setValue(0);
        Animated.timing(
            this.opacityValue,
            {
                toValue: 1,
                duration: ANIMATION_TIME,
                easing: Easing.linear,
                useNativeDriver: true,
            }
        ).start();
    }

    opacity_test() {
        this.opacityValue.setValue(1);
        Animated.timing(
            this.opacityValue,
            {
                toValue: 0,
                duration: ANIMATION_TIME,
                easing: Easing.linear,
                useNativeDriver: true,
            }
        ).start();
    }

    checkedChange() {
        const newCheckedState = !this.state.checked;
        analytics.event("onboarding", `:check_accept:${JSON.stringify(newCheckedState)}:`);

        //Set the checked state
        this.setState({ checked: newCheckedState });

        //Start animation
        this.state.checked == false ? this.opacity() : this.opacity_test();
    }

    goToDownload() {
        this.props.navigation.navigate('DownloadInfoScreen', {
        });
    }

    render() {

        const { getTextFromCMS, language, downloadState } = this.props;
        const { status } = downloadState;

        const headerText = getTextFromCMS("onb:onboarding_screen_3_header", "test your know-how");
        const bodyText = getTextFromCMS("onb:onboarding_screen_3_body", "test and enhance your skills with our interactive quizzes");
        const linkText1 = getTextFromCMS("onb:onboarding_screen_3_link", "check to accept the");
        const linkText2 = getTextFromCMS("onb:onboarding_screen_3_link_2", "terms of use");
        const bTnLabel = getTextFromCMS("next", "next");

        const _progress = this.props.progress === undefined ? 0 : this.props.progress;
        const _downloadLanguage = this.props.navigation.getParam("downloadLanguage");
        const _downloadIndigatorRunning = _downloadLanguage !== undefined ? getTextFromCMS("downloading_1", "downloading") + ' - ' + _downloadLanguage : getTextFromCMS("downloading_1", "downloading") + ' - ' + language.description;
        const _downloadIndigatorDone = _downloadLanguage !== undefined ? null : getTextFromCMS("onb:onboarding_screen_dowload_finished_header", "download complete");
        const downloadIndigatorHeader = _progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;

        const bTnHeight = bTnLabel.length > 9 && height < 570 ? 45 : 35; //To control the elements within different languages, when on a screen a small as on a Iphone SE
        const bTnWidth = bTnLabel.length > 8 && height > 570 ? (width < height) ? width - width / 1.55 : height - height / 1.55 : width - width / 1.5; //To control the elements within different languages, when on a screen a small as on a Iphone SE

        const opacity_test = this.opacityValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
        });

        return (
            <View style={styles.container}>
                <AnalyticsTracker eventType="onboarding" eventData={`:know-how:`} />
                <TopSectionOfValueProps icon="test_know_how" headerText={headerText} bodyText={bodyText} />
                <View style={{ justifyContent: "flex-end", alignItems: "center", flex: 1, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", marginLeft: 20, marginRight: 20, marginBottom: height < 570 ? 12 : 16, alignItems: "center" }}>
                        <View style={{  overflow: "hidden" }}>
                            <AnimatedCheckBox
                                borderColor={ColorTheme.SECONDARY}
                                checkedFillColor={ColorTheme.SECONDARY}
                                iconTintColor={ColorTheme.PRIMARY}
                                borderWidth={1.5}
                                animated={true}
                                onPress={(a) => this.checkedChange(a.checked)}
                                checked={this.state.checked}
                            />
                        </View>
                        <View style={{ flexWrap: "wrap", marginLeft: 6 }}>
                            <AppText style={[styles.testStyle, { fontSize: 12 }]} pointerEvents="none">
                                {linkText1 + " "}
                                <AppText style={[styles.testStyle, { fontWeight: "500", fontSize: 12, }]} onPress={() => this.goToTermsOfUse()}>
                                    {linkText2}
                                </AppText>
                            </AppText>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-end" }}>
                        <View style={{ flex: 1, paddingLeft: 10, alignItems: "center", justifyContent: "center" }} />
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", height: 35 }}>
                            <ValuePropIndicator indicatorCount={4} selectedIndicator={3} style={style = {}} />
                        </View>
                        <Animated.View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", marginRight: 10 }} opacity={opacity_test}>
                            <TouchableOpacity disabled={!this.state.checked} style={[styles.buttonStyle, style, { borderColor: ColorTheme.SECONDARY, height: bTnHeight, width: bTnWidth }]} onPress={() => this.goToNext()}>
                                <View style={{ alignItems: 'center', flexWrap: "wrap" }}>
                                    <AppText style={[, { marginLeft: 20, color: ColorTheme.SECONDARY, textAlign: "center" }]}>{bTnLabel}</AppText>
                                </View>
                                <View style={{ marginRight: 12 }}>
                                    <Image style={{ height: 16, width: 24, justifyContent: "center", alignItems: "center", }} source={{ uri: "right_arrow_white" }} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                <DownloadIndicator isVisible={status !== "idle"}
                    onPress={() => this.goToDownload()}
                    progress={this.props.progress}
                    width={250}
                    text={downloadIndigatorHeader}
                    language={language.description} />
            </View>);
    }

    goToTermsOfUse() {
        this.props.navigation.navigate('ValuePropScreenTermsOfUse', {
        });
    }

    goToNext() {
        this.props.navigation.navigate('ValuePropScreenSurvey', {
        });
    }

    goBack() {
        this.props.navigation.pop();
    }
}

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state;
    const language = contentByLanguage[selectedLang];
    const { screen } = language

    return {
        selectedLang,
        language,
        screen,
        downloadState: state.downloadReducer,
        progress: getDownloadPercentage(state.downloadReducer),
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback),
    };
}

export default connect(mapStateToProps)(ValuePropScreenKnowHow)