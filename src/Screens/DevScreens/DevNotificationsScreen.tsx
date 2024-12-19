import * as React from "react"
import ColorTheme from "../../Constants/ColorTheme";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { StoreState } from "../../Reducers/reducers";
import { NotificationState, Notification } from "../../Reducers/notificationReducer";
import { UserProfileNotification, addNotificationToDevice, NotificationType } from "../../Actions/notificationActions";
import { View, ScrollView, TouchableHighlight } from "react-native";
import ListHeader from "../../Components/ListHeader";
import AppText from "../../Components/AppText";
import { getTextFromCMS } from "../../Utils/helpers";
import moment from "moment";
import { scheduleNotification } from "../../Utils/notifications";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { BundleNotification } from "../../Reducers/contentReducer";

interface OwnProps {

}

interface PropsFromState {
    deviceNotifications: Array<Notification>;
    userProfileNotifications: Array<UserProfileNotification>;
    getTextFromCMS(key: string, fallback: string): string;
    allWeeklyNotifications: Array<BundleNotification>;
}

interface DispatchFromProps {
    addNotification(noti: Notification): void;
}

type Props = OwnProps & PropsFromState & DispatchFromProps;

class DevNotificationsScreen extends React.Component<Props> {

    private renderList(title: string, arrayList: Array<Notification | BundleNotification>) {

        const { addNotification } = this.props;
        return (
            <View>
                <ListHeader>{title} ({arrayList.length})</ListHeader>
                {arrayList.map((item: Notification, index: number) => {
                    const header = item.notificationType ? item.notificationType : `(${index + 1})`
                    const weeklyNotification: NotificationType = "WEEKLY_NOTIFICATION"
                    {/*
                 //@ts-ignore*/}
                    const mItem = item.headerText ? { ...item } : { ...item, headerText: item.longDescription, notificationType: weeklyNotification };
                    // let text = this.props.getTextFromCMS(item.headerText.key, item.headerText.fallback);
                    const link_prefix = item.link ? item.link.split(":")[0] : undefined
                    return (
                        <TouchableHighlight key={`noti_${title}_${index}`} onPress={() => {
                            const time = moment().add(300, "millisecond")
                            console.log("DNL - time", time.toDate(), time.valueOf())
                            addNotification({ ...mItem, timeToSchedule: time.valueOf() })
                        }}>
                            <View style={{ padding: 10, backgroundColor: index % 2 ? "lightgray" : "white" }}>
                                {link_prefix ? <View style={{ flexDirection: "row" }}>
                                    <AppText>{header}</AppText><AppText>{` (link: ${link_prefix})`}</AppText>
                                </View> : null}
                                <AppText>{moment(item.timeToSchedule).format("DD-MM-YYYY-HH:mm")}</AppText>
                            </View>
                        </TouchableHighlight>
                    )
                })}
            </View>
        )
    }

    public render() {
        const { deviceNotifications, userProfileNotifications, allWeeklyNotifications } = this.props;
        return (
            <ScrollableTabView style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
                {/*
                 //@ts-ignore*/}
                <ScrollView tabLabel="scheduled">
                    {this.renderList("Notifications saved on device", deviceNotifications)}
                    {this.renderList("Notifications saved on User profile", userProfileNotifications)}
                </ScrollView>
                {/* 
                //@ts-ignore */}
                <ScrollView tabLabel="all weekly">
                    {this.renderList("All weekly notifications in language version", allWeeklyNotifications)}
                </ScrollView>
            </ScrollableTabView>
        )
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state) => {

    const { selectedLang, contentByLanguage } = state;
    const { screen, notifications } = contentByLanguage[selectedLang];

    let userProfileNotifications = [];

    if (state.userProfiles[state.currentUser.currentUser]) {
        userProfileNotifications = state.userProfiles[state.currentUser.currentUser].userSpecificNotificationScheduleList;
    }

    return {
        allWeeklyNotifications: notifications,
        deviceNotifications: state.deviceSpecificNotificationScheduleList,
        userProfileNotifications: userProfileNotifications,
        getTextFromCMS: (screenKey, fallback) => getTextFromCMS(screen, screenKey, fallback),

    };

}

const mapDispatchToProps: MapDispatchToProps<DispatchFromProps, OwnProps> = (dispatch) => {
    return {
        addNotification: (noti) => {
            console.log("addNotificatioFromSettings")
            dispatch(addNotificationToDevice(noti));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevNotificationsScreen);