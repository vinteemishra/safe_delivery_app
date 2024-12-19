import * as React from "react";
import { createStackNavigator } from "react-navigation-stack";
import NotificationRichTextScreen from "./NotificationRichTextScreen";
import ActioncardScreen from "./ActioncardScreen";
import ChapterOptionScreen from "./ChapterOptionScreen";

interface OwnProps {
    navigation: any
}
export default class NotificationLinkStack extends React.Component<OwnProps>{

    private createMainStack = (initialRouteName) => (
        createStackNavigator({
            NotificationRichText: {
                screen: ActioncardScreen,
                navigationOptions: ({ navigation }) => ({
                    // headerRight: <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.pop() }} />,
                }),
            },
            NotificationChapterOption: {
                screen: ChapterOptionScreen,
                navigationOptions: ({ navigation }) => ({
                    // headerRight: <RightHeaderButton source={require('../img/notification_message/close.png')} onPress={() => { navigation.pop() }} />,
                }),
            }
        }, {
            initialRouteName,
        })
    )

    public render() {
        const StackRoot = this.createMainStack("NotificationRichText");
        return (
            <StackRoot />
        )
    }
}
