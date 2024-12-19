import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import ListItem from "../Components/ListItem";
import ColorTheme from "../Constants/ColorTheme";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import * as helpers from "../Utils/helpers";

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: ColorTheme.TERTIARY,
  },
});

class ChapterOptionScreen extends React.Component {
  // static navigatorButtons = {
  //     rightButtons: [
  //         {
  //             // title: this.props.getTextFromCMS('drug_title', 'drugs'),
  //             icon: require('../../img/nav_icons/drugs_selected.png'),
  //             id: 'drugs'
  //         },
  //     ]
  // };

  constructor(props) {
    super(props);
  }

  onOptionPressed(
    property,
    contentType,
    index,
    id,
    fromNotification,
    fromMyLearning
  ) {
    console.log("onOptionPressed", property);
    this.props.navigation.navigate(
      fromNotification
        ? "NotificationRichText"
        : fromMyLearning
        ? "QuizReviewLearnMore"
        : "ActioncardScreen",
      {
        title: property.description,
        content: property.content,
        contentType,
        index,
        id,
        chapterId: property.id,
      }
    );
  }

  assignColor(index) {
    if (index == 0) {
      return "green";
    } else if (index == 1) {
      return "orange";
    } else if (index == 2) {
      return "red";
    } else return undefined;
  }

  assignNewColor(index) {
    if (index == 0) {
      return "#F3C213";
    } else if (index == 1) {
      return "#EA703C";
    } else if (index == 2) {
      return "#D74545";
    } else {
      return undefined;
    }
  }

  assignHBBColor(index) {
    if (index == 0) {
      return "grey";
    } else if (index == 1) {
      return "green";
    } else if (index == 2) {
      return "orange";
    } else if (index == 3) {
      return "red";
    } else {
      return undefined;
    }
  }

  getBackgroundColorFromId(id) {
    switch (id) {
      case "management-hypertension_1486815930026":
        return this.assignColor;
      case "management-hypertension-new_1597327534878":
        return this.assignNewColor;
      case "hbb---neonatal-resuscitation_1599724439603":
        return this.assignHBBColor;
      default:
        return (v) => undefined;
    }
  }

  render() {
    const { content, lang, id, contentType } = this.props;
    // console.log('id: ', id, "content:", content, "navigation state", this.props.navigation.state)
    const fromNotification =
      this.props.navigation.state.routeName === "NotificationChapterOption";
    const fromMyLearning =
      this.props.navigation.state.routeName ===
      "QuizReviewLearnMoreChapterOptions";
    const getBackgroundColor = this.getBackgroundColorFromId(id);
    const menu = content
      ? content.map((item, index) => {
          console.log("menu", item);
          const backgroundColor = getBackgroundColor(index);
          // if (id.includes('management-hypertension')) {
          //     const backgroundColor = id.includes("management-hypertension-new") ? this.assignNewColor(index) : this.assignColor(index)
          //     return <ListItem key={index} backgroundColor={backgroundColor} onPress={() => this.onOptionPressed(item, contentType, index, id, fromNotification)}>{item.description}</ListItem>
          // }
          return (
            <ListItem
              key={index}
              backgroundColor={backgroundColor}
              onPress={() =>
                this.onOptionPressed(
                  item,
                  contentType,
                  index,
                  id,
                  fromNotification,
                  fromMyLearning
                )
              }
            >
              {item.description}
            </ListItem>
          );
        })
      : null;

    return (
      <ScrollView style={styles.mainContainer} alwaysBounceVertical={false}>
        <AnalyticsTracker
          eventType="chapterList"
          eventData={`:${this.props.id}:`}
        />
        {menu}
      </ScrollView>
    );
  }
}
ChapterOptionScreen.propTypes = {};

function mapStateToProps(state, props) {
  console.log("chapterOptionScreen", props);
  const params = props.navigation.state.params;
  const content = params ? params.content : undefined;
  const id = params ? params.id : undefined;
  const contentType = params ? params.contentType : undefined;
  const { selectedLang, contentByLanguage } = state;
  const lang = contentByLanguage[selectedLang] || {};
  const { screen } = contentByLanguage[selectedLang];

  return {
    content,
    lang,
    screen,
    id,
    contentType,
    getTextFromCMS: (screenKey, fallback) =>
      helpers.getTextFromCMS(screen, screenKey, fallback),
  };
}

export default connect(mapStateToProps)(ChapterOptionScreen);
