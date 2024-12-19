import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

var styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  divider: {
    backgroundColor: "black",
    height: 1,
  },
});

class ActioncardParagraph extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.divider} />
      </View>
    );
  }
}

module.exports = ActioncardParagraph;
