import { ENDPOINT_HOST } from '../Config/config';
import { removeAllSpacesFromString } from './helpers';

export async function updatePassword(oldPassword, newPassword, currentUser) {
  try {
    let endpoint_host = ENDPOINT_HOST(null);

    const response = await fetch(endpoint_host + '/api/public/changePassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: currentUser,
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    });

    const json = await response.json();

    if (json.result === 'userUpdated') {
      return {
        status: true,
        result: json.result
      };
    } else {
      return {
        status: false,
        result: json.result
      };
    }
  } catch (error) {
    console.log('updatePassword -> error: ', error);

    return {
      status: false,
      result: 'errorNoConnection'
    };
  } finally {
    console.log('updatePassword -> finally');
  }
}

export async function updateAccountInfo(
  name,
  email,
  password,
  method,
  currentUser
) {
  try {
    let endpoint_host = ENDPOINT_HOST(null);

    const response = await fetch(
      endpoint_host + '/api/public/updateProfileInfoV2',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentUser,
          password,
          info: {
            name,
            email: removeAllSpacesFromString(email),
            method
          }
        })
      }
    );

    const json = await response.json();

    if (json.result === 'userUpdated') {
      return {
        status: true,
        result: json.result,
        profileName: json.profileName,
        profileEmail: json.profileEmail
      };
    } else if (json.result === 'mailAlreadyInUse') {
      return {
        status: false,
        result: json.result
      };
    } else {
      return {
        status: false,
        result: json.result
      };
    }
  } catch (error) {
    console.log('updateAccountInfo -> error: ', error);

    return {
      status: false,
      result: 'errorNoConnection'
    };
  } finally {
    console.log('updateAccountInfo -> finally');
  }
}
