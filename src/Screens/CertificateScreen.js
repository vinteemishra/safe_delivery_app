import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "../Components/AppText";
import { connect } from "react-redux";
import * as helpers from "../Utils/helpers";
import FramedButton from "../Components/FramedButton";
import { openModal } from "../Actions/modalActions";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: width - width / 4,
    borderColor: ColorTheme.PRIMARY,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    flexDirection: "row",
  },
  buttonText: {
    color: ColorTheme.PRIMARY,
  },
  imageStyle: {
    flexGrow: 1,
    width: width < height ? width : height,
    height: width < height ? (width / 16) * 9 : (height / 16) * 9,
  },
  spinner: {
    margin: 16,
    height: 100,
    width: 100,
    color: ColorTheme.SECONDARY,
  },
});

class CertificateScreen extends Component {
  constructor(props) {
    super(props);
    this.certificate = helpers.getContentByLanguageProperty(
      this.props.certificates,
      this.props.language
    )[0];
    this.state = {
      fetchError: "",
      certLayoutWidth: 0,
      ceryLayoutHeight: 0,
    };
  }

  render() {
    let user = this.props.userProfiles[this.props.currentUser];
    const lastCertEntry = user.profileCertificates.length - 1;
    // console.log('render user', user)
    if (user.profileCertificates[lastCertEntry].passed) {
      return this.renderPassed();
    } else {
      return this.renderFailed();
    }
  }

  getCertDates(user) {
    const certDates = [];
    const keys = Object.keys(user.profileCertificates);
    for (const k of keys) {
      if (user.profileCertificates[k].certDate > 0) {
        certDates.push(user.profileCertificates[k].certDate);
      }
    }

    return certDates;
  }

  renderPassed() {
    let user = this.props.userProfiles[this.props.currentUser];
    const lastCertEntry = user.profileCertificates.length - 1;

    let roundedScore = Math.round(
      user.profileCertificates[lastCertEntry].score
    );

    return (
      <View style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
        <ScrollView>
          <AppText
            style={{
              fontWeight: "500",
              fontSize: 20,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            {this.props.screen["lp:congratulations"]
              ? this.props.screen["lp:congratulations"]
              : "congratulations!"}
          </AppText>
          <AppText style={{ margin: 20, marginTop: 10, textAlign: "center" }}>
            {this.props.screen["lp:your_certificate_score"]
              ? this.props.screen["lp:your_certificate_score"]
              : "you got a total score of:"}
          </AppText>
          <AppText
            style={{
              fontSize: ColorTheme.FONT_SIZE * 2,
              margin: 20,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {/* {user.profileCertificates[lastCertEntry].score}% */}
            {roundedScore}%
          </AppText>
          <AppText style={{ margin: 40, marginTop: 20, textAlign: "center" }}>
            {this.props.screen["lp:certificate_unlocked_message"]
              ? this.props.screen["lp:certificate_unlocked_message"]
              : "you have unlocked the Safe Delivery Champion Certificate."}
          </AppText>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FramedButton
              style={styles.button}
              onPress={() => this.claim()}
              label={
                this.props.screen["lp:claim_certificate"]
                  ? this.props.screen["lp:claim_certificate"]
                  : "claim certificate"
              }
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  renderFailed() {
    let user = this.props.userProfiles[this.props.currentUser];
    const lastCertEntry = user.profileCertificates.length - 1;
    let time_passed =
      Date.now() - user.profileCertificates[lastCertEntry].unlockTimestamp;
    days_left = 14 - Math.floor(time_passed / (24 * 60 * 60 * 1000));
    let failed_on_deadly = (
      <AppText style={{ margin: 12, textAlign: "center" }}>
        {this.props.screen["lp:certificate_failed_deadly_message"]
          ? this.props.screen["lp:certificate_failed_deadly_message"]
          : "unfortunately you had too many deadly answers and can therefore not pass"}
      </AppText>
    );
    let failed_on_rating = (
      <AppText style={{ margin: 12, textAlign: "center" }}>
        {this.props.screen["lp:certificate_failed_message"]
          ? this.props.screen["lp:certificate_failed_message"]
          : "you did not score well enough to earn the Safe Delivery Certificate"}
      </AppText>
    );
    let roundedScore = Math.round(
      user.profileCertificates[lastCertEntry].score
    );
    return (
      <View style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
        <ScrollView>
          <AppText
            style={{
              fontWeight: "500",
              fontSize: 20,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            {this.props.screen["lp:certificate_failed_title"]
              ? this.props.screen["lp:certificate_failed_title"]
              : "unfortunate"}
          </AppText>
          {this.props.navigation.state.params.failed_on_deadly ? null : (
            <View>
              <AppText
                style={{ margin: 20, marginTop: 10, textAlign: "center" }}
              >
                {this.props.screen["lp:your_certificate_score"]
                  ? this.props.screen["lp:your_certificate_score"]
                  : "you got a total score of:"}
              </AppText>
              <AppText
                style={{
                  fontSize: ColorTheme.FONT_SIZE * 2,
                  margin: 20,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {roundedScore}%
              </AppText>
            </View>
          )}
          {this.props.navigation.state.params.failed_on_deadly
            ? failed_on_deadly
            : failed_on_rating}
          <AppText style={{ margin: 40, marginTop: 20, textAlign: "center" }}>
            {this.props.screen["lp:certificate_retry_later_message"] &&
            this.props.screen["lp:days"]
              ? this.props.screen["lp:certificate_retry_later_message"] +
                " " +
                days_left +
                " " +
                this.props.screen["lp:days"]
              : `you may try to pass the test again in ${days_left} days.`}
          </AppText>
        </ScrollView>
        <FramedButton
          label={this.props.screen.done ? this.props.screen.done : "done"}
          onPress={() => this.doneTest()}
        />
      </View>
    );
  }

  onLayoutCert(event) {
    this.setState({
      certLayoutWidth: event.nativeEvent.layout.width,
      certLayoutHeight: event.nativeEvent.layout.height,
    });
  }

  claim() {
    this.props.dispatch(
      openModal({
        modalType: "CLAIM_CERTIFICATE",
        modalProps: {
          disableFloatingCloseButton: false,
          disableOnBackDropPress: false,
          user: this.props.user || undefined,
          certId: this.certificate.id,
        },
      })
    );
  }
}

function mapStateToProps(state) {
  const {
    selectedLang,
    contentByLanguage,
    index,
    selectedMode,
    currentUser,
    userProfiles,
  } = state;
  const language = contentByLanguage[selectedLang];
  const { screen, notifications, certificates } = language;

  let user = null;
  if (currentUser.currentUser) {
    user = userProfiles[currentUser.currentUser];
  }

  return {
    certificates,
    selectedLang,
    language,
    screen,
    notifications,
    index,
    selectedMode,
    currentUser: currentUser.currentUser,
    userProfiles,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
    user,
  };
}

export default connect(mapStateToProps)(CertificateScreen);
