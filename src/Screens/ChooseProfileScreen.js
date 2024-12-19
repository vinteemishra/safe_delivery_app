import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
import { connect } from "react-redux";
import * as helpers from "../Utils/helpers";
import { setCurrentUser } from "../Actions/actions";
import FramedButton from "../Components/FramedButton";
import LightBoxModal from "../Components/LightBoxModal";
import LogoutBox from "../Components/LogoutBox";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { removeProfile, setCurrentUser } from "../Actions/actions";
import {
  resetEngagementNotifications,
  setupNotifications,
} from "../Actions/notificationActions";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: ColorTheme.TERTIARY,
  },
  profileCurrentText: {
    fontSize: ColorTheme.FONT_SIZE * 1.2,
    fontWeight: "500",
    letterSpacing: 1.2,
  },
  profileItem: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 8,
    marginRight: 8,
    borderTopWidth: 1,
    justifyContent: "center",
    borderColor: ColorTheme.SEPARATOR,
    backgroundColor: ColorTheme.SECONDARY,
  },
  profileText: {
    fontSize: ColorTheme.FONT_SIZE,
    letterSpacing: 1.2,
  },
  separator: {
    height: 2,
    backgroundColor: "#eee",
  },
});
class ChooseProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  pressProfile() {
    this.props.navigation.navigate("ShowProfileScreenFromSettingsModal", {
      title: this.props.getTextFromCMS("userprofile", "user profile"),
      fromSettingsScreenViewProfile: true,
    });
  }

  //When a user logs out, the LearningScreen witnin the MyLearningTab stack is reset to prevent an app crash, and then there is the need to navigate back ShowProfileScreen. Hence this functions.
  resetStackAndClose() {
    this.props.navigation.navigate("ShowProfileScreenFromSettings", {
      //Jump back to the "Settings" tab
    });
  }

  render() {
    let user_profiles = [];
    let current_profile = null;
    let userProfiles = Object.values(this.props.userProfiles).sort(
      compareProfileNames
    );
    const { language } = this.props;
    for (let profile in userProfiles) {
      let user = "" + userProfiles[profile].profileId;
      if (
        userProfiles[profile].profileId == this.props.currentUser.currentUser
      ) {
        current_profile = (
          <View
            style={{
              alignItems: "center",
              paddingTop: 32,
              paddingBottom: 16,
              borderBottomColor: ColorTheme.SEPARATOR,
              borderBottomWidth: 1,
              backgroundColor: ColorTheme.SECONDARY,
            }}
          >
            <AppText style={styles.profileCurrentText}>
              {userProfiles[profile].profileName}
            </AppText>
            {userProfiles[profile].profileEmail ? (
              <AppText
                style={[
                  styles.profileText,
                  { fontSize: ColorTheme.FONT_SIZE * 0.8 },
                ]}
              >
                {userProfiles[profile].profileEmail}
              </AppText>
            ) : null}
            <FramedButton
              label={this.props.getTextFromCMS(
                "lp:view_profile_button",
                "view profile"
              )}
              onPress={() => this.pressProfile()}
            />
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <TouchableOpacity onPress={() => this.pressLogout()}>
                <AppText
                  style={{
                    color: ColorTheme.PRIMARY,
                    fontSize: ColorTheme.FONT_SIZE * 0.8,
                  }}
                >
                  {this.props.getTextFromCMS("lp:log_out", "log out")}
                </AppText>
              </TouchableOpacity>
            </View>
            <LightBoxModal
              visible={this.state.modalVisible == true}
              onRequestClose={() => this.setState({ modalVisible: false })}
              floatingCloseButtonVisible={true}
              closeText={
                language.screen.close ? language.screen.close : "close"
              }
            >
              <LogoutBox
                closeButtonText={
                  this.props.language.screen.close
                    ? this.props.language.screen.close
                    : "close"
                }
                doneMassage={this.props.getTextFromCMS(
                  "lp:logout_done_message",
                  "user logged out"
                )}
                syncFailedMessage={this.props.getTextFromCMS(
                  "lp:logout_failed_sync_message",
                  "your latest progress could not be saved. you may try again, or log out the user anyway (you will lose the latest progress)"
                )}
                userProfiles={this.props.userProfiles}
                currentUser={this.props.currentUser.currentUser}
                country={this.props.selectedCountry}
                screen={this.props.screen}
                removeProfile={() =>
                  this.props.dispatch(
                    removeProfile(this.props.currentUser.currentUser)
                  )
                }
                setCurrentUser={() => this.props.dispatch(setCurrentUser(null))}
                onRequestClose={() => this.resetStackAndClose()}
              />
            </LightBoxModal>
          </View>
        );
      } else {
        user_profiles.push(
          <TouchableOpacity
            key={profile}
            style={styles.profileItem}
            onPress={() => this.chooseUser(user)}
          >
            <AppText style={styles.profileText}>
              {userProfiles[profile].profileName}
            </AppText>
            {userProfiles[profile].profileEmail ? (
              <AppText
                style={[
                  styles.profileText,
                  {
                    fontSize: ColorTheme.FONT_SIZE * 0.8,
                    alignSelf: "flex-end",
                    color: ColorTheme.SUB_LABEL,
                  },
                ]}
              >
                {userProfiles[profile].profileEmail}
              </AppText>
            ) : null}
          </TouchableOpacity>
        );
      }
    }
    if (this.props.navigation.state.params.no_active_user) {
      return (
        <View style={styles.mainContainer}>
          {this.props.currentUser.currentUser !== null ? current_profile : null}
          <View style={{ backgroundColor: ColorTheme.SEPARATOR, height: 1 }} />
          <TouchableOpacity
            style={[
              styles.profileItem,
              {
                borderTopWidth: 0,
                marginRight: 0,
                marginLeft: 0,
                paddingRight: 16,
                paddingLeft: 16,
                paddingTop: 32,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              },
            ]}
            onPress={() => this.login()}
          >
            <Image
              style={{ marginRight: 12 }}
              source={require("../../img/learning_icons/user-add-red.png")}
            />
            <AppText
              style={[styles.profileText, { color: ColorTheme.PRIMARY }]}
            >
              {this.props.screen["lp:add_user2"]
                ? this.props.screen["lp:add_user2"]
                : "Log in"}
            </AppText>
          </TouchableOpacity>
          <AppText
            style={{
              fontWeight: "500",
              padding: 16,
              paddingBottom: 12,
              paddingTop: 24,
              backgroundColor: ColorTheme.SECONDARY,
            }}
          >
            {this.props.getTextFromCMS(
              "lp:existing_users_device",
              "Users already on this device"
            )}
          </AppText>
          <ScrollView>
            <View
              style={{
                backgroundColor: ColorTheme.SECONDARY,
                borderBottomColor: ColorTheme.SEPARATOR,
                borderBottomWidth: 1,
              }}
            >
              {user_profiles.length > 0 ? (
                user_profiles
              ) : (
                <View style={styles.profileItem}>
                  <AppText style={{ color: ColorTheme.SEPARATOR }}>
                    {this.props.getTextFromCMS(
                      "lp:empty_user_list",
                      "no users avaliable"
                    )}
                  </AppText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      );
    }
    return (
      <ScrollView
        alwaysBounceVertical={false}
        style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }}
        contentContainerStyle={styles.mainContainer}
      >
        <AnalyticsTracker
          eventType="myLearningProfile"
          eventData={`:ChooseProfile:`}
        />
        {this.props.currentUser.currentUser !== null ? current_profile : null}
        <AppText
          style={{
            fontWeight: "500",
            padding: 16,
            paddingBottom: 12,
            paddingTop: 24,
            backgroundColor: ColorTheme.SECONDARY,
          }}
        >
          {this.props.currentUser.currentUser != null
            ? this.props.getTextFromCMS("lp:switch_user", "switch user")
            : this.props.getTextFromCMS("lp:choose_user", "choose user")}
        </AppText>
        <View style={{ backgroundColor: ColorTheme.SEPARATOR, height: 1 }} />
        <View>
          <View
            style={{
              backgroundColor: ColorTheme.SECONDARY,
              borderBottomColor: ColorTheme.SEPARATOR,
              borderBottomWidth: 1,
            }}
          >
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderTopWidth: 0,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
              ]}
              onPress={() => this.addUser()}
            >
              <Image
                style={{
                  marginRight: 12,
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                }}
                source={require("../../img/learning_icons/user-add-red.png")}
              />
              <AppText
                style={[styles.profileText, { color: ColorTheme.PRIMARY }]}
              >
                {this.props.screen["lp:add_user"]
                  ? this.props.screen["lp:add_user"]
                  : "add user"}
              </AppText>
            </TouchableOpacity>
            {user_profiles.length > 0 ? (
              user_profiles
            ) : (
              <View style={styles.profileItem}>
                <AppText style={{ color: ColorTheme.SUB_LABEL }}>
                  {this.props.getTextFromCMS(
                    "lp:empty_user_list",
                    "no users avaliable"
                  )}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  addUser() {
    this.props.navigation.navigate("ChooseUserTypeScreen", {
      title: this.props.getTextFromCMS("add_user_title", "add user"),
      fromSettingsScreen: true,
      fromSettingsScreenViewProfile: true,
    });
  }

  login() {
    this.props.navigation.navigate("LoginScreen", {
      title: this.props.getTextFromCMS("add_user_title", "add user"),
      fromSettingsScreen: true,
      fromSettingsScreenViewProfile: true,
    });
  }

  chooseUser(profile_id) {
    // console.log('chooseUser ' + JSON.stringify(profile_id));
    this.props.dispatch(setCurrentUser(profile_id));
    this.props.dispatch(setupNotifications());
    this.props.navigation.pop();
  }

  pressLogout() {
    //Show the Log out dialouge modal
    this.setState({ modalVisible: true });
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    selectedCountry,
    contentByLanguage,
    index,
    selectedMode,
    selectedLearningModule,
    currentUser,
    userProfiles,
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications } = language;

  let user = null;
  if (currentUser.currentUser) user = userProfiles[currentUser.currentUser];

  return {
    selectedLang,
    selectedCountry,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    selectedLearningModule,
    userProfiles,
    currentUser,
    user,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
  };
}

function compareProfileNames(a, b) {
  if (a.profileName == undefined || b.profileName == undefined) {
    return -1;
  }
  if (a.profileName.toLowerCase() < b.profileName.toLowerCase()) {
    return -1;
  }
  if (a.profileName.toLowerCase() > b.profileName.toLowerCase()) {
    return 1;
  } else {
    return 0;
  }
}

export default connect(mapStateToProps)(ChooseProfileScreen);
