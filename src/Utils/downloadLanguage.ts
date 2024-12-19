import { store } from "./store";
import { startDownload, startUpdate, resetDownloadStatus } from '../Actions/downloadActions';
import * as CONSTANTS from '../Constants/Constants';
import fs from 'react-native-fs';
import { closeModal } from "../Actions/modalActions";
import { IndexLanguageType } from "../Reducers/downloadReducer";

const { dispatch } = store;
const BYTES_PER_MEGABYTE = 1000000;
const DUMMY_BUNDLE_SIZE = 1;
const DUMMY_SELECTIVE_DOWNLOAD_SIZE = CONSTANTS.DUMMY_IMAGE_ZIP_FILE_SIZE + CONSTANTS.DUMMY_IMAGE_ZIP_FILE_SIZE + DUMMY_BUNDLE_SIZE;
export async function isThereEnoughDiskSpace(selectedLanguage: IndexLanguageType, isSelectiveDownload?: boolean) {

  //Get the disk space info from the device
  const diskSpace = await fs.getFSInfo();

  console.log("diskSpace", diskSpace);
  let freeSpaceNeeded: number = 0;

  //Map through the language sizes and find the one matching the selected language to install. Return the size
  if (diskSpace.freeSpace) {
    CONSTANTS.LANGUAGE_SIZE.map((item, index) => {
      if (item.languageID === selectedLanguage.id) {
        console.log("item from size map", item);
        const requiredFreeMB = isSelectiveDownload ? DUMMY_SELECTIVE_DOWNLOAD_SIZE : item.size + CONSTANTS.DUMMY_IMAGE_ZIP_FILE_SIZE;
        freeSpaceNeeded = requiredFreeMB * BYTES_PER_MEGABYTE;
        console.log("freespaceNeeded", freeSpaceNeeded);

      }
    })
  }

  //Chesk if the free space on the device is >= the size that the selected language will need
  if (diskSpace.freeSpace) {
    if (diskSpace.freeSpace >= freeSpaceNeeded) {
      return true;
    }
    return false;
  }
  return false;
}

export function startLanguageDownload(downloadLanguage, isSelectiveDownload = false) {
  console.log("startLanguageDownload", downloadLanguage);
  dispatch(startDownload({ language: downloadLanguage, isSelectiveDownload }));

}