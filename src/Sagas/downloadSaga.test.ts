import { getNewModules, getUpdatedVideos, getVideosToDownload, getVideosToUpdate } from "./downloadSaga";
import { mockOldVideoList, mockUpdatedVideoList } from "./__mocks__/videoLists";
import { mockUpdatedModuleList } from "./__mocks__/moduleLists";
import { Video } from "../Reducers/reducers";
import { BundleModule } from "../Reducers/contentReducer";

let updatedVideoList: Array<Video>;
let oldVideoList: Array<Video>;
let updatedModuleList: Array<BundleModule>;
let oldModuleList: Array<BundleModule>;;
let offlineModuleIds: Array<string>;
let isSelectiveDownload: boolean;

describe("getUpdatedVideos", () => {

    const mMockOldVideoList = [
        {
            id: '/english WHO/Infection prevention/intro',
            src: '/localcontent/assets/videos/english%20WHO/Infection%20prevention/intro.mp4',
            icon: '/english WHO/Infection prevention/intro',
            description: 'Intro',
            version: 1605615228000
        },
        {
            id: '/english WHO/Infection prevention/hand_hygiene',
            src: '/localcontent/assets/videos/english%20WHO/Infection%20prevention/hand_hygiene.mp4',
            icon: '/english WHO/Infection prevention/hand_hygiene',
            description: 'Hand Hygiene',
            version: 1605615227000
        },
        {
            id: '/english WHO/Post abortion care/intro',
            src: '/localcontent/assets/videos/english%20WHO/Post%20abortion%20care/intro.mp4',
            icon: '/english WHO/Post abortion care/intro',
            description: 'Intro',
            version: 1605615230000
        },
    ]


    const mMockUpdatedVideoList = [
        {
            id: '/english WHO/Infection prevention/intro',
            src: '/localcontent/assets/videos/english%20WHO/Infection%20prevention/intro.mp4',
            icon: '/english WHO/Infection prevention/intro',
            description: 'Intro',
            version: 1605616974977
        },
        {
            id: '/english WHO/Infection prevention/hand_hygiene',
            src: '/localcontent/assets/videos/english%20WHO/Infection%20prevention/hand_hygiene.mp4',
            icon: '/english WHO/Infection prevention/hand_hygiene',
            description: 'Hand Hygiene',
            version: 1605616974977
        },
        {
            id: '/english WHO/Post abortion care/intro',
            src: '/localcontent/assets/videos/english%20WHO/Post%20abortion%20care/intro.mp4',
            icon: '/english WHO/Post abortion care/intro',
            description: 'Intro',
            version: 1605616974977
        },
    ]

    beforeEach(() => {
        updatedVideoList = mMockUpdatedVideoList.map(v => ({ ...v }));
        oldVideoList = mMockOldVideoList.map(v => ({ ...v }));
    });

    it("should recognize that all videos have been updated", () => {
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        expect(videosToUpdate).toEqual(updatedVideoList);
    });

    it("should recognize that two videos have been updated", () => {
        updatedVideoList = oldVideoList.map(v => ({ ...v }));
        updatedVideoList[0] = { ...updatedVideoList[0], version: updatedVideoList[0].version + 1 } //Bumps versionumber
        updatedVideoList[1] = { ...updatedVideoList[1], version: updatedVideoList[1].version + 1 } //Bumps versionumber
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        const expectedResult = [updatedVideoList[0], updatedVideoList[1]];
        expect(videosToUpdate).toEqual(expectedResult);
    });

    it("should return updated videos (all) and the video that is unique for updatedVideoList", () => {
        oldVideoList.pop();
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        expect(videosToUpdate).toEqual(updatedVideoList);
    });

    it("should return the two items missing from oldVideoList", () => {
        updatedVideoList = [...oldVideoList];
        const expectedResult = [oldVideoList.pop()];
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        expect(videosToUpdate).toEqual(expectedResult);

    })

    it("should not update first videofile because it is the same for both lists", () => {
        updatedVideoList[0] = oldVideoList[0];
        const expectedResult = [...updatedVideoList].splice(1, updatedVideoList.length);
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        expect(videosToUpdate).toEqual(expectedResult);
    });

    it("should not return any items when updatedList only has no updates but is missing a video from the old list", () => {
        updatedVideoList.pop();
        const videosToUpdate = getUpdatedVideos(updatedVideoList, oldVideoList);
        expect(videosToUpdate).toEqual(updatedVideoList);
    })
});

describe("getVideosToDownload", () => {

    beforeEach(() => {
        updatedVideoList = mockUpdatedVideoList.map(v => ({ ...v }));
        oldVideoList = mockOldVideoList.map(v => ({ ...v }));
        updatedModuleList = JSON.parse(JSON.stringify(mockUpdatedModuleList));
        oldModuleList = JSON.parse(JSON.stringify([...updatedModuleList].splice(1, updatedModuleList.length)))
        offlineModuleIds = oldModuleList.map(m => m.id);
        isSelectiveDownload = true;

    });

    it("should download no videos if both module and video lists are identical", () => {
        const expectedResult = [];
        const result = getVideosToDownload(oldVideoList, oldVideoList, oldModuleList, oldModuleList, offlineModuleIds, isSelectiveDownload);
        expect(result).toEqual(expectedResult);
    })

    it("should download the videos from the extra module in updatedVideos if isSelectiveDownload is false", () => {
        isSelectiveDownload = false;
        const oldModuleList = [...updatedModuleList];
        oldModuleList.pop();
        oldVideoList.pop();
        const expectedResult = [updatedVideoList[2]]
        const result = getVideosToDownload(updatedVideoList, oldVideoList, updatedModuleList, oldModuleList, offlineModuleIds, isSelectiveDownload);
        expect(result).toEqual(expectedResult);
    });

    it("should not download the videos form the extra module if isSelectiveDownload is true", () => {
        const oldModuleList = [...mockUpdatedModuleList];
        oldModuleList.pop();
        const expectedResult = [];

        const result = getVideosToDownload(updatedVideoList, oldVideoList, updatedModuleList, oldModuleList, offlineModuleIds, isSelectiveDownload);
        expect(result).toEqual(expectedResult);
    });

    it("should not download videos from new module if the videos already exist in another offline module and isSelectiveDownload is false", () => {
        oldModuleList = [...updatedModuleList];
        oldModuleList.pop();

        oldModuleList[0].videos.push('/english WHO/Post abortion care/intro');
        isSelectiveDownload = false;
        offlineModuleIds = ['infection-prevention_1487676001934'];
        const expectedResult = [];
        const result = getVideosToDownload(updatedVideoList, updatedVideoList, updatedModuleList, oldModuleList, offlineModuleIds, isSelectiveDownload)

        expect(result).toEqual(expectedResult);
    });

    it("should donwload the videos from the new module, if videolists are the same, but videos belong to a module that is not offline and isSelectiveDownload is false", () => {
        oldModuleList = [...updatedModuleList];
        oldModuleList.pop();

        oldModuleList[0].videos.push('/english WHO/Post abortion care/intro');
        isSelectiveDownload = false;
        offlineModuleIds = [];
        const expectedResult = [updatedVideoList.find(v => v.id === '/english WHO/Post abortion care/intro')];
        const result = getVideosToDownload(updatedVideoList, updatedVideoList, updatedModuleList, oldModuleList, offlineModuleIds, isSelectiveDownload)

        expect(result).toEqual(expectedResult);
    });
})







