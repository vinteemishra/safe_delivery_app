import * as React from "react"
import { View, Button, Platform, TouchableOpacity, Image } from "react-native"
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";

interface OwnProps {
    title: string;
    body: string;
    label: string;
    buttonFunction: () => void;
    onRequestClose: () => void;
    icon?: any;
}
export class DownloadVideoAssetsModal extends React.Component<OwnProps>{

    private onPress() {
        this.props.buttonFunction();
        this.props.onRequestClose();
    };

    public render() {
        const { title, body, label, icon } = this.props;
        return (
            <View style={{ margin: 20, justifyContent: "center", alignItems: "center" }}>
                {icon ? <Image source={icon}
                    style={{ height: 70, width: 75, marginBottom: 30, marginTop: 10 }} /> : null}
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.2, marginBottom: 10 }}>{title}</AppText>
                <AppText style={{ textAlign: "center", marginTop: 30 }}>{body}</AppText>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}>
                    <FramedButton label={label} onPress={() => this.onPress()} />
                </View>
            </View>
        );
    };
};