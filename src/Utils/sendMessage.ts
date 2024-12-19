import { ENDPOINT_HOST } from '../Config/config';
import { store } from './store';
import { StoreState, UserProfile } from '../Reducers/reducers';
import { getTextFromCMS } from './helpers';

const getText = (key: string, fallback: string): string => {
  const state = store.getState() as StoreState;
  return getTextFromCMS(
    state.contentByLanguage[state.selectedLang].screen,
    key,
    fallback
  );
};

const getUser = (id: string): UserProfile | undefined => {
  const state = store.getState() as StoreState;
  if (id in state.userProfiles) {
    return state.userProfiles[id];
  }
  return undefined;
};

function getCertDates(user) {
  const certDates = [];
  const keys = Object.keys(user.profileCertificates);
  for (const k of keys) {
    if (user.profileCertificates[k].certDate > 0) {
      certDates.push(user.profileCertificates[k].certDate);
    }
  }

  return certDates;
}

export async function sendCertificate(
  language: any,
  email: string,
  member: string,
  name: string,
  jobTitle: string,
  userId: string,
  uniqueId: string | undefined,
  country: string | null,
  moduleName?: string | undefined,
  method?: string | undefined,
  modulekey?: string | undefined
) {
  // Set the language so the canvas service can pick the right font to use
  const _language = language.description ? language.description : undefined;

  const user = getUser(userId);
  if (user === undefined && !moduleName) {
    return;
  }

  const _certDates = moduleName
    ? [user.moduleCertificates[modulekey].date]
    : getCertDates(user);

  var certHeader = getText(
    'lp:share_cert_header',
    'This certificate is granted to'
  );

  var certBody = moduleName
    ? `For successfully completing the ${moduleName}`
    : getText(
        'lp:share_cert_body',
        'for successfully completing the MyLearning'
      );
  var certBody1 = moduleName
    ? 'module of the MyLearning certification exam'
    : getText(
        'lp:share_cert_body_1',
        'certification exam in the Safe Delivery App'
      );
  var certBody2 = moduleName
    ? 'in the Safe Delivery App'
    : getText('lp:share_cert_body_2', 'and earning the title of:');

  try {
    const response = await fetch(
      ENDPOINT_HOST(country) + '/api/public/shareCertificate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          email,
          name,
          member,
          uniqueId,
          country: country || undefined,
          jobTitle,
          certDates: _certDates,
          certHeader,
          certBody,
          certBody1,
          certBody2,
          language: _language,
          method,
          moduleName
        })
      }
    );

    const json = await response.json();

    if (json.result === 'certificateShared') {
      return {
        status: true,
        result: json.result
      };
    } else if (json.result === 'invalidUser') {
      return {
        status: false,
        result: json.result
      };
    } else if (json.result === 'certificateCouldNotBeSent') {
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
    console.log('sendCertificate -> error: ', error);

    return {
      status: false,
      result: 'errorNoConnection'
    };
  } finally {
    console.log('sendCertificate -> finally');
  }
}
