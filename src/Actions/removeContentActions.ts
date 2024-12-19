import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("removeContentActions");

export const deleteLanguage = actionCreator<string>("DELETE_LANGUAGE");
export const deleteModuleVideos = actionCreator<string>("DELETE_MODULE_VIDEOS");

// export function removeLanguageContent(lang) {
// 	return {
// 		type: REMOVE_LANGUAGE_CONTENT,
// 		lang
// 	}
// }