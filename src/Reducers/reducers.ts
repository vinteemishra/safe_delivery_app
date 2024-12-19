import { combineReducers } from 'redux';
import { LanguageConfig } from '../Utils/LanguageConfig';
import {
  APPROVE_DISCLAIMER,
  ANSWERED_SURVEY,
  CLEAR_CURRENT_DOWNLOAD_PROCESS,
  FAILED_INDEX,
  INVALIDATE_INDEX,
  RECEIVE_INDEX,
  REMOVE_PROFILE,
  REQUEST_INDEX,
  SELECT_COUNTRY,
  SELECT_LANG,
  SELECT_LEARNING_MODULE,
  SELECT_MODE,
  SELECT_MODULE,
  SET_ABOUT_LEARNING,
  SET_APP_STATE,
  SET_CONNECTION_STATUS,
  SET_IS_HEALTHCARE_WORKER,
  SET_CURRENT_DOWNLOAD_PROCESS,
  SET_CURRENT_USER,
  SET_DOWNLOAD_PROCESS_CANCELED,
  SET_DOWNLOAD_PROCESS_ERROR,
  SET_PROFILE_CERTIFICATE,
  ADD_PROFILE_CERTIFICATE,
  SET_PROFILE_MODULE_SCORE,
  SET_PROFILE_PREP_TEST_SCORE,
  SET_PROFILE_NAME,
  SET_PROFILE_QUESTION,
  SET_PROFILE_QUESTIONS,
  SET_QUIZ_ANSWERED,
  SUBTRACT_ONE_FROM_CURRENT_DOWNLOAD_PROCESS,
  UPSERT_PROFILE,
  DISMISS_UPGRADE_MESSAGE,
  SET_LAST_NOTIFICATION_DATE,
  SET_SHOW_DELIVERIESQUESTION_DATE,
  SET_NOTIFICATION_SHOWN,
  SET_CHEAT_USED,
  IS_PRE_BULILD,
  SET_ASKED_FOR_PERMISSION_TIMESTAMP,
  ADD_NOTIFICATION_TO_USER_PROFILE,
  UPDATE_USER_NOTIFICATION_SHEDULE_LIST,
  INIT_ASSETS_START,
  INIT_ASSETS_SUCCESS,
  INIT_ASSETS_FAILED,
  SET_PROFILE_COUNTRY,
  DOWNGRADE_LANGUAGE_VERSION_NUMBER,
  SET_STREAM_WARNING_DISABLED,
  SET_MEMBER_ID_ON_CERT
} from '../Actions/actions';

import { downloadReducer, DownloadState } from './downloadReducer';
import { learningReducer } from './learningReducer';
import {
  deviceSpecificNotificationScheduleList,
  NotificationState
} from './notificationReducer';

import { profile } from '../Utils/profile';
import { LearningState } from './learningReducer';
import { UserProfileNotification } from '../Actions/notificationActions';
import { AnnouncementState, announcementReducer } from './announcementReducer';
import { SyncProfileState, syncProfilesReducer } from './syncProfilesReducer';
import { ModalState, modalReducer } from './modalReducer';
import { ContentState } from './contentReducer';
import { contentReducer } from './contentReducer';
import { featureFlagReducer, FeatureFlagState } from './featureFlagReducer';
import { createUniqueCertNumber } from '../Utils/certId';
import { FEATURE_FLAGS, hasFeature } from '../Utils/featureFlag';
import { store } from '../Utils/store';

export interface StoreState {
  selectedLang: string;
  selectedCountry: string | null;
  contentByLanguage: ContentState;
  index: Index;
  isFetchingIndex: boolean;
  currentDownloadProcess;
  selectedMode: string;
  selectedModule: string;
  selectedLearningModule: string;
  userProfiles: { [id: string]: UserProfile };
  appState: string;
  isConnected: boolean;
  isHealthCareWorker: boolean;
  currentUser;
  disclaimer: { approved: boolean };
  answeredSurvey: boolean;
  isPreBuild: boolean;
  quizAnswered: boolean;
  aboutLeanring: boolean;
  lastNotificationSceduled: number;
  showDeliveriesQuestionDate: number;
  downloadReducer: DownloadState;
  learningReducer: LearningState;
  deviceSpecificNotificationScheduleList: NotificationState;
  announcementReducer: AnnouncementState;
  syncProfilesReducer: SyncProfileState;
  modalReducer: ModalState;
  featureFlag: FeatureFlagState;
  isStreamingWarningDisabled: boolean;
}

interface Index {
  version: number;
  languages: Array<Language>;
  didInvalidate: false;
  lastUpdated: number;
  updatetime: number;
  isFetching: false;
}

interface Language {
  id: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  description: string;
  version: number;
  href: string;
  hrefZip: string;
}

export interface Video {
  description: string;
  icon: string;
  id: string;
  src: string;
  version: number;
}

export interface UserProfile {
  profileId: string;
  profileTimestamp: number;
  profileName: string;
  profileEmail: string | null;
  profileModuleScores: { [key: string]: number };
  profileCertificates?: Array<{
    unlockTimestamp: number;
    score: number;
    passed: boolean;
    claimed: boolean;
    name: string;
    jobTitle?: string;
    workPlace?: string;
    certDate?: number;
    uniqueId?: string;
    memberId?: string;
    profilePrepTestScores?: object;
  }>;
  cheatUsed: boolean;
  country?: string;
  listOfShownNotifications?: Array<string>;
  dismissedUpgradeMessage?: boolean;
  userSpecificNotificationScheduleList: Array<UserProfileNotification>;
  profileQuestions?: any;
  moduleCertificates?: Array<{
    id: string;
    date: number;
  }>;
  method?: string;
}

function isFetchingIndex(state = false, action) {
  switch (action.type) {
    case REQUEST_INDEX:
      return true;
    case RECEIVE_INDEX:
    case FAILED_INDEX:
      return false;
    default:
      return state;
  }
}

function installFromAssets(
  state = { installInProgress: false, didSucceed: false },
  action
) {
  switch (action.type) {
    case INIT_ASSETS_START:
      return {
        ...state,
        installInProgress: true,
        didSucceed: false
      };
    case INIT_ASSETS_SUCCESS:
      return {
        ...state,
        installInProgress: false,
        didSucceed: true
      };
    case INIT_ASSETS_FAILED:
      return {
        ...state,
        installInProgress: false,
        didSucceed: false
      };
    default:
      return state;
  }
}
function currentDownloadProcess(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_DOWNLOAD_PROCESS: {
      const {
        lang,
        downloadItems,
        languageTitle,
        bundleInfo,
        zipFile,
        showWarning,
        currentTaskDescription,
        totalTaskCount,
        taskDoneCount
      } = action;
      return {
        ...state,
        lang,
        downloadItems,
        languageTitle,
        bundleInfo,
        zipFile,
        showWarning,
        currentTaskDescription,
        totalTaskCount,
        taskDoneCount,
        error: undefined, // reset error
        canceled: false
      };
    }
    case SUBTRACT_ONE_FROM_CURRENT_DOWNLOAD_PROCESS: {
      const { totalTaskCount, taskDoneCount } = state as any;
      if (totalTaskCount == undefined) {
        return state;
      }
      if (totalTaskCount == 0 || taskDoneCount == totalTaskCount) {
        return state;
      }
      return {
        ...state,
        taskDoneCount: taskDoneCount + action.diff
      };
    }
    case SET_DOWNLOAD_PROCESS_ERROR: {
      const { error } = action;
      return {
        ...state,
        error
      };
    }
    case SET_DOWNLOAD_PROCESS_CANCELED: {
      const { error } = action;
      return {
        ...state,
        error: undefined,
        canceled: true
      };
    }
    case CLEAR_CURRENT_DOWNLOAD_PROCESS:
      return {};
    default:
      return state;
  }
}

function selectedLang(state = 'none', action) {
  switch (action.type) {
    case SELECT_LANG:
      LanguageConfig.Instance.selectedLang = action.lang;
      return action.lang;
    default:
      return state;
  }
}
function selectedCountry(state = null, action) {
  switch (action.type) {
    case SELECT_COUNTRY:
      profile.saveProfileEndpointToFile(action.country);
      return action.country;
    default:
      return state;
  }
}
function selectedMode(state = 'content', action) {
  switch (action.type) {
    case SELECT_MODE:
      return action.mode;
    default:
      return state;
  }
}
function selectedModule(state = 'none', action) {
  switch (action.type) {
    case SELECT_MODULE:
      return action.module;
    default:
      return state;
  }
}
function selectedLearningModule(state = 'none', action) {
  switch (action.type) {
    case SELECT_LEARNING_MODULE:
      return action.module;
    default:
      return state;
  }
}

function disclaimer(state = { approved: false }, action) {
  switch (action.type) {
    case APPROVE_DISCLAIMER:
      return {
        ...state,
        approved: true
      };
    default:
      return state;
  }
}

function newCert(timestamp, score, passed) {
  return {
    claimed: false,
    certDate: 0,
    passed: passed ? passed : false,
    score: score ? score : 0,
    unlockTimestamp: timestamp ? timestamp : 0,
    jobTitle: '',
    name: '',
    workPlace: '',
    profilePrepTestScores: {}
  };
}

function mergeCert(certificates) {
  return {
    claimed:
      certificates && certificates.claimed ? certificates.claimed : false,
    certDate: certificates && certificates.certDate ? certificates.certDate : 0,
    passed: certificates && certificates.passed ? certificates.passed : false,
    score: certificates && certificates.score ? certificates.score : 0,
    unlockTimestamp:
      certificates && certificates.unlockTimeStamp
        ? certificates.unlockTimeStamp
        : 0,
    jobTitle:
      certificates && certificates.jobTitle ? certificates.jobTitle : '',
    name: certificates && certificates.name ? certificates.name : '',
    workPlace:
      certificates && certificates.workPlace ? certificates.workPlace : '',
    profilePrepTestScores:
      certificates && certificates.profilePrepTestScores
        ? certificates.profilePrepTestScores
        : {}
  };
}

function answeredSurvey(state = false, action) {
  switch (action.type) {
    case ANSWERED_SURVEY:
      return true;
    default:
      return state;
  }
}

function isPreBuild(state = false, action) {
  switch (action.type) {
    case IS_PRE_BULILD:
      // return true;
      return action.boolean;
    default:
      return state;
  }
}

function userProfiles(state = {}, action) {
  let new_profiles = null;

  switch (action.type) {
    case SET_PROFILE_NAME:
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileName: action.profileName
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    case SET_PROFILE_QUESTION:
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileQuestions: {
            ...state[action.profileId].profileQuestions,
            [action.questionId]: action.answer
          }
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    case SET_PROFILE_QUESTIONS:
      if (!state[action.profileId]) {
        return state;
      }

      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileQuestions: Object.assign(
            {},
            state[action.profileId].profileQuestions,
            action.entry
          )
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    case SET_PROFILE_MODULE_SCORE:
      // console.log("SET_PROFILE_MODULE_SCORE", action, state);
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileModuleScores: {
            ...state[action.profileId].profileModuleScores,
            [action.moduleId]: action.score
          }
        }
      };
      if (
        hasFeature(
          FEATURE_FLAGS.MODULE_CERTIFICATION,
          store.getState().selectedLang
        )
      ) {
        if (action.score === 11) {
          const ts = new Date();
          if (new_profiles[action.profileId].moduleCertificates === undefined) {
            new_profiles[action.profileId].moduleCertificates = {};
          }
          new_profiles[action.profileId].moduleCertificates = {
            ...new_profiles[action.profileId].moduleCertificates,
            [action.moduleId]: {
              id: createUniqueCertNumber(
                new_profiles[action.profileId].country,
                ts
              ),
              date: ts.getTime()
            }
          };
        } else if (
          action.score < 11 &&
          new_profiles[action.profileId].moduleCertificates &&
          new_profiles[action.profileId].moduleCertificates[action.moduleId]
        ) {
          delete new_profiles[action.profileId].moduleCertificates[
            action.moduleId
          ];
        }
      } else {
        console.log(
          'The selected lang does not have module certificate enabled'
        );
      }
      console.log('New profiles: ', new_profiles);
      profile.save(new_profiles);
      return new_profiles;
    case SET_PROFILE_PREP_TEST_SCORE:
      const relevantProfile = state[action.profileId];
      const certificates = [...relevantProfile.profileCertificates];
      const lastCert = certificates.pop();

      const updatedLastCert = {
        ...lastCert,
        profilePrepTestScores: {
          ...lastCert.profilePrepTestScores,
          [action.moduleId]: action.score
        }
      };

      new_profiles = {
        ...state,
        [action.profileId]: {
          ...relevantProfile,
          profileCertificates: [...certificates, updatedLastCert]
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    case SET_PROFILE_CERTIFICATE: {
      const certATM = state[action.profileId].profileCertificates;
      const mCert = [...certATM];
      const lastCertEntry = mCert.length - 1;

      mCert[lastCertEntry] = {
        ...state[action.profileId].profileCertificate,
        unlockTimestamp: action.unlockTimestamp,
        score: action.score,
        passed: action.passed,
        claimed: action.claimed,
        uniqueId: action.uniqueId,
        name: action.name,
        jobTitle: action.jobTitle,
        workPlace: action.workPlace,
        certDate: action.claimTimestamp,
        profilePrepTestScores: {}
      };
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileCertificates: mCert
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    }
    case ADD_PROFILE_CERTIFICATE: {
      const _certATM = state[action.profileId].profileCertificates;
      const _mCert = [..._certATM];
      const timestamp = Date.now();
      _mCert.push(newCert(timestamp, action.score, action.passed));
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileCertificates: _mCert
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    }
    case SET_MEMBER_ID_ON_CERT: {
      const { profileId, memberId, certUniqueId } = action;
      if (
        !memberId ||
        memberId.trim() === '' ||
        !certUniqueId ||
        certUniqueId.trim() === ''
      ) {
        return state;
      }

      const certs = state[profileId].profileCertificates;
      const copyOfCerts = [...certs];
      const idx = certs.findIndex((c) => c.uniqueId === certUniqueId);
      const existing = copyOfCerts[idx];

      copyOfCerts[idx] = {
        ...existing,
        memberId
      };

      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          profileCertificates: copyOfCerts
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    }

    case DISMISS_UPGRADE_MESSAGE:
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          dismissedUpgradeMessage: action.messageState
        }
      };
      return new_profiles;
    case UPSERT_PROFILE: {
      let certs;

      // If the incomming action.profileCertificates is not an array but have data on it ie. its a converted certificate inside i certificates,
      // when save that data in the correct way within the certificates structure
      if (
        !Array.isArray(action.profileCertificates) &&
        action.profileCertificates !== undefined
      ) {
        certs = [mergeCert(action.profileCertificates)];
      }
      // If the action.profileCertificates is an array with data or is undefined, act so accordingly
      else {
        certs =
          action.profileCertificates === undefined
            ? [newCert(0, 0, false)]
            : action.profileCertificates;
      }

      new_profiles = {
        ...state,
        [action.profileId]: {
          profileId: action.profileId,
          profileTimestamp: action.profileTimestamp,
          profileName: action.profileName,
          profileEmail: action.profileEmail,
          profileQuestions: action.profileQuestions,
          profileModuleScores: action.profileModuleScores,
          profileCertificates: certs,
          listOfShownNotifications: action.listOfShownNotifications,
          dismissedUpgradeMessage: action.dismissedUpgradeMessage,
          cheatUsed: action.cheatUsed,
          method: action.method,
          country: action.country,
          userSpecificNotificationScheduleList:
            action.userSpecificNotificationScheduleList,
          moduleCertificates: action.moduleCertificates
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    }

    case SET_PROFILE_COUNTRY:
      const updated = {};
      for (let profileId in state) {
        if (state.hasOwnProperty(profileId)) {
          const profile = state[profileId];

          // Use action.country, unless profile already has useful value.
          let newCountry = action.country;
          if (profile.country && profile.country !== 'Unknown') {
            newCountry = profile.country;
          }
          updated[profileId] = {
            ...profile,
            country: newCountry
          };
        }
      }
      profile.save(updated);
      return updated;

    case REMOVE_PROFILE:
      new_profiles = {
        ...state
      };
      delete new_profiles[action.profileId];
      profile.save(new_profiles);
      return new_profiles;
    // Notification stuff
    case SET_NOTIFICATION_SHOWN:
      //If there is a entry in the listOfShownNotifications in the store under the user, then keep it and push the new to the array.
      const listOfShownNotifications =
        state[action.profileId].listOfShownNotifications || [];

      if (listOfShownNotifications.indexOf(action.notificationName) === -1) {
        listOfShownNotifications.push(action.notificationName);
      }
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          listOfShownNotifications: listOfShownNotifications
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    // Add notification to the userProfile for later use for schedule notifications
    case ADD_NOTIFICATION_TO_USER_PROFILE: {
      console.log('action.payload', action.payload);
      const { profileId, ...rest } = action.payload;

      const _profileNotifications =
        state[profileId].userSpecificNotificationScheduleList || [];
      const _newProfileNotificationsList = [..._profileNotifications];

      _newProfileNotificationsList.push({ ...rest });

      new_profiles = {
        ...state,
        [profileId]: {
          ...state[profileId],
          userSpecificNotificationScheduleList: _newProfileNotificationsList
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    }
    case UPDATE_USER_NOTIFICATION_SHEDULE_LIST:
      if (action.payload.profileId == undefined) {
        return { ...state };
      }

      new_profiles = {
        ...state,
        [action.payload.profileId]: {
          ...state[action.payload.profileId],
          userSpecificNotificationScheduleList:
            action.payload.notificationScheduleList
        }
      };

      profile.save(new_profiles);
      return new_profiles;
    //Cheat stuff
    case SET_CHEAT_USED:
      new_profiles = {
        ...state,
        [action.profileId]: {
          ...state[action.profileId],
          cheatUsed: action.cheatUsed
        }
      };
      profile.save(new_profiles);
      return new_profiles;
    default:
      return state;
  }
}

function currentUser(state = { currentUser: null }, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.profileId
      };
    default:
      return state;
  }
}

// function lang(state = {}, action) {
// 	// console.log('lang', action.type)
// 	switch (action.type) {
// 		case INVALIDATE_LANG:
// 			console.log("invalidate lang");
// 			return Object.assign({}, state, {
// 				didInvalidate: true,
// 			})
// 		case RECEIVE_BUNDLE:
// 			return Object.assign({}, state, {
// 				//isFetching: false,
// 				didInvalidate: false,
// 				lastUpdated: action.receivedAt,
// 				...action.json,
// 			})
// 		case RECEIVE_MODULES:
// 			return Object.assign({}, state, {
// 				[action.href]: {
// 					...action.json,
// 					didInvalidate: false
// 				},
// 			})
// 		case RECEIVE_ABOUT:
// 			return Object.assign({}, state, {
// 				[action.href]: {
// 					...action.json,
// 					didInvalidate: false
// 				},
// 			})
// 		case RECEIVE_DRUGS:
// 		case RECEIVE_ONBOARDING:
// 		case RECEIVE_ACTIONCARDS:
// 		case RECEIVE_PROCEDURES:
// 		case RECEIVE_KEY_LEARNING_POINTS:
// 		case RECEIVE_CERTIFICATES:
// 		case RECEIVE_VIDEO:
// 		case RECEIVE_IMAGE:
// 			return Object.assign({}, state, {
// 				[action.href]: {
// 					...action.json,
// 					didInvalidate: false
// 				},
// 			})
// 		case FAILED_CONTENT_DOWNLOAD:
// 			return Object.assign({}, state, {
// 				[action.href]: {
// 					didInvalidate: true
// 				}
// 			})
// 		case SET_ESSENTIAL_QUESTION:
// 			// console.log('SET_ESSEN', state)
// 			const stateCopy = Object.assign({}, state, {});
// 			// console.log('SET_ESSENTIAL_QUESTION', stateCopy[action.keyLearningPoint], stateCopy, action.keyLearningPoint)
// 			stateCopy[action.keyLearningPoint].questions[action.questionIdx].hasBeenAnswered = true;
// 			return stateCopy;
// 		default:
// 			return state
// 	}
// }

// function contentByLanguage(state = {
// 	none: {
// 		screen: {
// 		},
// 		version: 'none'
// 	}
// }, action) {

// 	// Handle new download (typescript-fsa style action type)
// 	if (action.type === "downloadActions/INSERT_LANGUAGE_JSON") {

// 		const language = action.payload.bundle;

// 		return Object.assign({}, state, {
// 			[language.langId]: language,
// 		});
// 	}

// 	//Below is ueed for backgound dowload if there if missing media files. Kept here if we choose to go this path. It not just delete this
// 	// if (action.type === "downloadActions/SET_MISSING_FILES_TO_DOWNLOAD") {

// 	// 	const contentByLanguage = action.payload.contentByLanguage;
// 	// 	const langId = action.payload.langId;

// 	// 	const newContentByLanguage = {  missingFilesToDownload: action.payload.missingFilesToDownload, ...contentByLanguage[langId] };

// 	// 	return Object.assign({}, state, {
// 	// 		[langId]: newContentByLanguage
// 	// 	});
// 	// }

// 	switch (action.type) {
// 		case INVALIDATE_LANG:
// 		case RECEIVE_BUNDLE:
// 		case RECEIVE_MODULES:
// 		case RECEIVE_PROCEDURES:
// 		case RECEIVE_ABOUT:
// 		case RECEIVE_ACTIONCARDS:
// 		case RECEIVE_KEY_LEARNING_POINTS:
// 		case RECEIVE_DRUGS:
// 		case RECEIVE_ONBOARDING:
// 		case RECEIVE_CERTIFICATES:
// 		case RECEIVE_VIDEO:
// 		case RECEIVE_IMAGE:
// 		case SET_ESSENTIAL_QUESTION:
// 		case FAILED_CONTENT_DOWNLOAD:
// 			return Object.assign({}, state, {
// 				[action.lang]: lang(state[action.lang], action)
// 			})
// 		case RECEIVE_VIDEO_DURATION:
// 			return Object.assign({}, state, {
// 				durations: action.json
// 			})
// 		case REMOVE_LANGUAGE_CONTENT:
// 			const result = Object.assign({}, state);
// 			// Remove language
// 			delete result[action.lang];
// 			return result;
// 		case DOWNGRADE_LANGUAGE_VERSION_NUMBER:
// 			let newState = { ...state };
// 			console.log("DOWNLOAD_LANGUAGE", action.langId, newState);
// 			newState[action.langId].version = 1;
// 			return newState;
// 		default:
// 			return state
// 	}
// }

function quizAnswered(state = false, action) {
  switch (action.type) {
    case SET_QUIZ_ANSWERED:
      return action.boolean;
    default:
      return state;
  }
}
function index(
  state = {
    version: 0,
    languages: [],
    didInvalidate: true,
    lastUpdated: 0,
    updateTime: 0
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_INDEX:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case RECEIVE_INDEX:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        updateTime: Date.now(),
        ...action.json
      });
    case FAILED_INDEX:
      return Object.assign({}, state, {
        isFetching: false
      });
    case REQUEST_INDEX:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    default:
      return state;
  }
}

function appState(state = 'background', action) {
  switch (action.type) {
    case SET_APP_STATE:
      return action.state;
    default:
      return state;
  }
}

function isConnected(state = false, action) {
  switch (action.type) {
    case SET_CONNECTION_STATUS:
      return action.isConnected;
    default:
      return state;
  }
}

function isHealthCareWorker(state = false, action) {
  switch (action.type) {
    case SET_IS_HEALTHCARE_WORKER:
      return action.boolean;
    default:
      return state;
  }
}

function aboutLearning(state = true, action) {
  switch (action.type) {
    case SET_ABOUT_LEARNING:
      return action.boolean;
    default:
      return state;
  }
}

function lastNotificationScheduled(state = new Date().getTime(), action) {
  switch (action.type) {
    case SET_LAST_NOTIFICATION_DATE:
      return action.date;
    default:
      return state;
  }
}

function showDeliveriesQuestionDate(state = new Date().getTime(), action) {
  switch (action.type) {
    case SET_SHOW_DELIVERIESQUESTION_DATE:
      return action.date;
    default:
      return state; //Sometimes this runes when restarting the App, without the dispatch(showDeliveriesQuestionDate) is run!
  }
}

function askedForLocationPermission(state = 0, action) {
  switch (action.type) {
    case SET_ASKED_FOR_PERMISSION_TIMESTAMP:
      return action.timestamp;
    default:
      return state;
  }
}

function isStreamingWarningDisabled(state = false, action) {
  switch (action.type) {
    case SET_STREAM_WARNING_DISABLED:
      return action.status;
    default:
      return state;
  }
}

const rootReducer = combineReducers<StoreState>({
  selectedLang,
  selectedCountry,
  contentByLanguage: contentReducer,
  index,
  isFetchingIndex,
  currentDownloadProcess,
  selectedMode,
  selectedModule,
  selectedLearningModule,
  userProfiles,
  appState,
  isConnected,
  isHealthCareWorker,
  currentUser,
  disclaimer,
  answeredSurvey,
  quizAnswered,
  aboutLearning,
  lastNotificationScheduled,
  showDeliveriesQuestionDate,
  isPreBuild,
  askedForLocationPermission,
  // Typescript-fsa backed reducers
  downloadReducer,
  learningReducer,
  deviceSpecificNotificationScheduleList,
  // listOfScheduledNotifications,
  announcementReducer,
  syncProfilesReducer,
  modalReducer,
  installFromAssets,
  featureFlag: featureFlagReducer,
  isStreamingWarningDisabled
});

export default rootReducer;
