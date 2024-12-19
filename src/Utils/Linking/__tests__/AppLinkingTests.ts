

import { StoreState } from "../../../Reducers/reducers";
import { parseAppLink, getRouteFromLink, AppLinkParseResult, RouteResultType } from "../AppLinking";
import { englishMockState } from "../__mocks__/englishMockTest";

import { Platform } from "react-native";
import { getBackText, getTextFromCMS } from "../../helpers";
beforeAll(() => {
    Platform.OS = "ios";
});
describe("Test parsing of linking URL", () => {
    const module = "hypertension_1487677992452";
    const baseURL = `safedelivery://${module}`;
    test("Hypertension specific video", () => {
        const url = baseURL + "/video//english%20WHO/Hypertension/management_of_hypertension";
        const expectedResult = {
            feature: "video",
            module: module,
            input: url,
            key: "/english%20WHO/Hypertension/management_of_hypertension"
        }
        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension video list", () => {
        const url = baseURL + "/video";
        const expectedResult = {
            feature: "video",
            module: module,
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension actioncard list", () => {
        const url = baseURL + "/ac";
        const expectedResult = {
            feature: "ac",
            module: module,
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension actioncard list", () => {
        const url = baseURL + "/ac";
        const expectedResult = {
            feature: "ac",
            module: module,
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension specific actioncard", () => {
        const url = baseURL + "/ac/management-hypertension-new_1597327534878";
        const expectedResult = {
            feature: "ac",
            module: module,
            input: url,
            key: "management-hypertension-new_1597327534878"
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension specific chapter in actioncard", () => {
        const url = baseURL + "/ac/management-hypertension-new_1597327534878/chapter/bp-140-15990-109_1597327612225";
        const expectedResult = {
            feature: "ac",
            module: module,
            input: url,
            key: "management-hypertension-new_1597327534878",
            chapter: "bp-140-15990-109_1597327612225"
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension practical procedures list", () => {
        const url = baseURL + "/pp";
        const expectedResult = {
            feature: "pp",
            module: module,
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("Hypertension specific list of drugs", () => {
        const url = baseURL + "/drug";
        const expectedResult = {
            feature: "drug",
            module: module,
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });

    test("List of all drugs", () => {
        const url = "safedelivery://drug";
        const expectedResult = {
            feature: "drug",
            input: url
        }

        const result = parseAppLink(url);
        expect(result).toEqual(expectedResult);
    });
})

describe("Test deep linking route and redux actions", () => {

    const ENGLISH_LANGUAGE_VERSION_ID = "7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da";
    const noneLanguageVersion = {
        screen: {},
        version: "none",
    }
    const noInstalledVersionsContentByLangauge = {
        "none": noneLanguageVersion,

    }

    const withEnglishLanguageVersion = {
        ...noInstalledVersionsContentByLangauge,
        [ENGLISH_LANGUAGE_VERSION_ID]: {
            ...englishMockState
        }

    }

    const baseStoreState: Partial<StoreState> = {
        selectedLang: ENGLISH_LANGUAGE_VERSION_ID,
        contentByLanguage: withEnglishLanguageVersion,
        answeredSurvey: true,
        downloadReducer: {
            status: "finished",
        },
        currentUser: {
            currentUser: null,
        },

    }

    const default_linking_error = {
        payload: {
            modalProps: {
                body: "Something wrong with link",
                title: "Linking error",
            },
            modalType: "LINKING_ERROR"
        },
        type: "modalActions/OPEN_MODAL",
    }

    const module = "hypertension_1487677992452";
    const baseURL = `safedelivery://${module}`;

    test("Link to video chapter screen", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "VideoChapterScreen",
                    params: { title: "Videos" }
                }
            ],
            dispatchActions: [{ type: "SELECT_MODULE", module: "hypertension_1487677992452" }]
        }
        const matches: AppLinkParseResult = {
            input: `${baseURL}/video"`,
            module: module,
            feature: "video",
        }


        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult)
    });
    test("Link to videoplayer with video that exist in module", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "VideoChapterScreen",
                    params: { title: "Videos", playlist: [{ id: "/english WHO/Hypertension/management_of_hypertension", src: "/content/assets/videos/english%20WHO/Hypertension/management_of_hypertension.mp4", icon: "/english WHO/Hypertension/management_of_hypertension", description: "Management of Hypertension", version: 1597658392000 }] }
                }
            ],
            dispatchActions: [{ type: "SELECT_MODULE", module: "hypertension_1487677992452" }]
        }
        const matches = {
            input: `${baseURL}/video//english%20WHO/Hypertension/management_of_hypertension"`,
            key: "/english%20WHO/Hypertension/management_of_hypertension",
            module: module,
            feature: "video" as "video",
        }


        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult)
    });

    test("Link to videoplayer, but video does not belong to the specified module", () => {
        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions: [{
                payload: {
                    modalProps: {
                        body: "Could not find linked video in module.",
                        title: "Linking error",
                    },
                    modalType: "LINKING_ERROR",
                },
                type: "modalActions/OPEN_MODAL",
            }],
            analyticsErrorMessage: "notInModule"
        };

        const matches: AppLinkParseResult = {
            input: `${baseURL}/video//english WHO/Infection prevention/personal_protective_equipment"`,
            key: "/english WHO/Infection prevention/personal_protective_equipment",
            module: module,
            feature: "video"
        }
        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("Link to quiz without an active profile should lead user to MyLearningHome", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "MyLearningHome",
                    params: {}
                }
            ],
            dispatchActions: [],
            analyticsErrorMessage: "noProfile"
        }

        const matches: AppLinkParseResult = {
            input: `${baseURL}/quiz/"`,
            module: module,
            feature: "quiz",
        }

        const result = getRouteFromLink(matches, baseStoreState);

        expect(result).toEqual(expectedResult);
    });

    test("Link to quiz with an active profile should lead to LearningModule", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "LearningModuleScreen",
                    params: { title: "Hypertension" }
                }
            ],
            dispatchActions: [{ type: "SELECT_LEARNING_MODULE", module: module }],
        }
        const matches: AppLinkParseResult = {
            input: `${baseURL}/quiz/"`,
            module: module,
            feature: "quiz",
        }
        let hasUserState = { ...baseStoreState }
        hasUserState.currentUser.currentUser = "12345";
        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);

    });

    test("Link to druglist without specified module should open drugs list from HomeScreen", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "drugList",
                    params: { title: englishMockState.screen.drugs, module: false }
                },
            ],
            dispatchActions: [],
        }

        const matches: AppLinkParseResult = {
            input: "safedelivery://drug",
            feature: "drug",
        };

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("Link to druglist for specified module", () => {
        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "drugList",
                    params: { title: englishMockState.screen.drugs, module: true }
                },
            ],
            dispatchActions: [{ type: "SELECT_MODULE", module: module }],
        }

        const matches: AppLinkParseResult = {
            input: baseURL + "/drug",
            module: module,
            feature: "drug",
        };

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("Link to drug without specifiying module, but drug is not in language version", () => {
        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions: [
                {
                    payload: {
                        modalProps: {
                            body: "Something wrong with link",
                            title: "Linking error",
                        },
                        modalType: "LINKING_ERROR",
                    },
                    type: "modalActions/OPEN_MODAL",
                },
            ],
            analyticsErrorMessage: "invalidUrl",
        };

        const matches: AppLinkParseResult = {
            input: "safedelivery://drug/test",
            key: "test",
            feature: "drug",
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("Link to drug in hypertension module were drug is specified, but drug is not in languageversion", () => {
        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions: [
                {
                    payload: {
                        modalProps: {
                            body: "Something wrong with link",
                            title: "Linking error",
                        },
                        modalType: "LINKING_ERROR",
                    },
                    type: "modalActions/OPEN_MODAL",
                },
            ],
            analyticsErrorMessage: "invalidUrl",
        };

        const matches: AppLinkParseResult = {
            input: baseURL + "drug/test",
            module: module,
            key: "test",
            feature: "drug",
        }

        const mockedStoreState: Partial<StoreState> = JSON.parse(JSON.stringify(baseStoreState));
        mockedStoreState.contentByLanguage["7cf6efab-a9d7-54d2-2cbd-ec82efe4a7da"]["hypertension_1487677992452"].drugs.push("test");
        const result = getRouteFromLink(matches, mockedStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("Link to Betamethasone (which exists in English) without specifing module", () => {
        const matches: AppLinkParseResult = {
            input: "safedelivery://drug/betamethasone_1487080183154",
            key: "betamethasone_1487080183154",
            feature: "drug"
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "drugList",
                    params: { title: englishMockState.screen.drugs, module: false }
                },
                {
                    routeName: "drug",
                    params: { id: englishMockState.drugs[6].id, title: englishMockState.drugs[6].description, content: englishMockState.drugs[6].content }
                }
            ],
            dispatchActions: [],
        };

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("Link to Betamethasone on newborn-management. Betamethasone exists in both language and module, so the link should be successful", () => {
        const matches: AppLinkParseResult = {
            input: "safedelivery://drug/newborn-management_1487679126990/betamethasone_1487080183154",
            key: "betamethasone_1487080183154",
            module: "newborn-management_1487679126990",
            feature: "drug"
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Newborn Management" }
                },
                {
                    routeName: "drugList",
                    params: { title: englishMockState.screen.drugs, module: true }
                },
                {
                    routeName: "drug",
                    params: { id: englishMockState.drugs[6].id, title: englishMockState.drugs[6].description, content: englishMockState.drugs[6].content }
                }
            ],
            dispatchActions: [{
                module: "newborn-management_1487679126990",
                type: "SELECT_MODULE",
            }],
        };

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("Link to Betamethasone on hypertension. Betamethasone exists in language but is not avaliable in Hypertension, so the link should not work", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/drug/betamethasone_1487080183154",
            key: "betamethasone_1487080183154",
            module: module,
            feature: "drug"
        }

        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions: [{
                payload: {
                    modalProps: {
                        body: "Something wrong with link",
                        title: "Linking error",
                    },
                    modalType: "LINKING_ERROR",
                },
                type: "modalActions/OPEN_MODAL",
            }],
            analyticsErrorMessage: "notInModule"
        };

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("link to practical procedure menu in specified module ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/pp",
            module: module,
            feature: "pp",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "CardOptionScreen", params: { title: getTextFromCMS(englishMockState.screen, "procedures", "procedures"), contentType: "procedure", backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[module].procedures }
                },
            ],
            dispatchActions: [
                {
                    module: module,
                    type: "SELECT_MODULE",
                }
            ],
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("link to practical procedure with multiple chapters that exists in specified module ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/pp/urine-catheter_1487245590353",
            key: "urine-catheter_1487245590353",
            module: module,
            feature: "pp",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "CardOptionScreen", params: { title: getTextFromCMS(englishMockState.screen, "procedures", "procedures"), contentType: "procedure", backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[module].procedures }
                },
                {
                    routeName: "ChapterOptionScreen", params: { title: englishMockState[matches.key].description, contentType: "procedure", id: matches.key, backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.key].chapters }
                }
            ],
            dispatchActions: [
                {
                    module: module,
                    type: "SELECT_MODULE",
                }
            ],
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("link to practical procedure with single chapter that exists in specified module ", () => {
        const matches: AppLinkParseResult = {
            input: "safedelivery://normal-labour-and-birth_1591261731571" + "/pp/vaginal-examination_1591619208367",
            key: "vaginal-examination_1591619208367",
            module: "normal-labour-and-birth_1591261731571",
            feature: "pp",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: {
                        title: "Normal Labour and Birth"
                    }
                },
                {
                    routeName: "CardOptionScreen",
                    params: {
                        title: getTextFromCMS(englishMockState.screen, "procedures", "procedures"), contentType: "procedure", backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.module].procedures
                    }
                },
                {
                    routeName: "ActioncardScreen",
                    params: {
                        title: englishMockState[matches.key].description, contentType: "procedure", id: matches.key, backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.key].chapters[0].content, index: 0, fromNotification: false, chapterId: englishMockState[matches.key].chapters[0].id
                    }
                }
            ],
            dispatchActions: [
                {
                    module: matches.module,
                    type: "SELECT_MODULE",
                }
            ],
        }
        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    });

    test("link to actioncard with single chapter that exists in specified module ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/ac/emergency-referral---hypertension_1527674369336",
            key: "emergency-referral---hypertension_1527674369336",
            module: module,
            feature: "ac",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: {
                        title: "Hypertension"
                    }
                },
                {
                    routeName: "CardOptionScreen",
                    params: {
                        title: getTextFromCMS(englishMockState.screen, "actioncards", "actioncards"), contentType: "actioncard", backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.module].actionCards
                    }
                },
                {
                    routeName: "ActioncardScreen",
                    params: {
                        title: englishMockState[matches.key].description, contentType: "actioncard", id: matches.key, backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.key].chapters[0].content, index: 0, fromNotification: false, chapterId: englishMockState[matches.key].chapters[0].id
                    }
                }
            ],
            dispatchActions: [
                {
                    module: matches.module,
                    type: "SELECT_MODULE",
                }
            ],
        }
        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("link to actioncard emergency-referral---hypertension_1527674369336 but mislabel it as a practical procedure ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/pp/emergency-referral---hypertension_1527674369336",
            key: "emergency-referral---hypertension_1527674369336",
            module: module,
            feature: "pp",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
            ],
            dispatchActions: [

            ],
            analyticsErrorMessage: "notInModule"
        }
        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("link to specified chapter in practical procedure with multiple chapters that exists in specified module ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/pp/urine-catheter_1487245590353/chapter/usage_1487246011962",
            key: "urine-catheter_1487245590353",
            chapter: "usage_1487246011962",
            module: module,
            feature: "pp",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
                {
                    routeName: "CardOptionScreen", params: { title: getTextFromCMS(englishMockState.screen, "procedures", "procedures"), contentType: "procedure", backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[module].procedures }
                },
                {
                    routeName: "ChapterOptionScreen", params: { title: englishMockState[matches.key].description, contentType: "procedure", id: matches.key, backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.key].chapters }
                },
                {
                    routeName: "ActioncardScreen", params: { title: englishMockState[matches.key].chapters[0].description, contentType: "procedure", id: matches.key, backButtonTitle: getBackText(englishMockState.screen.back), content: englishMockState[matches.key].chapters[0].content, index: 0, fromNotification: false, chapterId: englishMockState[matches.key].chapters[0].id }
                }
            ],
            dispatchActions: [
                {
                    module: module,
                    type: "SELECT_MODULE",
                }
            ],
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })


    test("matches with unhandled feature type should throw error", () => {
        const matches: any = {
            input: baseURL + "/pp/urine-catheter_1487245590353/chapter/usage_1487246011962",
            key: "urine-catheter_1487245590353",
            chapter: "usage_1487246011962",
            module: module,
            feature: "new",
        }
        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions:
                [
                    default_linking_error,
                ],
            analyticsErrorMessage: "invalidUrl"
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);

    })

    test("giving key and chapter to a quiz should result in invalid link", () => {
        const matches: AppLinkParseResult = {
            input: baseURL + "/pp/urine-catheter_1487245590353/chapter/usage_1487246011962",
            key: "urine-catheter_1487245590353",
            chapter: "usage_1487246011962",
            module: module,
            feature: "quiz",
        }
        const expectedResult: RouteResultType = {
            routeActions: [],
            dispatchActions: [],
            analyticsErrorMessage: "invalidUrl"
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);

    })

    test("Link to specific module without any other data should take you to the module screen ", () => {
        const matches: AppLinkParseResult = {
            input: baseURL,
            module: module,
        }

        const expectedResult: RouteResultType = {
            routeActions: [
                {
                    routeName: "Module",
                    params: { title: "Hypertension" }
                },
            ],
            dispatchActions: [
                {
                    module: module,
                    type: "SELECT_MODULE",
                }
            ],
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })

    test("Link to specific module without any other data but module does not exist. Should result in error", () => {
        const matches: AppLinkParseResult = {
            input: "safedelivery://testmodule_134",
            module: "testmodule_134",
        }

        const expectedResult: RouteResultType = {
            routeActions: [
            ],
            dispatchActions: [
                default_linking_error
            ],
            analyticsErrorMessage: "moduleNotInLanguage"
        }

        const result = getRouteFromLink(matches, baseStoreState);
        expect(result).toEqual(expectedResult);
    })
});