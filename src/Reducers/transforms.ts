import { createTransform } from "redux-persist";

// function fixProfileCert(profile) {

//     let certTemplate = {
//         claimed: false,
//         certDate: 0,
//         passed: false,
//         score: 0,
//         unlockTimestamp: 0,
//         jobTitle: "",
//         name: "",
//         workPlace: "",
//         profilePrepTestScores: {}
//     };

//     console.log("transform - fixProfileCert - profile: ", profile);
//     console.log("transform - fixProfileCert - profile.profileCertificate === undefined: ", profile.profileCertificate === undefined);
//     console.log("transform - fixProfileCert - profile.profileCertificates !== undefined: ", profile.profileCertificates !== undefined);

//     if (profile.profileCertificate === undefined && profile.profileCertificates === undefined) { //Vorking correct!
//         console.log("transform - profile.profileCertificate === undefined");
//         return {
//             ...profile,
//             profileCertificates: [
//                 certTemplate,
//             ],
//         }
//     }

//     // If the incomming profile has an empty profileCertificate, then make a template within the new structure
//     if (profile.profileCertificate) { //Vorking correct!
//         console.log("transform - profile.profileCertificate");

//         let cert = _compareAndUpdateObjects(profile.profileCertificate, certTemplate);

//         const { profileCertificate, ...rest } = profile;

//         return {
//             ...rest,
//             profileCertificates: [
//                 cert
//             ],
//         }
//     }

//     if (profile.profileCertificates && Array.isArray(profile.profileCertificates)) { //Vorking correct! TODO - check for [] with no entries!
//         console.log("transform - profile.profileCertificates && Array.isArray(profile.profileCertificates");

//         let cert = {};
//         let _profileCertificates = [];

//         profile.profileCertificates.map((item, index) => {

//             cert = _compareAndUpdateObjects(item, certTemplate);
//             _profileCertificates.push(cert)
//         }
//         )

//         const { profileCertificates, ...rest } = profile;

//         return {
//             ...rest,
//             profileCertificates: _profileCertificates
//         }
//     }


//     else {
//         console.log("transform - profile.profileCertificates !== undefined");
//         return profile;
//     }
// }

// function fixProfileCreationMethod(profile) {
//     if (profile.method === undefined) {
//         return {
//             ...profile,
//             method: "Email",
//         }
//     }
//     return profile;
// }


// /**
//  * @param one object to compare
//  * @param two object to compare to
//  */

// function _compareAndUpdateObjects(one, two) {
//     const keysOne = Object.keys(one);
//     const keysTwo = Object.keys(two);

//     const allKeys = new Set([...keysOne, ...keysTwo]);

//     const cert = {};
//     for (const k of allKeys) {
//         cert[k] = one[k] && one[k] != two[k] ? one[k] : two[k]
//     }

//     return cert;
// }

export const ProfileMigrationTransform = createTransform(
    // Do nothing on save
    (inboundState, key) => (inboundState),

    // Do something on read / app start
    (userProfiles, key) => {
        // console.log("outboundState er nu: ", userProfiles);
        // const users = Object.keys(userProfiles);

        // if (users.length > 0) {
        //     const migratedUserProfiles = {};
        //     for (const id of users) {
        //         migratedUserProfiles[id] = fixProfileCert(userProfiles[id]);
        //         console.log("migratedUserProfiles: ", migratedUserProfiles[id]);
        //         // migratedUserProfiles[id] = fixProfileCreationMethod(userProfiles[id]);

        //         //Send the above updated migratedUserProfiles[id], otherwise the fixProfileCreationMethod will just overwrite with the old profile
        //         migratedUserProfiles[id] = fixProfileCreationMethod(migratedUserProfiles[id]);
        //         console.log("migratedUserProfiles: ", migratedUserProfiles[id]);
        //     }
        //     console.log("migratedUserProfiles: ", migratedUserProfiles);
        //     return migratedUserProfiles;
        // }

        // console.log("userProfiles: ", userProfiles);
        return userProfiles; //Need to save in the right way!
    },
    // define which reducers this transform gets called for.
    { whitelist: ['userProfiles'] }
);