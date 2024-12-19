import { Action } from "redux";
import { isType } from "typescript-fsa";
import { syncProfilesStart, syncProfilesDone, syncProfilesFailed, syncProfilesInitial, setLastSyncTimestamp } from "../Actions/syncProfilesActions";
import moment from "moment";

export type SyncProfileState = {
    lastUpdateTimestamp?: number,
    isFetching: boolean;
};

const INITIAL_STATE: SyncProfileState = {
    // lastUpdateTimestamp: 0,
    isFetching: false,
}

export const syncProfilesReducer = (state: SyncProfileState = { ...INITIAL_STATE }, action: Action): SyncProfileState => {

    if (isType(action, syncProfilesStart)) {
        let newState = { ...state };
        newState.isFetching = true;
        return newState;
    }

    if (isType(action, syncProfilesDone)) {
        let newState = { ...state };
        newState.isFetching = false;
        newState.lastUpdateTimestamp = moment().valueOf();
        return newState;
    }

    if (isType(action, setLastSyncTimestamp)) {
        let newState = { ...state };
        newState.lastUpdateTimestamp = action.payload;
        return newState;
    }

    if (isType(action, syncProfilesFailed)) {
        let newState = { ...state };
        newState.isFetching = false;
        return newState;
    }

    if (isType(action, syncProfilesInitial)) {
        let newState = { ...state };
        newState.isFetching = false;
        return newState;
    }

    return state;
}
