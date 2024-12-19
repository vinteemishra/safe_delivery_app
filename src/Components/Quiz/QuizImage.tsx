import * as React from "react"
import { Image, StyleSheet, Dimensions } from "react-native";
import fs from 'react-native-fs';
import { getArrayItem } from "../../Utils/helpers";

const { width, height } = Dimensions.get("window");
interface OwnProps {
    src: string;
}

export default class QuizImage extends React.Component<OwnProps> {
    public render() {
        const { src } = this.props;
        let url = "placeholder_module";
        if (src != undefined && src !== "") {
            url = 'file://' + fs.DocumentDirectoryPath + encodeURI(src)
        }
        return (
            <Image source={{ uri: url }}
                resizeMode='contain'
                style={styles.imageStyle}>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: (width < height) ? width : height,
        height: (width < height) ? width / 16 * 9 : height / 16 * 9,
    },
});