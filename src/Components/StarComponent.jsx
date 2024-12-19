import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import STAR from "../../img/stars/star.png";
import STAR_SELECTED from "../../img/stars/star-selected.png";

class StarComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { rating, setRating } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {[1, 2, 3, 4, 5].map((el) => (
          <TouchableOpacity key={el} onPress={() => setRating(el)}>
            <Image
              source={el <= rating ? STAR_SELECTED : STAR}
              style={{ width: 40, height: 40, marginLeft: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

export default StarComponent;
