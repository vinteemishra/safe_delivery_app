import actionCreatorFactory from "typescript-fsa";
import { IndexLanguageType, DownloadState } from "../Reducers/downloadReducer";

const actionCreator = actionCreatorFactory("downloadActions");
export type DownloadAction = { language: IndexLanguageType, isSelectiveDownload?: boolean };
export const startDownload = actionCreator<DownloadAction>("START_DOWNLOAD");
export const startUpdate = actionCreator<DownloadAction>("START_UPDATE");
export const cancelDownload = actionCreator("CANCEL_DOWNLOAD");
export const setDownloadStatus = actionCreator<DownloadState>("SET_DOWNLOAD_STATUS");
export const setFilesRemaining = actionCreator<DownloadState["filesRemaining"]>("SET_FILES_REMAINING");
export const downloadFinished = actionCreator("DOWNLOAD_FINISHED");
export const resumeDownload = actionCreator("RESUME_DOWNLOAD");
export const resetDownloadStatus = actionCreator("RESET_DOWNLOAD_STATUS");

export const insertLanguage = actionCreator<{ bundle: any }>("INSERT_LANGUAGE_JSON");

//Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this and the instances where then are used
export const cancelMissingFilesDownload = actionCreator<{ filesToDonwload: any }>("CANCEL_MISSING_FILES_DOWNLOAD");
export const setMissingFilesToDownload = actionCreator<{ contentByLanguage: any, missingFilesToDownload: boolean, langId: string }>("SET_MISSING_FILES_TO_DOWNLOAD");
export const startDownloadOfMissingFIles = actionCreator<{ filesToDonwload: any, langId: any }>("START_DOWNLOAD_OF_MISSING_FILES");

export const downloadVideos = actionCreator<{ filesToDownload: Array<string>, langId: string }>("DOWNLOAD_VIDEOS");
export const setSelectiveDownload = actionCreator<boolean>("SET_SELECTIVE_DOWNLOAD")