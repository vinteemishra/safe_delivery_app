import React, { Component } from "react";
import { connect } from "react-redux";
import RichText from "../Components/RichText";
import AnalyticsTracker from "../Components/AnalyticsTracker";
import { View, Platform, SafeAreaView } from "react-native";
import ZoomableView from "../Components/ZoomableView";
import { FEATURE_FLAGS, hasFeature } from "../Utils/featureFlag";
import { COLOR } from "../Constants/Constants";
import ColorTheme from "../Constants/ColorTheme";

class DrugScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { language, content, selectedLang, id } = this.props;
    const canZoom = hasFeature(FEATURE_FLAGS.ZOOMABLE_VIEWS, selectedLang);

    const drugScreen = (
      <ZoomableView canZoom={canZoom}>
        <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
          <AnalyticsTracker eventType="drug" eventData={`:${id}:`} />
          <RichText language={language} content={content} />
        </View>
      </ZoomableView>
    );

    return Platform.OS === "android" ? (
      drugScreen
    ) : (
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorTheme.PRIMARY }}>
        {drugScreen}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];
  const { screen } = contentByLanguage[selectedLang];
  const { content, id } = props.navigation.state.params;
  return { screen, language, content, id, selectedLang };
}

export default connect(mapStateToProps)(DrugScreen);
