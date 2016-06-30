/**
 * @memberOf Enum
 * @summary Usable role to filter access right
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
RolesEnum = {
    /** global */
    MANIFMAKER: "manifMaker",

    /** task */
    TASKREAD: "taskRead",
    /** task */
    TASKWRITE: "taskWrite",
    /** task */
    TASKDELETE: "taskDelete",
    /** task */
    ACCESSPASSVALIDATION: "accessPassValidation",
    /** task */
    EQUIPMENTVALIDATION: "equipmentValidation",
    /** task */
    ASSIGNMENTVALIDATION: "assignmentValidation",

    /** activity */
    ACITIVITYREAD: "activityRead",
    /** activity */
    ACITIVITYWRITE: "activityWrite",
    /** activity */
    ACITIVITYDELETE: "activityDelete",

    /** assignment */
    ASSIGNMENTTASKUSER: "assignmentTaskUser",

    /** user */
    USERREAD: "userRead",
    /** user */
    USERWRITE: "userWrite",
    /** user */
    USERDELETE: "userDelete",

    /** conf */
    CONFMAKER: "confMaker",
    /** conf */
    ROLE: "role"
};