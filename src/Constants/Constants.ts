import { Platform, Dimensions } from 'react-native';

export const COLOR = {
  WHITE: '#fff',
  BLACK: '#000',
  RED: '#c00f48',
  IMPORTANT_RED: '#CC0000',
  BLUE: '#3e73b6',
  BLACK_50: 'rgba(0, 0, 0, 0.5)',
  BLACK_25: 'rgba(0,0,0,0.25)',
  BLACK_75: 'rgba(0,0,0,0.75)',
  GRAY: '#f8f8f8',
  GRAY_2: '#eaeaea'
};

export const SCREEN = {
  ok: 'Godkend',
  cancel: 'Annuller'
};

export const TIMINGS = {
  modalHangtimeBeforeClose: 1000,
  modalHangtimeWhileStoreUpdates: 1300,
  modalTimningBeforeOpenNewModal: 350,
  modalOpenAnimationTime: 300,
  modalCloseAnimationTime: 300,
  closeModalBeforeGobackOneScreen: 2300,
  goBackOneScreenAfterModalClose: 3200
};

export const HAS_CERTIFICATE = true;

export const NAVIGATOR_STYLE = () => {
  return {
    headerStyle: {
      backgroundColor: COLOR.RED,
      ...cardShadowStyle,
      height: Platform.OS === 'android' ? 60 : undefined //Testing!
    },
    headerTitleStyle: {
      color: COLOR.WHITE,
      maxWidth: Dimensions.get('window').width * 0.6,
      marginLeft: Platform.OS === 'android' ? null : 12
    },
    headerBackTitleStyle: {
      color: COLOR.WHITE
    },
    headerTintColor: COLOR.WHITE,
    headerBackTitle: null
  };
  // navBarBackgroundColor: COLOR.RED,
  // navBarTextColor: '#ffffff',
  // navBarSubtitleTextColor: '#ff0000',
  // navBarButtonColor: '#ffffff',
  // statusBarTextColorScheme: 'light',
  // navBarTextFontFamily: getFont(),
  // navBarTextFontWeight: 'normal'
};

export const cardShadowStyle = {
  shadowColor: 'rgba(0, 0, 0, 0.25)',
  shadowOpacity: 0.8,
  shadowRadius: 2,
  shadowOffset: {
    height: 4,
    width: 3
  },
  elevation: 2
};

export const cardShadow = {
  elevation: 2,
  shadowOpacity: 0.4,
  shadowRadius: 2,
  shadowColor: 'black',
  shadowOffset: { height: 1, width: 0 }
};

export const DUMMY_IMAGE_ZIP_FILE_SIZE = 12;
//TODO - get the below information from the DB, so we don't need to manually update the sizes
export const LANGUAGE_SIZE = [
  {
    name: 'Arabic',
    languageID: '5f06426b-f7f4-ced1-66e3-d8ab3d0881bd',
    size: 85 //Need the right number
  },
  {
    name: 'Bangladesh',
    languageID: '7c507a77-f40c-944d-d832-9925cce38b77',
    size: 85 //Need the right number
  },
  {
    name: 'English',
    languageID: '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da',
    size: 73
  },
  {
    name: 'Ethiopia - Amharic',
    languageID: 'f3bb22c9-d64b-26e3-cbf9-e5418e905fb1',
    size: 85
  },
  {
    name: 'Ethiopia - English',
    languageID: 'cca954e8-6c14-6924-6990-010cd19c7919',
    size: 80
  },
  {
    name: 'Ethiopia - Oromifa',
    languageID: 'a5a16d2a-c5c4-c605-f944-1e559dfe7bdf',
    size: 80
  },
  {
    name: 'Ethiopia - Somali',
    languageID: '67431a5f-a328-a334-3a79-125866630feb',
    size: 95
  },
  {
    name: 'French',
    languageID: '6a146956-9f21-206a-98cf-55db7b0a8301',
    size: 90
  },
  {
    name: 'Ghana - English',
    languageID: '791bb5cb-192d-9a45-a03a-c4a0805caf23',
    size: 65
  },
  {
    name: 'India - English',
    languageID: '7ec65d25-3edc-dde4-c066-dfe92c798404',
    size: 72
  },
  {
    name: 'India - Hindi',
    languageID: '49bc07fa-9ad4-816c-17db-e693a28dd40f',
    size: 75
  },
  {
    name: 'Kyrgyz',
    languageID: '57153e33-dd43-63d8-337b-ce55028fddb6',
    size: 85 //Need the right number
  },
  {
    name: 'Kyrgyz - Russian',
    languageID: '31ac7e6e-0a21-6d65-7c65-528baae911ca',
    size: 85 //Need the right number
  },
  {
    name: 'Laos',
    languageID: '3163c8ae-e97e-2ad3-986d-82868e1b342b',
    size: 57
  },
  {
    name: 'Myanmar',
    languageID: '7a3f367b-99df-9bca-0b1f-100dcc14ae95',
    size: 62
  },
  {
    name: 'Somali',
    languageID: '32c2c9f8-5afe-6746-2a79-9966e7987446',
    size: 95
  },
  {
    name: 'South Africa',
    languageID: 'dca15fb5-81b8-eeaa-c971-d08a7e5c7570',
    size: 60
  },
  {
    name: 'Tanzania - English',
    languageID: '52510488-1303-5e36-6616-cc66413a73f1',
    size: 85 //Need the right number
  }
];

export type RETAKE_EXAM_PREP = '2658';
export type DEV_RETAKE_EXAM_PREP = '2659';
export type RETAKE_EXAM_UNLOCKED = '2660';
export type MY_LEARNING_ENGAGEMENT = '668';
export type DELIVERIES_SURVEY = '669';
export type MY_LEARNING_PROGRESS = '2655';
export type EXAM_UNLOCKED = '2657';
export type INTRO_MY_LEARNING = '667';

interface NotificationIds {
  RETAKE_EXAM_PREP: RETAKE_EXAM_PREP;
  DEV_RETAKE_EXAM_PREP: DEV_RETAKE_EXAM_PREP;
  RETAKE_EXAM_UNLOCKED: RETAKE_EXAM_UNLOCKED;
  MY_LEARNING_ENGAGEMENT: MY_LEARNING_ENGAGEMENT;
  DELIVERIES_SURVEY: DELIVERIES_SURVEY;
  MY_LEARNING_PROGRESS: MY_LEARNING_PROGRESS;
  EXAM_UNLOCKED: EXAM_UNLOCKED;
  INTRO_MY_LEARNING: INTRO_MY_LEARNING;
}

export const NOTIFICATION_ID: NotificationIds = {
  RETAKE_EXAM_PREP: '2658',
  DEV_RETAKE_EXAM_PREP: '2659',
  RETAKE_EXAM_UNLOCKED: '2660',
  MY_LEARNING_ENGAGEMENT: '668',
  DELIVERIES_SURVEY: '669',
  MY_LEARNING_PROGRESS: '2655',
  EXAM_UNLOCKED: '2657',
  INTRO_MY_LEARNING: '667'
};

export const TEST_ANNOUNCEMENTS = [
  {
    id: 'specific-to-7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da',
    link: 'module:post-abortion-care_1487676484604',
    title: {
      '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da': 'English Specific'
    },
    body: {
      '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da': 'This is the message'
    },
    config: {
      aboveLangVersion: 290,
      // beforeTimestamp: 529489248294,
      // aboveAppVersion: "3.1.6",
      language: '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
    }
  },
  {
    id: 'i-am-global',
    link: 'video/',
    title: {
      '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da': 'English',
      '6a146956-9f21-206a-98cf-55db7b0a8301': 'French'
    },
    body: {
      '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da': 'Hey you.',
      '6a146956-9f21-206a-98cf-55db7b0a8301': 'Omelet Paris'
    },
    config: {
      aboveLangVersion: 290
      //beforeTimestamp: 529489248294,
      // aboveAppVersion: "3.1.6",
      // language: undefined,
    }
  }
];

export const BASE_URL = 'https://sdacms.blob.core.windows.net';

// expression for correct email syntax
export const EMAIL_REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// expression for correct WhatsApp number syntax
// export const WHATS_APP_REG = /^\+[1-9]\d{1,14}$/;
export const WHATS_APP_REG = /^\+(?:[0-9]\x20?){6,14}[0-9]$/;
