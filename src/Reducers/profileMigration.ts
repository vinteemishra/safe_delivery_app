import { getStoredState } from "redux-persist";

export const certTemplate = {
    claimed: false,
    certDate: 0,
    passed: false,
    score: 0,
    unlockTimestamp: 0,
    jobTitle: "",
    name: "",
    workPlace: "",
    profilePrepTestScores: {}
};

export function fixProfileCert(profile) {

    // if (profile.profileCertificate === undefined && profile.profileCertificates === undefined) {
    //     return {
    //         ...profile,
    //         profileCertificates: [
    //             certTemplate,
    //         ],
    //     }
    // }

    // If the incomming profile has an profileCertificate strukcure, then check if the data indisde is OK, write the data / updated data to the new certificates structure
    if (profile.profileCertificate) { //Vorking correct!

        let cert = _compareAndUpdateObjects(profile.profileCertificate, certTemplate);

        const { profileCertificate, ...rest } = profile;

        return {
            ...rest,
            profileCertificates: [
                cert
            ],
        }
    }
    // If the incomming profile has an profileCertificates strukcure, then check if the data indisde is OK, write the data / updated data to the certificates structure
    else if (profile.profileCertificates) { //Working correct

        const { profileCertificates, ...rest } = profile;

        if (Array.isArray(profile.profileCertificates) && profile.profileCertificates.length > 0) {

            let cert = {};
            let _profileCertificates = [];

            profile.profileCertificates.map((item, index) => {

                cert = _compareAndUpdateObjects(item, certTemplate);
                _profileCertificates.push(cert)
            })

            return {
                ...rest,
                profileCertificates: _profileCertificates
            }
        }
        // If the certificates array structure is currupt in some way, then save a template in the correct structure
        else { //Working correct
            return {
                ...rest,
                profileCertificates: [
                    certTemplate
                ],
            }
        }
    }
    // If there is not a certificate or a certificates when make a certificates with the template
    else { //Working correct
        return {
            ...profile,
            profileCertificates: [
                certTemplate
            ],
        }
    }

    // if (profile.profileCertificates && Array.isArray(profile.profileCertificates) && profile.profileCertificates.length === 0) {

    //     const { profileCertificates, ...rest } = profile;

    //     return {
    //         ...rest,
    //         profileCertificates: [
    //             certTemplate
    //         ]
    //     }
    // }

    // if (profile.profileCertificates && Array.isArray(profile.profileCertificates) && profile.profileCertificates.length > 0) {

    //     let cert = {};
    //     let _profileCertificates = [];

    //     profile.profileCertificates.map((item, index) => {

    //         cert = _compareAndUpdateObjects(item, certTemplate);
    //         _profileCertificates.push(cert)
    //     }
    //     )

    //     const { profileCertificates, ...rest } = profile;

    //     return {
    //         ...rest,
    //         profileCertificates: _profileCertificates
    //     }
    // }


    // else {
    //     return profile;
    // }
}

function fixProfileCreationMethod(profile) {
    if (profile.method) {
        return profile;
    }

    if (profile.method === undefined && profile.profileEmail != null) {
        return {
            ...profile,
            method: "Email",
        }
    }
    return profile;
}

/**
 * @param one object to validate
 * @param two object to compare against
 */

function _compareAndUpdateObjects(one, two) {
    const keysOne = Object.keys(one);
    const keysTwo = Object.keys(two);

    const allKeys = new Set([...keysOne, ...keysTwo]);

    const cert = {};
    for (const k of allKeys) {
        cert[k] = one[k] && one[k] != two[k] ? one[k] : two[k]
    }

    return cert;
}

export const profileMigrate = (fsResult) => {

    if (!fsResult) {
        return;
    }
    const { userProfiles, ...rest } = fsResult;

    if (!userProfiles || Object.keys(userProfiles).length === 0) {
        return;
    }

    const users = Object.keys(userProfiles);

    const migratedUserProfiles = {};
    for (const id of users) {

        migratedUserProfiles[id] = fixProfileCert(userProfiles[id]);

        migratedUserProfiles[id] = fixProfileCreationMethod(migratedUserProfiles[id]);

    }

    const updatedState = {
        ...rest,
        userProfiles: migratedUserProfiles,
    }

    return updatedState;
}