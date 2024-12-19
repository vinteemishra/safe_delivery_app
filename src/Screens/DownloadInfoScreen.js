import React, { Component } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View, Animated, Easing, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../Components/AppText';
import DownloadIndicator from '../Components/DownloadIndicator';
import FramedButton from '../Components/FramedButton';
import ColorTheme from '../Constants/ColorTheme';
import { getDownloadPercentage } from '../Reducers/downloadReducer';
import * as helpers from '../Utils/helpers';
import { cancelDownload } from '../Actions/downloadActions';
import { resetEngagementNotifications } from '../Actions/notificationActions'

const { width, height } = Dimensions.get("window");
var styles = StyleSheet.create({
    container: {
        // borderColor: ColorTheme.SEPARATOR,
        borderColor: ColorTheme.PRIMARY,
        backgroundColor: ColorTheme.SECONDARY,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        flex: 1,
    },
    buttonStyle: {
        height: 65,
        width: 300,
    },
    viewStyle: {

    },
    testStyle: {
        padding: 12,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: ColorTheme.PRIMARY
    },
    label: {
        textAlign: "center"
    },
    buttonContainer: {
        alignItems: 'center',
        margin: 16,
    },
    button: {
        height: 50,
        // width: width - width / 4,
        width: (width < height) ? width - width / 4 : height - height / 4,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 32,
    },
});

class DownloadInfoScreen extends Component {

    constructor(props) {
        super(props)
        this.opacityValue = new Animated.Value(1);
        this.goToHome = this.goToHome.bind(this);
        this.state = {
            progress: 0,
            downloadLanguage: props.navigation.getParam("downloadLanguage"), // To determin where this screen is loaded from, for validating use later on
            hasHeader: props.navigation.getParam("header"), //The last DownloadInfoScreen will have header === null, and it is only here that the FremedButton should apear!
            noHeader: props.navigation.getParam("noHeaderButton"), //If downloadign another language version, then 
        };

    }

    componentDidUpdate(prevProps) {

        const { status, previouslyActiveLanguage } = this.props.downloadState;

        if (status === "canceled") {
            if (previouslyActiveLanguage === "none") {
                this.props.navigation.navigate("InitialDownload", {});
            } else if (this.props.navigation.getParam("onDone")) {
                this.props.navigation.state.params.onDone();
            } else {
                this.props.navigation.navigate("LanguageScreen", {
                    title: this.props.getTextFromCMS('choose_version_title', 'choose version'),
                });
            }
            return;
        }

        if (status === 'media' && prevProps.downloadState.status === 'bundle') {
            this.opacity();
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick); //To prevent the user from going back with press on the hardware back button on Android
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick); //To prevent the user from going back with press on the hardware back button on Android
    }

    handleBackButtonClick = () => {
        return true;
    };

    // renderError(message) {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <AppText>{this.props.getTextFromCMS('lp:error', 'error')} + {message}</AppText>
    //         </View>
    //     );
    // }

    opacity() {
        this.opacityValue.setValue(0);
        Animated.timing(
            this.opacityValue,
            {
                toValue: 1,
                duration: 750,
                easing: Easing.linear,
                useNativeDriver: true,
                // isInteraction: false
            }
        ).start();
    }

    render() {

        const opacityView = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
        });

        const showHideShow = this.opacityValue.interpolate({
            inputRange: [0, 0.01, 1],
            outputRange: [1, 0, 1],
        })

        const { getTextFromCMS, downloadState, language, mustShowOnboarding } = this.props;

        // if (this.props.status === "failed") {
        //     return this.renderError(downloadState.message);
        // }

        const { downloadLanguage, hasHeader, noHeader } = this.state;


        // const _downloadIndigatorRunning = downloadLanguage !== undefined ? getTextFromCMS("downloading_1", "downloading") + ' - ' + downloadLanguage : getTextFromCMS("downloading_1", "downloading") + ' - ' + language.description;
        const _downloadIndigatorRunning = getTextFromCMS("downloading_1", "downloading") + '... ';
        // const _downloadIndigatorDone = downloadLanguage !== undefined ? getTextFromCMS("done", "done") + ' - ' + downloadLanguage : getTextFromCMS("done", "done") + ' - ' + language.description;
        const _downloadIndigatorDone = getTextFromCMS("done", "done");

        const progress = downloadState.status === "media" || downloadState.status === "finished" ? getDownloadPercentage(downloadState) : 0;
        const downloadIndigatorHeader = progress < 100 ? _downloadIndigatorRunning : _downloadIndigatorDone;


        let headerTextWaiting = "";
        let headerTextFinished = "";
        let bodyTextWaiting = "";
        let bodyTextFinished1 = "";
        let btnLabel = "Get started";

        const statusIdleBundleOrCanceled = downloadState.status === "idle" || downloadState.status === "bundle" || downloadState.status === "canceled";
        if (!statusIdleBundleOrCanceled) {
            headerTextWaiting = getTextFromCMS("onb:onboarding_screen_waiting_for_download_header", "waiting for download to finish");
            headerTextFinished = getTextFromCMS("onb:onboarding_screen_dowload_finished_header", "download complete");
            bodyTextWaiting = getTextFromCMS("onb:onboarding_screen_waiting_for_download_body", "this may take serveral minutes depending on your internet connectivity");
            bodyTextFinished1 = getTextFromCMS("onb:onboarding_screen_dowload_finished_body", "your download has completed\n");
            btnLabel = this.props.navigation.getParam("onDone") ? getTextFromCMS("next", "next") : getTextFromCMS("lp:certificate_center_notification_My_Learning_introduction_button_label", "get started");
        }

        let bodyTextFinished2 = "";
        const shouldShowBodyTextFinished2 = ((hasHeader === null || noHeader === true) && progress === 100) || this.props.isPreBuild;

        if (shouldShowBodyTextFinished2 && !this.props.navigation.getParam("onDone")) {
            bodyTextFinished2 = getTextFromCMS("onb:onboarding_screen_dowload_finished_body_2", "welcome to the\nsafe delivery app!"); //Only show the welcome text if the survey are done, and are on the final downloadInfoScreen
        }

        const cancelDownloadText = downloadState.status === "idle" || downloadState.status === "bundle" ? "Cancel download" : getTextFromCMS("onb:onboarding_screen_waiting_for_dowload_cancel_button", "cancel download");
        // const btnLabel = downloadState.status === "idle" || downloadState.status === "bundle" ? 'Get started' : getTextFromCMS("lp:certificate_center_notification_My_Learning_introduction_button_label", "get started");
        const isDownloadRunning = downloadState.status !== "idle" && downloadState.status !== "finished";
        const disableButton = mustShowOnboarding || isDownloadRunning;

        return (
            <View style={[styles.container, { borderTopWidth: this.props.navigation.getParam("header") === null ? 1 : 0 }]}>
                <Animated.View style={{ opacity: opacityView, marginTop: hasHeader === null ? 64 : 20 }}>
                    <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: 22 }]}>
                        {isDownloadRunning ? headerTextWaiting : headerTextFinished}
                    </AppText>
                </Animated.View>
                {/* {!this.props.isPreBuild */}
                {this.props.navigation.state.params.hideDownloadProgress != true ?
                    <View style={{ justifyContent: "center", alignItems: "center", margin: 20 }}>
                        <DownloadIndicator isVisible={true}
                            progress={progress}
                            width={250}
                            style={{ borderTopWidth: 0 }}
                            text={downloadIndigatorHeader}
                            doNotShowExtendIcon={true} />
                        <Animated.View style={{ opacity: opacityView, }} >
                            <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: 16 }]}>
                                {isDownloadRunning ? bodyTextWaiting : bodyTextFinished1}
                            </AppText>
                        </Animated.View>
                    </View>
                    : null}
                <View style={{ justifyContent: "flex-end", marginBottom: 32 }}>
                    <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: ColorTheme.FONT_SIZE, marginLeft: 20, marginRight: 20 }]}>
                        {bodyTextFinished2}
                    </AppText>
                    {hasHeader === null || hasHeader === undefined || noHeader === true ?
                        // <Animated.View style={{ opacity: showHideShow, overflowHidden: true }}>
                        // <FramedButton activeOpacity={isDownloadRunning ? 1 : 0.2} disabled={isDownloadRunning} style={{ marginBottom: 32, }} label={btnLabel} onPress={this.goToHome} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity disabled={disableButton} activeOpacity={disableButton ? 1 : 0.2} style={[styles.button, { borderColor: disableButton ? ColorTheme.DISABLED : ColorTheme.PRIMARY }]} onPress={() => !disableButton && this.goToHome()}>
                                <View style={{ alignItems: 'center' }}>
                                    <AppText style={[styles.label, { marginRight: 20, marginLeft: 20, color: disableButton ? ColorTheme.DISABLED : ColorTheme.PRIMARY }]}>{btnLabel}</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        // </Animated.View>
                        : null}
                    {isDownloadRunning ?
                        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.cancelDownload()}>
                            <Animated.View style={{ opacity: showHideShow, }}>
                                <AppText style={{ color: ColorTheme.PRIMARY }}>
                                    {cancelDownloadText}
                                </AppText>
                            </Animated.View>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>);
    }

    goToHome() {
        const onDone = this.props.navigation.getParam("onDone");
        if (onDone) {
            return onDone();
        }
        console.log("goToHome");

        //Reset the weekly notifications so there will be scheduled new ones that contain the new selected language!
        this.props.dispatch(resetEngagementNotifications());

        this.props.navigation.navigate('Home', {});
    }

    cancelDownload() {
        console.log("downloadInfoScreen - cancel download");
        this.props.dispatch(cancelDownload());
    }
}

function mapStateToProps(state) {
    const { selectedLang, contentByLanguage, disclaimer } = state;
    const language = contentByLanguage[selectedLang];
    const { screen } = language;
    const isPreBuild = state.isPreBuild;
    return {
        selectedLang,
        language,
        screen,
        downloadState: state.downloadReducer,
        disclaimerNotApproved: state.disclaimer.approved === false,
        getTextFromCMS: (screenKey, fallback) => helpers.getTextFromCMS(screen, screenKey, fallback),
        disclaimer,
        isPreBuild,
        mustShowOnboarding: state.disclaimer.approved === false && Object.keys(state.userProfiles).length === 0,
    };
}

export default connect(mapStateToProps)(DownloadInfoScreen)