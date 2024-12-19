
import { all, put, takeLatest, takeEvery } from "redux-saga/effects";
import {
    initAssetsFail, initAssetsStart, initAssetsSuccess, selectLang, receiveVideoDuration,
    receiveVideo, subtractOneFromCurrentDownloadProcess, receiveBundle, receiveAbout, receiveModules, receiveKeyLearningPoint,
    receiveImage, receiveCertificates, receiveActioncards, receiveDrugs, receiveOnboarding, receiveProcedures, mapDuration, setLastNotificationDate
} from '../Actions/actions';
import { StoreState } from "../Reducers/reducers";
import fs from 'react-native-fs';
import * as notifications from '../Utils/notifications';
import RNFetchBlob from "rn-fetch-blob";

export const getDownloadState = (state: StoreState) => state.downloadReducer;
export const getPreviouslyActiveLanguage = (state: StoreState) => state.selectedLang;
export const getVideoList = (state: StoreState) => state.contentByLanguage[state.selectedLang].videos;
export const getContentByLanguage = (state: StoreState) => state.contentByLanguage[state.selectedLang];
export const getDisclaimerStatus = (state: StoreState) => state.disclaimer.approved;
export const hasProfiles = (state: StoreState) => Object.keys(state.userProfiles).length > 0;
export const getAnsweredSurvey = (state: StoreState) => state.answeredSurvey;

export function* installAssetsVersionSaga() {

    try {

        yield initAssets();

        yield put(initAssetsSuccess());
    } catch (e) {
        yield put(initAssetsFail());
        console.error("Could not load from assets:", e);
        // this.props.navigation.navigate("InitialDownload");
    }
}

function* initAssets() {
    try {
        console.log('initAssets')
        let json
        const size = yield fs.getFSInfo()
        console.log('free space')
        // console.log(size)
        if (size.freeSpace < 70000000) {
            console.log("Not enough space on device");
            return;
        }

        yield handleAssetsDir('version');
        let fn = fs.DocumentDirectoryPath + '/bundle.json';
        console.log("readFile");
        const content = yield fs.readFile(fn)
        json = JSON.parse(content);
        let lang = json.langId ? json.langId : '7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da'
        // console.log('lang', lang)
        yield addBundleToRedux(json, lang, true)
        yield getVideoInfoFromAssets()
        for (let i = 0; i < json.videos.length; i++) {
            yield put(receiveVideo(lang, json.videos[i], json.videos[i].src))
        }
        yield put(selectLang(lang))

    } catch (error) {
        console.log('init assets err', error);

    }
}

function* getVideoInfoFromAssets() {
    // console.log('getVideoInfoFromAssets')
    const fn = fs.DocumentDirectoryPath + '/durations.json'
    // console.log('copyFileFromAssets')
    yield copyFileFromAssets('version/durations.json', fn)
    const content = yield fs.readFile(fn)
    let json = JSON.parse(content)
    let duration_object = mapDuration(json)
    yield put(receiveVideoDuration(duration_object))

}
function* addBundleToRedux(json, lang, fromZip) {
    try {
        let filesToAdd = []
        filesToAdd.push(put(receiveBundle(lang, json)));
        if (json.modules) filesToAdd.push(addToRedux(lang, json.modules, receiveModules, fromZip));
        if (json.actionCards) filesToAdd.push(addToRedux(lang, json.actionCards, receiveActioncards, fromZip));
        if (json.procedures) filesToAdd.push(addToRedux(lang, json.procedures, receiveProcedures, fromZip))
        if (json.about) filesToAdd.push(addToRedux(lang, json.about, receiveAbout, fromZip));
        if (json.drugs) filesToAdd.push(addToRedux(lang, json.drugs, receiveDrugs, fromZip));
        if (json.onboarding) filesToAdd.push(addToRedux(lang, json.onboarding, receiveOnboarding, fromZip));
        if (json.keyLearningPoints) filesToAdd.push(addToRedux(lang, json.keyLearningPoints, receiveKeyLearningPoint, fromZip));
        if (json.certificates) filesToAdd.push(addToRedux(lang, json.certificates, receiveCertificates, fromZip));
        if (json.images) filesToAdd.push(addImageToRedux(lang, json.images, receiveImage));

        yield all(filesToAdd)
    } catch (error) {
        console.log('error adding bundle from filesystem', error);
    }
}

function addImageToRedux(lang, array, callback) {
    return dispatch => {
        for (let i = 0; i < array.length; i++) {
            let id = array[i].id
            dispatch(callback(lang, array[i], id))
            dispatch(subtractOneFromCurrentDownloadProcess());
        }
    }
}

function* addToRedux(lang, array, callback, fromZip) {
    try {
        let filesToAdd = []
        for (let i = 0; i < array.length; i++) {
            let fn;
            if (fromZip) {
                fn = `${fs.DocumentDirectoryPath}/${array[i].href}`;
            } else {
                fn = `${fs.DocumentDirectoryPath}/content/${lang}/${array[i].href}`;
            }
            const content = yield fs.readFile(fn)
            let json = JSON.parse(content);
            let id = array[i].id;
            filesToAdd.push(put(callback(lang, json, id)));
            filesToAdd.push(put(subtractOneFromCurrentDownloadProcess()));
        }
        yield all(filesToAdd);

    } catch (error) {
        console.log("error", error);
    }

}

function* handleAssetsDir(dir) {
    const res = yield fs.readDirAssets(dir)
    let promises = []
    for (let i = 0; i < res.length; i++) {
        let promise
        if (res[i].isDirectory()) {
            // console.log('res ' + res[i].name + ' is a directory', res[i].path)
            let split = res[i].path.split(/[\s/]+/)
            // console.log(split[0])
            let dir = fs.DocumentDirectoryPath + res[i].path.replace(split[0], '')
            // console.log('dir', dir)
            yield fs.mkdir(dir)
            promise = handleAssetsDir(res[i].path)
            promises.push(promise)
        } else {
            // console.log('res ' + res[i].name + ' is a file ' + res[i].path)
            let split = res[i].path.split(/[\s/]+/)
            let dir = fs.DocumentDirectoryPath + res[i].path.replace(split[0], '')
            // console.log('copyFile, path', res[i].path, 'dir', dir)
            promise = copyFileFromAssets(res[i].path, dir)
            promises.push(promise)
        }
    }
    // console.log('Promises all', promises)
    yield all(promises)
}

/**
 * Copies a file from the assets folder
 * @param {String} src_path
 * @param {String} dist_path
 */
function copyFileFromAssets(src_path, dist_path) {
    return RNFetchBlob.fs.cp(RNFetchBlob.fs.asset(src_path), dist_path)
    // console.log('Check for Strings', typeof src_path, typeof dist_path)
    // return fs.copyFileAssets(src_path, dist_path)
    // 	.then(() => console.log('copied to ' + dist_path))
}

export function* assetsVersionSaga() {
    yield takeEvery("INIT_ASSETS_START", installAssetsVersionSaga);
}