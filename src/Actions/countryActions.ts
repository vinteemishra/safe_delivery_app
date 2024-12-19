import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("countryActions");

export const lookupCountryIfMissing = actionCreator("LOOKUP_COUNTRY_IF_MISSING");