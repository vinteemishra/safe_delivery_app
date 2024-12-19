import { put, select, takeEvery } from 'redux-saga/effects';
import {
  startQuiz,
  setCurrentLearningQuiz,
  finishQuiz,
  finishPrepQuiz,
  setPrevModuleScore,
  setCurrentPrepQuizModuleScore,
  setCurrentQuizModuleScore,
  startCertificateQuiz,
  setCurrentCertificateQuiz,
  finishCertificateQuiz,
  setCertificateTestResult,
  enterCertificateCentral,
  claimCertificate
} from '../Actions/learningActions';
import { Action } from 'typescript-fsa';
import { StoreState, UserProfile } from '../Reducers/reducers';
import {
  getContentByLanguageProperty,
  getLevelFromModuleScore,
  shuffleArray,
  checkIfModuleContainsEssentialQuestion,
  getTotalScoreFromStore
} from '../Utils/helpers';
import {
  LearningPoint,
  LearningPointEntry,
  LearningState,
  Case
} from '../Reducers/learningReducer';
import {
  setModuleScore,
  setPrepTestScore,
  setProfileCertificate,
  SET_PROFILE_MODULE_SCORE,
  addNewCertificate
} from '../Actions/actions';
import { analytics } from '../Utils/analytics';
import { createUniqueCertNumber } from '../Utils/certId';

export const language = (state: StoreState) =>
  state.contentByLanguage[state.selectedLang];
export const learningReducer = (state: StoreState) => state.learningReducer;
export const currentUser = (state: StoreState) => state.currentUser.currentUser;
export const userProfile = (state: StoreState) =>
  state.userProfiles[state.currentUser.currentUser];

function* prepareQuiz(
  action: Action<{ level: string; moduleKey: string; preparePrepQuiz: boolean }>
) {
  const languageState = yield select(language);
  const { keyLearningPoints } = languageState[action.payload.moduleKey];
  let learning_points: Array<LearningPoint> = getContentByLanguageProperty(
    keyLearningPoints,
    languageState
  );

  let learning_points_for_level = learning_points.filter((item, i) => {
    //Prepare the learning points for the prep quiz. This one dosen't use the level system
    if (
      item &&
      (action.payload.preparePrepQuiz === true || action.payload.level == '4')
    ) {
      return true;
    }
    //Prepare the ordinary non-prep-quiz learning points where the level system is used
    else if (
      action.payload.preparePrepQuiz !== true &&
      (item && item.level === action.payload.level)
    ) {
      return true;
    }
    return false;
  });

  const _questions = learning_points_for_level.map((item) => {
    let questions = item.questions;
    let q_count = questions.length;

    //Check if there an essential question in the KLP and return its index instead of a random question index.
    const essentialQuestion = () => {
      for (let question in questions) {
        if (
          questions[question].essential == true &&
          !questions[question].hasBeenAnswered
        ) {
          return question;
        }
      }
      return -1;
    };

    const indexOfEssential = essentialQuestion();

    //Return the essentials non-random question that will be used with the prep quiz
    if (indexOfEssential >= 0) {
      return questions[indexOfEssential];
    }
    //Return the mixed randomized questions if no exential questions exist for entry. Used within the ordinaty non-prep-quiz.
    else if (!action.payload.preparePrepQuiz && indexOfEssential < 0) {
      const randomItem = Math.floor(Math.random() * q_count);
      return questions[randomItem];
    } else {
      //Do nothing. Non-essential questions are discarded for PrepQuiz
    }
  });

  //Filter out the onens that are undefined
  const questions = _questions.filter(function(element) {
    return element !== undefined;
  });

  //Randomize the order of questions
  let shuffledQuestions = shuffleArray(questions, true);

  if (action.payload.level === '4') {
    shuffledQuestions = shuffledQuestions.slice(0, 12);
  }
  //For testing purpose! Return shortend list for every selected module
  if (__DEV__) {
    shuffledQuestions = shuffledQuestions.slice(0, 3);
  }

  yield put(
    setCurrentLearningQuiz({
      questions: shuffledQuestions,
      moduleKey: action.payload.moduleKey
    })
  );
}

// function* prepareCertificateQuiz(action: Action<string>) {
function* prepareCertificateQuiz(
  action: Action<{ certId: string; cheat?: boolean }>
) {
  const languageState = yield select(language);
  const certificate = languageState[action.payload.certId];
  let cases: Array<Case> = Array.from(certificate.cases);
  action.payload.cheat ? (cases = cases.slice(0, 1)) : null;
  // cases = cases.slice(0, 1);
  yield put(
    setCurrentCertificateQuiz({
      cases: cases,
      introduction: certificate.content,
      passRate: certificate.passRate,
      deadly: certificate.deadly
    })
  );
}

function* setProfileScore() {
  const learningState: LearningState = yield select(learningReducer);
  const profileId: string = yield select(currentUser);
  const profile: UserProfile = yield select(userProfile);

  let moduleScore =
    profile.profileModuleScores &&
    learningState &&
    learningState.currentModule &&
    profile.profileModuleScores[learningState.currentModule]
      ? profile.profileModuleScores[learningState.currentModule]
      : 0;

  const level = getLevelFromModuleScore(moduleScore);

  //If the level is 4 ie. the KPL module is complete, ie. the user is on retake quiz, then do not add the score
  if (level === 4) {
    return false;
  }

  let quizAnswers: Array<LearningPointEntry> =
    learningState.currentQuizQuestions;
  const rightAnswers = quizAnswers.filter((item) => {
    if (item.answerScore === 1) {
      return true;
    }
    return false;
  });

  const newModuleScore = calculateNewModuleScore(
    rightAnswers.length,
    quizAnswers.length,
    level
  );
  yield put(setPrevModuleScore(moduleScore));
  yield put(setCurrentQuizModuleScore(newModuleScore));

  if (newModuleScore > moduleScore) {
    yield put(
      setModuleScore(profileId, learningState.currentModule, newModuleScore)
    );
  }
}

function* setProfilePrepScore(
  action: Action<{ lastCertEntry: number; prepTestScore: number }>
) {
  const learningState: LearningState = yield select(learningReducer);
  const profile: UserProfile = yield select(userProfile);

  let modulePrepScore =
    profile.profileCertificates[action.payload.lastCertEntry]
      .profilePrepTestScores[learningState.currentModule];

  if (!modulePrepScore) {
    modulePrepScore = 0;
  }

  let quizAnswers: Array<LearningPointEntry> =
    learningState.currentQuizQuestions;
  let rightAnswers = quizAnswers.filter((item) => {
    if (item.answerScore === 1) {
      return true;
    }
    return false;
  });

  const level = 3;
  const newModuleScore = calculateNewModuleScore(
    rightAnswers.length,
    quizAnswers.length,
    level
  );

  yield put(setCurrentPrepQuizModuleScore(newModuleScore));

  if (newModuleScore >= modulePrepScore) {
    yield put(
      setPrepTestScore(
        profile.profileId,
        learningState.currentModule,
        newModuleScore
      )
    );
  }
}

function* updateCertificateState() {
  console.log('updateCertificateState');
  const languageState: any = yield select(language);
  const profile: UserProfile = yield select(userProfile);
  const lastCertEntry = profile.profileCertificates.length - 1;

  //Check if all prepTests have been completed and unlock if they have. Handles possible issue of modules without prepTest questions blocking the user from retaking certificate.
  const modulesForPreptest = languageState.modules.filter((m) =>
    checkIfModuleContainsEssentialQuestion(m.id, languageState)
  );
  const prepTestScore = getTotalScoreFromStore(
    modulesForPreptest,
    profile.profileCertificates[lastCertEntry].profilePrepTestScores
  );
  console.log(
    'updateCertificateState prepTestScore prepTestScore',
    prepTestScore
  );
  if (prepTestScore === 100) {
    yield put(addNewCertificate(profile.profileId, 0, false));
  }

  // Check if the certificate is already unlocked
  const ts = Date.now();
  if (
    profile.profileCertificates &&
    profile.profileCertificates[lastCertEntry] &&
    profile.profileCertificates[lastCertEntry].unlockTimestamp &&
    profile.profileCertificates[lastCertEntry].unlockTimestamp < ts
  ) {
    return;
  }

  const langaugeModuleIds = getModuleIds(languageState);

  if (!isAllKlpPassed(langaugeModuleIds, profile.profileModuleScores)) {
    return;
  }

  yield put(
    setProfileCertificate(
      profile.profileId,
      ts,
      0,
      profile.profileCertificates[lastCertEntry].passed,
      profile.profileCertificates[lastCertEntry].claimed,
      profile.profileCertificates[lastCertEntry].name
    )
  );
}

function* isCertificatePassed() {
  const learningState: LearningState = yield select(learningReducer);
  const profile: UserProfile = yield select(userProfile);
  const profileId: string = yield select(currentUser);

  const { currentCertificateQuestions, certPassRate, deadly } = learningState;
  const arrayOfQuestions = getArrayOfQuestion(currentCertificateQuestions);
  const certificateResult = calculateCertificateResult(arrayOfQuestions);
  yield put(
    setCertificateTestResult({
      currentCertScore: certificateResult.score,
      currentCertDeadly: certificateResult.deadly
    })
  );

  if (
    certificateResult.score >= certPassRate &&
    certificateResult.deadly < deadly
  ) {
    const lastCertEntry = profile.profileCertificates.length - 1;
    yield put(
      setProfileCertificate(
        profileId,
        profile.profileCertificates[lastCertEntry].unlockTimestamp,
        certificateResult.score,
        true,
        false,
        ''
      )
    );
  }
}

function getModuleIds(lang): Array<string> {
  const ids = lang.modules.map((item) => item.id);
  return ids;
}

// function getScore(moduleIds: Array<string>, moduleScores: { [key: string]: number }): number {
//     let score = 0;
//     moduleIds.forEach(id => {
//         if (moduleScores[id]) {
//             score = score + moduleScores[id]
//         }
//     })
//     return score;
// }

function isAllKlpPassed(
  moduleIds: Array<string>,
  moduleScores: { [key: string]: number }
) {
  return moduleIds.reduce((acc: boolean, curr: string) => {
    const thisModulePassed = (moduleScores[curr] || 0) >= 11;
    return thisModulePassed && acc;
  }, true);
}

function calculateNewModuleScore(
  score: number,
  max_score: number,
  level: number
): number {
  let newModuleScore = (level - 1) * 4;
  if (score == max_score) {
    newModuleScore = level * 4 > 11 ? 11 : level * 4;
  } else if (score >= Math.ceil(max_score * 0.6)) {
    newModuleScore += 2;
  } else if (score >= Math.ceil(max_score * 0.2)) {
    newModuleScore += 1;
  } else {
    newModuleScore += 0;
  }
  return newModuleScore;
}

export function getArrayOfQuestion(
  arrayOfCases: Array<Case>
): Array<LearningPointEntry> {
  let arrayOfQuestions = [];
  arrayOfCases.forEach((item) => {
    arrayOfQuestions = arrayOfQuestions.concat(item.questions);
  });
  return arrayOfQuestions;
}

export function calculateCertificateResult(
  answers: Array<LearningPointEntry>
): { score: number; deadly: number } {
  const maxScore = answers.length;
  const answersWithoutDeadly = answers.filter((item) => {
    if (item.answerScore === -1) {
      return false;
    }
    return true;
  });

  let score = 0;
  answersWithoutDeadly.forEach((item) => {
    score += item.answerScore;
  });

  const numberOfDeadly = answers.length - answersWithoutDeadly.length;
  const procentageScore = (score / maxScore) * 100;
  return { score: procentageScore, deadly: numberOfDeadly };
}

function* claimCertificateSaga(
  action: Action<{ name: string; jobTitle: string; certId: string }>
) {
  const { name, jobTitle, certId } = action.payload;

  const user = yield select(userProfile);
  const profileId = yield select(currentUser);
  const selectedCountry = yield select((s) => s.selectedCountry);

  let claimTimestamp = new Date().getTime();
  const lastCertEntry = user ? user.profileCertificates.length - 1 : -1;

  // TODO: Make sure we have a country at this point
  let uniqueCertId;
  if (selectedCountry !== null) {
    uniqueCertId = createUniqueCertNumber(selectedCountry, claimTimestamp);
  }

  yield put(
    setProfileCertificate(
      profileId,
      user.profileCertificates[lastCertEntry].unlockTimestamp,
      user.profileCertificates[lastCertEntry].score,
      user.profileCertificates[lastCertEntry].passed,
      true,
      name,
      jobTitle,
      undefined,
      claimTimestamp,
      uniqueCertId
    )
  );
  // console.log('analytics', 'certClaimed', `:${certId}:`);
  analytics.event('certClaimed', `:${certId}:`);
}

export function* learningSaga() {
  yield takeEvery(startQuiz, prepareQuiz);
  yield takeEvery(startCertificateQuiz, prepareCertificateQuiz);
  yield takeEvery(finishQuiz, setProfileScore);
  yield takeEvery(finishPrepQuiz, setProfilePrepScore);
  yield takeEvery(finishCertificateQuiz, isCertificatePassed);
  yield takeEvery(enterCertificateCentral, updateCertificateState);
  yield takeEvery(claimCertificate, claimCertificateSaga);
  yield takeEvery(SET_PROFILE_MODULE_SCORE, updateCertificateState);
}
