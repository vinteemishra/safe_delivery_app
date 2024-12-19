import { store } from './store';
import { openModal, closeModal } from '../Actions/modalActions';
import { ENDPOINT_HOST } from '../Config/config';
import {
  upsertProfile,
  setCurrentUser,
  removeProfile
} from '../Actions/actions';
import { removeAllSpacesFromString } from './helpers';
import { TIMINGS } from '../Constants/Constants';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const { dispatch } = store;

export async function userLogin(
  email: string,
  password: string,
  name?: string
) {
  let endpoint_host = ENDPOINT_HOST(store.getState().selectedCountry);

  try {
    dispatch(openModal({ modalType: 'USER_LOGIN' }));
    console.log('requesting: ', endpoint_host + '/api/public/signin');

    const response = await fetch(endpoint_host + '/api/public/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: removeAllSpacesFromString(email),
        password: password
      })
    });

    const json = await response.json();

    console.log('Rudi - inde i userLogin -> userLogin er json nu: ', json);

    if (json.result === 'userSignedin') {
      if (name !== undefined) {
        dispatch(
          upsertProfile(
            json.id,
            json.profileTimestamp,
            json.profileName,
            json.profileEmail,
            json.country,
            json.profileQuestions,
            json.profileModuleScores,
            json.profileCertificates || json.profileCertificate,
            json.listOfShownNotifications,
            json.dismissedUpgradeMessage,
            json.cheatUsed,
            json.method,
            json.userSpecificNotificationScheduleList,
            json.moduleCertificates
          )
        );
        dispatch(setCurrentUser(json.id));
        dispatch(removeProfile(name));
        dispatch(openModal({ modalType: 'USER_LOGIN_SUCCESS' }));
      } else {
        dispatch(
          upsertProfile(
            json.id,
            json.profileTimestamp,
            json.profileName,
            json.profileEmail,
            json.country,
            json.profileQuestions,
            json.profileModuleScores,
            json.profileCertificates || json.profileCertificate,
            json.listOfShownNotifications,
            json.dismissedUpgradeMessage,
            json.cheatUsed,
            json.method,
            json.userSpecificNotificationScheduleList,
            json.moduleCertificates
          )
        );
        dispatch(setCurrentUser(json.id));
        dispatch(openModal({ modalType: 'USER_LOGIN_SUCCESS' }));
      }

      await sleep(TIMINGS.modalHangtimeBeforeClose);
      return true;
    } else if (json.result === 'invalidUserOrPassword') {
      dispatch(
        openModal({
          modalType: 'COULD_NOT_UPDATE_PASSWORD',
          modalProps: {
            disableFloatingCloseButton: true,
            disableOnBackDropPress: true
          }
        })
      );
      // setTimeout(() => dispatch(closeModal()), TIMINGS.modalHangtimeBeforeClose);
      return false;
    }
  } catch (error) {
    dispatch(
      openModal({
        modalType: 'COULD_NOT_CONNECT_TO_NETWORK',
        modalProps: {
          disableFloatingCloseButton: true,
          disableOnBackDropPress: true
        }
      })
    );
    // setTimeout(() => dispatch(closeModal()), TIMINGS.modalHangtimeBeforeClose);
    return false;
  } finally {
    setTimeout(() => dispatch(closeModal()), TIMINGS.modalHangtimeBeforeClose);
  }
}
