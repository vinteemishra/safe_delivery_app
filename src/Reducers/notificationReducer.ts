import { Action } from "redux";
import { isType } from "typescript-fsa";
import { addNotificationToDevice, NotificationType, KeyWithFallback, IconForNotification, NotificationCallback, removeDeviceNotifications, updateDeviceNotificationScheduleList } from '../Actions/notificationActions';
import { array } from "prop-types";
export type Notification = {
    profileId?: string,
    link?: string;
    notificationType: NotificationType,
    timeToSchedule: number,
    headerText: KeyWithFallback,
    bodyText?: KeyWithFallback,
    bodyText2?: KeyWithFallback,
    icon?: IconForNotification,
    label?: KeyWithFallback,
    buttonFunction?: NotificationCallback
    score?: number;
}

export type WeeklyNotification = {
    header: string;
    body: string;
    link: string;
    id: string;
    timeToSchedule: number;

}
export type NotificationState = Array<Notification>;

const INITIAL_STATE: NotificationState = []

// export const notificationReducer = (state: NotificationState = { ...INITIAL_STATE }, action: Action): NotificationState => {
export const deviceSpecificNotificationScheduleList = (state: NotificationState = INITIAL_STATE, action: Action): NotificationState => {

    if (isType(action, addNotificationToDevice)) {

        //TODO - fix below...
        let newState = [...state];
        newState.push(action.payload);

        return newState;
    }

    if (isType(action, removeDeviceNotifications)) {

        return INITIAL_STATE;

    }

    if (isType(action, updateDeviceNotificationScheduleList)) {
        return action.payload;
    }

    return state;
}