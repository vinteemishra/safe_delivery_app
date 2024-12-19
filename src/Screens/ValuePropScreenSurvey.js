import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import ColorTheme from '../Constants/ColorTheme';
import TopSectionOfValueProps from '../Components/TopSectionOfValueProps';
import ValuePropIndicator from '../Components/ValuePropIndicator';
import DownloadIndicator from '../Components/DownloadIndicator';
import AppText from '../Components/AppText';
import * as helpers from '../Utils/helpers';
import { connect } from 'react-redux';
import { getDownloadPercentage } from '../Reducers/downloadReducer';
import AnalyticsTracker from '../Components/AnalyticsTracker';

const { width, height } = Dimensions.get('window');

var styles = StyleSheet.create({
    container: {
        borderColor: ColorTheme.SEPARATOR,
        borderWidth: 1,
        borderTopWidth: 0,
        flex: 1,
        backgroundColor: ColorTheme.PRIMARY,
        flexDirection: "column",
    },
    testStyle: {
        color: ColorTheme.SECONDARY
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

class ValuePropScreenSurvey extends Component {

    constructor(props) {
        super(props)
    }

    renderBackButton() {
        return (
            <TouchableOpacity onPress={() => this.goBack()}>
                <View style={{ height: 48, width: 48, justifyContent: "center", alignItems: "flex-start" }}>
                    <Image style={{ height: 32, width: 48, }} source={{ uri: "left_arrow_white" }} />
                </View>
            </TouchableOpacity>
        )
    }

    goToDownload() {
        this.props.navigation.navigate('DownloadInfoScreen', {
        });
    }

    render() {

        const { getTextFromCMS, language, downloadState } = this.props;
        const { status } = downloadState;
        
        const headerText = getTextFromCMS("onb:onboarding_screen_4_header", "background survey");
        const bodyText = getTextFromCMS("onb:onboarding_screen_4_body", "before you access the content of this app we kindly ask you to take a minute to complete a survey");
        const bodyText1 = getTextFromCMS("onb:onboarding_screen_4_body_2", "all data will be kept anonymous");
        const linkText = getTextFromCMS("onb:onboarding_screen_4_link", "see what we use it for");
        const bTnLabel = getTextFromCMS("next", "next");

        const _progress = this.props.progress === undefined ? 0 : this.props.progress;
        const _downloadLanguage = this.props.navigation.getParam("downloadLanguage");
        const _downloadIndigatorRunning = _downloadLanguage !== undefined ? getTextFromCMS("downloading_1", "downloading") + ' - ' + _downloadLanguage : getTextFromCMS("downloading_1", "downloading") + ' - ' + language.description;
        const _downloadIndigatorDone = _downloadLanguage !== undefined ? null : getTextFromCMS("onb:onboarding_screen_dowload_finished_header", "download complete");
        const downloadIndigatorHeader = _progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;

        const bTnHeight = bTnLabel.length > 9 && height < 570 ? 45 : 35; //To control the elements within different languages, when on a screen a small as on a Iphone SE
        const bTnWidth = bTnLabel.length > 8 && height > 570 ? (width < height) ? width - width / 1.55 : height - height / 1.55 : width - width / 1.5; //To control the elements within different languages, when on a screen a small as on a Iphone SE
        let _marginBottom = 0;
        
        if (language.description === 'Ethiopia - Oromifa' && height < 570) { //(language.description === 'Kyrgyz - Russian' || language.description === 'Myanmar')
            _marginBottom = -12;
        }
        else if (language.description === 'Kyrgyz - Russian' && height < 570) {
            _marginBottom = -8; 
        }
        else if (language.description === 'Myanmar' && height < 570) {
            _marginBottom = -2; 
        }
        else {
            _marginBottom = height < 570 ? 12 : 16;
        }

        return (
            <View style={styles.container}>
                <AnalyticsTracker eventType="onboarding" eventData={`:survey_intro:`} />
                <TopSectionOfValueProps icon="survey" headerText={headerText} bodyText={bodyText} bodyText1={bodyText1} linkText={linkText} />
                <View style={{ justifyContent: "flex-end", flex: 1, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: _marginBottom }}>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", }} onPress={() => this.goToBackgroundSurvey()}>
                            <AppText style={[styles.testStyle, { fontWeight: "500", fontSize: 14, textAlign: "center", }]}>
                                {linkText}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-end" }}>
                        <View style={{ flex: 1, paddingLeft: 10, alignItems: "center", justifyContent: "center" }} />
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", height: 35 }}>
                            <ValuePropIndicator indicatorCount={4} selectedIndicator={4} style={style = {}} />
                        </View>
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                            <TouchableOpacity style={[styles.buttonStyle, style, { borderColor: ColorTheme.SECONDARY, height: bTnHeight, width: bTnWidth }]} onPress={() => this.goToNext()}>
                                <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                    <AppText style={[, { marginLeft: 20, color: ColorTheme.SECONDARY, textAlign: "center" }]}>{bTnLabel}</AppText>
                                </View>
                                <View style={{ marginRight: 12 }}>
                                    <Image style={{ height: 16, width: 24, justifyContent: "center", alignItems: "center", }} source={{ uri: "right_arrow_white" }} />
                                </View>
                            </TouchableOpacity>
                        </View>
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

    goToBackgroundSurvey() {
        this.props.navigation.navigate('ValuePropScreenBackgroundSurvey', {
        });
    }

    goToNext() {
        this.props.navigation.navigate('UserSurveyQuestionsScreen', {
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

export default connect(mapStateToProps)(ValuePropScreenSurvey)