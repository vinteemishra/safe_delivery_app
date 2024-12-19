import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ViewStyle,
  ImageStyle,
} from "react-native";
import ColorTheme from "../Constants/ColorTheme";
import AppText from "./AppText";
import * as helpers from "../Utils/helpers";
import fs from "react-native-fs";
import ChoiceQuestion from "./ChoiceQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import OrderQuestion from "./OrderQuestion";
import HintText from "./HintText";
import QuizImage from "./Quiz/QuizImage";
import { CHEAT } from "../Config/config";
import { analytics } from "../Utils/analytics";
let { width, height } = Dimensions.get("window");

interface OwnProps {
  screen: { [key: string]: string };
  engineType: string;
  engineData: any;
  description: string;
  image: string;
  reviewing?: boolean;
  questionIdx: number;
  maxQuestions: number;
  answer: any;
  reviewCommentLinkText?: string;
  reviewCommentColor?: string;
  onChangeAnswer?(answer: any, score: number): void;
  reviewComment?: string;
  caseIdx?: number;
  maxCases?: number;
  onGoToAbout?(): void;
  hasStudyNow?: boolean;
}
export default class LearningPoint extends Component<OwnProps> {
  /**
   * Determine the type of question and assigns the matching component for the answer options.
   * @param engineType
   * @param engineData
   * @param answer
   * @param reviewing
   */
  private renderOptions(
    engineType: string,
    engineData: any,
    answer: any,
    reviewing: boolean
  ) {
    let options = null;

    if (engineType == "oneCorrect")
      options = (
        <ChoiceQuestion
          key={1}
          items={engineData}
          onChangeAnswer={(answer, score) =>
            this.props.onChangeAnswer(answer, score)
          }
          selectedOption={answer}
          disabled={reviewing}
        />
      );
    else if (
      engineType == "severalCorrect" ||
      engineType == "severalCorrectWithResult"
    )
      options = (
        <MultipleChoiceQuestion
          key={2}
          items={engineData}
          onChangeAnswer={(answer, score) =>
            this.props.onChangeAnswer(answer, score)
          }
          selectedOptions={answer}
          disabled={reviewing}
          engineType={engineType}
        />
      );
    else if (engineType == "chooseOrder") {
      let data = engineData.map(
        (item: { value: string; correct: boolean }, index: number) => {
          let value = item.value;
          if (CHEAT) {
            value += `( ${String(index + 1)} )`;
          }
          const obj = Object.assign({}, item, { value: value });
          return obj;
        }
      );
      let order = helpers.shuffleArray(data, false);
      options = (
        <OrderQuestion
          key={3}
          items={data}
          onChangeAnswer={(answer, score) =>
            this.props.onChangeAnswer(answer, score)
          }
          order={answer ? answer : order}
          disabled={reviewing}
        />
      );
    } else {
      console.error("unknown engine type " + engineType);
    }

    return options;
  }
  private getTextFromCMS(screenKey, fallback) {
    return helpers.getTextFromCMS(this.props.screen, screenKey, fallback);
  }

  public render() {
    const {
      screen,
      engineType,
      engineData,
      image,
      reviewing,
      answer,
      reviewCommentLinkText,
      reviewCommentColor,
      reviewComment,
    } = this.props;

    const renderComment = (reviewing) => {
      if (reviewing) {
        return (
          <View
            style={[
              styles.reviewResultBar,
              { backgroundColor: reviewCommentColor },
            ]}
          >
            <AppText style={{ color: ColorTheme.SECONDARY }}>
              {reviewComment}
            </AppText>
            {reviewCommentLinkText && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 1.2,
                  borderBottomColor: ColorTheme.SECONDARY,
                  borderBottomWidth: 1.2,
                }}
                onPress={() => this.goToAbout()}
              >
                <AppText
                  style={{ color: ColorTheme.SECONDARY, fontWeight: "500" }}
                >
                  {reviewCommentLinkText}
                </AppText>
                <Image
                  style={{ height: 10, width: 16, marginLeft: 8 }}
                  source={require("../../img/notification_message/arrow-right.png")}
                />
              </TouchableOpacity>
            )}
          </View>
        );
      } else {
        return (
          <HintText
            style={{ lineHeight: 25, height: 25, fontWeight: "bold" }}
            showHint={false}
          >
            {screen["lp:hint_" + engineType]
              ? screen["lp:hint_" + engineType]
              : "answer the following"}
          </HintText>
        );
      }
    };

    const renderProgressLabel = (
      label: string,
      idx: number,
      maxCount: number,
      bold?: boolean
    ) => (
      <AppText
        style={{
          textAlign: "right",
          fontSize: ColorTheme.FONT_SIZE * 0.8,
          color: ColorTheme.SUB_LABEL,
          fontWeight: bold ? "500" : "300",
        }}
      >
        {label} {idx}/{maxCount}
      </AppText>
    );

    return (
      <View style={{ backgroundColor: ColorTheme.TERTIARY, flex: 1 }}>
        <View style={styles.cardStyle}>
          <QuizImage src={image} />
          <View style={styles.imageOverlay}>
            <View style={{ position: "absolute", top: 10, right: 10 }}>
              {this.props.caseIdx &&
                renderProgressLabel(
                  this.getTextFromCMS("lp:case", "case"),
                  this.props.caseIdx,
                  this.props.maxCases,
                  true
                )}
              {renderProgressLabel(
                this.getTextFromCMS("lp:question", "question"),
                this.props.questionIdx,
                this.props.maxQuestions,
                false
              )}
            </View>
            <AppText
              style={{
                margin: 16,
                fontSize: ColorTheme.FONT_SIZE * 1.1,
                fontWeight: "500",
              }}
            >
              {this.props.description}
            </AppText>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {renderComment(reviewing)}
          {this.renderOptions(engineType, engineData, answer, reviewing)}
        </View>
      </View>
    );
  }

  getShuffledOrder(array) {
    let order = [];
    for (let i = 0; i < array.length; i++) {
      order.push(i);
    }
    let allowSameOrder = false;
    return helpers.shuffleArray(order, allowSameOrder);
  }

  goToAbout() {
    analytics.event("seeWhy", `::`);
    if (this.props.onGoToAbout) this.props.onGoToAbout();
  }
}

interface Style {
  imageOverlay: ViewStyle;
  cardStyle: ViewStyle;
  linkStyle: ViewStyle;
  imageStyle: ImageStyle;
  reviewResultBar: ViewStyle;
}
const styles = StyleSheet.create<Style>({
  imageOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  cardStyle: {
    marginBottom: 8,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 3,
    },
  },
  linkStyle: {
    height: 32,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 3,
    },
  },
  imageStyle: {
    flexGrow: 1,
    width: width < height ? width : height,
    height: width < height ? (width / 16) * 9 : (height / 16) * 9,
  },
  reviewResultBar: {
    height: 50,
    width: width < height ? width : height,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
