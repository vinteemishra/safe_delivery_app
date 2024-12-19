import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import DownloadIndicator from '../Components/DownloadIndicator';
import TopSectionOfValueProps from '../Components/TopSectionOfValueProps';
import ValuePropIndicator from '../Components/ValuePropIndicator';
import ColorTheme from '../Constants/ColorTheme';
import { getDownloadPercentage } from '../Reducers/downloadReducer';
import * as helpers from '../Utils/helpers';
import AnalyticsTracker from '../Components/AnalyticsTracker';

const { width, height } = Dimensions.get('window');

var styles = StyleSheet.create({
    container: {
        borderColor: ColorTheme.SEPARATOR,
        backgroundColor: ColorTheme.PRIMARY,
        borderWidth: 1,
        borderTopWidth: 0,
        flex: 1,
        flexDirection: "column"
    },
    buttonStyle: {
        // height: 45,
        // width: width - width / 1.6,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});

class ValuePropScreen extends Component {

    constructor(props) {
        super(props)
    }

    goToDownload() {
        this.props.navigation.navigate('DownloadInfoScreen', {});
    }

    skipOnbarding() { //If in __DEV__ mode, there is an option to skip the onboarding
        return (
            <View style={{ marginBottom: 30, alignItems: "center", }}>
                <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", borderColor: ColorTheme.SECONDARY, borderWidth: 1, height: 35, borderRadius: 5, width: 200 }} onPress={() => this.props.navigation.navigate('UserSurveyQuestionsScreen', { skipOnbarding: true })}>
                    <View style={{}}>
                        <AppText style={{ color: ColorTheme.SECONDARY, fontSize: ColorTheme.FONT_SIZE }}>
                            Skip onboarding
                    </AppText>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { getTextFromCMS, language, downloadState } = this.props;
        const { status } = downloadState;

        const headerText = getTextFromCMS('onb:onboarding_screen_1_header', 'improve your skills');
        const bodyText = getTextFromCMS('onb:onboarding_screen_1_body', 'learn to better manage complications during pregnacy and childbirth');
        const bTnLabel = getTextFromCMS("next", "next");

        const progress = this.props.progress === undefined ? 0 : this.props.progress;

        const _downloadLanguage = this.props.navigation.getParam("downloadLanguage");
        const _downloadIndigatorRunning = _downloadLanguage !== undefined ? getTextFromCMS("downloading_1", "downloading") + ' - ' + _downloadLanguage : getTextFromCMS("downloading_1", "downloading") + ' - ' + language.description;
        const _downloadIndigatorDone = _downloadLanguage !== undefined ? null : getTextFromCMS("onb:onboarding_screen_dowload_finished_header", "download complete");
        const downloadIndigatorHeader = progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;

        const bTnHeight = bTnLabel.length > 9 && height < 570 ? 45 : 35; //To control the elements within different languages, when on a screen a small as on a Iphone SE
        const bTnWidth = bTnLabel.length > 8 && height > 570 ? (width < height) ? width - width / 1.55 : height - height / 1.55 : width - width / 1.5; //To control the elements within different languages, when on a screen a small as on a Iphone SE

        return (
            <View style={styles.container}>
                <AnalyticsTracker eventType="onboarding" eventData={`:improve_skills:`} />
                <View style={{ }}>
                    {__DEV__ ? this.skipOnbarding() : null}
                </View>
                <TopSectionOfValueProps icon="learn_to_manage" headerText={headerText} bodyText={bodyText} />
                <View style={{ justifyContent: "flex-end", flex: 1, marginBottom: height < 570 ? 12 : 16 }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-end" }}>
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "flex-start", justifyContent: "center" }}>
                        </View>
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", height: 35 }}>
                            <ValuePropIndicator indicatorCount={4} selectedIndicator={1} style={style = {}} />
                        </View>
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                            <TouchableOpacity style={[styles.buttonStyle, style, { borderColor: ColorTheme.SECONDARY, height: bTnHeight, width: bTnWidth }]} onPress={() => this.goToNext()}>
                                <View style={{ alignItems: 'center', flexWrap: "wrap" }}>
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
                    progress={progress}
                    width={250}
                    text={downloadIndigatorHeader}
                    language={language.description} />
            </View>);
    }

    goToNext() {
        this.props.navigation.navigate('ValuePropScreenDrugs', {
        });
    }
}

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage } = state;
    const language = contentByLanguage[selectedLang];
    const { screen } = language;

    return {
        selectedLang,
        language,
        screen,
        downloadState: state.downloadReducer,
        progress: getDownloadPercentage(state.downloadReducer),
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback),
    };
}

export default connect(mapStateToProps)(ValuePropScreen)