import React, { Component } from "react";
import { View, Modal, TouchableOpacity, Image, Dimensions } from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
// This is a work around to https://github.com/facebook/react-native/issues/10845

const { height, width } = Dimensions.get("window");

export class CustomModal extends React.Component {
  updateVisibleStateTimer;

  constructor(props) {
    super();
    this.state = { isVisible: props.visible };
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateVisibleStateTimer !== null) {
      clearTimeout(this.updateVisibleStateTimer);
    }

    this.updateVisibleStateTimer = setTimeout(this.updateVisibleState, 200);
  }

  componentWillUnmount() {
    if (this.updateVisibleStateTimer !== null) {
      clearTimeout(this.updateVisibleStateTimer);
    }
  }

  render() {
    let props = this.props;
    return (
      <Modal {...props} ref={undefined} visible={this.state.isVisible}>
        <View
          style={{
            height: width < height ? height : width,
            width: width < height ? width : height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              backgroundColor: ColorTheme.MODAL_BACKGROUND,
            }}
            onPress={this.props.onCancel ? this.props.onCancel : () => {}}
            activeOpacity={0.8}
          />
          {this.props.onCancel ? (
            <TouchableOpacity
              onPress={this.props.onCancel}
              style={{
                width: "90%",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  backgroundColor: "transparent",
                  textAlign: "right",
                  color: ColorTheme.SECONDARY,
                }}
              >
                {this.props.closeButtonText}
              </AppText>
              <Image
                style={{ height: 16, width: 16, marginLeft: 8 }}
                source={require("../../img/notification_message/close.png")}
              />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              width: "90%",
              margin: 16,
              marginTop: 12,
              backgroundColor: ColorTheme.SECONDARY,
            }}
          >
            {props.children}
          </View>
        </View>
      </Modal>
    );
  }

  updateVisibleState = () => {
    this.setState({ isVisible: this.props.visible });
    this.updateVisibleStateTimer = null;
  };
}
