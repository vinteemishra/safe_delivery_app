import { Platform } from "react-native";
import { NavigationNavigateActionPayload } from "react-navigation";
import { selectLearningModule, selectModule } from "../../Actions/actions";
import { openModal } from "../../Actions/modalActions";
import { ModalProps, ModalType } from "../../Reducers/modalReducer";
import { StoreState } from "../../Reducers/reducers";
import { getBackText, getTextFromCMS, isAllAssetsOffline } from "../helpers";
import { store } from "../store";
import { getLanguage } from "../../Sagas/announcementSaga";

export type AppLinkParseResult = {
  input: string;
  module?: string;
  feature?: "video" | "pp" | "ac" | "quiz" | "drug" | string;
  key?: string;
  chapter?: string;
};

export const parseAppLink = (str: string): AppLinkParseResult | undefined => {
  if (str === "safedelivery://drug") {
    return { input: str, feature: "drug" };
  }

  const m = /safedelivery:\/\/([^\/]+)\/([a-z]+)\/(.+)\/chapter\/(.+)$|safedelivery:\/\/([^\/]+)\/([a-z]+)\/(.+)|safedelivery:\/\/([^\/]+)\/([a-z]+)\/?$|safedelivery:\/\/([^\/]+)\/?$|safedelivery:\/$/gm;
  const matches = (m.exec(str) || []).filter((group) => group !== undefined);

  /* Change starts 25-12-2022*/
  if (matches[3] != undefined) {
    if (matches[2] === "video") {
      //Code optimized to map incoming deep link url to language specific video's if the module exists in the language version
      //else the "Linking Error" would be displayed.
      //Code change is only for Video as of now.

      //split the key part which contains the language specific uri -
      //ex: english WHO (WHO english version) ; India ( India hindi version)
      const StrUrl = matches[3].split("/");

      //store.getState().selectedLang - returns lang id
      //get the active language version and split it into uri's
      //4th uri is language specific uri - english WHO, India etc

      var StrVideoUrl = getLanguage(store.getState()).videos[1].src.toString();
      var StrVideoCountry = StrVideoUrl.split("/")[4];

      //replace the incoming language uri to installed version on uri
      //ex: if the installed version is India (for India - Hindi) and deep link sent is safedelivery://low-birth-weight_1536047907931/video/english WHO/Low birth weight/danger_signs
      //after replace the Deep url should be: safedelivery://low-birth-weight_1536047907931/video/India/Low birth weight/danger_signs
      matches[3] = matches[3].replace(StrUrl[0], StrVideoCountry);
    }
  }
  /* Change ends*/

  let result: AppLinkParseResult = {
    input: str,
    module: matches[1],
    feature: matches[2],
    key: matches[3],
    chapter: matches[4],
  };

  return result;
};

/**
 * Returns route and redux actions needed to deep link into application
 * @param url - internal link of safe delivery app
 * @param state - the entire state of the safe delivery app
 */

export type RouteResultType = {
  routeActions: Array<NavigationNavigateActionPayload>;
  dispatchActions: Array<{ type: string; [key: string]: any }>;
  analyticsErrorMessage?:
    | "invalidUrl"
    | "notInModule"
    | "moduleNotInLanguage"
    | "languageNotAvaliable"
    | "invalidAppState"
    | "noProfile";
};

export function getRouteFromLink(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  if (matches === undefined) {
    // Early return if parsing of link did not return a valid output.
    return { routeActions: [], dispatchActions: [openErrorModal({})] };
  }

  if (
    state.selectedLang === "none" ||
    (state.downloadReducer.status !== "finished" &&
      state.downloadReducer.status !== "idle")
  ) {
    return {
      routeActions: [],
      dispatchActions: [openErrorModal({})],
      analyticsErrorMessage: "invalidAppState",
    };
  }
  if (state.answeredSurvey === false) {
    //Early return if the user has yet to finish the onboarding processes. This should not be possible to bypass since it includes survey and user accepting terms of use.
    return {
      routeActions: [],
      dispatchActions: [openErrorModal({})],
      analyticsErrorMessage: "invalidAppState",
    };
  }

  const { selectedLang, contentByLanguage } = state;
  const language = contentByLanguage[selectedLang];

  if (language === undefined || language.modules === undefined) {
    return {
      routeActions: [],
      dispatchActions: [openErrorModal({})],
      analyticsErrorMessage: "languageNotAvaliable",
    };
  }

  const usesInvalidModule = (module, language) => {
    if (module) {
      const ids = language.modules.map((m) => m.id);
      const moduleMissing = ids.indexOf(module) === -1;
      if (moduleMissing) {
        console.log("Has module missing", module, ids, moduleMissing);
      }
      return moduleMissing;
    }
    return false;
  };

  if (usesInvalidModule(matches.module, language)) {
    return {
      routeActions: [],
      dispatchActions: [openErrorModal({})],
      analyticsErrorMessage: "moduleNotInLanguage",
    };
  }

  switch (matches.feature) {
    case "drug":
      return handleDrug(matches, state);
    case "ac":
      return handleActioncardsAndProcedures(matches, state);
    case "pp":
      return handleActioncardsAndProcedures(matches, state);
    case "video":
      return handleVideo(matches, state);
    case "quiz":
      return handleQuiz(matches, state);
    case undefined:
      return handleWithoutFeature(matches, state);
    default:
      return {
        routeActions: [],
        dispatchActions: [openErrorModal({})],
        analyticsErrorMessage: "invalidUrl",
      };
  }
}

function handleWithoutFeature(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  const { module } = matches;
  if (module) {
    const { contentByLanguage, selectedLang } = state;
    const language = contentByLanguage[selectedLang];

    const moduleInfo = language[module];

    return {
      routeActions: [
        { routeName: "Module", params: { title: moduleInfo.description } },
      ],
      dispatchActions: [selectModule(module)],
    };
  }
  return {
    routeActions: [],
    dispatchActions: [openErrorModal({})],
    analyticsErrorMessage: "invalidUrl",
  };
}

function handleQuiz(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  let routeActions: RouteResultType["routeActions"] = [];
  let dispatchActions: RouteResultType["dispatchActions"] = [];
  let analyticsErrorMessage: RouteResultType["analyticsErrorMessage"];
  const { key, chapter, module } = matches;
  // Return early if link contains chapter or key. These values are not valid when linking to quiz
  if (chapter || key) {
    return {
      routeActions: [],
      dispatchActions: [],
      analyticsErrorMessage: "invalidUrl",
    };
  }
  const { contentByLanguage, selectedLang } = state;
  const language = contentByLanguage[selectedLang];

  const HAS_ACTIVE_PROFILE = state.currentUser.currentUser != null;
  if (HAS_ACTIVE_PROFILE) {
    const learningModuleInfo = language[module];
    const { description } = learningModuleInfo;
    dispatchActions.push(selectLearningModule(module));
    // store.dispatch(selectLearningModule(module));
    const withProfileRoute = {
      routeName: "LearningModuleScreen",
      params: { title: description },
    };
    routeActions.push(withProfileRoute);
  } else {
    const withoutProfileRoute = { routeName: "MyLearningHome", params: {} };
    routeActions.push(withoutProfileRoute);
    analyticsErrorMessage = "noProfile";
  }

  return { routeActions, dispatchActions, analyticsErrorMessage };
}

function handleVideo(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  let routeActions: RouteResultType["routeActions"] = [];
  let dispatchActions: RouteResultType["dispatchActions"] = [];
  const { key, chapter, module } = matches;

  // Return early if link contains chapter. This value is not valid when linking to video
  if (chapter) {
    return { routeActions: [], dispatchActions: [] };
  }

  const { contentByLanguage, selectedLang } = state;
  const language = contentByLanguage[selectedLang];

  const moduleInfo = language[module];

  routeActions.push({
    routeName: "Module",
    params: { title: moduleInfo.description },
  });
  dispatchActions.push(selectModule(module));

  if (key) {
    let decodedKey = decodeURI(key);
    let VIDEO_IS_IN_MODULE = moduleInfo.videos.indexOf(decodedKey) !== -1;

    //If video not found in module check if "/" was accidently left out of video id
    if (!VIDEO_IS_IN_MODULE && !decodedKey.startsWith("/")) {
      decodedKey = "/" + decodedKey;
      VIDEO_IS_IN_MODULE = moduleInfo.videos.indexOf(decodedKey) !== -1;
    }

    if (VIDEO_IS_IN_MODULE) {
      const source = language.videos.find((i) => i.id === decodedKey);

      // routeActions.push({
      //     routeName: "VideoPlayerScreen", params: { playlist: [source], hasOfflineAssets: isAllAssetsOffline([source]),  }
      // });
      if (source) {
        const isOffline = isAllAssetsOffline([source]);
        routeActions.push({
          routeName: "VideoChapterScreen",
          params: { title: language.screen.videos, playlist: [source] },
        });
      } else {
        const OPEN_ERROR_MESSAGE_VIDEO_NOT_IN_MODULE = openErrorModal({
          body: "Could not find linked video in module.",
        });
        return {
          routeActions: [],
          dispatchActions: [OPEN_ERROR_MESSAGE_VIDEO_NOT_IN_MODULE],
          analyticsErrorMessage: "notInModule",
        };
      }
    } else {
      const OPEN_ERROR_MESSAGE_VIDEO_NOT_IN_MODULE = openErrorModal({
        body: "Could not find linked video in module.",
      });
      return {
        routeActions: [],
        dispatchActions: [OPEN_ERROR_MESSAGE_VIDEO_NOT_IN_MODULE],
        analyticsErrorMessage: "notInModule",
      };
    }
  } else {
    routeActions.push({
      routeName: "VideoChapterScreen",
      params: { title: language.screen.videos },
    });
  }

  return { routeActions, dispatchActions };
}

function openErrorModal(message: { title?: string; body?: string }) {
  const default_error_content: {
    modalType: ModalType;
    modalProps: ModalProps;
  } = {
    modalType: "LINKING_ERROR",
    modalProps: { title: "Linking error", body: "Something wrong with link" },
  };
  const error = {
    ...default_error_content,
    modalProps: { ...default_error_content.modalProps, ...message },
  };
  return openModal(error);
}

function handleActioncardsAndProcedures(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  let routeActions: RouteResultType["routeActions"] = [];
  let dispatchActions: RouteResultType["dispatchActions"] = [];
  const { feature, key, chapter, module } = matches;

  let contentType;
  let type;
  let screen_key;
  if (feature === "ac") {
    contentType = "actioncard";
    type = "actionCards";
    screen_key = "actioncards";
  } else {
    contentType = "procedure";
    type = "procedures";
    screen_key = "procedures";
  }

  const { contentByLanguage, selectedLang } = state;
  const language = contentByLanguage[selectedLang];

  const moduleInfo = language[module];
  routeActions.push({
    routeName: "Module",
    params: { title: moduleInfo.description },
  });
  routeActions.push({
    routeName: "CardOptionScreen",
    params: {
      title: getTextFromCMS(language.screen, screen_key, screen_key),
      contentType: contentType,
      backButtonTitle: getBackText(language.screen.back),
      content: language[module][type],
    },
  });
  dispatchActions.push(selectModule(module));

  const INDEX_OF_ITEM = moduleInfo[type].indexOf(key);

  if (key && INDEX_OF_ITEM !== -1) {
    const source = language[key] ? language[key] : {};
    if (source.chapters.length === 1) {
      // send to actioncardscreen
      const chapterInfo = language[key].chapters[0];
      const chapterIndex = 0;
      routeActions.push({
        routeName: "ActioncardScreen",
        params: {
          title: language[key].description,
          contentType: contentType,
          id: key,
          chapterId: chapterInfo.id,
          fromNotification: false,
          index: chapterIndex,
          content: chapterInfo.content,
          backButtonTitle: getBackText(language.screen.back),
        },
      });
    } else {
      routeActions.push({
        routeName: "ChapterOptionScreen",
        params: {
          title: language[key].description,
          contentType: contentType,
          id: key,
          backButtonTitle: getBackText(language.screen.back),
          content: language[key].chapters,
        },
      });
      if (chapter) {
        const chapterInfo = language[key].chapters.find(
          (c) => c.id === chapter
        );
        const chapterIndex = language[key].chapters
          .map((e) => e.id)
          .indexOf(chapter);
        routeActions.push({
          routeName: "ActioncardScreen",
          params: {
            title: chapterInfo.description,
            contentType: contentType,
            id: key,
            chapterId: chapterInfo.id,
            fromNotification: false,
            index: chapterIndex,
            content: chapterInfo.content,
            backButtonTitle: getBackText(language.screen.back),
          },
        });
      }
    }
  } else if (key && INDEX_OF_ITEM === -1) {
    return {
      routeActions: [],
      dispatchActions: [],
      analyticsErrorMessage: "notInModule",
    };
  }

  return { routeActions, dispatchActions };
}

function handleDrug(
  matches: AppLinkParseResult,
  state: Partial<StoreState>
): RouteResultType {
  let routeActions: RouteResultType["routeActions"] = [];
  let dispatchActions: RouteResultType["dispatchActions"] = [];
  const { key, chapter, module } = matches;

  // Return early if link contains chapter. This value is not valid when linking to drug
  if (chapter) {
    return {
      routeActions: [],
      dispatchActions: [],
      analyticsErrorMessage: "invalidUrl",
    };
  }

  const { contentByLanguage, selectedLang } = state;
  const language = contentByLanguage[selectedLang];
  console.log("handleDrug", module);
  if (module) {
    const moduleInfo = language[module];
    console.log("handleDrug moduleInfo", moduleInfo);
    const moduleAction = {
      routeName: "Module",
      params: { title: moduleInfo.description },
    };
    routeActions.push(moduleAction);
    dispatchActions.push(selectModule(module));
    const drugAction = {
      routeName: "drugList",
      params: { title: language.screen.drugs, module: true },
    };
    routeActions.push(drugAction);
  } else {
    const drugAction = {
      routeName: "drugList",
      params: { title: language.screen.drugs, module: false },
    };
    routeActions.push(drugAction);
  }

  if (key) {
    let drugParams;
    if (module === undefined) {
      //find drug content and title in langauge drugs
      //push screen with drug content parameters
      const drug = language.drugs.find((i) => i.id === key);
      if (drug) {
        const { description, content, id } = drug;
        drugParams = { title: description, content, id };
      } else {
        return {
          routeActions: [],
          dispatchActions: [openErrorModal({})],
          analyticsErrorMessage: "invalidUrl",
        };
      }
    } else {
      const moduleInfo = language[module];
      if (moduleInfo.drugs.indexOf(key) === -1) {
        return {
          routeActions: [],
          dispatchActions: [openErrorModal({})],
          analyticsErrorMessage: "notInModule",
        };
      }
      // check if drug is in module
      // find drug content and title in language.drugs
      // push screen with drug content parameters
      const drug = language.drugs.find((i) => i.id === key);
      if (drug) {
        const { description, content, id } = drug;
        drugParams = { title: description, content, id };
      } else {
        return {
          routeActions: [],
          dispatchActions: [openErrorModal({})],
          analyticsErrorMessage: "invalidUrl",
        };
      }
    }
    routeActions.push({ routeName: "drug", params: drugParams });
  }

  return { routeActions, dispatchActions };
}
