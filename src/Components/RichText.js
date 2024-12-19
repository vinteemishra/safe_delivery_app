import React from "react";
import { ScrollView, StyleSheet, Text, Linking, View } from "react-native";
import fs from "react-native-fs";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import ColorTheme from "../Constants/ColorTheme";
import * as helpers from "../Utils/helpers";
import { getFont } from "../Utils/helpers";
import ActioncardImportantText from "./Actioncard/ActioncardImportantText";
import ActioncardParagraph from "./Actioncard/ActioncardParagraph";
import CardText from "./CardText";
import ScaleImage from "./ScaleImage";
import Icon from "react-native-vector-icons/FontAwesome";
import { closeModal, openModal } from "../Actions/modalActions";
import { analytics } from "../Utils/analytics";

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.SECONDARY,
  },
  contentContainerStyle: {
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 10,
  },
  image: {
    width: 300,
    height: 300,
    paddingBottom: 0,
    alignSelf: "center",
  },
});

class RichText extends React.Component {
  singleListRenderer = (
    htmlAttribs,
    children,
    convertedCSSStyle,
    passProps
  ) => {
    try {
      const wrappedChildren = children.map((c) => {
        const childType = typeof c.props.children;
        if (childType === "string") {
          return (
            <CardText key={c.key} style={{ flex: 1, flexWrap: "wrap" }}>
              {c}
            </CardText>
          );
        } else {
          return c;
        }
      });
      return <View>{wrappedChildren}</View>;
    } catch (e) {
      console.warn("Couldn't get children types - using fallback");
      return <View>{children}</View>;
    }
  };

  onExternalLinkPress(url) {
    const { getTextFromCMS } = this.props;
    const warningTitle = getTextFromCMS("external_link", "External link");
    const warningBody = getTextFromCMS(
      "leaving_sda_warning",
      "You are about to leave Safe Delivery App."
    );
    const buttonLabel = getTextFromCMS("accept", "Accept");

    analytics.event("pressedLink", `:${url}:external:`);
    this.props.externalLinkWarning(url, warningTitle, warningBody, buttonLabel);
  }
  onInternalLinkPress(url) {
    analytics.event("pressedLink", `:${url}:internal:`);
    Linking.openURL(url);
  }
  render() {
    const { language, content, images } = this.props;

    const tagsStyles = () => ({
      h1: {
        marginBottom: 10,
        marginTop: 10,
        letterSpacing: 1.2,
        fontWeight: "bold",
        fontSize: ColorTheme.FONT_SIZE * 1.1,
        textAlign: this.props.centered ? "center" : "left",
        color:
          this.props.color != undefined ? this.props.color : ColorTheme.TEXT,
        fontFamily: this.props.normal ? getFont() : getFont("serif"),
      },
      h2: {
        marginBottom: 10,
        letterSpacing: 1.2,
        fontWeight: "bold",
        fontSize: ColorTheme.FONT_SIZE * 1,
        textAlign: this.props.centered ? "center" : "left",
        color:
          this.props.color != undefined ? this.props.color : ColorTheme.TEXT,
        fontFamily: this.props.normal ? getFont() : getFont("serif"),
      },
      h3: {
        marginBottom: 10,
        marginTop: 10,
        letterSpacing: 1.2,
        fontWeight: "bold",
        fontSize: ColorTheme.FONT_SIZE * 1,
        textAlign: this.props.centered ? "center" : "left",
        color: ColorTheme.HIGHLIGHTED,
        fontFamily: this.props.normal ? getFont() : getFont("serif"),
      },
    });

    const renderers = {
      span: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        if (htmlAttribs.color) {
          let color = htmlAttribs.color.toUpperCase();
          return (
            <ActioncardParagraph
              bold={htmlAttribs.bold}
              color={ColorTheme[color]}
            >
              {children}
            </ActioncardParagraph>
          );
        } else {
          var fontMultiplyer = 1.5;
          if (passProps.parentTagName == "h1") {
            fontMultiplyer = 2;
          } else if (passProps.parentTagName == "h2") {
            fontMultiplyer = 1.7;
          }
          return (
            <Text
              style={{
                fontSize: ColorTheme.FONT_SIZE * fontMultiplyer,
                marginBottom: 20,
              }}
            >
              {children}
            </Text>
          );
        }
      },
      img: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        let item = helpers.getArrayItem(htmlAttribs.src, images);
        let src = item && item.hasOwnProperty("src") ? item.src : "";
        let dir = "file://" + fs.DocumentDirectoryPath + encodeURI(src);
        // return <View><Text>Toast</Text></View>
        return <ScaleImage imageUrl={dir} />;
      },
      important: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        return (
          <ActioncardImportantText color={"red"} italic={htmlAttribs.italic}>
            {children}
          </ActioncardImportantText>
        );
      },
      li: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        if (passProps.parentTag == "ol")
          return (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "flex-start",
              }}
            >
              {/* <CardText style={{ paddingRight: 4, flexShrink: 0 }} color={ColorTheme.BLACK}>{passProps.groupInfo.index + 1 + '.'}</CardText> */}
              <CardText style={{ paddingRight: 4 }} color={ColorTheme.BLACK}>
                {passProps.nodeIndex + 1 + "."}
              </CardText>
              <CardText style={{ flex: 1, flexWrap: "wrap" }}>
                {children}
              </CardText>
            </View>
          );
        else
          return (
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <CardText style={{ paddingRight: 4 }} color={ColorTheme.BLACK}>
                {"•"}
              </CardText>
              <CardText style={{ flex: 1, flexWrap: "wrap" }}>
                {children}
              </CardText>
            </View>
          );
      },
      ol: this.singleListRenderer,
      ul: this.singleListRenderer,
      br: () => {
        return <Text>{"\n"}</Text>;
      },
      hr: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        return (
          <View
            style={{
              height: 1,
              margin: 8,
              backgroundColor:
                typeof htmlAttribs.noshade !== "undefined"
                  ? "transparent"
                  : ColorTheme.SEPARATOR,
            }}
          />
        );
      },
      table: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        //table
        return (
          <View
            style={{
              flexGrow: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              marginTop: 16,
              marginBottom: 16,
            }}
            {...passProps}
          >
            {children}
          </View>
        );
      },
      tbody: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        return (
          <View style={{ flex: 1 }} {...passProps}>
            {children}
          </View>
        );
      },
      tr: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        return (
          <View
            style={{ flex: 1, flexDirection: "row", borderTopWidth: 1 }}
            {...passProps}
          >
            {children}
          </View>
        );
      },
      th: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              borderLeftWidth: 1,
              padding: 1,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
            {...passProps}
          >
            {children}
          </View>
        );
      },
      td: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        //Table
        return (
          <View {...passProps} style={{ flex: 1, borderLeftWidth: 1 }}>
            {children}
          </View>
        );
      },
      div: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        if (!htmlAttribs.class) {
          let style = { fontSize: 11, padding: 2, paddingLeft: 4 };
          if (passProps.parentTagName == "th") style.textAlign = "center";
          if (htmlAttribs.highlighted == "true") style.color = "blue";
          if (htmlAttribs.bold == "true") style.fontWeight = "bold";
          console.log("children div", children);
          return <CardText style={style}>{children}</CardText>;
        } else {
          switch (htmlAttribs.class) {
            case "formula":
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {children}
                </View>
              );
            case "problem":
              return (
                <View style={{ flex: 1, flexDirection: "row" }}>
                  {children}
                </View>
              );
            case "fraction":
              return <View style={{ display: "flex" }}>{children}</View>;
            case "fractionline":
              return (
                <View
                  style={{ height: 1, backgroundColor: ColorTheme.BLACK }}
                />
              );
            case "subtraction":
              return (
                <View
                  style={{
                    paddingLeft: 8,
                    paddingBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardText style={{ fontSize: ColorTheme.FONT_SIZE * 1.7 }}>
                    {children}
                  </CardText>
                </View>
              );
            case "denominator":
              return (
                <CardText style={{ textAlign: "center", margin: 2 }}>
                  {children}
                </CardText>
              );
            case "equal":
              return (
                <CardText style={{ textAlign: "center", margin: 4 }}>
                  {children}
                </CardText>
              );
            case "result":
              return (
                <CardText style={{ textAlign: "center", fontWeight: "bold" }}>
                  {children}
                </CardText>
              );
            default:
              return (
                <CardText style={{ textAlign: "center", margin: 2 }}>
                  {children}
                </CardText>
              );
          }
        }
      },
      p: (htmlAttribs, children, convertedCSSStyle, passProps) => {
        if (
          htmlAttribs.class == "link" &&
          htmlAttribs["href"] &&
          htmlAttribs["data-text"]
        ) {
          if (htmlAttribs["href"].includes("safedelivery://")) {
            return (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    color: ColorTheme.HIGHLIGHTED,
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                  }}
                  onPress={() => this.onInternalLinkPress(htmlAttribs["href"])}
                >
                  {htmlAttribs["data-text"]}
                </Text>
              </View>
            );
          }

          return (
            <View
              style={{
                marginBottom: 12,
                flexDirection: "row",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: ColorTheme.HIGHLIGHTED,
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                }}
                // onPress={() => Linking.openURL(htmlAttribs["href"])}
                onPress={() => this.onExternalLinkPress(htmlAttribs["href"])}
              >
                {htmlAttribs["data-text"]}
              </Text>
              <Icon
                style={{ paddingTop: 2, paddingLeft: 10 }}
                name="external-link"
                size={16}
                color={ColorTheme.HIGHLIGHTED}
              />
            </View>
          );
        }

        if (
          htmlAttribs.class == "denominator" ||
          htmlAttribs.class == "numerator"
        ) {
          return <CardText>{children}</CardText>;
        }

        return (
          <CardText
            style={{
              marginBottom: 8,
              textAlign: this.props.centered ? "center" : "auto",
            }}
          >
            {children}
          </CardText>
        );
      },
    };
    console.log("html content", content);
    return (
      <ScrollView
        style={styles.container}
        alwaysBounceVertical={false}
        contentContainerStyle={[
          styles.contentContainerStyle,
          { justifyContent: this.props.centered ? "center" : "flex-start" },
        ]}
      >
        <HTML
          tagsStyles={tagsStyles()}
          html={content}
          renderers={renderers}
          ignoredTags={[]}
        />
        {/* This allows for extra components in the scroll view after the Rich Text area */}
        {this.props.extraComponent && this.props.extraComponent}
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const { selectedLang, contentByLanguage } = state;
  const { images, screen } = contentByLanguage[selectedLang];

  return {
    images,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    externalLinkWarning: (url, title, body, buttonLabel) => {
      dispatch(
        openModal({
          modalType: "EXTERNAL_LINK_WARNING",
          modalProps: {
            title,
            body,
            label: buttonLabel,
            buttonFunction: () => {
              Linking.openURL(url);
              analytics.event("externalLinkWarning", ":accept:");
              dispatch(closeModal());
            },
            onCloseModal: () => {
              analytics.event("externalLinkWarning", ":decline:");
            },
          },
        })
      );
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RichText);
