import React from "react";
import AnimatedCheckBox from "./AnimatedCheckBox";
import ColorTheme from "../Constants/ColorTheme";
import { analytics } from "../Utils/analytics";
import { View } from "react-native";
import { RWANDA, RWANDA_FRENCH } from "../Utils/helpers";

// const EVENT_TYPE = "actioncardCompletion";
const EVENT_TYPE = "actioncard";

const ORGANIZED_TEXT = (langId: string) => {
    if (langId === RWANDA_FRENCH) {
        return "J’ai terminé cet exercise dans le cadre d’une séance de pratique organisée par le formateur/coordonnateur de la pratique sur place."
    } else {
        return "I have completed this exercise as part of a practice session organised by the on-site trainer/practice coordinator.";
    }
}

const INFORMALLY_TEXT = (langId: string) => {
    if (langId === RWANDA_FRENCH) {
        return "J’ai effectué cet exercice seul ou de manière informelle avec un ou deux collègues.";
    } else {
        return "I have completed this exercise on my own or informally with one or two colleagues.";
    }
}

interface IProps {
    trackingInfo: string;
    selectedLang: string;
}
interface IState {
    organizedChecked: boolean;
    informallyChecked: boolean;
}
export class HappyBirthdayCheckmarks extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            organizedChecked: false,
            informallyChecked: false,
        }

        this.isDisabled = this.isDisabled.bind(this);
        this.handleOrganizedClicked = this.handleOrganizedClicked.bind(this);
        this.handleInformallyClicked = this.handleInformallyClicked.bind(this);
    }

    isDisabled() {
        const { organizedChecked, informallyChecked } = this.state;
        return organizedChecked || informallyChecked;
    }

    handleOrganizedClicked() {
        if (this.isDisabled()) {
            return;
        }

        this.setState({ organizedChecked: true });
        analytics.event(EVENT_TYPE, `${this.props.trackingInfo}organized:`);
    }

    handleInformallyClicked() {
        if (this.isDisabled()) {
            return;
        }

        this.setState({ informallyChecked: true });
        analytics.event(EVENT_TYPE, `${this.props.trackingInfo}informally:`);
    }

    render() {
        const { organizedChecked, informallyChecked } = this.state;
        const { selectedLang } = this.props;
        const disabled = organizedChecked || informallyChecked;
        return (
            <View style={{ paddingTop: 20 }}>
                <AnimatedCheckBox
                    label={ORGANIZED_TEXT(selectedLang)}
                    onPress={this.handleOrganizedClicked}
                    checked={organizedChecked}
                    disabled={disabled}
                    animated={true}
                    borderColor={ColorTheme.PRIMARY}
                    disabledFillColor={disabled ? ColorTheme.SEPARATOR : null}
                    checkedFillColor={ColorTheme.PRIMARY}
                    iconTintColor={ColorTheme.SECONDARY}
                />
                <AnimatedCheckBox
                    label={INFORMALLY_TEXT(selectedLang)}
                    onPress={this.handleInformallyClicked}
                    checked={informallyChecked}
                    disabled={disabled}
                    animated={true}
                    borderColor={ColorTheme.PRIMARY}
                    disabledFillColor={disabled ? ColorTheme.SEPARATOR : null}
                    checkedFillColor={ColorTheme.PRIMARY}
                    iconTintColor={ColorTheme.SECONDARY}
                />
            </View>
        );
    }
}
