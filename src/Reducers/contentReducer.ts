import { Action } from "redux";
import { isType } from "typescript-fsa";
import {
  DOWNGRADE_LANGUAGE_VERSION_NUMBER,
  FAILED_CONTENT_DOWNLOAD,
  INVALIDATE_LANG,
  RECEIVE_ABOUT,
  RECEIVE_ACTIONCARDS,
  RECEIVE_BUNDLE,
  RECEIVE_CERTIFICATES,
  RECEIVE_DRUGS,
  RECEIVE_IMAGE,
  RECEIVE_KEY_LEARNING_POINTS,
  RECEIVE_MODULES,
  RECEIVE_ONBOARDING,
  RECEIVE_PROCEDURES,
  RECEIVE_VIDEO,
  RECEIVE_VIDEO_DURATION,
  REMOVE_LANGUAGE_CONTENT,
  SET_ESSENTIAL_QUESTION,
} from "../Actions/actions";
import {
  insertLanguage,
  setSelectiveDownload,
  startDownload,
} from "../Actions/downloadActions";
import { deleteLanguage } from "../Actions/removeContentActions";
import { Video } from "./reducers";

export interface ScreenTexts {
  [key: string]: string;
}

export interface BundleImage {
  id: string;
  src: string;
  version: number;
}

export interface BundleNotification {
  id: string;
  shortDescription: string;
  longDescription: string;
  link: string;
}

export interface BundleDrug {
  id: string;
  version: number;
  description: string;
  content: string;
}

export interface BundleModule {
  id: string;
  version: number;
  icon: string;
  iconAlt: string;
  description: string;
  actionCards: Array<string>;
  procedures: Array<string>;
  keyLearningPoints: Array<string>;
  videos: Array<string>;
}

export interface BundleOnboarding {
  id: string;
  version: number;
  question: string;
  answers: Array<string>;
}

export interface Language {
  isSelectiveDownload?: boolean;
  screen: ScreenTexts;
  version: number | "none";
  description?: string;
  langId?: string;
  latitude?: number;
  longtitude?: number;
  countryCode?: string;
  videos?: Array<Video>;
  images?: Array<BundleImage>;
  notifications?: Array<BundleNotification>;
  drugs?: Array<BundleDrug>;
  modules?: Array<BundleModule>;
  certificates?: Array<any>;
  bundleUrl?: string;
  onboarding?: Array<BundleOnboarding>;
  [key: string]: any;
}

export interface ContentState {
  [langId: string]: Language;
  durations: any;
}

const INITIAL_STATE: ContentState = {
  durations: {},
  none: {
    screen: {},
    version: "none",
  },
};

// export const notificationReducer = (state: NotificationState = { ...INITIAL_STATE }, action: Action): NotificationState => {
export const contentReducer = (
  state: ContentState = { ...INITIAL_STATE },
  action: Action
): ContentState => {
  if (isType(action, insertLanguage)) {
    const language = action.payload.bundle;

    return Object.assign({}, state, {
      [language.langId]: Object.assign({}, state[language.langId], language),
    });
  }

  // if (isType(action, startDownload)) {
  //     const { language, isSelectiveDownload } = action.payload;
  //     const langId = language.id;
  //     return Object.assign({}, state, {
  //         [langId]: Object.assign({}, state[langId], {
  //             isSelectiveDownload,
  //         })
  //     })
  // }

  console.log("action", action.type);
  const legacyAction: any = action;
  switch (legacyAction.type) {
    case INVALIDATE_LANG:
    case RECEIVE_BUNDLE:
    case RECEIVE_MODULES:
    case RECEIVE_PROCEDURES:
    case RECEIVE_ABOUT:
    case RECEIVE_ACTIONCARDS:
    case RECEIVE_KEY_LEARNING_POINTS:
    case RECEIVE_DRUGS:
    case RECEIVE_ONBOARDING:
    case RECEIVE_CERTIFICATES:
    case RECEIVE_VIDEO:
    case RECEIVE_IMAGE:
    case SET_ESSENTIAL_QUESTION:
    case FAILED_CONTENT_DOWNLOAD:
      return Object.assign({}, state, {
        [legacyAction.lang]: lang(state[legacyAction.lang], action),
      });
    case RECEIVE_VIDEO_DURATION:
      return Object.assign({}, state, {
        durations: legacyAction.json,
      });
    case REMOVE_LANGUAGE_CONTENT:
      const result = Object.assign({}, state);
      // Remove language
      console.log("REMOVE_LANGUAGE_CONTENT", legacyAction.langId);
      delete result[legacyAction.langId];
      return result;
    case DOWNGRADE_LANGUAGE_VERSION_NUMBER:
      let newState = { ...state };
      console.log("DOWNLOAD_LANGUAGE", legacyAction.langId, newState);
      newState[legacyAction.langId].version = 1;
      return newState;
    default:
      return state;
  }
};

function lang(state = {}, action) {
  // console.log('lang', action.type)
  switch (action.type) {
    case INVALIDATE_LANG:
      console.log("invalidate lang");
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    case RECEIVE_BUNDLE:
      return Object.assign({}, state, {
        //isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        ...action.json,
      });
    case RECEIVE_MODULES:
      return Object.assign({}, state, {
        [action.href]: {
          ...action.json,
          didInvalidate: false,
        },
      });
    case RECEIVE_ABOUT:
      return Object.assign({}, state, {
        [action.href]: {
          ...action.json,
          didInvalidate: false,
        },
      });
    case RECEIVE_DRUGS:
    case RECEIVE_ONBOARDING:
    case RECEIVE_ACTIONCARDS:
    case RECEIVE_PROCEDURES:
    case RECEIVE_KEY_LEARNING_POINTS:
    case RECEIVE_CERTIFICATES:
    case RECEIVE_VIDEO:
    case RECEIVE_IMAGE:
      return Object.assign({}, state, {
        [action.href]: {
          ...action.json,
          didInvalidate: false,
        },
      });
    case FAILED_CONTENT_DOWNLOAD:
      return Object.assign({}, state, {
        [action.href]: {
          didInvalidate: true,
        },
      });
    case SET_ESSENTIAL_QUESTION:
      // console.log('SET_ESSEN', state)
      const stateCopy = Object.assign({}, state, {});
      // console.log('SET_ESSENTIAL_QUESTION', stateCopy[action.keyLearningPoint], stateCopy, action.keyLearningPoint)
      stateCopy[action.keyLearningPoint].questions[
        action.questionIdx
      ].hasBeenAnswered = true;
      return stateCopy;
    default:
      return state;
  }
}
