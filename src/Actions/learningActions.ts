import actionCreatorFactory from "typescript-fsa";
import { LearningPointQuestion, Case } from "../Reducers/learningReducer";
import { number, any } from "prop-types";

const actionCreator = actionCreatorFactory("learningActions");

export const setCurrentLearningQuiz = actionCreator<{ questions: Array<LearningPointQuestion>, moduleKey: string }>("SET_CURRENT_LEARNING_QUIZ");
// export const setCurrentCertificateQuiz = actionCreator<{cases: Array<any>, introduction: string, passRate: number, deadly: number }>("SET_CURRENT_CERTIFICATE_QUIZ")
export const startQuiz = actionCreator<{ level: string, moduleKey: string, preparePrepQuiz?: boolean }>("START_QUIZ");
export const fetchTest = actionCreator("FETCH_TEST");
export const startCertificateQuiz = actionCreator<{ certId: string, cheat?: boolean }>("START_CERTIFICATE_QUIZ");
export const setCurrentCertificateQuiz = actionCreator<{ cases: Array<Case>, passRate: number, deadly: number, introduction: string }>("SET_CURRENT_CERTIFICATE_QUIZ");
export const advanceQuizIdx = actionCreator("ADVANCE_QUIZ_INDEX");
export const advanceCaseIdx = actionCreator("ADVANCE_CASE_INDEX");
export const retractQuizIdx = actionCreator("RETRACT_QUIZ_INDEX");
export const setQuizIdx = actionCreator<number>("SET_QUIZ_IDX");
export const setQuizAnswer = actionCreator<{ idx: number, answer: any, score: number }>("SET_QUIZ_ANSWER");
export const setCertificateAnswer = actionCreator<{ caseIdx: number, questionIdx: number, answer: any, score: number }>("SET_CERTIFICATE_ANSWER");
export const finishQuiz = actionCreator("FINISH_QUIZ");
export const finishPrepQuiz = actionCreator<{ lastCertEntry: number, prepTestScore: number }>("FINISH_PREP_QUIZ");
export const finishCertificateQuiz = actionCreator("FINISH_CERTIFICATE_QUIZ");
export const setProfileModuleScore = actionCreator<{ userId: string, moduleKey: string, score: number }>("SET_PROFILE_MODULE_SCORE");
export const setPrevModuleScore = actionCreator<number>("SET_PREV_MODULE_SCORE");
export const setCurrentPrepQuizModuleScore = actionCreator<number>("SET_CURRENT_MODULE_PREP_SCORE");
export const setCurrentQuizModuleScore = actionCreator<number>("SET_CURRENT_MODULE_SCORE");
export const setCertificateTestResult = actionCreator<{ currentCertScore: number, currentCertDeadly: number }>("SET_CERTIFICATE_TEST_RESULT");

export const claimCertificate = actionCreator<{name: string; jobTitle: string; certId: string}>("CLAIM_CERTIFICATE");

export const enterCertificateCentral = actionCreator<string>("ENTER_CERTIFICATE_CENTRAL");