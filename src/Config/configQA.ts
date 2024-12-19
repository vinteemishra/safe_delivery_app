const ENDPOINT_HOST_GLOBAL = "https://sda.maternity.dk";
const ENDPOINT_HOST_IN = "https://sda-in.maternity.dk";

export const ENDPOINT_HOST = (country: string | null) => {
    switch (country) {
        case "IN": return ENDPOINT_HOST_IN;
        default: return ENDPOINT_HOST_GLOBAL;
    }
}


export const CHEAT = true;
export const HAS_PREVIEW = true;
export const USE_LOCAL_CONTENT = false;

export const BUGSNAG_KEY = "cc6049ff684ae6cfe8ea0dc3434b80c9";
