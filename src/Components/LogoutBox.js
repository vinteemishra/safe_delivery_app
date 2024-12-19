import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
import FramedButton from "../Components/FramedButton";
import { ENDPOINT_HOST } from "../Config/config";

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: ColorTheme.SECONDARY,
    textAlign: "center",
  },
});

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default class LogoutBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      fetchingDone: false,
      fetchError: "",
      syncFailed: false,
    };
  }

  render() {
    let logout_text = "";
    let user = this.props.currentUser;

    if (user) {
      if (this.props.userProfiles[user].profileEmail) {
        logout_text_header = this.props.screen["lp:log_out"]
          ? this.props.screen["lp:log_out"]
          : "log out";
        logout_text = this.props.screen["lp:logout_online_user_message"]
          ? this.props.screen["lp:logout_online_user_message"]
          : "the user will be removed form this device.";
      } else {
        logout_text_header = this.props.screen["lp:log_out"]
          ? this.props.screen["lp:log_out"]
          : "log out";
        logout_text = this.props.screen["lp:logout_offline_user_message"]
          ? this.props.screen["lp:logout_offline_user_message"]
          : "this user will be removed. All progress will be deleted";
      }
    }

    let done_msg = "";
    if (!this.props.userProfiles[user].profileEmail)
      done_msg = this.props.doneMassage;
    else done_msg = this.props.doneMassage;

    let message = (
      <View>
        <View style={{ padding: 20 }}>
          <View style={{ marginBottom: 18 }}>
            <AppText
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: ColorTheme.FONT_SIZE * 1.25,
              }}
            >
              {logout_text_header}
            </AppText>
          </View>
          <AppText style={{ textAlign: "center" }}>{logout_text}</AppText>
        </View>
        <View style={{ minHeight: 50, marginTop: -12 }}>
          {this.state.fetching ? (
            <View
              style={{
                alignItems: "center",
                height: 80,
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <ActivityIndicator color={ColorTheme.PRIMARY} size={"large"} />
            </View>
          ) : (
            <FramedButton
              label={
                this.props.screen["lp:log_out"]
                  ? this.props.screen["lp:log_out"]
                  : "log out"
              }
              style={[
                styles.buttonText,
                { marginBottom: 12, minWidth: 150, maxWidth: "90%" },
              ]}
              onPress={() => this.logout()}
            />
          )}
        </View>
      </View>
    );

    if (this.state.syncFailed) {
      const errorHeader = this.props.screen["lp:network_error"]
        ? this.props.screen["lp:network_error"]
        : "could not connect to the network";

      message = (
        <View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <AppText
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: ColorTheme.FONT_SIZE * 1.25,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              {errorHeader}
            </AppText>
            <AppText
              style={{
                color: ColorTheme.WARNING,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {this.props.syncFailedMessage}
            </AppText>
          </View>
          {this.state.fetching === true ? (
            <View
              style={{
                paddingRight: 16,
                paddingLeft: 16,
                paddingTop: 20,
                paddingBottom: 20,
                alignItems: "center",
                height: 100,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color={ColorTheme.PRIMARY} size={"large"} />
            </View>
          ) : (
            <View style={{}}>
              <FramedButton
                style={[styles.button, { maxWidth: "90%" }]}
                label={
                  this.props.screen.retry ? this.props.screen.retry : "Retry"
                }
                onPress={() => this.logout()}
              />
              <FramedButton
                style={[
                  styles.button,
                  { maxWidth: "90%", marginTop: -12, marginBottom: 12 },
                ]}
                label={
                  this.props.screen.logoutAnyway
                    ? this.props.screen.logoutAnyway
                    : "Log out anyway"
                }
                onPress={() => this.deleteProfileAndDismiss()}
              />
            </View>
          )}
        </View>
      );
    } else if (this.state.fetchingDone && this.state.fetchError === "") {
      message = (
        <View style={{}}>
          <View
            style={{
              paddingRight: 16,
              paddingLeft: 16,
              paddingTop: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText
              style={{
                textAlign: "center",
                fontSize: ColorTheme.FONT_SIZE * 1.2,
                marginLeft: 16,
                marginRight: 16,
                marginBottom: 20,
              }}
            >
              {done_msg}
            </AppText>
            <Image
              source={require("../../img/learning_icons/success.png")}
              style={{ alignSelf: "center", width: 48, height: 36 }}
            />
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: ColorTheme.SECONDARY,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: ColorTheme.SECONDARY,
        }}
      >
        {message}
      </View>
    );
  }

  getOnlineProfiles = (profiles) => {
    let allProfiles = { ...profiles };

    for (key in allProfiles) {
      if (
        !allProfiles[key].profileEmail ||
        allProfiles[key].profileEmail.length === 0
      ) {
        delete allProfiles[key];
      }
    }
    return allProfiles;
  };

  logout() {
    let user = this.props.currentUser;

    if (user) {
      let onlineUserProfiles = this.getOnlineProfiles(this.props.userProfiles);

      if (Object.keys(onlineUserProfiles).length > 0) {
        this.updateProfiles(onlineUserProfiles);
      } else {
        this.deleteProfileAndDismiss();
      }
    } else {
      console.log("There is no user!");
      return;
    }
  }

  async updateProfiles(onlineUserProfiles) {
    this.setState({ fetching: true, fetchError: "" });

    const { country } = this.props;

    try {
      const response = await fetch(
        ENDPOINT_HOST(country) + "/api/public/profiles",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(onlineUserProfiles),
        }
      );

      const json = await response.json();

      console.log("json: ", json);

      if (json) {
        this.setState({ fetching: false, fetchingDone: true });
        await sleep(1200); //Halt a bit so the "User logged out" message will show for 1200ms
        this.setState({ fetchingDone: false });
        this.deleteProfileAndDismiss();
      }
    } catch (error) {
      this.setState({
        fetching: false,
        fetchingDone: true,
        syncFailed: true,
        fetchError: this.props.screen["lp:network_error"]
          ? this.props.screen["lp:network_error"]
          : "could not connect to the network",
      });
      await sleep(1600);
      this.setState({ fetchingDone: false });
    } finally {
    }
  }

  deleteProfileAndDismiss() {
    this.props.removeProfile();
    this.props.setCurrentUser();
    this.props.onRequestClose();
  }
}
