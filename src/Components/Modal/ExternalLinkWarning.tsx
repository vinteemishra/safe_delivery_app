import * as React from "react"
import { View, Button, Platform, TouchableOpacity } from "react-native"
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";

interface OwnProps {
    title: string;
    body: string;
    label: string;
    buttonFunction: () => void;
    icon?: any;
}
export class ExternalLinkWarning extends React.Component<OwnProps>{

    public render() {
        const { title, body, label } = this.props;
        console.log("render error Modal", title);
        return (
            <View style={{ margin: 20 }}>
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.1, fontWeight: "700", marginBottom: 10 }}>{title}</AppText>
                <AppText>{body}</AppText>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20, alignItems: "center" }}>
                </View>
                <FramedButton label={label} onPress={() => this.props.buttonFunction()} />
            </View>
        )
    }
}