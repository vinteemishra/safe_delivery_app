import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { cancelDownload } from '../Actions/downloadActions';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';
import { DownloadStatus } from '../Reducers/downloadReducer';
import { StoreState } from '../Reducers/reducers';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: ColorTheme.SECONDARY,
        marginTop: 64,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: ColorTheme.PRIMARY
    },
    container: {
        borderColor: ColorTheme.PRIMARY,
        backgroundColor: ColorTheme.SECONDARY,
        borderWidth: 1,
        borderTopWidth: 0,
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
    spinner: {
        margin: 16,
        height: 30,
        width: 30,
        // color: ColorTheme.SECONDARY,
    },
});

interface IPropsFromState {
    status: DownloadStatus;
    message?: string;
    filesToDownload?: string[];
    filesRemaining?: number;
    previouslyActiveLanguage?: string;
}
interface IPropsFromDispatch {
    cancelDownload(): void;
}

interface IOwnProps {
    navigation: NavigationStackProp<any, {}>;
}
type IProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class MGettingDownloadReadyScreen extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        // this.renderError = this.renderError.bind(this);
    }

    componentDidUpdate(prevProps: IProps) {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        const { status, previouslyActiveLanguage } = this.props;
        console.log("GettingDownloadReadyScreen", prevProps.status, this.props.status);
        if (prevProps.status !== "media" && this.props.status === "media") {
            console.log("Bundle was done.. Moving on...");
            // this.props.navigation.pop();
            setTimeout(() => this.props.navigation.pop(), 300);
        }
        else if (status === "canceled") {
            console.log("Download has been canceled.. Navigating back..")
            if (previouslyActiveLanguage === "none") {
                this.props.navigation.navigate("InitialDownload", {});
            } else {
                this.props.navigation.navigate("LanguageScreen", {
                    title: 'Choose version',
                });
            }
            return;
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        return true;
    }

    // renderError() {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <AppText>Error! {this.props.message}</AppText>
    //         </View>
    //     );
    // }

    render() {
        const { status } = this.props;

        // if (this.props.status === "failed") {
        //     return this.renderError();
        // }

        const headerText = "Preparing files for language download";
        const bodyTextWaiting = status === "media" ? "Preparation complete\n" : "This may take serveral minutes\ndepending on your internet connectivity";
        // const bodyTextFinished1 = "Your download has completed\n";
        // const isDownloadRunning = status !== "idle";
        const cancelBtn = "Cancel download"

        return (
            <View style={styles.container}>
                <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 8, marginRight: 8 }}>
                    <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: ColorTheme.FONT_SIZE * 1.25 }]}>
                        {headerText}
                    </AppText>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", }}>
                    <AppText style={[styles.testStyle, { fontWeight: "400", textAlign: "center", fontSize: ColorTheme.FONT_SIZE }]}>
                        {bodyTextWaiting}
                    </AppText>
                    <View style={{ marginLeft: 8, }}>
                        {status === "media" ? null : <ActivityIndicator color={ColorTheme.PRIMARY} size={'small'} />}
                    </View>
                </View>
                <View style={{ justifyContent: "flex-end", marginBottom: 20 }}>
                    <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.props.cancelDownload()}>
                        <AppText style={{ color: ColorTheme.PRIMARY }}>
                            {cancelBtn}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps: MapDispatchToProps<IPropsFromDispatch, IOwnProps> = (dispatch, props) => {
    return {
        cancelDownload: () => {
            console.log("GettingDownloadReadyScreen - cancel download");
            dispatch(cancelDownload())
        },
    }
}

const mapStateToProps: MapStateToProps<IPropsFromState, IOwnProps, any> = (state: StoreState) => {
    return {
        ...state.downloadReducer
    }
};

export const GettingDownloadReadyScreen = connect(mapStateToProps, mapDispatchToProps)(MGettingDownloadReadyScreen);
