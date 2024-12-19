import { upsertProfile } from "../Actions/actions";
import {
    syncProfilesStart,
} from "../Actions/syncProfilesActions";
import { ENDPOINT_HOST } from "../Config/config";

const debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

class SdaProfile {
    constructor() {
        this.lastSync = -1;
        this.save = debounce(this.actuallySave, 2000);
    }

    hasEmail(profile) {
        return (
            profile.profileEmail !== null &&
            profile.profileEmail !== undefined &&
            typeof profile.profileEmail === "string" &&
            profile.profileEmail.trim().length > 0
        );
    }

    getOnlineProfiles = (profiles) => {
        var result = {},
            key;
        for (key in profiles) {
            if (profiles.hasOwnProperty(key) && this.hasEmail(profiles[key])) {
                result[key] = profiles[key];
            }
        }
        return result;
    };

    isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    async saveProfileEndpointToFile(country) {
        if (country === null || country === "Unknown") {
            return;
        }

        var fs = require("react-native-fs");
        var filename = fs.DocumentDirectoryPath + "/profile_endpoint.txt";

        try {
            await fs.unlink(filename);
        } catch (error) {
            /* Ok */
        }

        try {
            await fs.writeFile(filename, ENDPOINT_HOST(country));
        } catch (err) {
            console.log("Couldn't save country: " + err);
        }
    }

    async actuallySave(profile_data) {
        let filtered_data = {};

        for (var user_id in profile_data)
            if (profile_data[user_id].profileEmail) {
                filtered_data[user_id] = profile_data[user_id];
            }

        var fs = require("react-native-fs");
        var fn = fs.DocumentDirectoryPath + "/profiles.json";

        try {
            await fs.unlink(fn);
            console.log("File deleted");
        } catch (error) {
            console.log("Filedetetion error!");
        }

        var filtered_json = JSON.stringify(filtered_data);

        fs.writeFile(fn, filtered_json)
            .then(() => {
                console.log("profiles saved profiles.json");
            })
            .catch((err) => {
                console.log("profiles save error: " + err);
            });
    }

    async loadAndDeleteUpdated() {
        var fs = require("react-native-fs");
        var filename = fs.DocumentDirectoryPath + "/profiles_updated.json";
        const exists = await fs.exists(filename);

        if (!exists) {
            console.log("no new profiles_updated.json");
            return undefined;
        }

        try {
            const updatedProfileRaw = await fs.readFile(filename);
            const updatedProfile = JSON.parse(updatedProfileRaw);

            // Clean updated file
            await fs.writeFile(filename, "{}");

            console.log("Found something in profiles_updated.json");
            return updatedProfile;
        } catch (e) {
            console.warn("Couldn't read profiles_updated.json", e);
        }
    }

    async syncOnlineProfiles(profiles, country, dispatchCallback = undefined) {
        let onlineProfiles = this.getOnlineProfiles(profiles);

        if (this.isEmptyObject(onlineProfiles)) {
            return undefined;
        }

        let now = Date.now();

        console.log("now - this.lastSync", now, this.lastSync);

        if (now - this.lastSync > 60 * 1000) {
            dispatchCallback && dispatchCallback(syncProfilesStart());

            this.lastSync = now;

            const response = await fetch(
                ENDPOINT_HOST(country) + "/api/public/profiles", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify(onlineProfiles),
                }
            );
            return await response.json();
        } else {
            console.log("No reason to Profile sync now");
            return profiles;
        }
    }

    upsertProfileHelper(dispatchCallback, profileId, profileData) {
        dispatchCallback(
            upsertProfile(
                profileId,
                profileData.profileTimestamp,
                profileData.profileName,
                profileData.profileEmail,
                profileData.country,
                profileData.profileQuestions,
                profileData.profileModuleScores,
                profileData.profileCertificates,
                profileData.listOfShownNotifications,
                profileData.dismissedUpgradeMessage,
                profileData.cheatUsed,
                profileData.method,
                profileData.userSpecificNotificationScheduleList,
                profileData.moduleCertificates
            )
        );
    }

    upsertAllProfilesHelper(dispatchCallback, profiles) {
        for (const id in profiles) {
            let p = profiles[id];
            this.upsertProfileHelper(dispatchCallback, id, p);
        }
    }
}

export let profile = new SdaProfile();