import React, { Component } from 'react';
import ColorTheme from '../Constants/ColorTheme';
import { Dimensions, View, TouchableOpacity, Image, ViewStyle } from 'react-native';
import AppText from './AppText';
import { CustomModal as Modal } from './CustomModal';

interface OwnProps {
    onCancel(): void;
    onOK(): void;
    onClose?(): void;
    visible: boolean;
    disabled?: boolean;
    hideModalClose?: boolean;
    cancelText: string;
    okText: string;
    closeButtonText: string;
}
const buttonStyle = (disabled): ViewStyle => {
    return {
        flex: 1,
        backgroundColor: disabled ? ColorTheme.DISABLED : ColorTheme.PRIMARY,
        paddingTop: 8, paddingBottom: 8,
        marginTop: 20,
        minHeight: 50,
        justifyContent: 'center'
    }
}


const OKCancelButtons = ({ okText, cancelText, onCancel, onOK, disabled }) => (
    <View style={{ flexDirection: 'row' }}>
        {onCancel &&
            <TouchableOpacity style={{ ...buttonStyle(disabled) }} onPress={disabled ? () => { } : onCancel}>
                <AppText style={{ color: ColorTheme.SECONDARY, textAlign: 'center' }}>{cancelText || "Cancel"}</AppText>
            </TouchableOpacity>
        }
        {onOK &&
            <TouchableOpacity style={buttonStyle(disabled)} onPress={disabled ? () => { } : onOK}>
                <AppText style={{ color: ColorTheme.SECONDARY, textAlign: 'center' }}>{okText || "OK"}</AppText>
            </TouchableOpacity>
        }
    </View>
)

export class OkCancelModal extends Component<OwnProps> {
    public render() {

        let cancel = this.props.onClose ? this.props.onClose : this.props.onCancel;
        let modalCancel = this.props.hideModalClose ? undefined : cancel;
        return (
            <Modal transparent={true} visible={this.props.visible || false} onRequestClose={() => { }} animationType='fade' onCancel={modalCancel} closeButtonText={this.props.closeButtonText}>
                <View style={{ backgroundColor: ColorTheme.SECONDARY }}>
                    <View style={{ padding: 16, paddingTop: 24 }}>
                        {this.props.children}
                    </View>
                    <OKCancelButtons
                        disabled={this.props.disabled}
                        onCancel={this.props.onCancel}
                        onOK={this.props.onOK}
                        cancelText={this.props.cancelText}
                        okText={this.props.okText}
                    />
                    {/* </View>
                </View> */}
                </View>
            </Modal>
        )
    }
}