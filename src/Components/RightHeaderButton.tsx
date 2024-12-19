import * as React from "react";
import {
  View,
  Image,
  ImagePropertiesSourceOptions,
  TouchableOpacity,
} from "react-native";
import { MapStateToProps } from "../../node_modules/@types/react-redux/index";
import { connect } from "react-redux";

interface OwnProps {
  source: ImagePropertiesSourceOptions;
  screenKey?: string;
  onPress(title: string): void;
}

interface PropsFromState {
  screen: string;
}

type Props = PropsFromState & OwnProps;
class RightHeaderButton extends React.Component<Props> {
  render() {
    var imageWidth = 40;
    var imageHeight = 40;

    switch (this.props.screenKey) {
      case "users_title":
        imageWidth = 25;
        imageHeight = 25;
        break;
      case "drug_title":
        imageWidth = 35;
        imageHeight = 35;
        break;
      default:
        imageWidth = 12.5;
        imageHeight = 12.5;
        break;
    }

    return (
      <View>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() =>
            this.props.onPress(
              this.props.screenKey !== undefined &&
                this.props.screen[this.props.screenKey]
                ? this.props.screen[this.props.screenKey]
                : ""
            )
          }
        >
          <Image
            source={this.props.source}
            style={{
              marginRight: 6,
              width: imageWidth,
              height: imageHeight,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, any> = (
  state,
  props
) => {
  const { selectedLang, contentByLanguage } = state;
  const { screen } = contentByLanguage[selectedLang];

  return {
    screen: screen,
  };
};

export default connect(mapStateToProps)(RightHeaderButton);
