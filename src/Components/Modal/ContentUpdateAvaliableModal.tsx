import * as React from "react"
import { View, Button, Platform, TouchableOpacity } from "react-native"
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";

interface OwnProps {
    title?: string;
    body?: string;
    negativeButton: string;
    positiveButton: string;
    negativeCallback(): void;
    positiveCallback(): void;
}
export class ContentUpdateAvaliableModal extends React.Component<OwnProps>{

    public render() {
        const { title, body, negativeButton, positiveButton, negativeCallback, positiveCallback } = this.props;

        const MButton = ({ onPress, title, style }) => {
            return (
                <TouchableOpacity style={{ padding: 8 }} onPress={() => onPress()}>
                    <View>
                        <AppText style={[style]}>{title}</AppText>
                    </View>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{ margin: 20 }}>
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.1, fontWeight: "700", marginBottom: 10 }}>{title}</AppText>
                <AppText>{body}</AppText>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20, alignItems: "center" }}>
                    <MButton onPress={negativeCallback}
                        title={negativeButton}
                        style={{ color: ColorTheme.PRIMARY }} />
                    <MButton onPress={positiveCallback}
                        title={positiveButton}
                        style={{ color: ColorTheme.PRIMARY, marginLeft: 10 }} />
                </View>
            </View>
        )
    }
}