import { call, delay, put, select, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { selectCountry, setProfileCountry } from "../Actions/actions";
import { lookupCountryIfMissing } from "../Actions/countryActions";
import { closeModal, updateCountryAndClose } from "../Actions/modalActions";
import { ENDPOINT_HOST } from "../Config/config";
import { UserProfile } from "../Reducers/reducers";
import { analytics } from "../Utils/analytics";
// export const announcements = (state: StoreState) => state.announcementReducer.;

async function readAppId() {
  return new Promise((resolve, reject) => {
    var fs = require("react-native-fs");
    var fn = fs.DocumentDirectoryPath + "/app_id.json";
    fs.readFile(fn)
      .then((content) => {
        resolve(content);
      })
      .catch((e) => {
        console.warn("Couldn't read app_id", e);
        reject(undefined);
      });
  });
}

async function fetchCountryLookup() {
  const appId = await readAppId();

  console.log("fetchCountryLookup - got appId:", appId);
  const url = `${ENDPOINT_HOST(null)}/api/public/countryLookup`;
  const fetchOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      appId,
    }),
  };

  const response = await fetch(url, fetchOptions);
  return response.json();
}

function* updateCountryAndCloseSaga(action: Action<{ country: string }>) {
  const { country } = action.payload;
  if (country) {
    analytics.event("countryChosen", `:dialog:${country}`);
    yield put(selectCountry(country));
    yield put(setProfileCountry(country));
    yield put(closeModal());
    // TODO: probably sync online profiles manually here..
  }
}

function* handleUpsertProfile(profile: any) {
  // We set the phones country if it's null or unknown and we login with a
  // profile which already have a country
  const selectedCountry = yield select((s) => s.selectedCountry);
  if (selectedCountry === null || selectedCountry === "Unknown") {
    if (profile.country !== undefined && profile.country !== "Unknown") {
      analytics.event("countryChosen", `:profile:${profile.country}`);
      yield put(selectCountry(profile.country));
    }
  }
}

function* lookupCountryIfMissingSaga() {
  const selectedCountry = yield select((s) => s.selectedCountry);
  if (selectedCountry !== null) {
    // Already got an answer, either by lookup or by popup
    return;
  }

  try {
    const result = yield call(fetchCountryLookup);
    const country = result.country;

    if (country === undefined) {
      console.log("Got undefined from countryLookup");
      return;
    }

    console.log("Got this from lookupCountry: ", country);
    if (country === "Unknown") {
      yield put(selectCountry(country));
    } else {
      analytics.event("countryChosen", `:lookup:${country}`);
      yield put(selectCountry(country));
      yield put(setProfileCountry(country));
    }
  } catch (e) {
    console.log("Couldn't ask for country online");
  }
}

export function* countrySaga() {
  yield takeEvery(updateCountryAndClose, updateCountryAndCloseSaga);
  yield takeEvery("UPSERT_PROFILE", handleUpsertProfile);
  yield takeEvery(lookupCountryIfMissing, lookupCountryIfMissingSaga);
}
