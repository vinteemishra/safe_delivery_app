import * as React from "react"
import { View, Button, Platform, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";
import { IndexLanguageType } from "../../Reducers/downloadReducer";
import { lang } from "moment";
import { isThereEnoughDiskSpace } from "../../Utils/downloadLanguage";
const DOWNLOAD_ICON = require("../../../img/download-red-large.png");
interface OwnProps {
    getTextFromCMS(screenKey: string, fallback: string): string;
    buttonFunction(): void;
    secondaryButtonFunction(isSelectiveDownload: boolean): void;
    onRequestClose(): void;
    language: IndexLanguageType;
}

interface State {
    checkForEnoughDiskSpacePrimary: boolean,
    checkForEnoughDiskSpaceSecondary: boolean,
    notEnoughSpaceOnDevice: boolean,
}

export class ConfirmSelectiveDownloadModal extends React.Component<OwnProps, State>{
    constructor(props: OwnProps) {
        super(props);
        this.state = {
            checkForEnoughDiskSpacePrimary: false,
            checkForEnoughDiskSpaceSecondary: false,
            notEnoughSpaceOnDevice: false,
        }
    }
    private async onPrimaryPress(language: IndexLanguageType) {
        const hasEnoughFreeSpace = await this.hasEnoughFreeSpace(language);
        if (hasEnoughFreeSpace) {
            this.props.buttonFunction();
            this.props.onRequestClose();
        } else {
            this.setState({ notEnoughSpaceOnDevice: true });
        }
    }

    private async onSecondaryPress(language: IndexLanguageType) {
        const isSelectiveDownload = true
        const hasEnoughFreeSpace = await this.hasEnoughFreeSpace(language, isSelectiveDownload);
        if (hasEnoughFreeSpace) {
            this.props.secondaryButtonFunction(isSelectiveDownload);
            this.props.onRequestClose();
        } else {
            this.setState({ notEnoughSpaceOnDevice: true });
        }
    }

    private async hasEnoughFreeSpace(downloadLanguage: IndexLanguageType, isSelectiveDownload?: boolean) {

        // Set the spinner active while we check if there is enough space on the device for installation of the selected language
        this.setState({ notEnoughSpaceOnDevice: false });
        if (isSelectiveDownload) {
            this.setState({ checkForEnoughDiskSpaceSecondary: true });
        } else {
            this.setState({ checkForEnoughDiskSpacePrimary: true });
        }


        // Get the true or false if there is enough space on the device
        const isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage = await isThereEnoughDiskSpace(downloadLanguage, isSelectiveDownload);

        // If the is not enough space on the device, then show a warning and skip download process.
        this.setState({ checkForEnoughDiskSpaceSecondary: false, checkForEnoughDiskSpacePrimary: false });
        return isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage;
    }

    private renderSkipVideosButton() {
        const { getTextFromCMS, language } = this.props;
        const { checkForEnoughDiskSpaceSecondary } = this.state;

        if (checkForEnoughDiskSpaceSecondary) {
            return (
                <View style={{ height: 45, marginTop: 10, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={ColorTheme.PRIMARY} size={"small"} /></View>
            )
        }

        return (
            <TouchableOpacity onPress={() => { this.onSecondaryPress(language) }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: "center", paddingTop: 20, paddingBottom: 20 }}>
                    <AppText style={[{ color: ColorTheme.PRIMARY }]}>{getTextFromCMS("download_without_videos", "Download later")}</AppText>
                </View>
            </TouchableOpacity>
        );
    }

    public render() {
        const { language, getTextFromCMS } = this.props;
        const { checkForEnoughDiskSpacePrimary, notEnoughSpaceOnDevice } = this.state;
        return (
            <View style={{ backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY, padding: 16, paddingTop: 24, alignItems: "center" }} >
                <Image key="download" source={DOWNLOAD_ICON}
                    style={{ height: 76, width: 81, marginBottom: 30 }} />
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.1, textAlign: 'center', marginBottom: 15, fontWeight: "bold" }}>{getTextFromCMS("language_download", "Download") + " " + language.description}</AppText>
                {/* <AppText style={{ fontSize: ColorTheme.FONT_SIZE, marginTop: 10, textAlign: 'center' }}>{getTextFromCMS('download_with_videos_description', 'Choose "Download with videos" to be able to watch them offline later without using data.')}</AppText> */}
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE, marginTop: 10, textAlign: 'center' }}>{getTextFromCMS('download_without_videos_description', 'Choose "Download later" if you have poor internet and/or prefer to stream videos. You can always download them later.')}</AppText>
                {notEnoughSpaceOnDevice ? <AppText style={{ color: ColorTheme.WARNING, fontSize: ColorTheme.FONT_SIZE, textAlign: "center", marginTop: 20 }}>{getTextFromCMS("language_download_size_error", "Error! not enough free space on the device!")}</AppText> : null}

                {checkForEnoughDiskSpacePrimary ? <View style={{ height: 50, marginTop: 20, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={ColorTheme.PRIMARY} size={"small"} /></View> :
                    <FramedButton label={this.props.getTextFromCMS('download_with_videos', 'Download with videos')} labelStyle={{ color: ColorTheme.SECONDARY }} style={[, { width: "auto", marginTop: 20, backgroundColor: ColorTheme.PRIMARY }]} onPress={() => this.onPrimaryPress(language)} />}
                {this.renderSkipVideosButton()}
            </View>
        )
    }
}