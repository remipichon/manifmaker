/**
 * @memberOf Enum
 * @summary Enum Validation State used to store into database
 * @description
 * workflow :
 *
 *  - OPEN -> TOBEVALIDATED
 *  - TOBEVALIDATED -> READY
 *  - TOBEVALIDATED -> REFUSED
 *  - READY -> REFUSED
 *
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

