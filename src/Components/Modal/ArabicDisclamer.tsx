import * as React from "react";
import { View } from "react-native";
import ColorTheme from "../../Constants/ColorTheme";
import AppText from "../AppText";

class ArabicDisclamer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ padding: 20 }}>
        <AppText
          style={{
            fontSize: ColorTheme.FONT_SIZE * 1.1,
            textAlign: "center",
            marginBottom: 15,
            fontWeight: "bold",
          }}
        >
          Disclamer
        </AppText>
        <AppText>
          تحتوي هذه الوحدات على إرشادات سريرية معترف بها دوليًا حول الموضوعات
          المتعلقة بالوقاية من حالات الطوارئ المتعلقة بالأمهات والأطفال حديثي
          الولادة وإدارتها. ومع ذلك، يجب أن تتصرف وفقًا للإرشادات والبروتوكولات
          الوطنية في مركز العمل الخاص بك ، ويجب ألا تقوم إلا بتنفيذ الإجراءات
          التي لديك ترخيص بها في ذلك البلد.
        </AppText>
      </View>
    );
  }
}
export default ArabicDisclamer;
