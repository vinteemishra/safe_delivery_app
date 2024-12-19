import { profileMigrate, fixProfileCert, certTemplate } from "../profileMigration";
import { UserProfile } from "../reducers";

const correctMigration = {
    userProfiles: {
        user1: {
            profileCertificates: [certTemplate]
        },
        user2: {
            profileCertificates: [certTemplate]
        },
        user3: {
            profileCertificates: [{ ...certTemplate, unlockTimestamp: 1234456 }]
        }
    }
}

describe("profileCertificates", () => {
    test("profileMigrate", () => {
        const state = {
            userProfiles: {
                user1: {
                    profileCertificate: {}
                },
                user2: {
                    profileCertificates: [{}]
                },
                user3: {
                    profileCertificates: [{ unlockTimestamp: 1234456 }]
                }
            }
        }
        const result = profileMigrate(state)
        expect(result).toEqual(correctMigration)
    });
})

describe("fixProfileCert", () => {
    const profileWithoutProfileCertificates: UserProfile = {
        profileId: "user1",
        profileTimestamp: 123456,
        profileName: "test",
        profileEmail: null,
        profileModuleScores: {},
        cheatUsed: false,
        listOfShownNotifications: [],
        dismissedUpgradeMessage: true,
    }

    const defaultProfileCertificate = {
        unlockTimestamp: 1572438317,
        score: 35,
        passed: false,
        claimed: false,
        name: "",
        jobTitle: "",
        workPlace: "",
        certDate: 0,
        profilePrepTestScores: {}
    }

    test("fixProfileCert for already correct profile", () => {
        const profile = { ...profileWithoutProfileCertificates, profileCertificates: [defaultProfileCertificate] };

        const fixedProfile = fixProfileCert(profile);
        expect(fixedProfile).toEqual(profile);

    });

    test("fixProfileCert for account with neither profileCertificate or profileCertificates properties", () => {
        const profile = { ...profileWithoutProfileCertificates };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [certTemplate] };

        expect(fixedProfile).toEqual(expectedResult);

    });

    test("fixProfileCert for old profile with property profileCertificate", () => {

        const profile = { ...profileWithoutProfileCertificates, profileCertificate: defaultProfileCertificate };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [defaultProfileCertificate] };
        expect(fixedProfile).toEqual(expectedResult);

    });

    test("fixProfileCert on old profile with profileCertificate and partially taken", () => {
        const UNLOCK_TIMESTAMP = 1572438317;
        const SCORE = 100;
        const PASSED = true;

        const partialData = {
            unlockTimestamp: UNLOCK_TIMESTAMP,
            passed: PASSED,
            score: SCORE
        }
        const profile = { ...profileWithoutProfileCertificates, profileCertificate: partialData };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [{ ...certTemplate, ...partialData }] };
        expect(fixedProfile).toEqual(expectedResult);

    });

    test("fixProfileCert on profile with empty array in property profileCertificates", () => {
        const profile = { ...profileWithoutProfileCertificates, profileCertificates: [] };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [certTemplate] };
        expect(fixedProfile).toEqual(expectedResult);

    });

    test("fixProfileCert on profile with empty object in profileCertificates array", () => {

        const profile = { ...profileWithoutProfileCertificates, profileCertificates: [{}] };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [certTemplate] };
        expect(fixedProfile).toEqual(expectedResult);

    });

    test("fixProfileCert on profile created with empty object in profileCertificates array and partially taken", () => {
        const UNLOCK_TIMESTAMP = 1572438317
        const profile = { ...profileWithoutProfileCertificates, profileCertificates: [{ unlockTimestamp: UNLOCK_TIMESTAMP }] };

        const fixedProfile = fixProfileCert(profile);
        const expectedResult = { ...profileWithoutProfileCertificates, profileCertificates: [{ ...certTemplate, unlockTimestamp: UNLOCK_TIMESTAMP }] };
        expect(fixedProfile).toEqual(expectedResult);

    });

}) 
