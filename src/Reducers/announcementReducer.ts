import { Action } from "redux";
import { isType } from "typescript-fsa";
import { addNotificationToDevice, NotificationType, KeyWithFallback, IconForNotification, NotificationCallback, removeDeviceNotifications, updateDeviceNotificationScheduleList } from '../Actions/notificationActions';
import { TEST_ANNOUNCEMENTS } from "../Constants/Constants";
import { updateAnnouncements, fetchAnnouncements, failedAnnouncementFetch, invalidateAnnouncementInfo, markAnnouncementAsRead, resetAnnouncementReducer } from "../Actions/announcementActions";
import moment from "moment";

export type Announcement = {
    id: string;
    link: string;
    title: { [key: string]: string };
    body: { [key: string]: string };
    config: {
        aboveLangVersion?: number;
        belowLangVersion?: number;
        beforeTimestamp?: number;
        afterTimestamp?: number;
        aboveAppVersion?: string;
        belowAppVersion?: string;
        language?: string;
    }
}

export type AnnouncementState = {
    currentAnnouncements: Array<Announcement>;
    index?: number,
    lastUpdateTimestamp?: number,
    didInvalidate: boolean,
    isFetching: boolean;
    announcementsMarkedAsRead: Array<string>,
};

const INITIAL_STATE: AnnouncementState = {
    currentAnnouncements: [], // TEST_ANNOUNCEMENTS,
    didInvalidate: true,
    isFetching: false,
    announcementsMarkedAsRead: [],

}

// export const notificationReducer = (state: NotificationState = { ...INITIAL_STATE }, action: Action): NotificationState => {
export const announcementReducer = (state: AnnouncementState = { ...INITIAL_STATE }, action: Action): AnnouncementState => {

    if (isType(action, updateAnnouncements)) {
        let newState = { ...state };
        newState.currentAnnouncements = action.payload;
        newState.isFetching = false;
        newState.didInvalidate = false;
        newState.lastUpdateTimestamp = moment().valueOf();
        return newState;
    }

    if (isType(action, fetchAnnouncements)) {
        let newState = { ...state };
        newState.isFetching = true;
        return newState;
    }

    if (isType(action, failedAnnouncementFetch)) {
        let newState = { ...state };
        newState.isFetching = false;
        return newState;
    }

    if (isType(action, invalidateAnnouncementInfo)) {
        let newState = { ...state };
        newState.didInvalidate = true;
        newState.isFetching = false;
        return newState;
    }

    if (isType(action, markAnnouncementAsRead)) {
        let newState = { ...state };
        newState.announcementsMarkedAsRead = [...newState.announcementsMarkedAsRead, action.payload];
        return newState;
    }

    if (isType(action, resetAnnouncementReducer)) {
        console.log("resetAnnouncement", INITIAL_STATE);
        return { ...INITIAL_STATE };
    }


    return state;
}
