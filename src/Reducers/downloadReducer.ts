import { Action } from "redux";
import { isType } from "typescript-fsa";
import { setDownloadStatus, resetDownloadStatus, setFilesRemaining } from "../Actions/downloadActions";

export interface IndexLanguageType {
    id: string;
    countryCode: string;
    description: string;
    version: number;
    href: string;
    hrefZip: string;
    latitude: number;
    longitude: number;
}

//Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
// export type DownloadStatus = "idle" | "bundle" | "media" | "missingMedia" |"failed" | "canceled" | "finished";

export type DownloadStatus = "idle" | "bundle" | "media" | "failed" | "canceled" | "finished";

export interface DownloadState {
    status: DownloadStatus;
    languageId?: string;
    previouslyActiveLanguage?: string;
    message?: string;
    filesToDownload?: string[];
    filesRemaining?: number;
    fetchId?: string;
    downloadType?: "init" | "update";
};

const INITIAL_STATE: DownloadState = {
    status: "idle",
    previouslyActiveLanguage: "none",
    downloadType: "init",
};

export const DownloadRehydrationTransform = {
    in: (state, key) => (state),
    /*
     * This transform makes sure that at startup we can't have download status as "bundle" or "canceled" or "finished".
     * In those cases we revert to "idle" (initial state)
     */
    out: (state: DownloadState, key) => {

        if (key === "downloadReducer" && (state.status === "canceled" || state.status === "bundle")) {
            return { ...INITIAL_STATE }
        }
        return state;
    },
}

export const getDownloadPercentage = (state: DownloadState) => {
    const { status, filesToDownload, filesRemaining, previouslyActiveLanguage } = state;

    // Handle idle state
    if (status === "idle") {
        return 0;
    }
    // Handle finished state
    else if (status === "finished") {
        return 100;
    }

    if (filesToDownload !== undefined && filesToDownload.length > 0 && filesRemaining !== undefined) {
        const total = filesToDownload.length;
        const remaning = filesRemaining;
        return Math.round((total - remaning) / total * 100);
    }
}

export const downloadReducer = (state: DownloadState = { ...INITIAL_STATE }, action: Action): DownloadState => {

    if (isType(action, setDownloadStatus)) {
        return {
            ...state,
            ...action.payload,
        }
    }

    if (isType(action, resetDownloadStatus)) {
        return { ...INITIAL_STATE };
    }

    if (isType(action, setFilesRemaining)) {
        return {
            ...state,
            filesRemaining: action.payload,
        }
    }

    return state;
};