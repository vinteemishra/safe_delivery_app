import { put, select, takeEvery } from 'redux-saga/effects';
import { StoreState } from '../Reducers/reducers';
import moment from 'moment';

import {
  NotificationState,
  Notification
} from '../Reducers/notificationReducer';
import {
  addNotificationToDevice,
  addNotificationToUserProfile,
  updateUserNotificationScheduleList,
  updateDeviceNotificationScheduleList,
  resetEngagementNotifications,
  removeProgressNotifications,
  setupNotifications
} from '../Actions/notificationActions';
import {
  scheduleNotification,
  cancelAllNotifications,
  getListOfWeeklyNotifications,
  getLatestScheduledNotification,
  getFirstScheduledNotification
} from '../Utils/notifications';

import { getTextFromCMS } from '../Utils/helpers';
import { NOTIFICATION_ID } from '../Constants/Constants';

export const userProfile = (state: StoreState) =>
  state.userProfiles[state.currentUser.currentUser];
export const deviceNotifications = (state: StoreState) =>
  state.deviceSpecificNotificationScheduleList;
export const disclaimer = (state: StoreState) => state.disclaimer.approved;
export const learningReducer = (state: StoreState) => state.learningReducer;
export const screen = (state: StoreState) =>
  state.contentByLanguage[state.selectedLang].screen;
export const healthcareWorker = (state: StoreState) => state.isHealthCareWorker;
export const weeklyNotifications = (state: StoreState) =>
  state.contentByLanguage[state.selectedLang].notifications;

function* scheduleNotificationsFromStore() {
  const now = moment().valueOf();

  const currentScreen = yield select(screen);
  const userProfileState = yield select(userProfile);
  let notificationsFromDevice: NotificationState = yield select(
    deviceNotifications
  );
  let notificationsFromProfile = [];

  // //Check the lists if there are some initial missing...
  notificationsFromDevice = yield initialDeviceNotificationList(
    notificationsFromDevice
  );
  // //Remove the old entries from the merged list
  notificationsFromDevice = filterOutNotificationsInThePast(
    notificationsFromDevice,
    now
  );
  //Save the updated device list to store
  yield put(updateDeviceNotificationScheduleList(notificationsFromDevice));

  if (userProfileState) {
    //If a profile is active on device get the users notifications
    notificationsFromProfile =
      userProfileState.userSpecificNotificationScheduleList || [];

    //Check the lists if there are some initial missing...
    notificationsFromProfile = yield initialUserNotificationList(
      notificationsFromProfile,
      userProfileState.profileCertificates
    );

    //Remove the old entries from the merged list
    notificationsFromProfile = filterOutNotificationsInThePast(
      notificationsFromProfile,
      now
    );

    //Save the updated user list to store if a user is active
    yield put(
      updateUserNotificationScheduleList({
        profileId: userProfileState.profileId,
        notificationScheduleList: notificationsFromProfile
      })
    );
  }

  //Merge the list of notifications from active user profile, and the list from the device
  let allNotificationsToSchdule = notificationsFromProfile.concat(
    notificationsFromDevice
  );

  //reschedule all notifications
  rescheduleNotification(allNotificationsToSchdule, currentScreen, now);
}

function rescheduleNotification(
  listOfNotifications,
  currentScreen,
  presentTimestamp
) {
  //Cancel all the old notifications
  cancelAllNotifications();
  listOfNotifications.forEach((notification: Notification) => {
    if (presentTimestamp > notification.timeToSchedule) {
      console.log('Outdated notification');
      return;
    }

    const fireDate = new Date(notification.timeToSchedule);
    if (notification.notificationType === 'WEEKLY_NOTIFICATION') {
      const headerText = notification.headerText;
      const data = {
        link: notification.link,
        message: headerText,
        notificationType: notification.notificationType
      };
      scheduleNotification(headerText, fireDate, data);
    } else {
      const headerText =
        notification.headerText &&
        getTextFromCMS(
          currentScreen,
          notification.headerText.key,
          notification.headerText.fallback
        );
      const bodyText =
        notification.bodyText &&
        getTextFromCMS(
          currentScreen,
          notification.bodyText.key,
          notification.bodyText.fallback
        );
      const bodyText2 =
        notification.bodyText2 &&
        getTextFromCMS(
          currentScreen,
          notification.bodyText2.key,
          notification.bodyText2.fallback
        );
      const label =
        notification.label &&
        getTextFromCMS(
          currentScreen,
          notification.label.key,
          notification.label.fallback
        );
      const data = {
        link: notification.link,
        headerText,
        bodyText,
        bodyText2,
        icon: notification.icon,
        label,
        buttonFunction: notification.buttonFunction,
        notificationType: notification.notificationType,
        score: notification.score
      };
      if (notification.notificationType === '667') {
        console.log('DNL - scheduleNotificaiton', headerText, fireDate, data);
      }
      scheduleNotification(headerText, fireDate, data);
    }
  });
}

function filterOutNotificationsInThePast(
  notificationsToSchdule: Notification[],
  presentTimestamp: number
): Notification[] {
  const notificationsThatShouldStay = notificationsToSchdule.filter(
    (notification) => {
      return notification.timeToSchedule >= presentTimestamp;
    }
  );
  return notificationsThatShouldStay;
}

function getHowManyDeliveriesNotificationData(numberOfNotificationsToGenerate) {
  const header = {
    key: 'upq:question_3',
    fallback: 'how many deliveries did you assist last month?'
  };
  const notificationType = NOTIFICATION_ID.DELIVERIES_SURVEY;

  let selectedNotifications = [];
  for (let i = 1; i < numberOfNotificationsToGenerate + 1; i++) {
    let timeToSchedule = moment().startOf('month');
    timeToSchedule.set('hour', 18);
    timeToSchedule.set('minute', 30);
    timeToSchedule.set('second', 0);

    timeToSchedule.add(i, 'months');
    selectedNotifications.push({
      notificationType: notificationType,
      timeToSchedule: timeToSchedule.valueOf(),
      headerText: header
    });
  }
  return selectedNotifications;
}

function getMyLearningMissesYouNotificationData(
  numberOfNotificationsToGenerate,
  firstFireDate
) {
  //Find a way to calculate the timeToSchedule + one week for every numberOfNotificationsToGenerate
  const notificationType = NOTIFICATION_ID.MY_LEARNING_ENGAGEMENT;
  const header = {
    key: 'lp:certificate_center_notification_My_Learning_misses_you_header',
    fallback: 'my learning misses you'
  };
  const body = {
    key: 'lp:certificate_center_notification_My_Learning_misses_you_body',
    fallback: 'continue your progress to become a Safe Dilivery Champion'
  };
  const icon = 'my_learning';
  const label = {
    key:
      'lp:certificate_center_notification_My_Learning_misses_you_button_label',
    fallback: 'go to next quiz'
  };
  const buttonFunction = 'Go to next quiz';

  let selectedNotifications = [];
  for (let i = 1; i < numberOfNotificationsToGenerate + 1; i++) {
    let timeToSchedule = moment(firstFireDate);
    timeToSchedule.set('hour', 18);
    timeToSchedule.set('minute', 30);
    timeToSchedule.set('second', 0);

    timeToSchedule.add(i * 2, 'weeks');

    selectedNotifications.push({
      notificationType: notificationType,
      timeToSchedule: timeToSchedule.valueOf(),
      headerText: header,
      bodyText: body,
      label: label,
      buttonFunction: buttonFunction,
      icon: icon
    });
  }
  return selectedNotifications;
}

function getPrepTestReadyNotificationData(certDate): Notification {
  const notificationType = NOTIFICATION_ID.RETAKE_EXAM_PREP;
  const header = {
    key: 'lp:certificate_center_notification_cert_claimed_header',
    fallback: 'time to retake the exam'
  };
  const body = {
    key: 'lp:certificate_center_notification_cert_claimed_body',
    fallback:
      '11 months has passed.\nMy Learning is now open for preparation questions to the cerfitication exam.'
  };
  const icon = 'certificate';
  const label = {
    key: 'lp:certificate_center_notification_cert_claimed_button_label',
    fallback: 'go to preparation'
  };
  const buttonFunction = 'Go to preparation';

  let timeToSchedule = moment(certDate).add(11, 'month');
  timeToSchedule.set('hour', 18);
  timeToSchedule.set('minute', 30);
  timeToSchedule.set('second', 0);

  // return { notificationType: notificationType, timeToSchedule: timeToSchedule.valueOf(), headerText: header, bodyText: body, label: label, buttonFunction: buttonFunction, icon: icon };
  return {
    notificationType: notificationType,
    timeToSchedule: timeToSchedule.valueOf(),
    headerText: header,
    bodyText: body,
    label: label,
    buttonFunction: buttonFunction,
    icon: icon
  };
}

function generateRandomWeeklyNotifications(
  allWeeklyNotifications,
  numberOfNotificationsToGenerate,
  firstFireDate
) {
  //if the numberOfNotificationsToGenerate are > 0 then generate as many as on numberOfNotificationsToGenerate
  //for that many weeks as well. + one week for each on numberOfNotificationsToGenerate
  //Find a way to calculate the timeToSchedule + one week for every numberOfNotificationsToGenerate
  // firstWeeklyFireDate.set("hour", 10);

  const weeklyNotifications = getListOfWeeklyNotifications(
    allWeeklyNotifications,
    numberOfNotificationsToGenerate,
    firstFireDate
  );
  return weeklyNotifications;
}
function* initialUserNotificationList(notificationList, certificates) {
  // 1. MyLearning misses you every 14 days for 6 months. Warning -> Might have 2 cancel and delete theese if the user uses the app, and trigger the notification middelware?
  // - ID: "668"
  // 2. If the user has a certificate(if more check the latest). Then fire a 11 mounths has passed, at the certDate + 11 mounths

  let _userSpecificNotificationScheduleList = [...notificationList];

  //Number of "My Learning misses you" notifications that should be scheduled in advance
  let numberOfMyLearningEngagementNotificationsToSchedule = 13;

  // const userProfileState = yield select(userProfile);
  const lastCertEntry = certificates ? certificates.length - 1 : -1;

  // let shouldAddMyLearningMissesYouNotification = numberOfMyLearningMissesYouNotificationsToScheduleResult < numberOfMyLearningMissesYouNotificationsToSchedule ? true : false; //TODO -> This needs to be updated by a loop through the notificationList

  let userHasScheduledPrepTestNotification =
    notificationList.filter(
      (notification) =>
        notification.notificationType === NOTIFICATION_ID.RETAKE_EXAM_PREP
    ).length > 0;
  let shouldAddPrepTestNotification =
    lastCertEntry > -1 && !userHasScheduledPrepTestNotification ? true : false;
  console.log(
    'UPN - prepTest',
    userHasScheduledPrepTestNotification,
    shouldAddPrepTestNotification,
    lastCertEntry
  );
  // //Push the notifications if they are needed
  if (shouldAddPrepTestNotification) {
    const certDate = certificates[lastCertEntry]
      ? certificates[lastCertEntry].certDate
      : 0;
    console.log('UPN - shouldAddPreptestNotification', certDate);
    //Add notification to the _updatedUserProfileNotificationsList
    if (certDate && certDate > 0) {
      _userSpecificNotificationScheduleList = _userSpecificNotificationScheduleList.concat(
        getPrepTestReadyNotificationData(certDate)
      );
    }
  }

  //     //TODO - see if there is a MyLearning misses you already, and if there is enough. ID: "668" -> update numberOfMyLearningMissesYouNotificationsToScheduled
  const engagementNotificationsScheduled = _userSpecificNotificationScheduleList.filter(
    (notification) =>
      notification.notificationType === NOTIFICATION_ID.MY_LEARNING_ENGAGEMENT
  );
  const numberOfEngagementNotificationsScheduled =
    engagementNotificationsScheduled.length;
  const needsToScheduleMoreEngagementNotifications =
    numberOfEngagementNotificationsScheduled <
    numberOfMyLearningEngagementNotificationsToSchedule
      ? true
      : false;

  if (needsToScheduleMoreEngagementNotifications) {
    let numberOfNotificationsToSchedule =
      numberOfMyLearningEngagementNotificationsToSchedule -
      numberOfEngagementNotificationsScheduled;
    //TODO - Schedule if needed
    const latestScheduledNotification = getLatestScheduledNotification(
      engagementNotificationsScheduled
    );

    const scheduleFromDate = moment(latestScheduledNotification).valueOf();
    _userSpecificNotificationScheduleList = _userSpecificNotificationScheduleList.concat(
      getMyLearningMissesYouNotificationData(
        numberOfNotificationsToSchedule,
        scheduleFromDate
      )
    );
    console.log(
      'UPN - _userSpecificNotificationScheduleList',
      _userSpecificNotificationScheduleList
    );
  }

  return _userSpecificNotificationScheduleList;
}

function isNewFireDateSameAsOldFireDate(notificationList) {
  const firstEngagementDate = getFirstScheduledNotification(
    (notificationList || []).filter(
      (noti) => noti.notificationType === NOTIFICATION_ID.MY_LEARNING_ENGAGEMENT
    )
  );
  const WHEN_WE_WANT_FIRST_DATE = moment().add(14, 'days');
  return moment(firstEngagementDate).isSame(WHEN_WE_WANT_FIRST_DATE, 'day');
}

function* updateEngagementNotifications() {
  const userProfileState = yield select(userProfile);

  if (
    !userProfileState ||
    isNewFireDateSameAsOldFireDate(
      userProfileState.userSpecificNotificationScheduleList
    )
  ) {
    return;
  }

  let notificationsFromProfile = [];
  if (userProfileState) {
    //If a profile is active on device get the users notifications
    notificationsFromProfile =
      userProfileState.userSpecificNotificationScheduleList || [];

    //Remove all previous engagement notifications from list
    notificationsFromProfile = notificationsFromProfile.filter(
      (notification) =>
        notification.notificationType !== NOTIFICATION_ID.MY_LEARNING_ENGAGEMENT
    );

    //Save the updated user list to store if a user is active
    yield put(
      updateUserNotificationScheduleList({
        profileId: userProfileState.profileId,
        notificationScheduleList: notificationsFromProfile
      })
    );
    yield scheduleNotificationsFromStore();
  }
}

function* initialDeviceNotificationList(notificationList) {
  //This shall be called every time the app starts, and when the user switches language.

  // 1. Weekly one notification for 6 mounths. From notifications from the store contentByLanguage.[selectedLang].notifications -> random..
  // - ID: there is a id on alle the 69 notifications in the store
  // 2. If the user is a helthcareworker, then 1 notification every month for 6 months. Determine if the user is healthCare worker!
  // - ID: "669"

  // const deviceNotificationsState = yield select(deviceNotifications);
  let listOfAllPossibleWeeklyNotifications = yield select(weeklyNotifications);
  let _deviceSpecificNotificationScheduleList = [...notificationList] || [];

  //Information to check against to see if there are enough weekly notifications are scheduled
  const numberOfWeeklyNotificationsThatShouldBeScheduledAtATime = 26;
  const weeklyNotificationsAlreadyScheduled = _deviceSpecificNotificationScheduleList.filter(
    (notification) => notification.notificationType === 'WEEKLY_NOTIFICATION'
  );
  const numberOfWeeklyNotificationsAlreadyScheduled =
    weeklyNotificationsAlreadyScheduled.length;
  const numberOfWeeklyNotificationsScheduledResult =
    numberOfWeeklyNotificationsThatShouldBeScheduledAtATime -
    numberOfWeeklyNotificationsAlreadyScheduled;

  //Set the flags if there is the need to add more notifications
  let shouldAddMoreWeeklyNotifications =
    numberOfWeeklyNotificationsAlreadyScheduled <
    numberOfWeeklyNotificationsThatShouldBeScheduledAtATime
      ? true
      : false; //TODO -> This needs to be updated by a loop through the notificationList
  // let shouldAddMyLearningIntroNotification = !userHasScheduledDisclaimerNotification && disclaimerAproved; //TODO -> Found out if there should be another factor to determine if the user should be notified with the welcome to MyLearning

  //Update numberOfWeeklyNotificationsScheduled
  if (shouldAddMoreWeeklyNotifications) {
    //TODO - Identify which notifications are being used
    const listOfWeeklyNotificationsNotYetScheduled = listOfAllPossibleWeeklyNotifications.filter(
      (notification) => {
        for (let noti in weeklyNotificationsAlreadyScheduled) {
          if (
            weeklyNotificationsAlreadyScheduled[noti].headerText ===
            notification.headerText
          ) {
            return false;
          }
        }
        return true;
      }
    );

    const latestScheduledWeeklyNotification = getLatestScheduledNotification(
      weeklyNotificationsAlreadyScheduled
    );
    console.log('latestScheduledWeeklyNotification');
    let date = moment(latestScheduledWeeklyNotification);
    date.set('hour', 18);
    date.set('minute', 30);
    date.set('second', 0);

    const newWeeklyNotifications = generateRandomWeeklyNotifications(
      listOfWeeklyNotificationsNotYetScheduled,
      numberOfWeeklyNotificationsScheduledResult,
      date
    );
    console.log('new weekly');
    _deviceSpecificNotificationScheduleList = _deviceSpecificNotificationScheduleList.concat(
      newWeeklyNotifications
    );
  }

  const isUserHealthcareWorker = yield select(healthcareWorker);
  let shouldAddHealthcareNotification = isUserHealthcareWorker || __DEV__;

  if (shouldAddHealthcareNotification) {
    //remove all previously scheduled delivery survey notifications.
    _deviceSpecificNotificationScheduleList = _deviceSpecificNotificationScheduleList.filter(
      (notification) =>
        notification.notificationType !== NOTIFICATION_ID.DELIVERIES_SURVEY
    );

    // add a monthly notification a half year in advance
    const HALF_A_YEAR_IN_MONTHS = 6;
    const deliveriesSurveyNotifications = getHowManyDeliveriesNotificationData(
      HALF_A_YEAR_IN_MONTHS
    );
    _deviceSpecificNotificationScheduleList = _deviceSpecificNotificationScheduleList.concat(
      deliveriesSurveyNotifications
    );
  }

  return _deviceSpecificNotificationScheduleList;
}

function* rmProgressNotifications() {
  const userProfileState = yield select(userProfile);
  let notificationsFromProfile = [];
  if (userProfileState) {
    //If a profile is active on device get the users notifications
    notificationsFromProfile =
      userProfileState.userSpecificNotificationScheduleList || [];

    //Remove all previous engagement notifications from list
    notificationsFromProfile = notificationsFromProfile.filter(
      (notification) =>
        notification.notificationType !== NOTIFICATION_ID.MY_LEARNING_PROGRESS
    );

    //Save the updated user list to store if a user is active
    yield put(
      updateUserNotificationScheduleList({
        profileId: userProfileState.profileId,
        notificationScheduleList: notificationsFromProfile
      })
    );
    yield scheduleNotificationsFromStore();
  }
}

export function* notificationSaga() {
  yield takeEvery(addNotificationToUserProfile, scheduleNotificationsFromStore);
  yield takeEvery(addNotificationToDevice, scheduleNotificationsFromStore);
  yield takeEvery(resetEngagementNotifications, updateEngagementNotifications);
  yield takeEvery(removeProgressNotifications, rmProgressNotifications);
  yield takeEvery(setupNotifications, scheduleNotificationsFromStore);
}
