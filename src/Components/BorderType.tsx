import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '../Components/AppText';
import ColorTheme from '../Constants/ColorTheme';

interface OwnProps {
    icon: string;
    headerText: string;
    bodyText: string;
}

export default class BorderType extends Component<OwnProps> {

    render() {
        //The component takes the following props.
        let { icon, headerText, bodyText } = this.props;

        //Return the views and AppText conponent, with above props provided.
        return (
            <View style={styles.containerStyle}>
                <View style={styles.viewStyle}>
                    <AppText style={{ fontSize: ColorTheme.FONT_SIZE * 1.25, paddingBottom: 12 }}>
                        {headerText}
                    </AppText>
                    <AppText style={{ fontSize: ColorTheme.FONT_SIZE, marginRight: 10 }}>
                        {bodyText}
                    </AppText>
                </View>
                <Image source={{ uri: icon }} style={styles.imageStyle} />
            </View>
        )
    }
}

//The code for styling the above elements are placed together here.
const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 12,
        borderBottomColor: ColorTheme.SEPARATOR,
        borderBottomWidth: 1
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        minHeight: 100
    },
    imageStyle: {
        width: 130,
        height: 90,
        margin: 2
    },
})