import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../Components/AppText";
import ColorTheme from "../Constants/ColorTheme";

export default class DrugListItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.container}>
          <AppText style={{ paddingTop: 16, paddingBottom: 16 }}>
            {this.props.children}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    alignSelf: "center",
  },
  container: {
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,

    backgroundColor: ColorTheme.SECONDARY,
    minHeight: 76,
  },
});
