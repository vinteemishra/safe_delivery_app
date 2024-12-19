import * as React from "react";
import { connect, MapStateToProps } from "react-redux";
import { StoreState } from "../../Reducers/reducers";
import { Case } from "../../Reducers/learningReducer";
import { ScrollView, View, Dimensions, StyleSheet, BackHandler } from "react-native";
import AppText from "../../Components/AppText";
import ColorTheme from "../../Constants/ColorTheme";
import { getTextFromCMS, getArrayItem } from "../../Utils/helpers";
import FramedButton from '../../Components/FramedButton';
import QuizImage from "../../Components/Quiz/QuizImage";
import { NavigationStackProp } from "react-navigation-stack";
import LightBoxModal from "../../Components/LightBoxModal";
import DismissQuiz from "../../Components/DismissQuiz";
import RightHeaderButton from "../../Components/RightHeaderButton";

const { width, height } = Dimensions.get('window')

interface OwnProps {
    navigation: NavigationStackProp<any, any>;
}

interface PropsFromState {
    certificateCases: Array<Case>
    caseIdx: number;
    imagesInLanguage: Array<{ id: string, src: string, version: number }>
    getTextFromCMS(screenKey: string, fallback: string): string;
}

interface PropsFromDispatch {

}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    showDismiss: boolean;
}

class CertCase extends React.Component<Props, State> {
    private didFocusSubscription;
    private willBlurSubscription;

    static navigationOptions = (props) => ({
        headerRight: <RightHeaderButton source={require("../../../img/notification_message/close.png")} onPress={() => props.navigation.state.params.dismissQuiz()} />,
    })
    constructor(props: Props) {
        super(props);
        this.dismissQuiz = this.dismissQuiz.bind(this);
        this.didFocusSubscription = props.navigation.addListener("didFocus", payload => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressAndroid);
        });
        this.state = {
            showDismiss: false,
        }
    }

    private dismissQuiz() {
        // console.log("dismissQuiz");
        this.setState({ showDismiss: true });
        return true;
    }

    private goToQuestion() {
        // console.log("goToNextQuestion");
        this.props.navigation.push("CertTest");
    }

    public componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener("willBlur", payload => {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackButtonPressAndroid);
        })
        this.props.navigation.setParams({
            // title: this.props.screen.certificate ? this.props.screen.certificate : 'Certification test',
            dismissQuiz: this.dismissQuiz,
        })
    }

    public componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    private onBackButtonPressAndroid = () => {
        this.dismissQuiz();
        return true;
    }

    public render() {
        const { certificateCases, caseIdx, imagesInLanguage, getTextFromCMS } = this.props;
        // console.log("CertTest", certificateCases[caseIdx]);

        const { image, description } = certificateCases[caseIdx];

        let case_text = getTextFromCMS("lp:case", "case ");
        case_text = case_text + " " + (caseIdx + 1) + " / " + certificateCases.length + ":";

        const imageObj = image ? getArrayItem(image, imagesInLanguage) : undefined;
        const imageSrc = imageObj !== undefined ? imageObj.src : null;

        return (
            <ScrollView alwaysBounceVertical={false} contentContainerStyle={{ backgroundColor: ColorTheme.SECONDARY, flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <QuizImage src={imageSrc} />
                    <View style={{ margin: 15 }}>
                        <AppText style={{ fontWeight: '500', fontSize: 20, marginTop: 20, textAlign: 'center' }}>{case_text}</AppText>
                        <AppText style={{ fontSize: 20, marginTop: 5, textAlign: 'center' }}>{description}</AppText>
                    </View>
                </View>
                <FramedButton label={getTextFromCMS("next", "next")} onPress={() => this.goToQuestion()} />
                <LightBoxModal
                    floatingCloseButtonVisible={true}
                    visible={this.state.showDismiss}
                    onRequestClose={() => this.setState({ showDismiss: false })}
                    closeText={getTextFromCMS("close", "close")}>
                    <DismissQuiz
                        message={getTextFromCMS("lp:quitting_test_warning", "you are about to quit the test. All progress on this quiz will be lost")}
                        header={getTextFromCMS("lp:leave", "leave")}
                        confirmLabel={getTextFromCMS("lp:leave", "leave")}
                        confirmDismiss={() => {
                            this.setState({ showDismiss: false }),
                                setTimeout(() => {
                                    this.props.navigation.navigate('CertificateCentralScreen', {
                                        title: this.props.getTextFromCMS("lp:certificate_center_title", "certification center"),
                                    })
                                }, 350)
                        }} />
                </LightBoxModal>
            </ScrollView>)
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state, props) => {
    const { contentByLanguage, selectedLang, learningReducer } = state;
    const language = contentByLanguage[selectedLang];
    const { images, screen } = language;
    return {
        certificateCases: learningReducer.currentCertificateQuestions,
        caseIdx: learningReducer.caseIdx,
        imagesInLanguage: images,
        getTextFromCMS: (screenKey, fallback) => (
            getTextFromCMS(screen, screenKey, fallback)
        )
    };
}

export default connect(mapStateToProps)(CertCase);