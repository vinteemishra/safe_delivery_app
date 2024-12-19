import { getStoredState } from "redux-persist";
import { AsyncStorage } from "react-native";

function isEmpty(obj: any) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function shouldApplyFix(asyncState: any) {
    return asyncState.selectedLang !== undefined
        && asyncState.selectedLang !== "none"
        && asyncState.selectedLang !== ""
        && asyncState.contentByLanguage !== undefined
        && asyncState.contentByLanguage[asyncState.selectedLang] === undefined;
}

function applyFix(asyncState: any) {
    return {
        ...asyncState,
        // reset selected lang
        selectedLang: "none",

        // Since the error can happen during a download
        // we can end up with a broken download state
        // Reset download state.
        downloadReducer: {
            status: "idle",
            previouslyActiveLanguage: "none",
            downloadType: "init",
        },
    }
}

export const storageMigrate = async (fsError, fsResult, persistor) => {
    console.log("storageMigrate");
    if (isEmpty(fsResult)) {
        // if state from fs storage is empty try to read state from previous storage
        try {
            let asyncState: any = await getStoredState({ storage: AsyncStorage })
            if (!isEmpty(asyncState)) {
                // Recover if app state is invalid. The app can delete all contentByLanguage
                // if storage space in AsyncStorage was exeeded, leaving the app useless.
                if (shouldApplyFix(asyncState)) {
                    asyncState = applyFix(asyncState);
                }
                // if data exists in `AsyncStorage` - rehydrate fs persistor with it
                persistor.rehydrate(asyncState, { serial: false })
            }
        } catch (getStateError) {
            console.warn("getStoredState error", getStateError)
        }
    }
}