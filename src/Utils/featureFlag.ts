import { FeatureFlagState } from '../Reducers/featureFlagReducer';
import { store } from './store';

export const FEATURE_FLAGS = {
  SELECTIVE_DOWNLOAD: 'SELECTIVE_DOWNLOAD',
  ZOOMABLE_VIEWS: 'ZOOMABLE_VIEWS',
  MODULE_CERTIFICATION: 'MODULE_CERTIFICATION'
};

export const hasFeature = (feature: string, languageId: string) => {
  const featureFlag: FeatureFlagState = store.getState().featureFlag;
  console.log('hasFeature', feature, languageId, featureFlag);
  const result = checkFeature(feature, languageId, featureFlag);
  return result;
};

const checkFeature = (
  feature: string,
  languageId: string,
  state: FeatureFlagState
) => {
  if (!state || !state.flags) {
    //featureFlagList was not found. Return early false as we cannot determain if feature is avaliable
    return false;
  }
  const featureFromList = state.flags[feature];
  if (!featureFromList) {
    //The requested feature does not exist as a featureFlag.
    return false;
  }

  //Check if the feature has been accepted for all languages. If not check the whitelist.
  if (featureFromList.needsWhitelist) {
    return featureFromList.whitelist.indexOf(languageId) !== -1;
  } else {
    return true;
  }
};
