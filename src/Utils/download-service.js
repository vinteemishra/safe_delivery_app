import { Platform, NativeModules } from 'react-native';
import fs from 'react-native-fs';

const BASE_URL = "https://sdacms.blob.core.windows.net"

export const ServiceStatusCode = {
    FAILED: -2,
    STOPPED: -1,
};

const TIMEOUT_ATTEMPT_1 = 15000;
const TIMEOUT_ATTEMPT_2 = 120000;
const TIMEOUT_ATTEMPT_3 = 3600000;

const getTimeout = (attempt) => {
    switch (attempt) {
        case 1: return TIMEOUT_ATTEMPT_1;
        case 2: return TIMEOUT_ATTEMPT_2;
        case 3: return TIMEOUT_ATTEMPT_3;
        default: return TIMEOUT_ATTEMPT_1;
    }
}

class DownloadServiceIos {
    // Singleton stuff
    static instance;
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new DownloadServiceIos();
        }
        return this.instance;
    }

    constructor() {
        // console.log("Created iOS download service");
        this.urlList = [];
        this.jobIdList = [];
        this.totalItems = 0;
        this.failed = false;
        this.stopped = true;
        this.attempts = 1;

        // Bind me some methods.
        this.getDownloadStatus = this.getDownloadStatus.bind(this);
        this.cleanUrlList = this.cleanUrlList.bind(this);
        this.removeItemFromUrls = this.removeItemFromUrls.bind(this);
        this.scheduleDownloadFile = this.scheduleDownloadFile.bind(this);
        this.startDownload = this.startDownload.bind(this);
        this.cancelDownload = this.cancelDownload.bind(this);
        this.stopDownloadAndClearList = this.stopDownloadAndClearList.bind(this);

        // console.log(this.urlList.length);
    }

    // fetchConfig(path) {
    //     return {
    //         fileCache: true,
    //         timeout: 30000,
    //         followRedirect: false,
    //         path,
    //     };
    // }

    /**
     * Status:
     *    o  Non negative number is number of remaining jobs
     *    o  -1 is stopped/finished
     *    o  -2 is failed
     */
    async getDownloadStatus() {
        if (this.failed) {
            return -2;
        }

        if (this.stopped) {
            return -1;
        }

        console.log("Status was called: ", this.urlList.length);
        return this.urlList.length;
    }

    cleanUrlList() {
        this.urlList.splice(0, this.urlList.length);
        this.jobIdList.splice(0, this.jobIdList.length);
    }

    removeItemFromUrls(item) {
        
        const index = this.urlList.indexOf(item);
        if (index > -1) {
            this.urlList.splice(index, 1);
        }
    }

    hasNotDownloadedFIle() {
        return this.urlList.length > 0;
    }

    async scheduleDownloadFile(url, timeout) {
        
        let absoluteUrl = BASE_URL + url;
        let destinationPath = fs.DocumentDirectoryPath + url;

        let split = destinationPath.split(/[\s/]+/);
        let dir = destinationPath.replace(split[split.length - 1], '');

        // Ensure that directory exists
        await fs.mkdir(dir, { NSURLIsExcludedFromBackupKey: true });

        const promiseWrapper = (prom) => {
            
            return new Promise((res, reject) => {
                prom.then(() => {
                    console.log("This url was done: ", url);
                    this.removeItemFromUrls(url);
                    res();
                }).catch(e => {
                    console.log("This url failed...: ", url);
                    reject(e);
                });
            });
        };

        // const conf = this.fetchConfig(destinationPath);
        const job = fs.downloadFile({
            fromUrl: absoluteUrl,
            toFile: destinationPath,
            background: true,
            discretionary: false,
            readTimeout: timeout,
            backgroundTimeout: TIMEOUT_ATTEMPT_3,
        });
        
        return {
            promise: promiseWrapper(job.promise), // .then(removeJobIdFromList),
            jobId: job.jobId,
        };
    }

    async scheduleDownload(list, timeout) {

        const urlListCopy = [...list];

        const promises = [];

        for (var url of urlListCopy) {
            if (this.stopped) {
                break;
            }

            try {
                const job = await this.scheduleDownloadFile(url, timeout);
                console.log("Got this from job:", job);
                promises.push(job.promise);
                this.jobIdList.push(job.jobId);
            } catch (e) {
                console.log("error: ", e);
            }
        }
        return promises;
    }

    shouldTryAgain() {
        console.log("shouldTryAgain");

        if (this.attempts > 3) {
            this.failed = true;
            console.log("We failed!");
            return;
        }

        console.log("The thing was done...");
        if (this.urlList.length > 0) {
            this.attempts++;
            this.startDownload([ ...this.urlList ]);
        }
    }

    async startDownload(list) {
        console.log("startDownload");
        

        this.stopped = false;
        this.failed = false;
        // Clear list and add new urls.
        this.cleanUrlList();
        this.urlList.push(...list);
        this.totalItems = this.urlList.length;

        // const urlListCopy = [...list];

        console.log("timeout er nu: ", getTimeout(this.attempts));
        
        // const promiseList = await this.scheduleDownload(list, getTimeout(this.attempts));
        const promiseList = await this.scheduleDownload(list, getTimeout(this.attempts));

        console.log("promiseList.length er nu: ", promiseList.length);
        
        let count = 0;
        for (const prom of promiseList) {
            
            prom.then(r => {
                count++;
                console.log("count then:", count);
                if (count == promiseList.length) {
                    this.shouldTryAgain();
                }
            }).catch(e => {
                count++;
                console.log("count catch:", count);
                if (count == promiseList.length) {
                    this.shouldTryAgain();
                }
            });
        }

        return;
    }

    stopDownloadAndClearList() {
        this.jobIdList.map(fs.stopDownload); // Cancel downloads
        this.stopped = true;
        this.cleanUrlList();
        this.totalItems = 0;
    }

    async cancelDownload() {
        this.stopDownloadAndClearList();
        this.failed = false;
    }
}

const createServices = () => {
    
    if (Platform.OS === "android") {
        const rnModule = NativeModules.DownloadService;
        return {
            getDownloadStatus: rnModule.getDownloadStatus,
            startDownload: rnModule.startDownload,
            cancelDownload: rnModule.cancelDownload,
        }
    }

    return {
        getDownloadStatus: DownloadServiceIos.getInstance().getDownloadStatus,
        startDownload: DownloadServiceIos.getInstance().startDownload,
        cancelDownload: DownloadServiceIos.getInstance().cancelDownload,
    }
}

export default {
    ...createServices()
};