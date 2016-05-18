/**
 * @memberOf Models
 * @summary Enum Validation State used to store into database
 * values : OPEN, TOBEVALIDATED, REFUSED, READY
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
ValidationState = {
    "OPEN": "OPEN",
    "TOBEVALIDATED": "TOBEVALIDATED",
    "REFUSED": "REFUSED",
    "READY": "READY"
};

/*
 OPEN -> TOBEVALIDATED
 TOBEVALIDATED -> REFUSED
 REFUSED -> READY
 READY -> REFUSED
 */