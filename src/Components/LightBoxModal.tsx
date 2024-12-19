import * as React from "react";
import { StyleSheet, View, ViewStyle, TouchableOpacity, Image, Text } from "react-native";
import { cardShadow, cardShadowStyle } from "../Constants/Constants";
import Modal from "react-native-modal";
import ColorTheme from '../Constants/ColorTheme';

interface OwnProps {
    visible: boolean;
    onRequestClose(): void;
    style?: ViewStyle | ViewStyle[];
    floatingCloseButtonVisible: boolean;
    closeText?: String;
    onModalHide?(): void;
    disableOnBackDropPress?: boolean;

}

interface State {

}

class LightBoxModal extends React.Component<OwnProps, State> {
    constructor(props: OwnProps) {
        super(props);
    }

    private renderfloatingCloseButton() {
        return (
            <TouchableOpacity onPress={() => this.props.onRequestClose()} style={{ width: '90%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ backgroundColor: 'transparent', textAlign: 'right', color: ColorTheme.SECONDARY }}>{this.props.closeText}</Text>
                <Image style={{ height: 12, width: 12, marginLeft: 8 }} source={require('../../img/notification_message/close.png')} />
            </TouchableOpacity>
        )
    }
    public render() {

        return (
            <Modal style={{ alignItems: "center", justifyContent: "center" }}
                isVisible={this.props.visible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropColor="rgba(0,0,0,0.75)"
                onBackdropPress={this.props.disableOnBackDropPress ? null : this.props.onRequestClose}
                animationInTiming={300}
                animationOutTiming={300}
                onModalHide={() => this.props.onModalHide()}

            >
                {this.props.floatingCloseButtonVisible == false ? null : this.renderfloatingCloseButton()}
                <View style={[styles.contentContainer, StyleSheet.flatten(this.props.style)]}>
                    {this.props.children}
                </View>
            </Modal>
        );
    }
}

export default LightBoxModal;

const styles = StyleSheet.create({
    contentContainer: {
        width: "90%",
        backgroundColor: "white",
        ...cardShadow,
        borderRadius: 5,
        overflow: "hidden"
    },
});