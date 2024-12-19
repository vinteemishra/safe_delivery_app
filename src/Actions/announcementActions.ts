import actionCreatorFactory from "typescript-fsa";
import { Announcement } from "../Reducers/announcementReducer";

const actionCreator = actionCreatorFactory("announcementActions");

export const fetchAnnouncements = actionCreator("FETCH_ANNOUNCEMENTS");
export const fetchAnnouncementsIfNeeded = actionCreator<string>(
  "FETCH_ANNOUNCEMENTS_IF_NEEDED"
);
export const updateAnnouncements = actionCreator<Announcement[]>(
  "UPDATE_ANNOUNCEMENTS"
);
export const markAnnouncementAsRead = actionCreator<string>(
  "MARK_ANNOUNCEMENT_AS_READ"
);
export const invalidateAnnouncementInfo = actionCreator(
  "INVALIDATE_ANNOUNCEMENT_INFO"
);
export const failedAnnouncementFetch = actionCreator(
  "FAILED_ANNOUNCEMENT_FETCH"
);

export const resetAnnouncementReducer = actionCreator(
  "RESET_ANNOUNCEMENT_REDUCER"
);

export const showPendingAnnouncement = actionCreator(
  "SHOW_PENDING_ANNOUNCEMENT"
);
