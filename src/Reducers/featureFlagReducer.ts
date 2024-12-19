import { Action } from "redux";
import { isType } from "typescript-fsa";
import moment from "moment";
import { failedFeatureFlagFetch, fetchFeatureFlag, invalidateFeatureFlagInfo, successFeatureFlagFetch } from "../Actions/featureFlagActions";

export type FeatureFlagResultType = {
    flags: FeatureFlags;
    version: number;
}
export type FeatureFlags = {
    [key: string]: {
        needsWhitelist: boolean;
        whitelist: Array<string>;
    }
}
export type FeatureFlagState = {
    didInvalidate: boolean;
    isFetching: boolean;
    version: number;
    flags: FeatureFlags;
    lastUpdateTimestamp?: number;
}



const INITIAL_STATE: FeatureFlagState = {
    version: 1,
    didInvalidate: true,
    isFetching: false,
    flags: {}

}

// export const notificationReducer = (state: NotificationState = { ...INITIAL_STATE }, action: Action): NotificationState => {
export const featureFlagReducer = (state: FeatureFlagState = { ...INITIAL_STATE }, action: Action): FeatureFlagState => {

    if (isType(action, successFeatureFlagFetch)) {
        let newState = { ...state };
        newState.flags = action.payload.flags;
        newState.version = action.payload.version;
        newState.isFetching = false;
        newState.didInvalidate = false;
        newState.lastUpdateTimestamp = moment().valueOf();
        return newState;
    }

    if (isType(action, fetchFeatureFlag)) {
        let newState = { ...state };
        newState.isFetching = true;
        return newState;
    }

    if (isType(action, failedFeatureFlagFetch)) {
        let newState = { ...state };
        newState.isFetching = false;
        return newState;
    }

    if (isType(action, invalidateFeatureFlagInfo)) {
        let newState = { ...state };
        newState.didInvalidate = true;
        newState.isFetching = false;
        return newState;
    }

    return state;
}
