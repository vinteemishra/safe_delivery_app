import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
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
        width: width - width / 1.5,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});

class ValuePropScreenDrugs extends Component {

    constructor(props) {
        super(props)
    }

    goToDownload() {
        this.props.navigation.navigate('DownloadInfoScreen', {
        });
    }

    render() {

        const { getTextFromCMS, language, downloadState } = this.props;
        const { status } = downloadState;

        const headerText = getTextFromCMS("onb:onboarding_screen_2_header", "look up information");
        const bodyText = getTextFromCMS("onb:onboarding_screen_2_body", "access our comprehensive drug list");
        const bTnLabel = getTextFromCMS("next", "next");

        const _progress = this.props.progress === undefined ? 0 : this.props.progress;
        const _downloadLanguage = this.props.navigation.getParam("downloadLanguage");
        const _downloadIndigatorRunning = _downloadLanguage !== undefined ? getTextFromCMS("downloading_1", "downloading") + ' - ' + _downloadLanguage : getTextFromCMS("downloading_1", "downloading") + ' - ' + language.description;
        const _downloadIndigatorDone = _downloadLanguage !== undefined ? null : getTextFromCMS("onb:onboarding_screen_dowload_finished_header", "download complete");
        const downloadIndigatorHeader = _progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;

        const bTnHeight = bTnLabel.length > 9 && height < 570 ? 45 : 35; //To control the elements within different languages, when on a screen a small as on a Iphone SE
        const bTnWidth = bTnLabel.length > 8 && height > 570 ? (width < height) ? width - width / 1.55 : height - height / 1.55 : width - width / 1.5; //To control the elements within different languages, when on a screen a small as on a Iphone SE

        return (
            <View style={styles.container}>
                <AnalyticsTracker eventType="onboarding" eventData={`:access_drug_list:`} />
                <TopSectionOfValueProps icon="drug_list" headerText={headerText} bodyText={bodyText} />
                <View style={{ alignItems: "center", marginTop: -12 }}>
                    <Image style={{ height: 50, width: 50, resizeMode: 'contain', }} source={{ uri: "drugs" }}></Image>
                </View>
                <View style={{ justifyContent: "flex-end", flex: 1, marginBottom: height < 570 ? 12 : 16 }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-end" }}>
                        <View style={{ flex: 1, paddingLeft: 10, alignItems: "center", justifyContent: "center" }}>
                        </View>
                        <View style={{ flex: 1, paddingRight: 10, alignItems: "center", justifyContent: "center", height: 35 }}>
                            <ValuePropIndicator indicatorCount={4} selectedIndicator={2} style={style = {}} />
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
                    language={language.description}>
                </DownloadIndicator>
            </View>);
    }

    goToNext() {
        this.props.navigation.navigate('ValuePropScreenKnowHow', {});
    }

    goBack() {
        this.props.navigation.pop();
    }
}

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage, } = state;
    const language = contentByLanguage[selectedLang];
    const { screen, } = language

    return {
        selectedLang,
        language,
        screen,
        downloadState: state.downloadReducer,
        progress: getDownloadPercentage(state.downloadReducer),
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback),
    };
}

export default connect(mapStateToProps)(ValuePropScreenDrugs)