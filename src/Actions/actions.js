import fs from 'react-native-fs';
import { USE_LOCAL_CONTENT } from '../Config/config';
import DownloadService from '../Utils/download-service';
import { fetchWithTimeout } from '../Utils/helpers';

const BASE_URL = 'https://sdacms.blob.core.windows.net';

export const SELECT_LANG = 'SELECT_LANG';
export const SELECT_COUNTRY = 'SELECT_COUNTRY';
export const SELECT_MODE = 'SELECT_MODE';
export const INVALIDATE_LANG = 'INVALIDATE_LANG';

export const REMOVE_LANGUAGE_CONTENT = 'REMOVE_LANGUAGE_CONTENT';
export const REMOVE_DOWNLOAD_FILES = 'REMOVE_DOWNLOAD_FILES';

export const REQUEST_INDEX = 'REQUEST_INDEX';
export const RECEIVE_INDEX = 'RECEIVE_INDEX';
export const INVALIDATE_INDEX = 'INVALIDATE_INDEX';

export const RECEIVE_MODULES = 'RECEIVE_MODULES';
export const RECEIVE_BUNDLE = 'RECEIVE_BUNDLE';
export const RECEIVE_ACTIONCARDS = 'RECEIVE_ACTIONCARDS';
export const RECEIVE_PROCEDURES = 'RECEIVE_PROCEDURES';
export const RECEIVE_ABOUT = 'RECEIVE_ABOUT';
export const RECEIVE_DRUGS = 'RECEIVE_DRUGS';
export const RECEIVE_ONBOARDING = 'RECEIVE_ONBOARDING';
export const RECEIVE_KEY_LEARNING_POINTS = 'RECEIVE_KEY_LEARNING_POINTS';
export const RECEIVE_CERTIFICATES = 'RECEIVE_CERTIFICATES';
export const SELECT_MODULE = 'SELECT_MODULE';

export const RECEIVE_IMAGE = 'RECEIVE_IMAGE';
export const RECEIVE_VIDEO = 'RECEIVE_VIDEO';
export const SET_APP_STATE = 'SET_APP_STATE';
export const FAILED_INDEX = 'FAILED_INDEX';
export const SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS';
export const SET_IS_HEALTHCARE_WORKER = 'SET_IS_HEALTHCARE_WORKER';

export const FAILED_CONTENT_DOWNLOAD = 'FAILED_CONTENT_DOWNLOAD';

export const SELECT_LEARNING_MODULE = 'SELECT_LEARNING_MODULE';
export const SET_PROFILE_NAME = 'SET_PROFILE_NAME';
export const SET_PROFILE_QUESTION = 'SET_PROFILE_QUESTION';
export const SET_PROFILE_QUESTIONS = 'SET_PROFILE_QUESTIONS';
export const ADD_PROFILE_CERTIFICATE = 'ADD_PROFILE_CERTIFICATE';
export const SET_PROFILE_COUNTRY = 'SET_PROFILE_COUNTRY';

export const SET_PROFILE_MODULE_SCORE = 'SET_PROFILE_MODULE_SCORE';
export const SET_PROFILE_PREP_TEST_SCORE = 'SET_PROFILE_PREP_TEST_SCORE';
export const SET_PROFILE_CERTIFICATE = 'SET_PROFILE_CERTIFICATE';
export const SET_MEMBER_ID_ON_CERT = 'SET_MEMBER_ID_ON_CERT';
export const SET_11_MONTH_NOTIFICATION = 'SET_11_MONTH_NOTIFICATION';
export const UPSERT_PROFILE = 'UPSERT_PROFILE';
export const CREATE_FAKE_PROFILE = 'CREATE_FAKE_PROFILE';
export const REMOVE_PROFILE = 'REMOVE_PROFILE';

export const APPROVE_DISCLAIMER = 'APPROVE_DISCLAIMER';
export const RECEIVE_VIDEO_DURATION = 'RECEIVE_VIDEO_DURATION';

export const SET_QUIZ_ANSWERED = 'SET_QUIZ_ANSWERED';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_ABOUT_LEARNING = 'SET_ABOUT_LEARNING';
export const SET_CURRENT_DOWNLOAD_PROCESS = 'SET_CURRENT_DOWNLOAD_PROCESS';
export const SET_DOWNLOAD_PROCESS_ERROR = 'SET_DOWNLOAD_PROCESS_ERROR';
export const SET_DOWNLOAD_PROCESS_CANCELED = 'SET_DOWNLOAD_PROCESS_CANCELED';
export const CLEAR_CURRENT_DOWNLOAD_PROCESS = 'CLEAR_CURRENT_DOWNLOAD_PROCESS';
export const SUBTRACT_ONE_FROM_CURRENT_DOWNLOAD_PROCESS =
  'SUBTRACT_ONE_FROM_CURRENT_DOWNLOAD_PROCESS';

export const SET_ESSENTIAL_QUESTION = 'SET_ESSENTIAL_QUESTION';
export const DISMISS_UPGRADE_MESSAGE = 'DISMISS_UPGRADE_MESSAGE';
export const SET_LAST_NOTIFICATION_DATE = 'SET_LAST_NOTIFICATION_DATE';
export const SET_SHOW_DELIVERIESQUESTION_DATE =
  'SET_SHOW_DELIVERIESQUESTION_DATE';
export const SET_NOTIFICATION_SHOWN = 'SET_NOTIFICATION_SHOWN';
export const ADD_NOTIFICATION_TO_USER_PROFILE =
  'notificationsActions/ADD_NOTIFICATION_TO_USER_PROFILE';
export const UPDATE_USER_NOTIFICATION_SHEDULE_LIST =
  'notificationsActions/UPDATE_USER_NOTIFICATION_SHEDULE_LIST';
export const UPDATE_DEVICE_NOTIFICATION_SHEDULE_LIST =
  'notificationsActions/UPDATE_DEVICE_NOTIFICATION_SHEDULE_LIST';
export const ADD_NOTIFICATION_TO_DEVICE =
  'notificationsActions/ADD_NOTIFICATION_TO_DEVICE';
export const SET_CHEAT_USED = 'SET_CHEAT_USED';

export const ANSWERED_SURVEY = 'ANSWERED_SURVEY';
export const IS_PRE_BULILD = 'IS_PRE_BUILD';

export const SET_ASKED_FOR_PERMISSION_TIMESTAMP =
  'SET_ASKED_FOR_PERMISSION_TIMESTAMP';

export const INIT_ASSETS_SUCCESS = 'INIT_ASSETS_SUCCESS';
export const INIT_ASSETS_START = 'INIT_ASSETS_START';
export const INIT_ASSETS_FAILED = 'INIT_ASSETS_FAILED';

export const DOWNGRADE_LANGUAGE_VERSION_NUMBER =
  'DOWNGRADE_LANGUAGE_VERSION_NUMBER';
export const SET_STREAM_WARNING_DISABLED = 'SET_STREAM_WARNING_DISABLED';

export const SET_PASSWORD_SENT = 'SET_PASSWORD_SENT';
export const SET_PASSWORD_SENT_METHOD = 'SET_PASSWORD_SENT_METHOD';

export function selectLang(lang) {
  return {
    type: SELECT_LANG,
    lang
  };
}

export function selectCountry(country) {
  return {
    type: SELECT_COUNTRY,
    country
  };
}

export function selectLangAsync(lang) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(selectLang(lang));
      setTimeout(resolve, 100);
    });
  };
}

export function selectMode(mode) {
  return {
    type: SELECT_MODE,
    mode
  };
}

export function selectModule(module) {
  return {
    type: SELECT_MODULE,
    module
  };
}
export function selectLearningModule(module) {
  return {
    type: SELECT_LEARNING_MODULE,
    module
  };
}

export function setCurrentDownloadProcess(
  lang,
  languageTitle,
  downloadItems,
  zipFile,
  bundleInfo,
  currentTaskDescription,
  showWarning,
  totalTaskCount,
  taskDoneCount
) {
  return {
    type: SET_CURRENT_DOWNLOAD_PROCESS,
    lang,
    downloadItems,
    languageTitle,
    zipFile,
    bundleInfo,
    showWarning,
    currentTaskDescription,
    totalTaskCount,
    taskDoneCount
  };
}

export function setDownloadProcessError(error) {
  return {
    type: SET_DOWNLOAD_PROCESS_ERROR,
    error
  };
}

export function setDownloadProcessCanceled() {
  return {
    type: SET_DOWNLOAD_PROCESS_CANCELED
  };
}

export function subtractOneFromCurrentDownloadProcess(diff) {
  return {
    type: SUBTRACT_ONE_FROM_CURRENT_DOWNLOAD_PROCESS,
    diff: diff || 1
  };
}

export function clearCurrentDownloadProcess() {
  return {
    type: CLEAR_CURRENT_DOWNLOAD_PROCESS
  };
}

export function setProfileName(profileId, profileName) {
  return {
    type: SET_PROFILE_NAME,
    profileId,
    profileName
  };
}

export function setProfileQuestion(profileId, questionId, answer) {
  return {
    type: SET_PROFILE_QUESTION,
    profileId,
    questionId,
    answer
  };
}

export function setProfileQuestions(profileId, entry) {
  return {
    type: SET_PROFILE_QUESTIONS,
    profileId,
    entry
  };
}

export function addNewCertificate(profileId, score, passed) {
  return {
    type: ADD_PROFILE_CERTIFICATE,
    profileId,
    score,
    passed
  };
}

export function setProfileCountry(country) {
  return {
    type: SET_PROFILE_COUNTRY,
    country
  };
}

// export function setProfileModuleScore(profileId, moduleId, score) {
// 	return (dispatch) => {
// 		dispatch(setModuleScore(profileId, moduleId, score));

// 		// If the score is the highest possible for the module, we check to see if the certificate was enabled
// 		const MAX_LEARNING_MODULE_SCORE = 11;
// 		if (score === MAX_LEARNING_MODULE_SCORE) {
// 			dispatch(updateCertificateState(profileId))
// 		}
// 	}
// }

export function setProfilePrepTestScore(
  profileId,
  moduleId,
  score,
  lastCertEntry
) {
  return (dispatch) => {
    dispatch(setPrepTestScore(profileId, moduleId, score, lastCertEntry));

    // If the score is the highest possible for the module, we check to see if the certificate was enabled
    // const MAX_LEARNING_MODULE_SCORE = 11;
    // if (score === MAX_LEARNING_MODULE_SCORE) {
    // 	dispatch(updateCertificateState(profileId))
    // }
  };
}

// }

// export function updateCertificateState(profileId) {
// 	return (dispatch, getState) => {
// 		const { userProfiles, contentByLanguage, selectedLang } = getState();
// 		const user = userProfiles[profileId];
// 		let profileModules = Object.keys(user.profileModuleScores)
// 		const modules = contentByLanguage[selectedLang].modules
// 		const lastCertEntry = user.profileCertificates.length - 1;

// 		if (profileModules.length < modules.length) {
// 			return
// 		}
// 		for (let i = 0; i < profileModules.length; i++) {
// 			let match = false
// 			const id = profileModules[i]

// 			for (m in modules) {
// 				if (modules[m].id === id) {
// 					match = true
// 				}
// 			}

// 			// console.log("updateCertificateState", match, modules, id);
// 			if (user.profileModuleScores[profileModules[i]] < 11 && match) {
// 				return
// 			}
// 		}

// 		const ts = Date.now();
// 		if (user.profileCertificates[lastCertEntry] && user.profileCertificates[lastCertEntry].unlockTimestamp) {
// 			// check that we do not already have an older unlock timestamp
// 			if (user.profileCertificates[lastCertEntry].unlockTimestamp < ts)
// 				return;
// 		}
// 		// console.log('setProfileCertificate', currentUser, ts, 0, user.profileCertificate.passed, user.profileCertificate.claimed, user.profileCertificate.name);
// 		dispatch(setProfileCertificate(profileId, ts, 0, user.profileCertificates[lastCertEntry].passed, user.profileCertificates[lastCertEntry].claimed, user.profileCertificates[lastCertEntry].name));
// 	}
// }

export function setModuleScore(profileId, moduleId, score) {
  return {
    type: SET_PROFILE_MODULE_SCORE,
    profileId,
    moduleId,
    score
  };
}

export function setPrepTestScore(profileId, moduleId, score) {
  return {
    type: SET_PROFILE_PREP_TEST_SCORE,
    profileId,
    moduleId,
    score
  };
}

export function setProfileCertificate(
  profileId,
  unlockTimestamp,
  score,
  passed,
  claimed,
  name,
  jobTitle,
  workPlace,
  claimTimestamp,
  uniqueId
) {
  return {
    type: SET_PROFILE_CERTIFICATE,
    profileId,
    unlockTimestamp,
    score,
    passed,
    claimed,
    name,
    jobTitle,
    workPlace,
    claimTimestamp,
    uniqueId
  };
}

export function setMemberIdOnCert(profileId, memberId, certUniqueId) {
  return {
    type: SET_MEMBER_ID_ON_CERT,
    profileId,
    memberId,
    certUniqueId
  };
}

export function set11MonthNofification() {
  //For testing use, then want to trigger the preptest before the 11 months has passed
  return {
    type: SET_11_MONTH_NOTIFICATION
  };
}

export function upsertProfile(
  profileId,
  profileTimestamp,
  profileName,
  profileEmail,
  country,
  profileQuestions,
  profileModuleScores,
  profileCertificates,
  listOfShownNotifications,
  dismissedUpgradeMessage,
  cheatUsed,
  method,
  userSpecificNotificationScheduleList,
  moduleCertificates
) {
  return {
    type: UPSERT_PROFILE,
    profileId,
    profileTimestamp,
    profileName,
    profileEmail,
    country,
    profileQuestions,
    profileModuleScores,
    profileCertificates,
    listOfShownNotifications,
    dismissedUpgradeMessage,
    cheatUsed,
    method,
    userSpecificNotificationScheduleList,
    moduleCertificates
  };
}

export function createfakeProfile(
  profileId,
  profileTimestamp,
  profileName,
  profileEmail,
  profileQuestions,
  profileModuleScores,
  profileCertificates,
  listOfShownNotifications,
  dismissedUpgradeMessage,
  cheatUsed
) {
  return {
    type: CREATE_FAKE_PROFILE,
    profileId,
    profileTimestamp,
    profileName,
    profileEmail,
    profileQuestions,
    profileModuleScores,
    profileCertificates,
    listOfShownNotifications,
    dismissedUpgradeMessage,
    cheatUsed
  };
}

export function removeProfile(profileId) {
  return {
    type: REMOVE_PROFILE,
    profileId
  };
}

export function dismissedUpgradeMessage(profileId, messageState) {
  return {
    type: DISMISS_UPGRADE_MESSAGE,
    profileId,
    messageState
  };
}

export function setStreamWarningDisabled(status) {
  return {
    type: SET_STREAM_WARNING_DISABLED,
    status
  };
}
export function setCurrentUser(profileId) {
  //reset 'Learning'-tab to root on user switch
  // Navigation.handleDeepLink({
  // 	link: "learning/root" // the link string (required)
  // });
  return {
    type: SET_CURRENT_USER,
    profileId
  };
}
export function setQuizAnswered(boolean) {
  return {
    type: SET_QUIZ_ANSWERED,
    boolean
  };
}

export function setAppState(state) {
  return {
    type: SET_APP_STATE,
    state
  };
}
export function invalidateIndex() {
  return {
    type: INVALIDATE_INDEX
  };
}
export function invalidateLang(lang) {
  return {
    type: INVALIDATE_LANG,
    lang
  };
}

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file)
      .then(resolve)
      .catch((e) => {
        // console.log("Couldn't find file", file);
        // Doesn't matter - resolve anyway!
        resolve();
      });
  });
}

export function getLanguageVersionFromContentByLanguage(contentByLanguage) {
  const result = [];

  //Get the keys from contentByLanguage
  const keys = Object.keys(contentByLanguage);

  //Run through the keys and get the language versions used
  for (const k of keys) {
    if (contentByLanguage[k].images) {
      const imageSrc = contentByLanguage[k].images[0].src;
      const version = imageSrc.substring(
        imageSrc.indexOf('/', 16) + 1,
        imageSrc.indexOf('/', 23)
      );

      result.push({ langId: k, languageVersion: version });
    }
  }

  return result;
}

function checkIfWeNeedToDeleteImageFolder(lang, languageVersion) {
  let languageVersionOfDeleted = '';

  //Get the language version for the selected language to delete
  languageVersion.map((item, index) => {
    if (item.langId == lang.id) {
      languageVersionOfDeleted = item.languageVersion;
    }
  });

  let listOfSameLanguageVersions = [];

  //Determine if we need to delete the image folder as well. e,g "africa" etc.
  if (languageVersion.length === 1) {
    return true;
  } else {
    languageVersion.map((item, index) => {
      if (
        item.languageVersion != languageVersionOfDeleted &&
        item.langId != lang.id
      ) {
        return true;
      } else if (item.languageVersion == languageVersionOfDeleted) {
        return listOfSameLanguageVersions.push(item.languageVersion);
      } else {
        return false;
      }
    });
  }

  if (listOfSameLanguageVersions.length === 1) {
    return true;
  }

  return false;
}

// export function deleteLanguage(lang) {

// 	return (dispatch, getState) => {
// 		const deleteJobs = [];

// 		if (getState().contentByLanguage[lang.id] && getState().contentByLanguage[lang.id].videos[0].src.startsWith("/content/assets/")) {

// 			//Get the video and image paths from the store
// 			const getPathToVideoMediaFiles = getState().contentByLanguage[lang.id].videos[0].src;
// 			const getPathToImageMediaFiles = getState().contentByLanguage[lang.id].images[0].src;

// 			//Contract the exact path needed for later use
// 			const getLanguageFolderOfVideoFilesToDelete = getPathToVideoMediaFiles.substring(0, getPathToVideoMediaFiles.indexOf("/", 23));
// 			const getLanguageFolderOfImageFilesToDelete = getPathToImageMediaFiles.substring(0, getPathToImageMediaFiles.indexOf("/", 23));

// 			//Get the ues language version on the installed languages eg. "africa" etc.
// 			const languageVersion = getLanguageVersionFromContentByLanguage(getState().contentByLanguage);

// 			//Check what overall language the deteting item is using, and if there are others that are using that. If not delete the overall language images also
// 			let deleteImageFolder = checkIfWeNeedToDeleteImageFolder(lang, languageVersion);

// 			//Delete language image folder
// 			if (deleteImageFolder) {
// 				deleteJobs.push(deleteFile(fs.DocumentDirectoryPath + getLanguageFolderOfImageFilesToDelete));
// 			}

// 			//Delete language video folder
// 			deleteJobs.push(deleteFile(fs.DocumentDirectoryPath + getLanguageFolderOfVideoFilesToDelete));

// 			//Remove the language from the store
// 			dispatch(removeLanguageContent(lang.id));

// 			//If we are deleting the only language, check if prebuild is true, and set it to false if so
// 			if (getState().isPreBuild === true && languageVersion.length === 1) {
// 				dispatch(setPreBuild(false));
// 			};

// 		}

// 		return Promise.all(deleteJobs);
// 	}
// }

// export function deleteLanguage(lang) {
// 	return (dispatch, getState) => {
// 		const deleteJobs = [];
// 		Object.keys(getState().contentByLanguage[lang.id] || {}).map(asset => {
// 			if (asset.startsWith("/content/assets/")) {
// 				deleteJobs.push(deleteFile(fs.DocumentDirectoryPath + asset));
// 				// Delete images also
// 				if (asset.endsWith(".mp4")) {
// 					deleteJobs.push(deleteFile(fs.DocumentDirectoryPath + asset.replace(".mp4", ".png")));
// 				}
// 			}
// 		});
// 		dispatch(removeLanguageContent(lang.id));
// 		return Promise.all(deleteJobs);
// 	}
// }

export function removeLanguageContent(langId) {
  return {
    type: REMOVE_LANGUAGE_CONTENT,
    langId
  };
}

// export function removeLanguageContent_v2(filesToRemove) {
// 	return {
// 		type: REMOVE_DOWNLOAD_FILES,
// 		filesToRemove
// 	}
// }

export function receiveBundle(lang, json) {
  return {
    type: RECEIVE_BUNDLE,
    lang,
    json,
    receivedAt: Date.now()
  };
}

export function approveDisclaimer() {
  return {
    type: APPROVE_DISCLAIMER
  };
}

export function answeredSurvey() {
  return {
    type: ANSWERED_SURVEY
  };
}

export function setPreBuild(boolean) {
  return {
    type: IS_PRE_BULILD,
    boolean
  };
}

export function setConnectionStatus(isConnected) {
  return {
    type: SET_CONNECTION_STATUS,
    isConnected
  };
}

export function setHealthCareWorkerQustion(boolean) {
  return {
    type: SET_IS_HEALTHCARE_WORKER,
    boolean
  };
}

export function fetchLang(lang, href, mode, fetch, success) {
  return (dispatch) => {
    dispatch(fetch(lang, href, mode)).catch((err) => {
      dispatch(invalidateLang(lang));
    });
  };
}

// function cancelDownloadNotification() {
// 	if (Platform.OS == "android") {
// 		PushNotification.cancelLocalNotifications({ id: 1039 });
// 	}
// }

// export function resumeDownloadProgress() {
// 	console.log("resumeDownload");
// 	return async (dispatch, getState) => {
// 		const { lang, downloadItems, languageTitle, bundleInfo, zipFile, canceled, error } = getState().currentDownloadProcess;
// 		// console.log("Resuming with this: ", { lang, downloadItems, languageTitle, bundleInfo, zipFile, canceled, error });
// 		if (bundleInfo === undefined) {
// 			// console.log("Oh, we are resuming download from a pretty early stage. Abort!");
// 			return dispatch(setDownloadProcessError("An error occoured. Try again later"));
// 		}

// 		// Don't resume a canceled download
// 		if (canceled || error !== undefined) {
// 			// console.log("We don't resume the download");
// 			return;
// 		}

// 		const status = await DownloadService.getDownloadStatus();
// 		// If we are currently downloading, we show status bar
// 		if (status > 0) {
// 			const filesDownloaded = downloadItems.length - status;
// 			dispatch(setCurrentDownloadProcess(lang, bundleInfo.description, downloadItems, zipFile, bundleInfo, "Downloading files", false, downloadItems.length * 1.25, filesDownloaded));
// 		} else {
// 			// If we are not currently downloading, we check if everything has been downloaded.
// 			const itsAllGoodMan = await areFilesDowloaded(downloadItems);
// 			// console.log("We have downloaded these files already: ", itsAllGoodMan.length, itsAllGoodMan);
// 			if (itsAllGoodMan.length !== downloadItems.length) {
// 				// Download missing files
// 				const missingFiles = arrayDifference(downloadItems, itsAllGoodMan);
// 				if (itsAllGoodMan.length > 0) {
// 					// console.log("Adding this to missing files: ", itsAllGoodMan[itsAllGoodMan.length - 1])
// 					missingFiles.unshift(itsAllGoodMan[itsAllGoodMan.length - 1]); // Add overlapping download
// 				}
// 				// Set download state:
// 				// console.log("We need to download moar:", missingFiles.length, missingFiles);
// 				await DownloadService.startDownload(missingFiles);
// 				await dispatch(setCurrentDownloadProcess(lang, bundleInfo.description, downloadItems, zipFile, bundleInfo, "Downloading files", false, downloadItems.length * 1.25, itsAllGoodMan.length));
// 			}
// 		}

// 		return dispatch(waitForDownload());
// 	}
// }

// export function waitForDownload() {
// 	const finishDownload = async (dispatch, state) => {
// 		console.log("finish download");
// 		// We are done downloading, so remove download notification
// 		cancelDownloadNotification();

// 		const { lang, downloadItems, languageTitle, bundleInfo, zipFile, canceled, error } = state.currentDownloadProcess;

// 		// Do nothing
// 		if (canceled || error !== undefined) {
// 			return;
// 		}

// 		const count = countItemsInBundle(bundleInfo);
// 		// We let this count for 20% - hence the count*5, count*4
// 		dispatch(setCurrentDownloadProcess(lang, languageTitle, downloadItems, zipFile, bundleInfo, "Finishing setup", true, count * 5, count * 4));

// 		const dir = fs.DocumentDirectoryPath + "/";
// 		// Ensure that the directory exists
// 		await fs.mkdir(dir, { NSURLIsExcludedFromBackupKey: true });
// 		console.log("made dir in directory", dir);
// 		if (zipFile) {
// 			console.log("unzip");
// 			await unzip(zipFile, dir);
// 		}

// 		// Add stuff to redux
// 		// console.log("Adding videos to Redux");
// 		await Promise.all(bundleInfo.videos.map(v => {
// 			dispatch(receiveVideo(lang, v, v.src));
// 			dispatch(subtractOneFromCurrentDownloadProcess());
// 		}));
// 		await dispatch(fetchVideoDurations());

// 		// console.log("Adding everything else to Redux");
// 		const isFromZipFile = zipFile !== undefined;
// 		await addBundleToRedux(bundleInfo, dispatch, lang, isFromZipFile);

// 		dispatch(clearCurrentDownloadProcess());
// 	};

// 	return async (dispatch, getState) => {
// 		return new Promise((resolve, reject) => {
// 			const checkForStatus = oldStatus => async () => {
// 				console.log("getDownloadStatus");
// 				const status = await DownloadService.getDownloadStatus();
// 				console.log("status", status, oldStatus);
// 				if (status < oldStatus) {
// 					dispatch(subtractOneFromCurrentDownloadProcess(oldStatus - status));
// 				}
// 				if (status > 0) {
// 					setTimeout(checkForStatus(status), 200);
// 				} else if (status == -2) { // Error!
// 					await dispatch(setDownloadProcessError("Couldn't download files"));
// 					reject("Couldn't download files");
// 				} else {
// 					await finishDownload(dispatch, getState());
// 					resolve();
// 				}
// 			};
// 			checkForStatus(0)();
// 		});
// 	};
// }

// export function fetchBundleZip(lang, href, mode) {
// 	console.log("fetchbundle");
// 	return async dispatch => {
// 		try {
// 			dispatch(setCurrentDownloadProcess(lang, undefined, [], undefined, undefined, "Preparing setup", false, 100, 0));
// 			// Check if we have enough disk space:
// 			console.log("checking for diskspace");
// 			const diskSpace = await fs.getFSInfo();
// 			console.log("diskSpce", diskSpace);
// 			if (diskSpace.freeSpace < 100e6) { // 100 mb
// 				return Promise.reject('Not enough space on device')
// 			}

// 			// Get bundle information
// 			const jsonFileLocation = href.replace('.zip', '.json');
// 			console.log("jsonFileLocation", jsonFileLocation);
// 			const bundleInfoRequest = await fetchWithTimeout(BASE_URL + jsonFileLocation);
// 			console.log("bundleInfoRequest", bundleInfoRequest);
// 			const bundleInfo = await bundleInfoRequest.json();
// 			console.log("bundleInfo", bundleInfo);

// 			// We need to download zip file
// 			const filesToDownload = [href];
// 			// And we need to download all video files
// 			const videoSources = (bundleInfo.videos || []).map(v => v.src);
// 			filesToDownload.push(...videoSources);
// 			console.log("filesToDownload", filesToDownload);
// 			await DownloadService.startDownload(filesToDownload);

// 			const zipFile = (fs.DocumentDirectoryPath + href) //.replace(/([^:]\/)\/+/g, "$1");

// 			// Set download state - We let videos count for 80% of all download
// 			dispatch(setCurrentDownloadProcess(lang, bundleInfo.description, filesToDownload, zipFile, bundleInfo, "Downloading files", false, filesToDownload.length * 1.25, 1));
// 			console.log("wait for download");
// 			return dispatch(waitForDownload());
// 		} catch (err) {
// 			dispatch(setDownloadProcessError(err));
// 			return Promise.reject(err)
// 		}
// 	}
// }

export function needToDownloadAsset(lang, state) {
  return async function(newItem) {
    // If this language was never downloaded, we return true
    // console.log("needToDownloadAsset", lang, newItem)
    if (!(lang in state.contentByLanguage)) {
      return true;
    }

    const id = newItem.id;
    const href = newItem.src;

    const exitingItem = state.contentByLanguage[lang][id];

    // First we check if the store indicate that we need to download
    if (
      exitingItem === undefined ||
      exitingItem.didInvalidate == false ||
      exitingItem.version < newItem.version
    ) {
      console.log(
        'needToDownloadAsset exitingItem',
        exitingItem === undefined,
        exitingItem.didInvalidate == false,
        exitingItem.version,
        newItem.version
      );
      return true;
    }

    // Now everything in the store is fine, we just need to check if the file actually exists
    const exists = await fs.exists(fs.DocumentDirectoryPath + href);
    return exists === false;
  };
}

export async function checkIfExistOnFileSystem(videoItem) {
  const href = videoItem.src;
  const exists = await fs.exists(fs.DocumentDirectoryPath + href);
  return exists;
}

// function needToDownloadJson(lang, state) {
// 	return async function (newItem) {

// 		// If this language was never downloaded, we return true
// 		if (!(lang in state.contentByLanguage)) {
// 			return true;
// 		}
// 		const href = newItem.href
// 		const id = newItem.id
// 		const existingItem = state.contentByLanguage[lang][id];

// 		// If this item doesn't exist in the store, we need to download it, alright!
// 		if (existingItem === undefined) {
// 			return true;
// 		}

// 		const oldVersion = existingItem.version;
// 		const newVersion = newItem.version;

// 		// Just download if new item is newer
// 		return newVersion > oldVersion;
// 	}
// }

// function URLifyJsonResource(lang, mode) {
// 	return function (item) {
// 		return `/${mode}/${lang}/${item.href}`;
// 	}
// }

// function getFilesToDownload(lang, mode, state, bundleInfo) {
// 	const jsonResourcesUrls = [
// 		...(bundleInfo.modules || []),
// 		...(bundleInfo.actionCards || []),
// 		...(bundleInfo.procedures || []),
// 		...(bundleInfo.about || []),
// 		...(bundleInfo.drugs || []),
// 		...(bundleInfo.certificates || []),
// 		...(bundleInfo.keyLearningPoints || []),
// 	]
// 		.filter(needToDownloadJson(lang, state))
// 		.map(URLifyJsonResource(lang, mode));

// 	const assetResourcesUrls = [
// 		...(bundleInfo.images || []),
// 		...(bundleInfo.videos || []),
// 	]
// 		.filter(needToDownloadAsset(lang, state))
// 		.map(i => (i.src));

// 	return [...jsonResourcesUrls, ...assetResourcesUrls];
// }

// export function fetchBundle(lang, href, mode) {
// 	return async (dispatch, getState) => {
// 		try {
// 			dispatch(setCurrentDownloadProcess(lang, undefined, [], undefined, undefined, "Preparing setup", false, 100, 0));
// 			const bundleInfoRequest = await fetchWithTimeout(BASE_URL + href, { headers: { 'Cache-Control': 'no-cache' } });
// 			const bundleInfo = await bundleInfoRequest.json();
// 			console.warn("We have the bundle!", bundleInfo);

// 			// Get files and convert to URLs
// 			let filesToDownload = getFilesToDownload(lang, mode, getState(), bundleInfo);
// 			console.log("Alright, I'll download this many files: ", filesToDownload);
// 			// filesToDownload = filesToDownload.slice(0, 10);
// 			console.log("Okay, get these files", filesToDownload)
// 			await DownloadService.startDownload(filesToDownload);

// 			const zipFile = (fs.DocumentDirectoryPath + href) //.replace(/([^:]\/)\/+/g, "$1");

// 			// Set download state:
// 			dispatch(setCurrentDownloadProcess(lang, bundleInfo.description, filesToDownload, undefined, bundleInfo, "Downloading files", false, filesToDownload.length * 1.25, 1));
// 			return dispatch(waitForDownload());
// 		} catch (err) {
// 			dispatch(setDownloadProcessError(err));
// 			return Promise.reject(err)
// 		}
// 	}
// }

function countItemsInBundle(json) {
  let result = 0;
  if (json.modules) {
    result += json.modules.length;
  }
  if (json.actionCards) {
    result += json.actionCards.length;
  }
  if (json.procedures) {
    result += json.procedures.length;
  }
  if (json.about) {
    result += json.about.length;
  }
  if (json.drugs) {
    result += json.drugs.length;
  }
  if (json.keyLearningPoints) {
    result += json.keyLearningPoints.length;
  }
  if (json.certificates) {
    result += json.certificates.length;
  }
  if (json.images) {
    result += json.images.length;
  }
  return result;
}

export function cancelDownload() {
  return async (dispatch, getState) => {
    const { lang } = getState().currentDownloadProcess;
    if (lang !== undefined) {
      await DownloadService.cancelDownload();
      return dispatch(setDownloadProcessCanceled());
    }
  };
}

// function addBundleToRedux(json, dispatch, lang, fromZip) {
// 	let promises = [
// 		dispatch(receiveBundle(lang, json)),
// 	]

// 	if (json.modules) promises.push(dispatch(addToRedux(lang, json.modules, receiveModules, fromZip)))
// 	if (json.actionCards) promises.push(dispatch(addToRedux(lang, json.actionCards, receiveActioncards, fromZip)))
// 	if (json.procedures) promises.push(dispatch(addToRedux(lang, json.procedures, receiveProcedures, fromZip)))
// 	if (json.about) promises.push(dispatch(addToRedux(lang, json.about, receiveAbout, fromZip)))
// 	if (json.drugs) promises.push(dispatch(addToRedux(lang, json.drugs, receiveDrugs, fromZip)))
// 	if (json.onboarding) promises.push(dispatch(addToRedux(lang, json.onboarding, receiveOnboarding, fromZip)))
// 	if (json.keyLearningPoints) promises.push(dispatch(addToRedux(lang, json.keyLearningPoints, receiveKeyLearningPoint, fromZip)))
// 	if (json.certificates) promises.push(dispatch(addToRedux(lang, json.certificates, receiveCertificates, fromZip)))
// 	if (json.images) promises.push(dispatch(addImageToRedux(lang, json.images, receiveImage)))

// 	return Promise.all(promises)
// 		.then(() => {
// 			// console.log('bundle has been added to redux');
// 		}).catch((err) => {
// 			// console.log('error adding bundle from filesystem', err);
// 			return Promise.reject(err)
// 		});
// }
// function addImageToRedux(lang, array, callback) {
// 	return dispatch => {
// 		for (let i = 0; i < array.length; i++) {
// 			let id = array[i].id
// 			dispatch(callback(lang, array[i], id))
// 			dispatch(subtractOneFromCurrentDownloadProcess());
// 		}
// 	}
// }

// function addToRedux(lang, array, callback, fromZip) {
// 	return dispatch => {
// 		let promises = []
// 		for (let i = 0; i < array.length; i++) {
// 			let fn;
// 			if (fromZip) {
// 				fn = `${fs.DocumentDirectoryPath}/${array[i].href}`;
// 			} else {
// 				fn = `${fs.DocumentDirectoryPath}/content/${lang}/${array[i].href}`;
// 			}
// 			let promise = fs.readFile(fn).then(content => {
// 				let json = JSON.parse(content)
// 				let id = array[i].id
// 				dispatch(callback(lang, json, id))
// 				dispatch(subtractOneFromCurrentDownloadProcess());
// 			})
// 			promises.push(promise)

// 		}
// 		return Promise.all(promises)

// 	}
// }

export function receiveImage(lang, json, href) {
  // console.log('receiveImage', href)
  return {
    type: RECEIVE_IMAGE,
    json,
    lang,
    href
  };
}
export function doNothing(lang, json) {
  return {
    type: 'DO_ABSOLUTELY_NOTHING'
  };
}

// export async function getVideoInfoFromAssets(lang, json) {
// 	// console.log('getVideoInfoFromAssets')
// 	const fn = fs.DocumentDirectoryPath + '/durations.json'
// 	// console.log('copyFileFromAssets')
// 	await copyFileFromAssets('version/durations.json', fn)
// 	const content = await fs.readFile(fn)
// 	let json = JSON.parse(content)
// 	let duration_object = mapDuration(json)
// 	dispatch(receiveVideoDuration(duration_object))

// }

export function fetchVideoDurations() {
  console.log('start videoDuration');
  return (dispatch) => {
    let url = `${BASE_URL}/content/assets/videos/durations.json`;
    // console.log('fetchVideoDuration url', url)
    return fetch(url, {
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log('receiveVideoDuration json', json)
        let duration_object = mapDuration(json);
        dispatch(receiveVideoDuration(duration_object));
        return Promise.resolve();
      })
      .catch((err) => {
        // console.log('error with fetchVideoDuration', err)
        return Promise.reject(err);
      });
  };
}
export function mapDuration(json) {
  let duration_object = {};
  for (let i = 0; i < json.length; i++) {
    duration_object[json[i].key] = {
      href: json[i].href,
      version: json[i].version,
      duration: json[i].duration
    };
  }
  return duration_object;
}

export function receiveVideoDuration(json) {
  return {
    type: RECEIVE_VIDEO_DURATION,
    json
  };
}

export function receiveVideo(lang, json, href) {
  return {
    type: RECEIVE_VIDEO,
    json,
    lang,
    href
  };
}

export function receiveProcedures(lang, json, href) {
  return {
    type: RECEIVE_PROCEDURES,
    json,
    lang,
    href
  };
}

export function receiveActioncards(lang, json, href) {
  return {
    type: RECEIVE_ACTIONCARDS,
    json,
    lang,
    href
  };
}

export function receiveDrugs(lang, json, href) {
  return {
    type: RECEIVE_DRUGS,
    json,
    lang,
    href
  };
}
export function receiveOnboarding(lang, json, href) {
  console.log('ACTION receiveOnboarding');
  return {
    type: RECEIVE_ONBOARDING,
    json,
    lang,
    href
  };
}
// export function receiveDrugs(lang, json, href) {
// 	return {
// 		type: RECEIVE_DRUGS,
// 		json,
// 		lang,
// 		href,
// 	}
// }
export function receiveKeyLearningPoint(lang, json, href) {
  return {
    type: RECEIVE_KEY_LEARNING_POINTS,
    json,
    lang,
    href
  };
}

export function receiveCertificates(lang, json, href) {
  return {
    type: RECEIVE_CERTIFICATES,
    json,
    lang,
    href
  };
}

export function receiveModules(lang, json, href) {
  return {
    type: RECEIVE_MODULES,
    json,
    lang,
    href
  };
}

export function receiveAbout(lang, json, href) {
  return {
    type: RECEIVE_ABOUT,
    json,
    lang,
    href
  };
}

function shouldFetchIndex(state) {
  const index = state.index;
  if (!index) {
    // console.log('index didInvalidate', true, 'doesnt exist')
    return true;
  } else if (index.isFetching) {
    // console.log('index didInvalidate', false, 'isfetching')
    return false;
  } else {
    // console.log('index didInvalidate', index.didInvalidate)
    return index.didInvalidate;
    // return true
  }
}

export function fetchIndexIfNeeded(mode) {
  (dispatch, getState) => {
    if (shouldFetchIndex(getState())) {
      dispatch(fetchIndex(mode));
    }
  };
}

// export function fetchLangIfNeeded(language, mode, success) {
// 	// return () => { success() };
// 	return (dispatch, getState) => {
// 		const state = getState();
// 		// Do we need to get the language anyways?
// 		if (!(language.id in state.contentByLanguage) || state.contentByLanguage[language.id].didInvalidate) {
// 			// console.log('shouldFetch')
// 			console.log("fetchLang");
// 			const languageInState = state.contentByLanguage[language.id];
// 			// Download zip if new language
// 			if (!languageInState && language.hrefZip) {
// 				dispatch(fetchLang(language.id, language.hrefZip, mode, fetchBundleZip, success))
// 				// dispatch(fetchLang(language.id, language.href, mode, fetchBundle, success))
// 			}
// 			// Otherwise we just download every normally
// 			else {
// 				dispatch(fetchLang(language.id, language.hrefZip, mode, fetchBundleZip, success))
// 			}

// 		} else {
// 			// console.log('dont need fetch')
// 			success()
// 		}
// 	}
// }

export function invalidateLangIfOutdated(id, version) {
  return (dispatch, getState) => {
    if (getState().contentByLanguage[id]) {
      const lang_version = getState().contentByLanguage[id].version;
      if (lang_version < version) {
        // console.log('invalidateLang')
        dispatch(invalidateLang(id));
      }
    }
  };
}

export function requestIndex() {
  return {
    type: REQUEST_INDEX
  };
}
export function receiveIndex(json) {
  return {
    type: RECEIVE_INDEX,
    json,
    receivedAt: Date.now()
  };
}
export function failedIndex() {
  return {
    type: FAILED_INDEX
  };
}

export function failedContentDownload(lang, href) {
  return {
    type: FAILED_CONTENT_DOWNLOAD,
    lang,
    href
  };
}

export function cheatDowngradeLanguageVersion(langId) {
  return {
    type: DOWNGRADE_LANGUAGE_VERSION_NUMBER,
    langId
  };
}

export function fetchIndex(mode) {
  return async function(dispatch) {
    if (USE_LOCAL_CONTENT) {
      mode = 'localcontent';
    }

    let url = `${BASE_URL}/${mode}/index.json`;

    try {
      const _response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const json = await _response.json();

      return await dispatch(receiveIndex(json));
    } catch (error) {
      dispatch(failedIndex());
      return Promise.reject();
    }
  };
}

// /**
//  * Copies a file from the assets folder
//  * @param {String} src_path
//  * @param {String} dist_path
//  */
// function copyFileFromAssets(src_path, dist_path) {
// 	return RNFetchBlob.fs.cp(RNFetchBlob.fs.asset(src_path), dist_path)
// 	// console.log('Check for Strings', typeof src_path, typeof dist_path)
// 	// return fs.copyFileAssets(src_path, dist_path)
// 	// 	.then(() => console.log('copied to ' + dist_path))
// }

// export async function initAssets(src, dist) {
// 	console.log('initAssets')
// 	let json
// 	return (dispatch, getStore) => {
// 		console.log("initAssets", json)
// 		return fs.getFSInfo()
// 			.then((size) => {
// 				console.log('free space')
// 				// console.log(size)
// 				if (size.freeSpace > 70000000) {
// 					return Promise.resolve()
// 				} else {
// 					return Promise.reject('Not enough space on device')
// 				}
// 			})
// 			.then(() => handleAssetsDir('version'))
// 			.then(() => {
// 				let fn = fs.DocumentDirectoryPath + '/bundle.json';
// 				console.log("readFile");
// 				return fs.readFile(fn)
// 			})
// 			.then((content) => {
// 				json = JSON.parse(content);
// 				notifications.initNotifications(json.notifications, (arg) => dispatch(setLastNotificationDate(arg)));
// 			})
// 			.then(() => {
// 				let lang = json.langId ? json.langId : '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
// 				// console.log('lang', lang)
// 				return addBundleToRedux(json, dispatch, lang, true)
// 			})
// 			.then(() => {
// 				let lang = json.langId ? json.langId : '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
// 				return dispatch(getVideoInfoFromAssets(lang, json))
// 			})
// 			.then(() => {
// 				let lang = json.langId ? json.langId : '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
// 				for (let i = 0; i < json.videos.length; i++) {
// 					dispatch(receiveVideo(lang, json.videos[i], json.videos[i].src))
// 				}
// 			})
// 			.then(() => {
// 				let lang = json.langId ? json.langId : '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
// 				dispatch(selectLang(lang))
// 			})
// 			.catch(err => {
// 				console.log('init assets err', err)
// 				return Promise.reject(err)
// 			})
// 	}
// }

export function initAssetsStart() {
  return {
    type: INIT_ASSETS_START
  };
}
export function initAssetsSuccess() {
  return {
    type: INIT_ASSETS_SUCCESS
  };
}

export function initAssetsFail() {
  return {
    type: INIT_ASSETS_FAILED
  };
}

// function handleAssetsDir(dir) {
// 	return fs.readDirAssets(dir)
// 		.then(res => {
// 			let promises = []
// 			for (let i = 0; i < res.length; i++) {
// 				let promise
// 				if (res[i].isDirectory()) {
// 					// console.log('res ' + res[i].name + ' is a directory', res[i].path)
// 					let split = res[i].path.split(/[\s/]+/)
// 					// console.log(split[0])
// 					let dir = fs.DocumentDirectoryPath + res[i].path.replace(split[0], '')
// 					// console.log('dir', dir)
// 					promise = fs.mkdir(dir)
// 						.then(() => {
// 							// console.log('made directory')
// 							return handleAssetsDir(res[i].path)
// 						})
// 						.catch(err => {
// 							// console.log('error with directory', err)
// 						})

// 					promises.push(promise)
// 				} else {
// 					// console.log('res ' + res[i].name + ' is a file ' + res[i].path)
// 					let split = res[i].path.split(/[\s/]+/)
// 					let dir = fs.DocumentDirectoryPath + res[i].path.replace(split[0], '')
// 					// console.log('copyFile, path', res[i].path, 'dir', dir)
// 					promise = copyFileFromAssets(res[i].path, dir)
// 					promises.push(promise)
// 				}
// 			}
// 			// console.log('Promises all', promises)
// 			return Promise.all(promises)
// 		})
// 		.catch((err) => {
// 			return Promise.reject(err)
// 		})
// }

export function setAboutLearning(boolean) {
  return {
    type: SET_ABOUT_LEARNING,
    boolean
  };
}

export function hasAnsweredEssentialQuestion(
  lang,
  keyLearningPoint,
  questionIdx
) {
  // console.log('action hasAnsweredEssential', lang)
  return {
    type: SET_ESSENTIAL_QUESTION,
    keyLearningPoint,
    questionIdx,
    lang
  };
}

export function setLastNotificationDate(date) {
  // console.log("notificationUpdate");
  return {
    type: SET_LAST_NOTIFICATION_DATE,
    date: date
  };
}

export function setDeliveriesQuestionDate(date) {
  return {
    type: SET_SHOW_DELIVERIESQUESTION_DATE,
    date: date
  };
}

export function setNotificationShown(profileId, notificationName) {
  return {
    type: SET_NOTIFICATION_SHOWN,
    profileId: profileId,
    notificationName: notificationName
  };
}

export function setNotificationSchedule(
  profileId,
  notificationName,
  timestamp
) {
  return {
    type: SET_NOTIFICATION_SCHEDULE,
    profileId: profileId,
    notificationName: notificationName,
    timestamp: timestamp
  };
}

export function setCheatHasBeenUsed(profileId, cheatUsed) {
  // console.log("SET_CHEAT_USED", profileId);
  return {
    type: SET_CHEAT_USED,
    profileId: profileId,
    cheatUsed: cheatUsed
  };
}

export function setAskedForPermissionTimestamp(timestamp) {
  return {
    type: SET_ASKED_FOR_PERMISSION_TIMESTAMP,
    timestamp: timestamp
  };
}
export function setPasswordSent(boolean) {
  return {
    type: SET_PASSWORD_SENT,
    boolean
  };
}

export function setPasswordSentMethod(string) {
  return {
    type: SET_PASSWORD_SENT_METHOD,
    string
  };
}
