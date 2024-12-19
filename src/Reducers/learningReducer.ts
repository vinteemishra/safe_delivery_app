import { Action } from "redux";
import { isType } from "typescript-fsa";
import { setCurrentLearningQuiz, advanceQuizIdx, startQuiz, setQuizAnswer, setPrevModuleScore, setCurrentPrepQuizModuleScore, setCurrentQuizModuleScore, retractQuizIdx, startCertificateQuiz, setCurrentCertificateQuiz, setCertificateAnswer, advanceCaseIdx, setCertificateTestResult, setQuizIdx } from "../Actions/learningActions";
import { string } from "prop-types";

export interface LearningPointQuestion {
    answers: Array<{ value: string, correct?: boolean }>;
    description: string; essential: boolean;
    id: string;
    image: string;
    link: string;
    question: string;
    quizzType: string;
    showToggle: boolean;
    hasBeenAnswered?: boolean;
}

export interface LearningPoint {
    description: string;
    id: string;
    level: string;
    questions: Array<LearningPointQuestion>;
    version: number;
}

export interface LearningPointEntry extends LearningPointQuestion {
    answer?: any;
    answerScore?: number;
}


export interface CertificateQuiz {
    id: string;
    version: number;
    description: string;
    contetn: string;
    deadly: number;
    passRate: number;
    cases: Array<Case>;
}

export interface Case {
    id: string;
    version: number;
    description: string;
    image: string;
    questions: Array<LearningPointEntry>;
}

export interface LearningState {
    currentQuizQuestions: Array<LearningPointEntry>;
    currentCertificateQuestions: Array<Case>;
    quizIdx: number;
    caseIdx: number;
    currentModule: string;
    prevModuleScore: number;
    currentPrepQuizModuleScore: number;
    currentQuizModuleScore: number;
    currentCertificateQuiz: string;
    certPassRate: number;
    deadly: number;
    certIntro: string;
    currentCertDeadly: number;
    currentCertScore: number;
};

const INITIAL_STATE: LearningState = {
    currentQuizQuestions: [],
    currentCertificateQuestions: [],
    currentCertificateQuiz: null,
    quizIdx: 0,
    caseIdx: 0,
    currentModule: null,
    prevModuleScore: null,
    currentPrepQuizModuleScore: null,
    currentQuizModuleScore: null,
    certPassRate: null,
    deadly: null,
    certIntro: "",
    currentCertDeadly: null,
    currentCertScore: null,

};

export const learningReducer = (state: LearningState = { ...INITIAL_STATE }, action: Action): LearningState => {

    if (isType(action, setCurrentLearningQuiz)) {
        return {
            ...state,
            currentQuizQuestions: action.payload.questions,
            currentModule: action.payload.moduleKey,
        }
    }

    if (isType(action, advanceQuizIdx)) {
        return {
            ...state,
            quizIdx: state.quizIdx + 1,
        }
    }

    if (isType(action, retractQuizIdx)) {
        return {
            ...state,
            quizIdx: state.quizIdx - 1,
        }
    }

    if (isType(action, setQuizIdx)) {
        return {
            ...state,
            quizIdx: action.payload,
        }
    }

    if (isType(action, startQuiz)) {
        return {
            ...state,
            quizIdx: 0,
        }
    }

    if (isType(action, advanceCaseIdx)) {
        return {
            ...state,
            quizIdx: 0,
            caseIdx: state.caseIdx + 1,
        }
    }

    if (isType(action, setQuizAnswer)) {
        let nextQuizQuestionsState = state.currentQuizQuestions.slice(0);
        nextQuizQuestionsState[action.payload.idx] = { ...nextQuizQuestionsState[action.payload.idx], answer: action.payload.answer, answerScore: action.payload.score }
        return {
            ...state,
            currentQuizQuestions: nextQuizQuestionsState,
        }
    }

    if (isType(action, setPrevModuleScore)) {
        return {
            ...state,
            prevModuleScore: action.payload,
        }
    }

    if (isType(action, setCurrentPrepQuizModuleScore)) {
        return {
            ...state,
            currentPrepQuizModuleScore: action.payload,
        }
    }

    if (isType(action, setCurrentQuizModuleScore)) {
        return {
            ...state,
            currentQuizModuleScore: action.payload,
        }
    }

    if (isType(action, startCertificateQuiz)) {
        return {
            ...state,
            currentCertificateQuiz: action.payload.certId,
        }
    }

    if (isType(action, setCurrentCertificateQuiz)) {
        return {
            ...state,
            currentCertificateQuestions: action.payload.cases,
            certPassRate: action.payload.passRate,
            deadly: action.payload.deadly,
            certIntro: action.payload.introduction,
            quizIdx: 0,
            caseIdx: 0,

        }
    }

    if (isType(action, setCertificateAnswer)) {
        const { caseIdx, questionIdx, answer, score } = action.payload;
        let nextCertificateQuestionsState = state.currentCertificateQuestions.slice(0);

        nextCertificateQuestionsState[caseIdx].questions[questionIdx] = { ...nextCertificateQuestionsState[caseIdx].questions[questionIdx], answer: answer, answerScore: score }
        return {
            ...state,
            currentCertificateQuestions: nextCertificateQuestionsState,
        }
    }

    if (isType(action, setCertificateTestResult)) {
        return {
            ...state,
            currentCertScore: action.payload.currentCertScore,
            currentCertDeadly: action.payload.currentCertDeadly,
        }
    }

    return state;
};