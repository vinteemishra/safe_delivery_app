

import { put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { StoreState } from "../Reducers/reducers";
import fs from 'react-native-fs';
import { deleteLanguage, deleteModuleVideos } from "../Actions/removeContentActions";
import { removeLanguageContent, setPreBuild } from "../Actions/actions";
import { Action } from "typescript-fsa";
import { closeModal } from "../Actions/modalActions";
import { ContentState } from "../Reducers/contentReducer";
import { USE_LOCAL_CONTENT } from "../Config/config";

export const getSelectedLang = (state: StoreState) => state.selectedLang;
export const getLanguages = (state: StoreState) => state.contentByLanguage;
export const getIfPrebuild = (state: StoreState) => state.isPreBuild;

const BASE_PATH = __DEV__ && USE_LOCAL_CONTENT ? "/localcontent/assets/" : "/content/assets/";
function* deleteLanguageSaga(action: Action<string>) {
    console.log("DeleteLanguageSaga", action);
    const contentByLanguage = yield select(getLanguages);
    const isPreBuild = yield select(getIfPrebuild);

    const language = contentByLanguage[action.payload];
    // const deleteJobs = [];
    if (language && language.videos[0].src.startsWith(BASE_PATH)) {

        //Get the used version of graphics for the installed languages eg. "africa" etc.
        const languageVersion = getLanguageVersionFromContentByLanguage(contentByLanguage);

        //Check what overall language the deteting item is using, and if there are others that are using that. If not delete the overall language images also
        let deleteImageFolder = checkIfWeNeedToDeleteImageFolder(language, languageVersion);
        console.log("deleteImageFolder", deleteImageFolder);
        //Delete language image folder
        if (deleteImageFolder) {
            yield deleteGraphicsImageFolderFromFileSystem(language);
        }

        //Delete language video folder
        yield deleteLanguageVideoFolderFromFileSystem(language);

        //Remove the language from the store
        console.log("remove the language from the store", language.langId);
        yield put(removeLanguageContent(language.langId));

        //If we are deleting the only language, check if prebuild is true, and set it to false if so
        if (isPreBuild === true && languageVersion.length === 1) {
            yield put(setPreBuild(false));
        };

    }

    yield put(closeModal());
}

function deleteLanguageVideoFolderFromFileSystem(language) {
    //Get the video paths from the store
    const getPathToVideoMediaFiles = language.videos[0].src;

    // Hardcoded placement of video files
    const filePath = BASE_PATH + "videos/"
    if (getPathToVideoMediaFiles.startsWith(filePath)) {
        const folderName = getPathToVideoMediaFiles.split(filePath).pop().split("/").shift();
        const getLanguageFolderOfVideoFilesToDelete = filePath + folderName;
        console.log("getLanguageFolderOfImageFiles", getLanguageFolderOfVideoFilesToDelete);

        //Delete language video folder
        return deleteFile(fs.DocumentDirectoryPath + getLanguageFolderOfVideoFilesToDelete);
    }
}

function deleteGraphicsImageFolderFromFileSystem(language) {
    // Get the image path from the store
    const getPathToImageMediaFiles = language.images[0].src;

    // Hardcoded placement of image files
    const filePath = BASE_PATH + "images/"
    if (getPathToImageMediaFiles.startsWith(filePath)) {
        const folderName = getPathToImageMediaFiles.split(filePath).pop().split("/").shift();
        const getLanguageFolderOfImageFilesToDelete = filePath + folderName;
        deleteFile(fs.DocumentDirectoryPath + getLanguageFolderOfImageFilesToDelete);
    }
}

function deleteFile(file) {
    console.log("deleteFile", file);
    return new Promise((resolve, reject) => {
        fs.unlink(file)
            .then(resolve)
            .catch((e) => {
                // console.log("Couldn't find file", file);
                // Doesn't matter - resolve anyway!
                resolve();
            });
    });
}

export function getLanguageVersionFromContentByLanguage(contentByLanguage) {

    const result = [];

    //Get the keys from contentByLanguage
    const keys = Object.keys(contentByLanguage)

    //Run through the keys and get the language versions used
    for (const k of keys) {
        if (contentByLanguage[k].images) {
            const imageSrc = contentByLanguage[k].images[0].src;
            const filePath = BASE_PATH + "images/"
            if (imageSrc.startsWith(filePath)) {
                console.log("imagesrc", imageSrc);
                const version = imageSrc.split(filePath).pop().split("/").shift();
                result.push({ langId: k, languageVersion: version });
            }
        }
    }
    console.log("result", result);
    return result;
}

function checkIfWeNeedToDeleteImageFolder(lang, languageVersion) {
    let languageVersionOfDeleted = "";

    //Get the language version for the selected language to delete
    languageVersion.map((item, index) => {
        if (item.langId == lang.id) {
            languageVersionOfDeleted = item.languageVersion;
        }
    });

    let listOfSameLanguageVersions = [];

    //Determine if we need to delete the image folder as well. e,g "africa" etc.
    if (languageVersion.length === 1) {
        return true;
    } else {
        languageVersion.map((item, index) => {
            if (item.languageVersion != languageVersionOfDeleted && item.langId != lang.id) {
                return true;
            }
            else if (item.languageVersion == languageVersionOfDeleted) {
                return listOfSameLanguageVersions.push(item.languageVersion);
            }
            else {
                return false;
            }
        });
    }

    if (listOfSameLanguageVersions.length === 1) {
        return true;
    }

    return false;
}

function* deleteModuleVideosSaga(action: Action<string>) {
    const contentByLanguage: ContentState = yield select(getLanguages);
    const selectedLang = yield select(getSelectedLang);
    const moduleId = action.payload;

    const language = contentByLanguage[selectedLang];

    const videosToDelete = language[moduleId].videos.map((v: string) => {
        return language.videos.find((f) => f.id == v);
    })
    const videoPaths = videosToDelete.map(v => {
        return v.src;
    });
    console.log("videosToDelete", videoPaths);

    videoPaths.forEach(element => {
        const filePath = fs.DocumentDirectoryPath + element;
        deleteFile(filePath)
    });
}

export function* removeContentSaga() {
    yield takeLatest(deleteLanguage, deleteLanguageSaga);
    yield takeEvery(deleteModuleVideos, deleteModuleVideosSaga);
}