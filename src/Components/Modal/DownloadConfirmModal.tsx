import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import AppText from "../AppText";
import ColorTheme from "../../Constants/ColorTheme";
import NavigationService from "./../NavigationService";
import { analytics } from "../../Utils/analytics";
import FramedButton from "../../Components/FramedButton";

import { isThereEnoughDiskSpace, startLanguageDownload } from "../../Utils/downloadLanguage";
import { closeModal } from "../../Actions/modalActions";
import * as helpers from "../../Utils/helpers";
import { StoreState } from "../../Reducers/reducers";

import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { IndexLanguageType } from "../../Reducers/downloadReducer";

interface OwnProps {
    screen: { [key: string]: string };
    buttonFunction(): void;
    label: string;
    onRequestClose(): void;
    getTextFromCMS(screenKey: string, fallback: string): string;
    // title: string;
    language: IndexLanguageType;
}

interface State {
    notEnoughSpaceOnDevice: boolean;
    checkForEnoughDiskSpace: boolean;
};

interface PropsFromDispatch {
}

interface PropsFromState {
}

type Props = OwnProps & PropsFromDispatch;

class DownloadConfirmModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            notEnoughSpaceOnDevice: false,
            checkForEnoughDiskSpace: false,
        };
    }

    private async onPress(language: IndexLanguageType) {
        const hasEnoughFreeSpace = await this.hasEnoughFreeSpace(language);
        if (hasEnoughFreeSpace) {
            this.props.buttonFunction();
            this.props.onRequestClose();
        } else {
            this.setState({ notEnoughSpaceOnDevice: true });
        }
    }

    private async hasEnoughFreeSpace(downloadLanguage: IndexLanguageType, isSelectiveDownload?: boolean) {

        // Set the spinner active while we check if there is enough space on the device for installation of the selected language
        this.setState({ checkForEnoughDiskSpace: true, notEnoughSpaceOnDevice: false });

        // Get the true or false if there is enough space on the device
        const isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage = await isThereEnoughDiskSpace(downloadLanguage);

        // If the is not enough space on the device, then show a warning and skip download process.
        this.setState({ checkForEnoughDiskSpace: false });
        return isThereEnoughDiskSpaceOnDeviceForTheSelectedLanguage;
    }

    public render() {
        const { getTextFromCMS, label, language } = this.props;

        return (
            <View style={{}}>
                <View style={{ backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY, padding: 16, paddingTop: 24, flexDirection: "column" }} >
                    <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.25, textAlign: "center", fontWeight: "500" }}>{this.props.getTextFromCMS("language_download", "Download")} "{language.description}"?</AppText>
                    <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 0.8, color: ColorTheme.SUB_LABEL, textAlign: "center", marginBottom: 15 }}>{label}</AppText>
                    <AppText style={{ fontSize: ColorTheme.FONT_SIZE, textAlign: "center", marginBottom: 12 }}>{this.props.getTextFromCMS("language_download_warning", "Are you sure, you want to download this version to your device?")}</AppText>
                    {this.state.notEnoughSpaceOnDevice ? <AppText style={{ color: ColorTheme.WARNING, fontSize: ColorTheme.FONT_SIZE, textAlign: "center" }}>{getTextFromCMS("language_download_size_error", "error! not enough free space on the device!")}</AppText> : null}
                    {this.state.checkForEnoughDiskSpace ? <ActivityIndicator color={ColorTheme.PRIMARY} size={"small"} /> : <FramedButton label={getTextFromCMS("ok", "ok")} onPress={() => this.onPress(language)} />}
                </View>
            </View>
        );
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state) => ({
    // screen: state.contentByLanguage[state.selectedLang].screen,
});



export default connect(mapStateToProps)(DownloadConfirmModal);