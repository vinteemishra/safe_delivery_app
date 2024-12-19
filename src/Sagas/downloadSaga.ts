import fs from "react-native-fs";
import uuid from "react-native-uuid";
import RNRestart from "react-native-restart";
import { unzip } from "react-native-zip-archive";
import {
  call,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { Action } from "typescript-fsa";
import {
  removeLanguageContent,
  selectLang,
  mapDuration,
  receiveVideoDuration,
} from "../Actions/actions";
import {
  cancelDownload,
  insertLanguage,
  resetDownloadStatus,
  resumeDownload,
  setDownloadStatus,
  startDownload,
  startUpdate,
  startDownloadOfMissingFIles,
  cancelMissingFilesDownload,
  downloadVideos,
  DownloadAction,
  setFilesRemaining,
} from "../Actions/downloadActions";
import { DownloadState, IndexLanguageType } from "../Reducers/downloadReducer";
import { StoreState, Video } from "../Reducers/reducers";
import DownloadService, { ServiceStatusCode } from "../Utils/download-service";
import * as helpers from "../Utils/helpers";
import { fetchWithTimeout } from "../Utils/helpers";
import NavigationService from "../Components/NavigationService";
import {
  BundleModule,
  ContentState,
  Language,
} from "../Reducers/contentReducer";
import { lang } from "moment";
import { analytics } from "../Utils/analytics";
import { language } from "./learningSaga";

const DEFAULT_FILE_NAME = "bundle.json";
const DURATION_FILE = `/content/assets/videos/durations.json`;
const BASE_URL = "https://sdacms.blob.core.windows.net";

export const getDownloadState = (state: StoreState) => state.downloadReducer;
export const getPreviouslyActiveLanguage = (state: StoreState) =>
  state.selectedLang;
export const getVideoList = (state: StoreState) =>
  state.contentByLanguage[state.selectedLang].videos;
export const getContentByLanguage = (state: StoreState) =>
  state.contentByLanguage;
export const getModuleList = (state: StoreState) =>
  state.contentByLanguage[state.selectedLang].modules;

export const getBundleUrl = (state: StoreState, langId: string) => {
  const lang = state.contentByLanguage[langId];
  if (lang) {
    return lang.bundleUrl;
  }
};

function* hasEnoughSpace() {
  const diskSpace = yield call(fs.getFSInfo);
  return diskSpace.freeSpace >= 100e6; //TODO - this might need to be a bit higher
  // return diskSpace.freeSpace >= 200e6; //TODO - this might need to be a bit higher
}

function flattenLanguage(lang: any) {
  const keepTheseKeys = [
    "images",
    "videos",
    "modules",
    "notifications",
    "drugs",
    "onboarding",
    "certificates",
  ];
  // const restKeys = ["about", "procedures", "actionCards", "keyLearningPoints" ];

  const extractedObjects = {};
  const keys = Object.keys(lang);
  for (const k of keys) {
    const current = lang[k];
    if (Array.isArray(current)) {
      current.map((c) => {
        extractedObjects[c.id] = c;
      });

      if (keepTheseKeys.indexOf(k) === -1) {
        // console.log("Deleting this key", k);
        delete lang[k];
      }
    }
  }
  return { ...lang, ...extractedObjects };
}

function* downloadLanguage(action: Action<DownloadAction>) {
  const { language, isSelectiveDownload } = action.payload;
  analytics.event("downloadLanguage", `:${language.id}:${isSelectiveDownload}`);
  yield call(
    downloadLanguageGeneric,
    language.href,
    (v: Array<Video>) => (isSelectiveDownload ? [] : v),
    "init"
  );
}

function* updateLanguage(action: Action<DownloadAction>) {
  const { language } = action.payload;
  const contentByLanguage: ContentState = yield select(getContentByLanguage);
  const { isSelectiveDownload } = contentByLanguage[language.id];
  analytics.event("updateLanguage", `:${language.id}:${isSelectiveDownload}`);
  let oldVideoList: Array<Video> = yield select(getVideoList);
  let oldModulesList: Array<BundleModule> = yield select(getModuleList);
  yield call(
    downloadLanguageGeneric,
    language.href,
    (updatedVideoList, updatedModulesList) =>
      getVideosToUpdate(
        updatedVideoList,
        oldVideoList,
        updatedModulesList,
        oldModulesList,
        isSelectiveDownload
      ),
    "update"
  );

  /** TO DO
   * Clean up videos that are not used anymore
   */
}

/**
 *
 * @param new_list
 * @param old_list
 */
export function getUpdatedVideos(
  updatedList: Array<Video>,
  oldList: Array<Video>
): Array<Video> {
  const updateVideos = updatedList.filter((video) => {
    const match = oldList.find((v) => v.id === video.id);
    if (!match || match.version < video.version) {
      return true;
    }
    return false;
  });

  return updateVideos;
}

async function getModuleSelectiveType(
  modules: Language["modules"],
  allVideos: Array<Video>,
  isStreaming: boolean
) {
  const isNoAssetsOfflinePromises = modules.map(async (m) => {
    const videoItemsInModule = helpers.getVideosInModule(m.videos, allVideos);
    const isStreaming = await helpers.isNoAssetsOffline(videoItemsInModule);
    return {
      isStreaming,
      id: m.id,
    };
  });
  const isNoAssetsOfflineBooleans = await Promise.all(
    isNoAssetsOfflinePromises
  );
  const result = isNoAssetsOfflineBooleans
    .filter((a) => a.isStreaming === isStreaming)
    .map((a) => a.id);

  return result;
}

export async function getStreamingModules(
  modules: Language["modules"],
  allVideos: Array<Video>
) {
  return await getModuleSelectiveType(modules, allVideos, true);
}

export async function getOfflineModules(
  modules: Language["modules"],
  allVideos: Array<Video>
) {
  return await getModuleSelectiveType(modules, allVideos, false);
}

export function getNewModules(
  oldModules: Array<BundleModule>,
  updatedModules: Array<BundleModule>
): Array<BundleModule> {
  const oldModuleIds = oldModules.map((m) => m.id);
  const newModules = updatedModules.filter(
    (m) => oldModuleIds.indexOf(m.id) === -1
  );
  return newModules;
}

export function getVideosToDownload(
  updatedVideoList: Array<Video>,
  oldVideoList: Array<Video>,
  updatedModules: Language["modules"],
  oldModules: Language["modules"],
  offlineModulesId: Array<string>,
  isSelectiveDownload?: boolean
) {
  const updatedVideosInBundle = getUpdatedVideos(
    updatedVideoList,
    oldVideoList
  );

  let offlineModules = oldModules.filter(
    (m) => offlineModulesId.indexOf(m.id) !== -1
  );

  //Videos from new modules that should be
  let videosFromNewModulesThatShouldBeOffline: Array<Video> = [];

  //Check if videos to possible new modules should be download or left of device as part of the selective download
  const downloadVideosFromNewModules = isSelectiveDownload !== true;
  if (downloadVideosFromNewModules) {
    const newModules = getNewModules(oldModules, updatedModules);
    const listOfVideoArrays = newModules.map((m) =>
      helpers.getVideosInModule(m.videos, updatedVideoList)
    );
    videosFromNewModulesThatShouldBeOffline = Array.prototype.concat.apply(
      [],
      listOfVideoArrays
    );
  }

  let videosInOfflineModules = [];

  offlineModules.forEach(
    (m) => (videosInOfflineModules = videosInOfflineModules.concat(m.videos))
  );

  // filter list of videos from new modules with already existing offline videos. If the videos are not already on list of should be offline then we add them.
  const videosFromNewModuleThatNeedsToBeDownloaded = videosFromNewModulesThatShouldBeOffline.filter(
    (v) => videosInOfflineModules.indexOf(v.id) === -1
  );

  //Filter the list of updates to which videos should be avaliable offline
  let videosToDownload = updatedVideosInBundle.filter(
    (v) => videosInOfflineModules.indexOf(v.id) !== -1
  );

  videosToDownload = videosToDownload.concat(
    videosFromNewModuleThatNeedsToBeDownloaded
  );
  return videosToDownload;
}
export async function getVideosToUpdate(
  updatedVideoList: Array<Video>,
  oldVideoList: Array<Video>,
  updatedModules: Language["modules"],
  oldModules: Language["modules"],
  isSelectiveDownload?: boolean
) {
  //Get videos used in offline modules
  const offlineModulesId = await getOfflineModules(oldModules, oldVideoList);
  const result = getVideosToDownload(
    updatedVideoList,
    oldVideoList,
    updatedModules,
    oldModules,
    offlineModulesId,
    isSelectiveDownload
  );
  return result;
}

function* downloadLanguageGeneric(
  url: string,
  videosFilter: (
    videoList: Language["videos"],
    modules: Language["modules"]
  ) => Array<Video>,
  downloadType: DownloadState["downloadType"]
) {
  try {
    let downloadState: DownloadState = yield select(getDownloadState);
    const { status } = downloadState;

    // Don't start multiple downloads...
    if (status === "bundle" || status === "media") {
      // console.log("Hey, already running, not going to do anything..");
      return;
    }

    // Annotate each fetch() request with a unique id.
    const fetchId = uuid.v4();

    // Check if enough disk space is available
    // const enoughSpace = yield call(hasEnoughSpace);
    // if (!enoughSpace) {
    //     yield put(setDownloadStatus({ status: "failed", message: "Not enough free space" }));
    //     return;
    // }

    yield put(setDownloadStatus({ status: "bundle", fetchId, downloadType }));

    // /localcontent/e3116616-a17f-4884-a7f8-3993f098e5d0/bundle.json

    //Getting alle the texts
    const jsonBundleUrl = `${BASE_URL}${url.replace(
      DEFAULT_FILE_NAME,
      "content-bundle.json"
    )}`;
    const { fetchRequestId, fetchResult } = yield call(
      fetchWithTimeout,
      fetchId,
      jsonBundleUrl,
      undefined
    );
    // yield put(setDownloadStatus({ status: "failed", message: "Not enough free space" }))

    // Check if something was cancelled,
    downloadState = yield select(getDownloadState);
    if (downloadState.fetchId !== fetchRequestId) {
      return;
    }

    if (downloadState.status === "canceled") {
      yield put(resetDownloadStatus());
      return;
    }
    // console.log("Continuing after bundle..");

    const language: Language = yield call([fetchResult, "json"]);
    language.bundleUrl = url;
    // console.log("videos for download", language.videos);
    // Convert this to old format
    const flattend = flattenLanguage(language);

    // Language is downloaded. Update...
    console.log("Language is downloaded. Update...");

    // console.log("Language is downloaded. Update...");
    const previouslyActiveLanguage = yield select(getPreviouslyActiveLanguage);
    yield put(insertLanguage({ bundle: flattend }));
    console.log("Language has been flattend");
    yield put(selectLang(language.langId));
    console.log("selected lang");
    helpers.updateRTL(language.langId);
    console.log("updated RTL");

    // Download images and videos - NB! Without base url
    const imagesUrl = url.replace(DEFAULT_FILE_NAME, "image-bundle.zip");
    const imagesLearningUrl = url.replace(
      DEFAULT_FILE_NAME,
      "image-learning-bundle.zip"
    );
    const filtered = yield videosFilter(
      language.videos || [],
      language.modules || []
    );
    // const filtered = [];
    const videoSources = filtered.map((v) => v.src);
    const filesToDownload = [
      DURATION_FILE,
      imagesUrl,
      imagesLearningUrl,
      ...videoSources,
    ];
    // const filesToDownload = [ imagesUrl ];

    //For testing purpose only!
    // filesToDownload.map((file, index) => {
    //     if (file === "/content/assets/videos/english%20WHO/Infection%20prevention/intro.mp4") {
    //         filesToDownload.splice(index, 1);
    //     }
    // })

    //Set the orginal files to download in the store under the installed language, so we later can validate if all the content has been successfully downloaded
    // yield put(insertOriginalFilesToDOwnload({ bundle: flattend, filesToDownload: filesToDownload }));

    downloadState = yield select(getDownloadState);
    // if (downloadState.fetchId !== fetchRequestId) {
    //     return;
    // }
    yield put(
      setDownloadStatus({
        status: "media",
        previouslyActiveLanguage,
        filesToDownload,
        filesRemaining: filesToDownload.length,
        languageId: language.langId,
      })
    );
    yield call(DownloadService.startDownload, filesToDownload);

    const prevRTL = helpers.isRTL(previouslyActiveLanguage);
    const currRTL = helpers.isRTL(language.langId);
    if (prevRTL !== currRTL) {
      RNRestart.Restart();
    }

    yield call(waitForDownloadFinishes);
  } catch (e) {
    console.error(e);
    // yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}

function* downloadVideosSaga(action) {
  // const filesToDownload = action.payload;
  const filesToDownload = action.payload.filesToDownload;
  const langId = action.payload.langId;
  const previouslyActiveLanguage = langId;
  yield put(
    setDownloadStatus({
      status: "media",
      downloadType: "update",
      previouslyActiveLanguage,
      filesToDownload,
      filesRemaining: filesToDownload.length,
      languageId: langId,
    })
  );
  yield call(DownloadService.startDownload, filesToDownload);
  NavigationService.navigate("DownloadInfoScreen", {
    noHeaderButton: true,
    onDone: () =>
      NavigationService.navigate("VideoChapterScreen", { title: "Downloaded" }),
    // downloadLanguage: this.state.downloadLanguage.description,
  });
  yield call(waitForDownloadFinishes);
}

// export function* downloadMissingFiles(filesToDownload: any, langId: any) {

//     try {
//         const previouslyActiveLanguage = yield select(getPreviouslyActiveLanguage);

//         yield put(setDownloadStatus({ status: "missingMedia", previouslyActiveLanguage, filesToDownload: filesToDownload.payload.filesToDownload, filesRemaining: filesToDownload.length, languageId: filesToDownload.payload.langId }));
//         yield call(DownloadService.startDownload, filesToDownload.payload.filesToDownload);

//         while (true) {
//             const downloadState: DownloadState = yield select(getDownloadState);
//             const status = yield call(DownloadService.getDownloadStatus);
//             if (status > 0) {
//                 yield put(setDownloadStatus({ ...downloadState, filesRemaining: status }));
//                 yield delay(1000);
//             } else {
//                 break;
//             }
//         }

//         yield put(setDownloadStatus({ status: "finished", languageId: undefined, filesToDownload: undefined }));

//     } catch (e) {
//         console.error("error! ", e);
//     }
// }

function* cancelDownloadSaga() {
  console.log("cancel download");
  yield put(setDownloadStatus({ status: "canceled" }));
  yield call(DownloadService.cancelDownload);
}

// function* cancelMissingFilesDownloadSaga() { //TODO - make this one delete the donwladed files only, not the entire landuage! To use when download is split, and can happen when the app is started!
//     console.log("cancel download");
//     // yield put(setDownloadStatus({ status: "canceled" }));
//     // yield call(DownloadService.cancelDownload);
// }

async function getDownloadedFiles(array: string[]) {
  const downloadedFiles = [];
  const missingFiles = [];
  for (let file of array) {
    if (await fs.exists(fs.DocumentDirectoryPath + file)) {
      downloadedFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  }
  return { downloadedFiles, missingFiles };
}

function getLast(array: any[]) {
  if (Array.isArray(array) && array.length > 0) {
    return array[array.length - 1];
  }
}

function* resumeDownloadSaga() {
  // If running just wait,
  // Otherwise check if all is downloaded
  const downloadState: DownloadState = yield select(getDownloadState);
  const serviceStatus = yield call(DownloadService.getDownloadStatus);

  if (
    serviceStatus === ServiceStatusCode.STOPPED ||
    serviceStatus === ServiceStatusCode.FAILED
  ) {
    const { downloadedFiles, missingFiles } = yield call(
      getDownloadedFiles,
      downloadState.filesToDownload
    );
    if (missingFiles.length > 0) {
      const filesToDownload = [getLast(downloadedFiles), ...missingFiles];
      yield call(DownloadService.startDownload, filesToDownload);
    }
  }
  yield call(waitForDownloadFinishes);
}

function* handleCancel(
  previouslyActiveLanguage: string,
  languageId: string,
  downloadType: DownloadState["downloadType"]
) {
  // Activate previously active language (before download - possibly "none")
  yield put(selectLang(previouslyActiveLanguage));
  helpers.updateRTL(previouslyActiveLanguage);

  // Remove downloaded JSON bundle
  if (downloadType === "init") {
    yield put(removeLanguageContent(languageId)); //TO-DO Canceling updates removes the whole language version.
  }

  yield put(resetDownloadStatus());
}

function* waitForDownloadFinishes() {
  try {
    while (true) {
      const status = yield call(DownloadService.getDownloadStatus);
      const downloadState: DownloadState = yield select(getDownloadState);
      if (status > 0) {
        yield put(setFilesRemaining(status));
        console.log(
          "Downloading....",
          downloadState.filesToDownload.length,
          status
        );
        yield delay(1000);
      } else {
        if (status === -2) {
          // something FAILED!
        }
        break;
      }
    }

    const downloadState: DownloadState = yield select(getDownloadState);
    const { languageId, status, previouslyActiveLanguage } = downloadState;

    // Check if there are any missing files, and if so download them before continue
    // const { downloadedFiles, missingFiles } = yield call(getDownloadedFiles, downloadState.filesToDownload);
    // if (missingFiles.length > 0 && status !== "canceled") {
    //     const filesToDownload = [getLast(downloadedFiles), ...missingFiles];
    //     //Download the missing files if any
    //     yield call(DownloadService.startDownload, filesToDownload);
    //     //Call this function again to finish the installation
    //     yield call(waitForDownloadFinishes);
    // }

    // if (status === "canceled" && contentByLanguage.missingFilesToDownload !== true) {
    if (status === "canceled") {
      yield handleCancel(
        previouslyActiveLanguage,
        languageId,
        downloadState.downloadType
      );
      return;
    }

    const bundleUrl = yield select(getBundleUrl, languageId);

    const imagesZip =
      fs.DocumentDirectoryPath +
      bundleUrl.replace(DEFAULT_FILE_NAME, "image-bundle.zip");
    const imagesLearningZip =
      fs.DocumentDirectoryPath +
      bundleUrl.replace(DEFAULT_FILE_NAME, "image-learning-bundle.zip");

    try {
      const durationFile = fs.DocumentDirectoryPath + DURATION_FILE;
      const durationsRaw = yield call(fs.readFile, durationFile);
      const durations = JSON.parse(durationsRaw);
      const durationsMap = mapDuration(durations);
      yield put(receiveVideoDuration(durationsMap));
    } catch (e) {
      console.warn("Couldn't extract durations..", e);
    }

    const dir = fs.DocumentDirectoryPath + "/";
    yield call(fs.mkdir, dir, { NSURLIsExcludedFromBackupKey: true });

    try {
      yield call(unzip, imagesZip, dir);
      yield call(fs.unlink, imagesZip);
    } catch (e) {
      console.warn("Couldn't unzip images - possibly empty zip");
    }

    try {
      yield call(unzip, imagesLearningZip, dir);
      yield call(fs.unlink, imagesLearningZip);
    } catch (e) {
      console.warn(
        "Couldn't unzip learning module images - possibly empty zip"
      );
    }

    console.log("Unpack finished!");
    // yield put(setDownloadStatus({ status: "idle", languageId: undefined, filesToDownload: undefined }));
    yield put(
      setDownloadStatus({
        status: "finished",
        languageId: undefined,
        filesToDownload: undefined,
      })
    );
  } catch (e) {
    console.error(e);
  }
}

export function* downloadSaga() {
  yield takeEvery(cancelDownload, cancelDownloadSaga);
  // yield takeEvery(cancelMissingFilesDownload, cancelMissingFilesDownloadSaga);
  yield takeEvery(startDownload, downloadLanguage);
  yield takeEvery(startUpdate, updateLanguage);
  // yield takeEvery(startDownloadOfMissingFIles as any, downloadMissingFiles as any);
  yield takeLatest(resumeDownload, resumeDownloadSaga);
  yield takeLatest(downloadVideos, downloadVideosSaga);
}
