import React, { Component } from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import AppText from "../Components/AppText";
import * as helpers from "../Utils/helpers";
import FramedButton from "../Components/FramedButton";
import CertificateTimerCounter from "../Components/CertificateTimerCounter";
import ScoreCircle from "../Components/ScoreCircle";
import NavigationService from "./NavigationService";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { analytics } from "../Utils/analytics";
import ColorTheme from "../Constants/ColorTheme";

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  imageStyle: {
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: ColorTheme.FONT_SIZE,
    textAlign: "center",
    marginTop: 12,
  },
  absoluteStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default class NotificationsModal extends Component {
  constructor(props) {
    super(props);
    this.certificate = helpers.getContentByLanguageProperty(
      this.props.certificates,
      this.props.language
    )[0];
    this.state = {
      certLayoutWidth: 0,
      ceryLayoutHeight: 0,
      atZero: false,
    };
  }

  componentDidMount() {
    analytics.event("notifications", `::`);
  }

  onLayoutCert(event) {
    this.setState({
      certLayoutWidth: event.nativeEvent.layout.width,
      certLayoutHeight: event.nativeEvent.layout.height,
    });
  }

  renderImage(icon) {
    //If the certificate picture is sent with props, then the size needs to by bigger than default.

    if (icon === "certificate") {
      iconWidth = 150;
      iconHeight = 200;
    } else if (
      icon == "my_learning" ||
      icon === "success" ||
      icon === "lock_open"
    ) {
      absuluteWidht = 70;
      absoluteHeight = 70;
    } else if (icon == "lock_open_white") {
      absuluteWidht = 55;
      absoluteHeight = 55;
    }
    // else if (icon == "lock_open") {
    //     absuluteWidht = 55;
    //     absoluteHeight = 55;
    // }
    else {
      iconWidth = 120;
      iconHeight = 120;
    }

    if (icon === "my_learning" || icon === "lock_open_white") {
      //Create the overlay icon, with a full red circle and a icon on top of that.
      return (
        <View>
          <ImageBackground
            style={{ width: iconWidth, height: iconHeight }}
            key={1}
            source={{ uri: "cert_score_white_full" }}
          >
            <View style={styles.absoluteStyle}>
              <Image
                source={{ uri: icon }}
                style={[
                  styles.imageStyle,
                  { height: absoluteHeight, width: absuluteWidht },
                ]}
              />
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      if (icon === "success") {
        return (
          <Image
            source={require("../../img/learning_icons/success.png")}
            style={[
              styles.imageStyle,
              { height: absoluteHeight, width: absuluteWidht },
            ]}
          />
        );
      }
      if (icon === "certificate") {
        return (
          <Image
            source={require("../../img/learning_icons/certificate.png")}
            style={[
              styles.imageStyle,
              { height: iconWidth, width: iconHeight },
            ]}
          />
        );
      }
      if (icon === "lock_open") {
        return (
          <Image
            source={{ uri: icon }}
            style={[
              styles.imageStyle,
              { height: absoluteHeight, width: absuluteWidht },
            ]}
          />
        );
      } else {
        return (
          <Image
            source={{ uri: icon }}
            style={[
              styles.imageStyle,
              { height: iconWidth, width: iconHeight },
            ]}
          />
        );
      }
    }
  }

  render() {
    let {
      icon,
      headerText,
      bodyText,
      bodyText2,
      label,
      buttonFunction,
      time_left_in_seconds,
      score,
    } = this.props;

    if (time_left_in_seconds <= 0) {
      time_left_in_seconds = 0;
    }

    if (icon === "certificate") {
      iconWidth = 200;
      iconHeight = 200;
    } else {
      iconWidth = 100;
      iconHeight = 100;
    }

    return (
      <View
        style={{}}
        onPress={() => {
          console.log("View press");
        }}
      >
        {/* <AnalyticsTracker eventType="notifications" eventData={`::`} /> */}
        <View
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 5,
            borderColor: ColorTheme.WHITE,
          }}
        >
          <View style={{ margin: 20, width: "90%" }}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              {icon === undefined ? null : this.renderImage(icon)}
              {/* {time_left_in_seconds == undefined || time_left_in_seconds <= 0 ? null :
                                <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                    <ScoreCircle score={(score)} width={(120)} height={(120)} fontSize={(24)} />
                                    <CertificateTimerCounter days_left_in_seconds={time_left_in_seconds} handelZero={() => this.setState({ atZero: true })}></CertificateTimerCounter>
                                </View>} */}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {score == undefined || score <= 0 ? null : (
                  <ScoreCircle
                    score={score}
                    width={120}
                    height={120}
                    fontSize={24}
                  />
                )}
                {/* {time_left_in_seconds == undefined || time_left_in_seconds <= 0 ? null : <CertificateTimerCounter days_left_in_seconds={time_left_in_seconds} handelZero={() => this.setState({ atZero: true })}></CertificateTimerCounter>} */}
              </View>
              {/* {score >= 50 && score <= 52 ? <ScoreCircle score={(score)} width={(100)} height={(100)} fontSize={(22)} /> : null}
                            {score >= 90 && score < 100 ? <ScoreCircle score={(score)} width={(100)} height={(100)} fontSize={(22)} /> : null} */}
              <AppText
                style={[
                  styles.textStyle,
                  { fontWeight: "bold", fontSize: ColorTheme.FONT_SIZE * 1.25 },
                ]}
              >
                {headerText}
              </AppText>
              <AppText style={[styles.textStyle, {}]}>{bodyText}</AppText>
              <AppText style={[styles.textStyle, {}]}>{bodyText2}</AppText>
              {buttonFunction == undefined ? null : (
                <FramedButton
                  label={label}
                  style={[, { maxWidth: 200, marginBottom: -16 }]}
                  onPress={() => this.bottomFunctions(buttonFunction)}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  bottomFunctions(bottomFunction) {
    switch (bottomFunction) {
      case "Take exam":
        this.onClose();
        setTimeout(() => {
          this.goToCertificateTest();
        }, 300);
        break;
      case "Go to next quiz":
        this.onClose();
        setTimeout(() => {
          this.goToLearningScreen();
        }, 300);
        // this.goToLearningScreen();
        break;
      case "Get started":
        this.onClose();
        setTimeout(() => {
          this.goToLearningScreen();
        }, 300);
        // this.goToLearningScreen();
        break;
      case "Go to preparation": //This funcition need to be looked at. The push function is not working, and if using showModal then it opens over the tab bar!
        this.onClose();
        setTimeout(() => {
          this.goToCertificateCentral();
        }, 300);
        // this.goToCertificateCentral();
        break;
      default:
        break;
    }
  }

  onClose() {
    this.props.onRequestClose();
  }

  goToLearningScreen() {
    NavigationService.navigate("MyLearningHome", {});
  }

  goToCertificateTest() {
    NavigationService.navigate("CertIntro", {
      certId: "certificate-2017_1503996242450",
    });
  }

  goToCertificateCentral() {
    NavigationService.navigate("CertificateCentralScreen", {
      title: helpers.getTextFromCMS(
        "lp:certificate_center_title",
        "certification center"
      ),
    });
  }
}
