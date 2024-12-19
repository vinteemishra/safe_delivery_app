import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("syncProfilesActions");

export const syncProfilesStart = actionCreator("SYNC_PROFILES_START");
export const syncProfilesDone = actionCreator("SYNC_PROFILES_DONE");
export const syncProfilesFailed = actionCreator("SYNC_PROFILES_FAILED");
export const syncProfilesInitial = actionCreator("SYNC_PROFILES_INITIAL");
export const setLastSyncTimestamp = actionCreator<number>("SET_LAST_SYNC_TIMESTAMP");