import { put, select, takeEvery } from "redux-saga/effects";
import { StoreState } from "../Reducers/reducers";
import { fetchAnnouncements, updateAnnouncements, failedAnnouncementFetch, fetchAnnouncementsIfNeeded, showPendingAnnouncement, markAnnouncementAsRead } from "../Actions/announcementActions";
import { BASE_URL } from "../Constants/Constants";
import { Announcement } from "../Reducers/announcementReducer";
import { openModal } from "../Actions/modalActions";
import { store } from "../Utils/store";
import { USE_LOCAL_CONTENT } from "../Config/config";
// export const announcements = (state: StoreState) => state.announcementReducer.;
export const announcementReducer = (state: StoreState) => state.announcementReducer;
export const getSelectedLang = (state: StoreState) => state.selectedLang;
export const getLanguage = (state: StoreState) => state.contentByLanguage[state.selectedLang];
export const getModalType = (state: StoreState) => state.modalReducer.modalType;

function* fetchAnnouncementsSaga() {
    let mode = "content";
    if (USE_LOCAL_CONTENT) {
        mode = "localcontent";
    }
    let url = `${BASE_URL}/${mode}/announcements.json`;

    try {
        const response = yield fetch(url, {
            headers: { 'Cache-Control': 'no-cache' }
        })
        const json: Announcement[] = yield response.json()
        yield put(updateAnnouncements(json));

    } catch (error) {
        yield put(failedAnnouncementFetch());
    }

}

function shouldFetchAnnouncements(announcementState) {

    if (!announcementState) {
        return true
    } else if (announcementState.isFetching) {
        return false
    } else {
        return announcementState.didInvalidate
    }
}

function shouldShowAnnouncement(currentAnnouncements, announcementsMarkedAsRead, selectedLang, langVersion) {
    // const {  } = this.props;
    const announcementsToShow = currentAnnouncements.filter((announcement, index) => {
        // const announcementsToShow = announcementsToShowAfterMatch.filter((announcement, index) => {

        let shouldShowAnnouncement = false;

        if (announcementsMarkedAsRead.indexOf(announcement.id) === -1) {
            if (!announcement.config.language || announcement.config.language === selectedLang) {
                console.log("announcementSaga announment with selectedLang", announcement);
                if (passLangVersionRequirement(langVersion, announcement.config)) {
                    console.log("announcementSaga true");
                    shouldShowAnnouncement = true;
                }
            }
        }
        return shouldShowAnnouncement;
    });

    return announcementsToShow;
}

function passLangVersionRequirement(langVersion, config) {
    console.log("announcementSaga langversion", langVersion, config.aboveLangVersion);

    const passAboveVersionCheck = !config.aboveLangVersion || config.aboveLangVersion < langVersion;
    console.log("announcementSaga check", passAboveVersionCheck);
    const passBelowVersionCheck = !config.belowLangVersion || config.belowLangVersion > langVersion;
    console.log("announcementSaga - passAboveVersionCheck", passAboveVersionCheck, "passBelowVersionCheck", passBelowVersionCheck);
    return passAboveVersionCheck && passBelowVersionCheck;
}

function* showPendingAnnouncementSaga() {
    const { currentAnnouncements, announcementsMarkedAsRead } = yield select(announcementReducer);
    const selectedLang = yield select(getSelectedLang);
    const language = yield select(getLanguage);
    const modalType = yield select(getModalType);

    const langVersion = language.version;
    const announcementsToShow = shouldShowAnnouncement(currentAnnouncements, announcementsMarkedAsRead, selectedLang, langVersion);

    const NO_OTHER_MODAL_SHOWING = modalType == null
    if (announcementsToShow.length > 0 && NO_OTHER_MODAL_SHOWING) {
        const { link, title, body, id } = announcementsToShow[0];
        yield put(openModal(
            {
                modalType: "ANNOUNCEMENT_MODAL",
                modalProps: {
                    link: link,
                    title: title[selectedLang],
                    message: body[selectedLang],
                    onCloseModal: () => store.dispatch(markAnnouncementAsRead(id))
                }
            }));
        // yield put(markAnnouncementAsRead(id))
    }
}


function* fetchAnnoucementsIfNeededSaga() {

    const annoucementState = yield select(announcementReducer);
    const shouldFetch = shouldFetchAnnouncements(annoucementState);
    if (shouldFetch) {
        yield put(fetchAnnouncements());
    }
}

export function* announcementSaga() {
    yield takeEvery(fetchAnnouncementsIfNeeded, fetchAnnoucementsIfNeededSaga);
    yield takeEvery(fetchAnnouncements, fetchAnnouncementsSaga);
    yield takeEvery(showPendingAnnouncement, showPendingAnnouncementSaga);
}