import * as React from "react";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { View, ScrollView } from "react-native";
import FramedButton from "../../Components/FramedButton";
import { NavigationStackProp } from "react-navigation-stack";
import { StoreState } from "../../Reducers/reducers";
import { startCertificateQuiz } from "../../Actions/learningActions";
import ColorTheme from "../../Constants/ColorTheme";
import RichText from "../../Components/RichText";
import { getTextFromCMS } from "../../Utils/helpers";
import { analytics } from "../../Utils/analytics";
import { CHEAT } from "../../Config/config";

interface OwnProps {
    navigation: NavigationStackProp<any, any>
}

interface PropsFromState {
    certId: string;
    introText: string;
    language: any;
    getTextFromCMS(screenKey: string, fallback: string): string;
}
interface PropsFromDispatch {
    startCertificateQuiz(certId: string, cheat?: boolean): void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

class CertIntroductionScreen extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        props.startCertificateQuiz(props.certId);
    }

    private goToCertificateTest() {
        this.props.navigation.push("CertCase");
    }

    private goToCertificateTestWithCheat() {
        this.props.startCertificateQuiz(this.props.certId, true);
        this.props.navigation.push("CertCase");
    }

    public render() {

        const { getTextFromCMS, introText, language } = this.props;

        return (
            <ScrollView style={{ flex: 1, backgroundColor: ColorTheme.SECONDARY }}
                alwaysBounceVertical={false}>
                <RichText language={language} content={introText} />
                <FramedButton label={getTextFromCMS("next", "next")} onPress={() => this.goToCertificateTest()} />
                {CHEAT ? <FramedButton label={"Start exam with cheat"} onPress={() => this.goToCertificateTestWithCheat()} /> : null}
            </ScrollView>
        )
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state, props) => {
    const { contentByLanguage, selectedLang } = state;
    const language = contentByLanguage[selectedLang];
    const { screen } = language;
    return {
        certId: props.navigation.getParam("certId"),
        introText: state.learningReducer.certIntro,
        language,
        getTextFromCMS: (screenKey, fallback) => {
            return getTextFromCMS(screen, screenKey, fallback);
        }
    }
}

const mapDispatchToProps: MapDispatchToProps<PropsFromDispatch, OwnProps> = (dispatch) => ({
    startCertificateQuiz: (certId, cheat) => {
        analytics.event('certStart', `:${certId}:`);
        dispatch(startCertificateQuiz({ certId, cheat }))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(CertIntroductionScreen);