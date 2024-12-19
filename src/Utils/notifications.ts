import * as helpers from './helpers';
import * as PushNotification from 'react-native-push-notification';
import { setNotificationShown } from "../Actions/actions";
import moment, { min } from "moment";
import { HAS_CERTIFICATE, NOTIFICATION_ID } from "../Constants/Constants"
import { addNotificationToUserProfile, addNotificationToDevice, resetEngagementNotifications, removeProgressNotifications } from '../Actions/notificationActions';
export const NOTIFICATION_50_PERCENT = "NOTIFICATION_50_PERCENT";
export const NOTIFICATION_90_PERCENT = "NOTIFICATION_90_PERCENT";
export const NOTIFICATION_PREP_TEST = "NOTIFICATION_PREP_TEST";

const MILLIS_IN_ONE_WEEK = 604800000; // 7 * 24 * 60 * 60 * 1000;

// let usedNotifications = []
// function scheduleOneNotification(allNotifications, date) {
//     if (helpers.isNotificationsDisabledForLanguage()) {
//         return;
//     }
//     // If all notifications has been used clear usedNotifications to start over on the list
//     if (usedNotifications.length >= allNotifications.length) {
//         usedNotifications = [];
//     }

//     let number = helpers.getRandomWithManyExclusions(allNotifications, usedNotifications)
//     let title = allNotifications[number].shortDescription
//     let message = allNotifications[number].longDescription
//     // console.log("Scheduled notification with message:", message);

//     usedNotifications.push(number)
//     let data = { link: allNotifications[number].link, title: title, id: allNotifications[number].id, message: message }

//     // console.log('shedule', title, message, date, Date.now(), data)
//     scheduleNotification(message, date, data, __DEV__);
// }

export function getListOfWeeklyNotifications(allNotifications, numberOfNotifications = 0, date) {
    console.log("getListOfweeklyNotifications", allNotifications, numberOfNotifications);
    if (helpers.isNotificationsDisabledForLanguage()) {
        return [];
    }
    let usedNotifications = [];
    let selectedNotifications = [];
    for (let i = 1; i < numberOfNotifications + 1; i++) {
        const ALL_NOTIFICATIONS_HAVE_BEEN_USED = usedNotifications.length === allNotifications.length;
        if (ALL_NOTIFICATIONS_HAVE_BEEN_USED) {
            //Empty used notifcations so the process can repaet until the numberOfNotifications has been reached.
            usedNotifications = [];
        }
        const _date = moment(date);
        _date.add(i, false && __DEV__ ? "minutes" : "weeks");
        const index = helpers.getRandomWithManyExclusions(allNotifications, usedNotifications);
        if (allNotifications[index] === undefined) {
            continue;
        }
        const title = allNotifications[index].shortDescription
        const message = allNotifications[index].longDescription
        // console.log("Scheduled notification with message:", message);

        // const data = { link: allNotifications[index].link, title: title, id: allNotifications[index].id, message: message }
        const link = allNotifications[index].link
        const id = allNotifications[index].id

        selectedNotifications.push({ timeToSchedule: _date.valueOf(), headerText: message, link: link, id: id, notificationType: "WEEKLY_NOTIFICATION" })
        usedNotifications.push(index)
    }
    return selectedNotifications;
}

// export function scheduleNotificationsOnFirstRun(notifications, scheduleNumber) {
//     // console.log("scheduleNotificationsOnFirstRun", scheduleNumber);
//     let now = new Date();
//     if (__DEV__) {
//         now = new Date(now.setSeconds(now.getSeconds() + 3))
//         scheduleOneNotification(notifications, now);
//     }

//     let firstNotification = new Date(now.setHours(10 + 48, 0, 0, 0)) // First notification at 10AM in two days

//     scheduleOneNotification(notifications, firstNotification);
//     let lastNotificationDate;
//     for (i = 1; i < scheduleNumber; i++) {
//         const timestamp = firstNotification.getTime() + i * MILLIS_IN_ONE_WEEK;
//         let date = new Date(timestamp);

//         scheduleOneNotification(notifications, date);
//         lastNotificationDate = date;
//     }
//     return lastNotificationDate.getTime();
// }

export function cancelAllNotifications() {
    // console.log('cancelAllNotifications')
    PushNotification.cancelAllLocalNotifications()
}

export function getLatestScheduledNotification(scheduledNotifications): number {
    return scheduledNotifications.reduce((prev, current) => {
        return (prev > current.timeToSchedule) ? prev : current.timeToSchedule
    }, moment().valueOf())
}

export function getFirstScheduledNotification(scheduledNotifications): number {
    return scheduledNotifications.reduce((prev, current) => {
        return (prev < current.timeToSchedule) ? prev : current.timeToSchedule
    }, moment().valueOf())
}


export function scheduleNotification(message, date, data, test?) { //id have to set as a String -> ''
    PushNotification.localNotificationSchedule({
        message: message,
        date: test ? new Date(Date.now() + (4 * 1000)) : date,
        userInfo: {
            ...data,
            test
        },
    });
}

export const storeNotificationMiddleware = store => next => action => {

    // console.log("This action happened:", action.type);
    const result = next(action);
    const state = store.getState();

    const { selectedLang, contentByLanguage, currentUser, userProfiles } = state;

    const language = contentByLanguage[selectedLang];
    const { screen, modules } = language;
    let user = null;
    if (currentUser.currentUser) {
        user = userProfiles[currentUser.currentUser];
    }

    // let lastCertEntry = user.profileCertificates.length - 1 || -1;

    // const lastCertEntry = user && user.profileCertificates ? user.profileCertificates.length - 1 : -1;

    // let time_left_in_seconds = 0;

    if (HAS_CERTIFICATE && action.type === "SET_PROFILE_MODULE_SCORE") {

        if (user == null) {
            return;
        }

        const userId = user.profileId;
        let score = helpers.getTotalScoreFromStore(modules, user.profileModuleScores); // Calculate the score from 0-100.

        //timeToSchedule is set to 2 days later from "now" at 18:30 a clock.
        let timeToSchedule = moment().add(2, 'days');
        timeToSchedule.set('hour', 18);
        timeToSchedule.set('minute', 30);

        if (__DEV__) {
            timeToSchedule = moment();
            timeToSchedule.add('second', 1);
        }
        // timeToSchedule = new Date(Date.now() + 5000); //For testing notification. It will be sent 5 seconds after a Learning Module is selected.

        const shownNotifications = user.listOfShownNotifications || [];
        const shouldShow = (notificationName) => (shownNotifications.indexOf(notificationName) === -1);

        if (score >= 50 && shouldShow(NOTIFICATION_50_PERCENT)) {
            //When the user reach the score of 50-52%, the notification is fired 2 days later.
            //IF the user reach 90-99% or 100% then the notification for that value is then fired. Hence the same notification ID is used for these 3 notifications.
            const headerText = { key: "lp:certificate_center_notification_score_50_header", fallback: "you are half way there!\n" };
            const bodyText = { key: "lp:certificate_center_notification_score_50_body", fallback: "congratulations you are half way through to unlock your cerfiticate exam in My learning." };

            store.dispatch(addNotificationToUserProfile({ profileId: userId, headerText: headerText, bodyText: bodyText, timeToSchedule: timeToSchedule.valueOf(), score, notificationType: NOTIFICATION_ID.MY_LEARNING_PROGRESS }))
            store.dispatch(setNotificationShown(userId, NOTIFICATION_50_PERCENT));
        }
        else if (score >= 90 && shouldShow(NOTIFICATION_90_PERCENT)) {

            // PushNotification.cancelLocalNotifications({ id: NOTIFICATION_ID.MY_LEARNING_PROGRESS }); //Cancel the one above to prevent it from fire, if the user reach 90%+ within 2 days after it has reach 50%

            //When the user reach the score above 90% and still are under 100%, then the notification is fired 2 days later.
            //IF the user reach 90-99% or 100% then the notification for that value is then fired. Hence the same notification ID is used for these 3 notifications.
            const headerText = { key: "lp:certificate_center_notification_score_90_header", fallback: "you are very close to becoming Expert in all modules." };
            const bodyText = { key: "lp:certificate_center_notification_score_90_body", fallback: "keep up the good work." };
            store.dispatch(removeProgressNotifications());
            store.dispatch(addNotificationToUserProfile({ profileId: userId, headerText, timeToSchedule: timeToSchedule.valueOf(), bodyText, score, notificationType: NOTIFICATION_ID.MY_LEARNING_PROGRESS }));
            store.dispatch(setNotificationShown(userId, NOTIFICATION_90_PERCENT));
        }
        else if (score === 100) { //Cancel notification when the user hits score 100 and are expert in all modules
            store.dispatch(removeProgressNotifications());
        }
    }

    if (HAS_CERTIFICATE && action.type === "SET_PROFILE_CERTIFICATE") {

        if (user == null) {
            return;
        }

        const lastCertEntry = user.profileCertificates.length - 1;

        if (user.profileCertificates[lastCertEntry].unlockTimestamp > 0 && user.profileCertificates[lastCertEntry].passed == false) {

            PushNotification.cancelLocalNotifications({ id: NOTIFICATION_ID.MY_LEARNING_PROGRESS }); //Cancel the one above to prevent it from fire, if the user reach 100% within 2 days after it has reach 90%+

            //Fire a notification when the user has been expert in all modules, and the user can take the certificate exam.
            let timeToSchedule = moment();
            timeToSchedule.add('second', 1);

            const icon = 'lock_open_white';
            const buttonFunction = "Take exam";
            const headerKey = "lp:certificate_center_notification_cert_unlocked_header";
            const headerFallback = "certificate is unlocked!";
            const bodyKey = "lp:certificate_center_notification_cert_unlocked_body";
            const bodyFallback = "your certificate exam in My Learning is now unlocked.";
            const body2Key = "lp:certificate_center_notification_cert_unlocked_body_1";
            const body2Fallback = "good luck!";
            const labelKey = "lp:certificate_center_notification_cert_unlocked_button_label";
            const labelFallback = "take exam";

            const header = { key: headerKey, fallback: headerFallback };
            const body = { key: bodyKey, fallback: bodyFallback };
            const body2 = { key: body2Key, fallback: body2Fallback };
            const label = { key: labelKey, fallback: labelFallback };

            store.dispatch(addNotificationToUserProfile({ profileId: user.profileId, notificationType: NOTIFICATION_ID.EXAM_UNLOCKED, timeToSchedule: timeToSchedule.valueOf(), headerText: header, bodyText: body, bodyText2: body2, label: label, buttonFunction, icon }));
        }

        else if (user.profileCertificates[lastCertEntry].claimed == true) { //This notification will be activated when multiple certifications is possible. //When the Claim Certificate button is pressed, the SET_PROFILE_CERTIFICATE action is called.

            let timeToSchedule = moment().add(11, 'month');
            timeToSchedule.set('hour', 18);
            timeToSchedule.set('minute', 30);
            timeToSchedule.set('second', 0);

            //Then 11 months has passed, it is now possible to take the preparation questions to the certification exam.
            const headerKey = "lp:certificate_center_notification_cert_claimed_header";
            const headerFallback = "time to retake the exam";
            const bodyKey = "lp:certificate_center_notification_cert_claimed_body";
            const bodyFallback = "11 months has passed.\nMy Learning is now open for preparation questions to the cerfitication exam.";
            const labelKey = "lp:certificate_center_notification_cert_claimed_button_label";
            const labelFallback = "go to preparation";
            const icon = "certificate";
            const buttonFunction = "Go to preparation";

            const header = { key: headerKey, fallback: headerFallback };
            const body = { key: bodyKey, fallback: bodyFallback };
            const label = { key: labelKey, fallback: labelFallback };
            store.dispatch(addNotificationToUserProfile({ profileId: user.profileId, notificationType: NOTIFICATION_ID.RETAKE_EXAM_PREP, timeToSchedule: timeToSchedule.valueOf(), headerText: header, bodyText: body, label: label, buttonFunction, icon }));
            store.dispatch(setNotificationShown(user.profileId, NOTIFICATION_PREP_TEST));
        }
    }

    if (action.type === "APPROVE_DISCLAIMER") {
        // const timeToSchedule = new Date((now - (now % MILISECONDS_IN_A_DAY)) + MILISECONDS_FROM_MIDNIGHT_TO_6_30_PM_2_DAYS_LATER); //timeToSchedule is set to 2 days later from Date.now at 18:30 a clock.

        //timeToSchedule is set to 2 days later from "now" at 18:30 a clock.
        let timeToSchedule = moment(new Date()).add(2, 'days');
        timeToSchedule.set('hour', 18);
        timeToSchedule.set('minute', 30);
        timeToSchedule.set('second', 0);

        //timeToSchedule = new Date(Date.now() + 5000); //For testing notification. It will be sent 5 seconds after the disclamer has been accepted.

        //Fire notification when the user has accepted the disclaimer, to notify the user what My Learning is all about.
        const headerText = { key: "lp:certificate_center_notification_My_Learning_introduction_header", fallback: "we want to introduce you to My Learning" };
        const bodyText = { key: "lp:certificate_center_notification_My_Learning_introduction_body", fallback: "my Learning is a game with quizzes based on the content of the Safe Delivery App. if you pass the final exam you become a Safe Delivery Champion and get your own certificate" };
        const icon = "my_learning";
        const label = { key: "lp:certificate_center_notification_My_Learning_introduction_button_label", fallback: "get started" };
        const buttonFunction = "Get started";
        store.dispatch(addNotificationToDevice({ headerText, timeToSchedule: timeToSchedule.valueOf(), bodyText, icon, label, buttonFunction, notificationType: NOTIFICATION_ID.INTRO_MY_LEARNING }));
    }

    if (action.type === "UPSERT_PROFILE") {
        //Cancel the above notification if the user has created a user profile.
        PushNotification.cancelLocalNotifications({ id: '667' });
    }

    if (action.type === "SELECT_LEARNING_MODULE") {
        store.dispatch(resetEngagementNotifications());
    }

    // if (action.type === "SET_SHOW_DELIVERIESQUESTION_DATE") {

    //     const headerText = getTextFromCMS("upq:question_3", "how many deliveries did you assist last month?");

    //     //timeToSchedule is set to 1 month later from "now" at 18:30 a clock.
    //     let timeToSchedule = moment(new Date()).add(1, 'month');
    //     timeToSchedule.set('hour', 18);
    //     timeToSchedule.set('minute', 30);
    //     timeToSchedule.set('second', 0);

    //     scheduleNotification("Deliveries question", headerText, timeToSchedule.toDate(), { id: NOTIFICATION_ID.DELIVERIES_SURVEY }, NOTIFICATION_ID.DELIVERIES_SURVEY);
    // }

    //For testing use, then want to trigger the preptest notification, before the 11 months has passed. Can only be triggered from a button withIn CertificateCentralScreen and if CHEAT is enabled!
    if (action.type === "SET_11_MONTH_NOTIFICATION") {

        let timeToSchedule = moment(new Date());
        timeToSchedule.add('millisecond', 300);

        //Then 11 months has passed, it is now possible to take the preparation questions to the certification exam.
        const headerText = { key: "lp:certificate_center_notification_cert_claimed_header", fallback: "time to retake the exam" };
        const bodyText = { key: "lp:certificate_center_notification_cert_claimed_body", fallback: "11 months has passed.\nMy Learning is now open for preparation questions to the cerfitication exam." };
        const icon = "certificate";
        const label = { key: "lp:certificate_center_notification_cert_claimed_button_label", fallback: "go to preparation" };
        const buttonFunction = "Go to preparation";

        store.dispatch(addNotificationToUserProfile({ profileId: user.profileId, notificationType: NOTIFICATION_ID.RETAKE_EXAM_PREP, timeToSchedule: timeToSchedule.valueOf(), headerText, bodyText, label: label, buttonFunction, icon }));
    }
    if (action.type === "SET_PROFILE_PREP_TEST_SCORE") {

        if (user == null) {
            return;
        }

        const lastCertEntry = user.profileCertificates.length - 1;
        const modulesForPreptest = language.modules.filter(m => helpers.checkIfModuleContainsEssentialQuestion(m.id, language));
        const prepTestScore = helpers.getTotalScoreFromStore(modulesForPreptest, user.profileCertificates[lastCertEntry].profilePrepTestScores);
        if (prepTestScore === 100) {

            let timeToSchedule = moment();
            timeToSchedule.add('millisecond', 300);

            const headerText = { key: "lp:certificate_center_notification_cert_unlocked_header", fallback: "certificate is unlocked!" };
            const bodyText = { key: "lp:certificate_center_notification_cert_unlocked_body", fallback: "your certificate exam in My Learning is now unlocked." };
            const bodyText2 = { key: "lp:certificate_center_notification_cert_unlocked_body_1", fallback: "good luck!" };

            const icon = "lock_open";
            const label = { key: "lp:certificate_center_notification_cert_unlocked_button_label", fallback: "take exam" };
            const buttonFunction = "Take exam";

            store.dispatch(addNotificationToUserProfile({ profileId: user.profileId, headerText, timeToSchedule: timeToSchedule.valueOf(), bodyText, bodyText2, icon, label, buttonFunction, notificationType: NOTIFICATION_ID.RETAKE_EXAM_UNLOCKED }));
        }
    }


    return result
}

/**
 *
 * @param {array} notifications - notifications from a language version
 * @param {number} numberOfNotifications - the number of notifications that should be scheduled. OBS: Max number of notifications on iOS around 60, so you should leave room for My Learning notifications also
 */
export function initNotifications(notifications, setLastNotificationDate) {
    // console.log('initNotifications', notifications)
    // cancelAllNotifications();

    // //Added delay so that iOS notification central does not schedule notifications and then cancel them imidiately after
    // setTimeout(() => {
    //     // Schedules notifications and returns date for last notification
    //     const lastNotificationDate = scheduleNotificationsOnFirstRun(notifications, 8);
    //     // console.log("SET NOTI", lastNotificationDate);
    //     setLastNotificationDate(lastNotificationDate);
    // }, 2000)
}