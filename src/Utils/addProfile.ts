import { store } from './store';
import { openModal, closeModal } from '../Actions/modalActions';
import { ENDPOINT_HOST } from '../Config/config';
import { profile } from './profile';
import {
  upsertProfile,
  setCurrentUser,
  removeProfile,
  setPasswordSent,
  setPasswordSentMethod
} from '../Actions/actions';
import { getTextFromCMS, removeAllSpacesFromString } from './helpers';
import { StoreState } from '../Reducers/reducers';
import NavigationService from '../Components/NavigationService';
import { EMAIL_REG, WHATS_APP_REG } from '../Constants/Constants';
import { TIMINGS } from '../Constants/Constants';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const getText = (key: string, fallback: string): string => {
  const state: StoreState = store.getState();
  return getTextFromCMS(
    state.contentByLanguage[state.selectedLang].screen,
    key,
    fallback
  );
};

const { dispatch } = store;

export async function addProfile(
  name,
  email,
  password,
  userLoginSelected,
  profileToUpgrade,
  fromSettingsScreenViewProfile
) {
  dispatch(openModal({ modalType: 'CREATE_PROFILE_FETCH' }));
  let endpoint_host = ENDPOINT_HOST(store.getState().selectedCountry);
  console.log('addProfile', email, 'password', password);
  try {
    const response = await fetch(endpoint_host + '/api/public/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: removeAllSpacesFromString(email),
        password: password,
        method: userLoginSelected
      })
    });

    const json = await response.json();
    if (json.result === 'userCreated') {
      // If the account is being upgraded we retreive old name to transfer progress. The account is upgraded if a name is passed in the props.
      let currentUserId = profileToUpgrade
        ? store.getState().currentUser.currentUser
        : null;

      let newUserId = json.id;
      if (currentUserId) {
        let profile = store.getState().userProfiles[currentUserId];

        dispatch(
          upsertProfile(
            newUserId,
            0,
            json.profileName,
            json.profileEmail,
            store.getState().selectedCountry,
            profile.profileQuestions,
            profile.profileModuleScores,
            profile.profileCertificates,
            profile.listOfShownNotifications,
            profile.dismissedUpgradeMessage,
            profile.cheatUsed,
            json.method,
            json.userSpecificNotificationScheduleList,
            profile.moduleCertificates
          )
        );
        dispatch(setCurrentUser(newUserId));
        dispatch(removeProfile(currentUserId));
      } else {
        dispatch(
          upsertProfile(
            newUserId,
            0,
            json.profileName,
            json.profileEmail,
            store.getState().selectedCountry,
            {},
            undefined,
            undefined,
            undefined,
            undefined,
            json.cheatUsed,
            json.method,
            json.userSpecificNotificationScheduleList,
            {}
          )
        );
        dispatch(setCurrentUser(newUserId));
      }

      dispatch(setPasswordSent(false)); // Reset the passwordSent flag, så it is ready again, if the user wants to reset password etc.
      dispatch(setPasswordSentMethod(null)); // Then the user is created set this to null again. The validation will after user creation look at the method used for creating the user!

      // If the online user was created with success, then sync the profile!
      let userProfiles = store.getState().userProfiles;
      await profile.syncOnlineProfiles(
        userProfiles,
        store.getState().selectedCountry
      );

      dispatch(openModal({ modalType: 'CREATE_PROFILE_SUCCESS' }));
      await sleep(1600);

      await sleep(350).then(() => {
        dispatch(closeModal());
        if (profileToUpgrade) {
          setTimeout(() => NavigationService.pop(), 350);
        } else {
          if (fromSettingsScreenViewProfile) {
            setTimeout(() => NavigationService.pop(), 350);
            setTimeout(() => NavigationService.pop(), 350);
          } else {
            setTimeout(() => NavigationService.pop(), 350);
          }
        }
      });
    } else if (json.result === 'userExists') {
      dispatch(
        openModal({
          modalType:
            userLoginSelected === 'Email'
              ? 'PROFILE_EXISTS_EMAIL'
              : 'PROFILE_EXISTS_WHATS_APP'
        })
      );
      return {
        emailError:
          userLoginSelected === 'Email'
            ? getText(
                'lp:email_already_exists_error',
                'a user with this email already exists'
              )
            : getText(
                'whatsApp_user_exists',
                'a user with this WhatsApp number already exists'
              )
      };
    } else if (json.result === 'passWordDoNotMatch') {
      dispatch(openModal({ modalType: 'PASSWORD_DOES_NOT_MATCH_WHATS_APP' }));
      setTimeout(
        () => dispatch(closeModal()),
        TIMINGS.modalHangtimeBeforeClose
      );
      return {
        passwordError: getText(
          'whatsApp_password_do_not_match',
          'password do not match the one sent to WhatsApp!'
        )
      };
    } else if (json.result === 'userCouldNotBeCreated') {
      const emailError =
        userLoginSelected === 'Email'
          ? getText(
              'lp:email_already_exists_error',
              'a user with this email already exists'
            )
          : getText('could_not_create_user', 'could not create user!');
      dispatch(openModal({ modalType: 'COULD_NOT_CREATE_PROFILE' }));
      return { nameError: '', emailError: emailError };
    } else {
      dispatch(openModal({ modalType: 'COULD_NOT_CONNECT_TO_NETWORK' }));
    }
  } catch (error) {
    if (error) {
      console.log('error', error);
      dispatch(openModal({ modalType: 'COULD_NOT_CONNECT_TO_NETWORK' }));
      await sleep(1600);
      dispatch(closeModal());
    }
  } finally {
    // await sleep(1600);
    // dispatch(closeModal());
  }
}

export async function createProfileWithEmail(
  name,
  email,
  password,
  confirmPassword,
  userProfiles,
  paramsName,
  isItFromSettingsScreenView
) {
  try {
    // isNameValid(name, userProfiles, paramsName);
    // console.log("got past isNameValid")
    if (!EMAIL_REG.test(email.trim())) {
      throw {
        emailError: getText(
          'lp:email_requirement_error',
          'you must enter an email address'
        )
      };
    }
    if (password.length < 4) {
      throw {
        passwordError: getText(
          'lp:password_requirement_error',
          'password must be at least 4 characters'
        )
      };
    }
    if (password !== confirmPassword) {
      throw {
        confirmPasswordError: getText(
          'lp:password_confirm_error',
          'passwords do not match'
        )
      };
    }

    const profileState = await addProfile(
      name,
      email,
      password,
      'Email',
      paramsName,
      isItFromSettingsScreenView
    );
    return profileState;
  } catch (error) {
    console.log('createProfileWithEmail - error ', error);
    return error;
  }
}

export async function createProfileWithWhatsApp(
  name,
  whatsAppNumber,
  code,
  userProfiles,
  paramsName,
  isItFromSettingsScreenView
) {
  try {
    // isNameValid(name, userProfiles, paramsName);
    if (!WHATS_APP_REG.test(whatsAppNumber.trim())) {
      return {
        whatsAppNumberError: getText(
          'whatsApp_number_validation',
          'you must enter a valid WhatsApp number ie. +4511223344'
        )
      };
    }

    const profileState = await addProfile(
      name,
      whatsAppNumber,
      code,
      'WhatsApp',
      paramsName,
      isItFromSettingsScreenView
    );
    return profileState;
  } catch (error) {
    console.log('createProfileWithWhatsApp - error', error);
    return error;
  }
}

function isNameValid(name, userProfiles, paramsName) {
  for (let p in userProfiles) {
    if (userProfiles[p].profileName === name && name !== paramsName) {
      throw {
        nameError: getText(
          'lp:user_already_exists_error',
          'a user by this name already exists'
        )
      };
    }
  }

  if (name.trim() === '' || name === undefined) {
    throw { nameError: getText('lp:add_user_name_error', 'invalid name') };
  }
}

export async function sendNewPasswordToWhatsApp(whatsAppNumber, resetPassword) {
  if (!whatsAppNumber || !WHATS_APP_REG.test(whatsAppNumber.trim())) {
    console.log('send error');
    return {
      whatsAppNumberError: getText(
        'whatsApp_number_validation',
        'you must enter a valid WhatsApp number ie. +4511223344'
      )
    };
  }

  dispatch(
    openModal(
      { modalType: 'SEND_WHATS_APP_NUMBER' },
      { disableFloatingCloseButton: true, disableOnBackDropPress: true }
    )
  );

  let endpoint_host = ENDPOINT_HOST(store.getState().selectedCountry);

  try {
    const response = await fetch(
      endpoint_host + '/api/public/whatsapp/sendNewPasswordToWhatsApp',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: removeAllSpacesFromString(whatsAppNumber),
          resetPassword
        })
      }
    );

    const json = await response.json();

    if (json.result === 'passwordSent') {
      dispatch(openModal({ modalType: 'SEND_PASSWORD_SUCCESS' }));

      // Set the flags so the app can know where in the user creation, the user are, if something should go wrong along the way
      dispatch(setPasswordSent(true));
      dispatch(setPasswordSentMethod('WhatsApp'));
      return { passwordSent: true };
    } else if (json.result === 'userExists') {
      dispatch(openModal({ modalType: 'PROFILE_EXISTS_WHATS_APP' }));
      return {
        whatsAppNumberError: getText(
          'WhatsApp_user_exists',
          'a user with this WhatsApp number already exist'
        )
      };
    } else if (json.result === 'passowordSentFailed') {
      dispatch(openModal({ modalType: 'COULD_NOT_SEND_CODE' }));
    } else {
      dispatch(openModal({ modalType: 'COULD_NOT_SEND_CODE' }));
    }
  } catch (error) {
    if (error) {
      console.log('error', error);
      dispatch(openModal({ modalType: 'COULD_NOT_CONNECT_TO_NETWORK' }));
    }
  } finally {
    await sleep(TIMINGS.modalHangtimeBeforeClose);
    dispatch(closeModal());
  }
}

export async function resetPassword(email, whatsApp, password) {
  let endpoint_host = ENDPOINT_HOST(store.getState().selectedCountry);

  dispatch(
    openModal(
      { modalType: 'RESET_PASSWORD' },
      { disableFloatingCloseButton: true, disableOnBackDropPress: true }
    )
  );

  try {
    const response = await fetch(endpoint_host + '/api/public/resetPassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        whatsApp,
        password
      })
    });

    const json = await response.json();

    if (json) {
      if (json.result === 'passwordReset') {
        dispatch(setPasswordSent(false));
        dispatch(setPasswordSentMethod(null));

        if (whatsApp === undefined) {
          dispatch(openModal({ modalType: 'EMAIL_PASSWORD_RESET_SUCCESS' }));
        }

        dispatch(openModal({ modalType: 'WHATSAPP_PASSWORD_RESET_SUCCESS' }));

        await sleep(TIMINGS.modalHangtimeBeforeClose); // Halt a bit so the "Password is reset..." message will show for 1200ms
        return true;
      } else if (json.result === 'invalidUser') {
        dispatch(openModal({ modalType: 'PROFILE_DO_NOT_EXIST' }));
        // this.setState({ fetchingDone: true, fetchError: this.props.getTextFromCMS("lp:network_call_invalid_user", "user does not exist") });
      } else if (json.result === 'resetPassWordFailed') {
        dispatch(openModal({ modalType: 'PASSWORD_COULD_NOT_BE_RESET' }));
        // this.setState({ fetchingDone: true, fetchError: this.props.getTextFromCMS("password_reset_failed", "the password could not be reset!") });
      } else if (json.result === 'passWordDoNotMatch') {
        // this.setState({ fetchingDone: true, passwordError: this.props.getTextFromCMS("whatsApp_password_do_not_match", "password do not match the one sent to WhatsApp!"), fetchError: "Password do not match the one sent to WhatsApp!" });
        dispatch(openModal({ modalType: 'PASSWORD_DOES_NOT_MATCH_WHATS_APP' }));
      }
    }
  } catch (error) {
    // this.setState({ fetchingDone: true, fetchError: getTextFromCMS("lp:network_error", "could not connect to the network") });
    dispatch(openModal({ modalType: 'COULD_NOT_CONNECT_TO_NETWORK' }));
  } finally {
    // await sleep(1600);
    // this.setState({ fetching: false, fetchingDone: false, fetchError: "" });

    await sleep(TIMINGS.modalHangtimeBeforeClose);
    dispatch(closeModal());
  }
}
