import * as React from "react"
import ColorTheme from "../../Constants/ColorTheme";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { StoreState } from "../../Reducers/reducers";
import { NotificationState, Notification } from "../../Reducers/notificationReducer";
import { UserProfileNotification, addNotificationToDevice } from "../../Actions/notificationActions";
import { View, ScrollView, TouchableHighlight } from "react-native";
import ListHeader from "../../Components/ListHeader";
import AppText from "../../Components/AppText";
import { getTextFromCMS } from "../../Utils/helpers";
import moment from "moment";
import fs from 'react-native-fs';

interface OwnProps {

}
interface PropsFromState {
    deviceNotifications: Array<Notification>;
    userProfileNotifications: Array<UserProfileNotification>;
    getTextFromCMS(key: string, fallback: string): string;
}

interface DispatchFromProps {
    addNotification(noti: Notification): void;
}
type Props = OwnProps & PropsFromState & DispatchFromProps;

interface State {
    eventState: Array<any>;
}
class DevAnalyticsScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            eventState: [],
        }
    }
    public componentDidMount() {
        console.log("getAnalyticsData")
        const fn = fs.DocumentDirectoryPath + "/analytics.json";

        fs.readFile(fn).then((content) => {
            const data = JSON.parse(content);
            this.setState({ eventState: data.reverse() });

        })
            .catch((err) => {
                console.log("error", err)
            });
    }
    private renderList(title: string, arrayList: Array<any>) {
        return (<View>
            <ListHeader>{title} ({arrayList.length})</ListHeader>
            {arrayList.map((item: any, index: number) => {
                // let text = this.props.getTextFromCMS(item.headerText.key, item.headerText.fallback);
                console.log("analytics data", item)
                return (

                    <View style={{ padding: 5, backgroundColor: index % 2 === 0 ? ColorTheme.SECONDARY : ColorTheme.SEPARATOR }}>
                        <AppText style={{ fontWeight: "bold" }}>{item.eventType}</AppText>
                        <AppText>{item.eventData}</AppText>
                        <AppText style={{ size: 11, color: "#333" }}>{moment(item.ts).fromNow()} ({item.ts})</AppText>
                    </View>)
            })}
        </View>)
    }
    public render() {
        const { deviceNotifications, userProfileNotifications } = this.props;

        return (
            <ScrollView style={{ flex: 1, backgroundColor: ColorTheme.TERTIARY }}>
                {this.renderList("Analytics log", this.state.eventState)}
            </ScrollView>
        )
    }
}

const mapStateToProps: MapStateToProps<PropsFromState, OwnProps, StoreState> = (state) => {
    const { selectedLang, contentByLanguage } = state;
    const { screen } = contentByLanguage[selectedLang];

    let userProfileNotifications = [];
    if (state.userProfiles[state.currentUser.currentUser]) {
        userProfileNotifications = state.userProfiles[state.currentUser.currentUser].userSpecificNotificationScheduleList;
    }
    return {
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
export default connect(mapStateToProps, mapDispatchToProps)(DevAnalyticsScreen);