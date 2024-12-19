import { all } from "redux-saga/effects";
import { downloadSaga } from "./downloadSaga";
import { learningSaga } from "./learningSaga";
import { notificationSaga } from "./notificationSaga";
import { announcementSaga } from "./announcementSaga";
import { assetsVersionSaga } from "./assetsVersionSaga";
import { countrySaga } from "./countrySaga";
import { removeContentSaga } from "./removeContentSaga";
import { featureFlagSaga } from "./featureFlagSaga";

export default function* rootSaga() {
    yield all([
        downloadSaga(),
        learningSaga(),
        countrySaga(),
        notificationSaga(),
        announcementSaga(),
        assetsVersionSaga(),
        removeContentSaga(),
        featureFlagSaga(),
    ]);
}