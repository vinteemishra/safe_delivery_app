import actionCreatorFactory from "typescript-fsa";
import { RETAKE_EXAM_PREP, DEV_RETAKE_EXAM_PREP, RETAKE_EXAM_UNLOCKED, MY_LEARNING_ENGAGEMENT, DELIVERIES_SURVEY, MY_LEARNING_PROGRESS, EXAM_UNLOCKED, INTRO_MY_LEARNING } from "../Constants/Constants";
import { Notification } from "../Reducers/notificationReducer";

const actionCreator = actionCreatorFactory("notificationsActions");

export type KeyWithFallback = {
    key: string;
    fallback: string;
}

// export interface Notification {
//     notificationType: NotificationType;
//     timeToSchedule: number;
//     headerText: KeyWithFallback;
//     bodyText?: KeyWithFallback;
//     bodyText2?: KeyWithFallback;
//     icon?: IconForNotification;
//     label?: KeyWithFallback;
//     buttonFunction?: NotificationCallback;
// }
export interface UserProfileNotification extends Notification {
    profileId: string;
}

export type IconForNotification = "lock_open" | "certificate" | "success" | "my_learning" | "lock_open_white" | "";
export type NotificationCallback = "Go to preparation" | "Take exam" | "Go to next quiz" | "Get started" | "";
export type NotificationType = "WEEKLY_NOTIFICATION" | RETAKE_EXAM_PREP | RETAKE_EXAM_PREP | DEV_RETAKE_EXAM_PREP | RETAKE_EXAM_UNLOCKED |
    MY_LEARNING_ENGAGEMENT | DELIVERIES_SURVEY | MY_LEARNING_PROGRESS | EXAM_UNLOCKED | INTRO_MY_LEARNING;

export const test = actionCreator("test");
export const setupNotifications = actionCreator("SETUP_NOTIFICATIONS");
export const removeDeviceNotifications = actionCreator("REMOVE_DEVICE_NOTIFICATIONS");
export const setNotificationFireDate = actionCreator<{ idx: string, fireDate?: number }>("SET_NOTIFICATION_FIRE_DATE");

export const addNotificationToUserProfile = actionCreator<UserProfileNotification>("ADD_NOTIFICATION_TO_USER_PROFILE");
export const addNotificationToDevice = actionCreator<Notification>("ADD_NOTIFICATION_TO_DEVICE");
export const updateUserNotificationScheduleList = actionCreator<{ profileId: string, notificationScheduleList: Array<any> }>("UPDATE_USER_NOTIFICATION_SHEDULE_LIST");
export const updateDeviceNotificationScheduleList = actionCreator<Array<any>>("UPDATE_DEVICE_NOTIFICATION_SHEDULE_LIST");

export const resetEngagementNotifications = actionCreator("RESET_ENGAGEMENT_NOTIFICATION");
export const removeProgressNotifications = actionCreator("REMOVE_PROGRESS_NOTIFICATION");