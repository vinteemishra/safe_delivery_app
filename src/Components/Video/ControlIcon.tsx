import * as React from "react";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
const icoMoonConfig = require("../../../assets/selection.json");
import { View, ViewStyle, TouchableOpacity } from "react-native";

// Load all image ressources
// import ENTER_FULLSCREEN_IMAGE from "../assets/icons/fullscreen.svg";
// import EXIT_FULLSCREEN_IMAGE from "../assets/icons/exit_fullscreen.svg";
// import GOOGLE_CAST_IMAGE from "../assets/icons/cast.svg";
// import BACK_ARROW_IMAGE from "../assets/icons/back-icon.svg";
// import REPLAY_BUTTON_IMAGE from "../assets/icons/replay.svg";
// import PLAY_BUTTON_IMAGE from "../assets/icons/play.svg";
// import PAUSE_BUTTON_IMAGE from "../assets/icons/pause.svg";

interface OwnProps {
    name: string;
    color?: string;
    size?: number;
    style?: ViewStyle;
    onPress?(): void;
}

// try {
const Icon = createIconSetFromIcoMoon(
    icoMoonConfig
);
// } catch (e) {
//     console.log("error creatingIconSet", e, icoMoonConfig);
// }


export class ControlIcon extends React.Component<OwnProps> {
    public render() {
        const { name, color, size, style, onPress } = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={style}>
                    <Icon name={name} color={color} size={size} />
                </View>
            </TouchableOpacity>
        );
    }
}