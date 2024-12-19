import * as React from "react"
import { View, Button, Platform, TouchableOpacity, Image } from "react-native"
import AppText from "../AppText";
import FramedButton from "../FramedButton";
import { App } from "../../App";
import ColorTheme from "../../Constants/ColorTheme";

interface OwnProps {
    title: string;
    getTextFromCMS(screenKey: string, fallback: string): string;
    buttonFunction(): void;
}

export class DeleteLanguageModal extends React.Component<OwnProps>{

    public render() {
        const { title, buttonFunction } = this.props;
        return (
            <View style={{ backgroundColor: ColorTheme.SECONDARY, borderWidth: 1, borderRadius: 5, borderColor: ColorTheme.SECONDARY, padding: 16, paddingTop: 24, flexDirection: "column", }} >
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.1, textAlign: 'center', marginBottom: 15, fontWeight: "bold" }}>{this.props.getTextFromCMS('language_delete', 'delete language')}</AppText>
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE, textAlign: 'center' }}>{this.props.getTextFromCMS('language_delete_warning', 'you are about to delete')}</AppText>
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE, fontWeight: 'bold', textAlign: 'center' }}>{title}</AppText>
                <AppText style={{ fontSize: ColorTheme.FONT_SIZE, marginTop: 10, textAlign: 'center' }}>{this.props.getTextFromCMS('language_delete_warning_1', 'do you want to continue?')}</AppText>
                <FramedButton label={this.props.getTextFromCMS('delete', 'Delete')} style={[, { width: 180, marginTop: 12, marginBottom: -16 }]} onPress={() => buttonFunction()} />
            </View>
        )
    }
}