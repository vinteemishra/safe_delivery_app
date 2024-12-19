import actionCreatorFactory from "typescript-fsa";
import { FeatureFlagResultType } from "../Reducers/featureFlagReducer";

const actionCreator = actionCreatorFactory("featureFlagActions");

export const fetchFeatureFlag = actionCreator("FETCH_FEATURE_FLAG");
export const fetchFeatureFlagIfNeeded = actionCreator("FETCH_FEATURE_FLAG_IF_NEEDED");
export const successFeatureFlagFetch = actionCreator<FeatureFlagResultType>("SUCCESS_FEATURE_FLAG_FETCH");
export const invalidateFeatureFlagInfo = actionCreator("INVALIDATE_FEATURE_FLAG_INFO");
export const failedFeatureFlagFetch = actionCreator("FAILED_FEATURE_FLAG_FETCH");
