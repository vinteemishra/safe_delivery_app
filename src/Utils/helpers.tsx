import { I18nManager, Platform } from 'react-native';
import { LanguageConfig } from './LanguageConfig';
import fs from 'react-native-fs';
import { BASE_URL } from '../Constants/Constants';
import { checkIfExistOnFileSystem } from '../Actions/actions';
import { Video } from '../Reducers/reducers';

// export async function fetchWithTimeout(requestId, url, options, timeout = 30000) {
export async function fetchWithTimeout(
  requestId,
  url,
  options,
  timeout = 600000
) {
  console.log('fetchWithTimeout url', url);
  const fetchPart = async () => {
    return {
      fetchRequestId: requestId,
      fetchResult: await fetch(url, options)
    };
  };
  return Promise.race([
    fetchPart(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out')), timeout)
    )
  ]).catch((e) => console.log('fetchWithTimeout error', e));
}

export const promiseDelay = (timeout) =>
  new Promise((resolve, _) => setTimeout(() => resolve(undefined), timeout));

export function getArrayItem(id, array) {
  if (!array || !id) {
    return undefined;
  }

  for (let i = 0; i < array.length; i++) {
    if (array && array[i].id == id) {
      return array[i];
    }
  }
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get random array item excluding one or more items in the array.
 * @param {array} originalArray  Array to randomly choose from
 * @param {array} arrayOfIndexesToExclude Array of the indexes that can not be choosen from.
 */
export function getRandomWithManyExclusions(
  originalArray,
  arrayOfIndexesToExclude
) {
  var rand = null;
  while (
    (rand === null || arrayOfIndexesToExclude.includes(rand)) &&
    originalArray.length > arrayOfIndexesToExclude.length
  ) {
    console.log('while getting random with many exclusions');
    rand = Math.round(Math.random() * (originalArray.length - 1));
  }
  return rand;
}

/**
 * Devide an array into smaller arrays
 * @param {array} array
 * @param {number} chunkCount length of the samller arrays.
 */
export function chunkArray(array, chunkCount) {
  // Clone so we don't modify the original array
  const arrayClone = [].concat(array);
  const chunkSize = Math.ceil(arrayClone.length / chunkCount);

  if (chunkCount < 1 || chunkSize === NaN) {
    throw Error('chunkCount must be a positive number.');
    return;
  }
  var results = [];

  while (arrayClone.length) {
    results.push(arrayClone.splice(0, chunkSize));
  }
  return results;
}

export function getLanguageContent(state) {
  return state.contentByLanguage[state.selectedLang];
}

// export function notificationMessage(message, link, title, id) {
//   Navigation.showLightBox({
//     screen: "NotificationMessage", // unique ID registered with Navigation.registerScreen
//     passProps: { message, link, title, id }, // simple serializable object that will pass as props to the lightbox (optional)
//     style: {
//       backgroundBlur: "none", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
//       backgroundColor: ColorTheme.MODAL_BACKGROUND // tint color for the background, you can specify alpha here (optional)
//     }
//   });
// }

/**
 * Converts miliseconds to the format hours:minutes:seconds
 * @param {number} duration - number in miliseconds
 */
export function msToTime(duration: number): string {
  if (typeof duration !== 'number') {
    return 'x:xx';
  }
  let milliseconds = Math.floor((duration % 1000) / 100);
  let seconds: number | string = Math.floor((duration / 1000) % 60);
  let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
  let hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  if (hours > 0) {
    return hours + ':' + minutes + ':' + seconds;
  } else {
    return minutes + ':' + seconds;
  }
}

export function getContentByLanguageProperty(array, lang) {
  let content = [];
  for (let item in array) {
    if (array[item].id) {
      content.push(lang[array[item].id]);
    } else content.push(lang[array[item]]);
  }
  return content;
}

/**
 * Randomizes an array
 * @param {array} original_array
 * @param {boolean} allowsSameOrderAfterShuffle
 */
export function shuffleArray(original_array, allowsSameOrderAfterShuffle) {
  let array = JSON.parse(JSON.stringify(original_array));
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  if (allowsSameOrderAfterShuffle) {
    return array;
  }

  if (JSON.stringify(original_array) === JSON.stringify(array)) {
    return this.shuffleArray(array);
  } else {
    return array;
  }
}

export function getLevelFromModuleScore(moduleScore) {
  let score = moduleScore;
  if (!score) {
    score = 0;
  }
  if (score == 11) {
    return 4;
  }
  return Math.floor(score / 4) + 1;
}

export function getLevelToRender(score) {
  let levelToRender = getLevelFromModuleScore(score);
  if (levelToRender === 4) {
    levelToRender = 3;
  }
  return levelToRender;
}

// export function mergeProfileProgress(original, secondary) {

//   return original; // TODO: FIX ME

//   const primary = Object.assign({}, original);
//   const isEmptyObject = (obj) => {
//     return Object.keys(obj).length === 0 && obj.constructor === Object
//   }

//   // Merge certificate - use primary if both have one
//   if (isEmptyObject(primary.profileCertificate) && !isEmptyObject(secondary.profileCertificate)) {
//     primary.profileCertificate = Object.assign({}, secondary.profileCertificate);
//   }
//   // If both have - merge properties but overwrite with primary values
//   if (!isEmptyObject(primary.profileCertificate) && !isEmptyObject(secondary.profileCertificate)) {
//     primary.profileCertificate = { ...secondary.profileCertificate, ...primary.profileCertificate }
//   }

//   // Merge KLPs
//   for (let m in secondary.profileModuleScores) {
//     let secondaryScore = secondary.profileModuleScores[m];
//     let primaryScore = m in primary.profileModuleScores ? primary.profileModuleScores[m] : 0;
//     primary.profileModuleScores[m] = Math.max(primaryScore, secondaryScore);
//   }

//   return primary;
// }

const ARABIC = '5f06426b-f7f4-ced1-66e3-d8ab3d0881bd';
const MYANMAR = '7a3f367b-99df-9bca-0b1f-100dcc14ae95';
const HINDI = '49bc07fa-9ad4-816c-17db-e693a28dd40f';
const KHMER = '130685a4-db88-3933-1026-f4ac14c4a95a';
export const RWANDA = '170e377f-709c-499d-b93c-e31bb7cb3908';
export const RWANDA_FRENCH = 'bba50fa5-52ca-8773-6f0f-257c96ade5be';
const AFGHANISTAN = 'a5cf01c8-aee8-1f48-bac8-b887483595ca';

export function getFont(type = undefined) {
  const rubik = 'Rubik';
  const merriweather = 'Merriweather';
  const padauk = 'Padauk';

  if (LanguageConfig.Instance.selectedLang == MYANMAR) {
    return padauk;
  }

  if (LanguageConfig.Instance.selectedLang === KHMER) {
    return Platform.OS === 'ios' ? 'Khmer' : 'Khmer-Regular';
  }
  if (LanguageConfig.Instance.selectedLang == HINDI && Platform.OS == 'ios') {
    return 'DevanagariSangamMN';
  }

  if (type == 'serif') {
    return merriweather;
  }

  return rubik;
}

export function isNotificationsDisabledForLanguage() {
  if (LanguageConfig.Instance.selectedLang == MYANMAR) {
    return true;
  } else {
    return false;
  }
}

export function getBackText(backText) {
  // HACK: Hide back on Myanmar
  if (Platform.OS == 'ios' && LanguageConfig.Instance.selectedLang == MYANMAR) {
    return '';
  }
  return backText;
}

export function updateRTL(langId) {
  if (langId === ARABIC || langId === AFGHANISTAN) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
}

export function isRTL(langId) {
  return langId === ARABIC || langId === AFGHANISTAN;
}

const IP_INFO_TOKEN = 'e51003d16646f4';
export async function getIpInfo() {
  const ipInfo = await fetch('https://ipinfo.io/geo', {
    headers: {
      Authorization: `Bearer ${IP_INFO_TOKEN}`,
      Accept: 'application/json; charset=UTF-8'
    }
  });
  if (ipInfo.ok) {
    return await ipInfo.json();
  }
  return undefined;
}

/**
 * @param {string} screenKey - Matches a screen text in the language version
 * @param {string} fallbackText - The fallback text if the screenKey is not present in the language version
 */
export function getTextFromCMS(screen, screenKey, fallbackText) {
  // console.log('getTextFromCMS', screen)
  return screen[screenKey] ? screen[screenKey] : fallbackText;
}

export function getTotalScoreFromStore(modules, learningModuleScores) {
  // const { selectedLang, contentByLanguage, currentUser, userProfiles } = state;

  // if (currentUser === undefined) {
  //   return -1;
  // }

  // const language = contentByLanguage[selectedLang];

  // let user = null;
  // if (currentUser.currentUser) {
  //   user = userProfiles[currentUser.currentUser];
  // }

  let completed_levels = 0;
  let module_count = 0;

  modules.forEach((mod) => {
    let moduleScore =
      learningModuleScores && learningModuleScores[mod.id]
        ? learningModuleScores[mod.id]
        : 0;

    if (moduleScore >= 11) completed_levels += 3;
    else if (moduleScore >= 8) completed_levels += 2;
    else if (moduleScore >= 4) completed_levels += 1;

    module_count += 1;
  });

  const score = (100 * completed_levels) / (module_count * 3);
  return score;
}

export function versionCompare(v1, v2, options) {
  var lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push('0');
    while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}

export function checkIfModuleContainsEssentialQuestion(moduleId, language) {
  let hasEssential = false;

  try {
    language[moduleId].keyLearningPoints.forEach((klp) => {
      if (language[klp]) {
        language[klp].questions.forEach((question) => {
          if (question.essential) {
            hasEssential = true;
          }
        });
      }
    });
  } catch (e) {
    console.log('checkModule error', e);
  }
  return hasEssential;
}

export function srcPathOnFilesystem(src) {
  return 'file://' + fs.DocumentDirectoryPath + encodeURI(src);
}

export function srcPathOnWeb(src) {
  return `${BASE_URL}${src}`;
}

export async function isAllAssetsOffline(listOfVideos) {
  console.log('isAll', listOfVideos);
  const resolve = await getIfAssetsInStorage(listOfVideos);
  console.log('isAll resolve', resolve);
  const isAllAssetsOffline = resolve.every((v) => v === true);
  return isAllAssetsOffline;
}

export async function isNoAssetsOffline(listOfVideos) {
  const resolve = await getIfAssetsInStorage(listOfVideos);
  const isNoAssetsOffline = resolve.every((v) => v === false);

  return isNoAssetsOffline;
}

async function getIfAssetsInStorage(listOfVideos) {
  const assetExistsOffline = listOfVideos.map((v) =>
    checkIfExistOnFileSystem(v)
  );
  const resolve = await Promise.all(assetExistsOffline);
  return resolve;
}

export function getVideosInModule(
  videoTitlesInModule: Array<string>,
  videosInLanguage: Array<Video>
): Array<Video> {
  const videosInModule = videoTitlesInModule
    .map((v) => {
      return getArrayItem(v, videosInLanguage);
    })
    .filter((v) => v !== undefined);
  return videosInModule;
}

export function removeAllSpacesFromString(string) {
  return string.replace(/\s/g, '');
}
