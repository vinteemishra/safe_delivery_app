import { put, select, takeEvery } from "redux-saga/effects";
import { StoreState } from "../Reducers/reducers";
import { BASE_URL } from "../Constants/Constants";
import { USE_LOCAL_CONTENT } from "../Config/config";
import { FeatureFlagResultType } from "../Reducers/featureFlagReducer";
import { failedFeatureFlagFetch, fetchFeatureFlag, fetchFeatureFlagIfNeeded, successFeatureFlagFetch } from "../Actions/featureFlagActions";

const featureFlagReducer = (state: StoreState) => state.featureFlag;

function* fetchFeatureFlagSaga() {
    let mode = "content";
    if (USE_LOCAL_CONTENT) {
        mode = "localcontent";
    }
    let url = `${BASE_URL}/${mode}/featureFlag.json`;

    try {
        const response = yield fetch(url, {
            headers: { 'Cache-Control': 'no-cache' }
        })
        const json: FeatureFlagResultType = yield response.json()
        yield put(successFeatureFlagFetch(json));

    } catch (error) {
        yield put(failedFeatureFlagFetch());
    }

}

function shouldFetchFeatureFlag(state) {

    if (!state) {
        return true
    } else if (state.isFetching) {
        return false
    } else {
        return state.didInvalidate
    }
}

function* fetchFeatureFlagIfNeededSaga() {

    const featureFlagState = yield select(featureFlagReducer);
    const shouldFetch = shouldFetchFeatureFlag(featureFlagState);
    console.log("shouldFetch", featureFlagState, shouldFetch)
    if (shouldFetch) {
        yield put(fetchFeatureFlag());
    }
}

export function* featureFlagSaga() {
    yield takeEvery(fetchFeatureFlagIfNeeded, fetchFeatureFlagIfNeededSaga);
    yield takeEvery(fetchFeatureFlag, fetchFeatureFlagSaga);
}