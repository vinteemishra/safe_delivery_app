
import { Platform } from "react-native";

// const ENDPOINT_HOST_GLOBAL = "https://sda.maternity.dk";
// const ENDPOINT_HOST_IN = "https://sda-in.maternity.dk";

const ENDPOINT_HOST_GLOBAL = Platform.OS === "android" ? "http://10.0.2.2:9000" : 'http://localhost:9000';
const ENDPOINT_HOST_IN = Platform.OS === "android" ? "http://10.0.2.2:9010" : 'http://localhost:9010';

export const ENDPOINT_HOST = (country: string | null) => {
    switch (country) {
        case "IN": return ENDPOINT_HOST_IN;
        default: return ENDPOINT_HOST_GLOBAL;
    }
}

export const CHEAT = true;
export const HAS_PREVIEW = true;
export const USE_LOCAL_CONTENT = true;

export const BUGSNAG_KEY = "d1d4b46ce1f66a7b75139a48fcfd26ff";
