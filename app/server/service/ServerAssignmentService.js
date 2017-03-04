import {TimeSlotService} from "../../both/service/TimeSlotService"
import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerAssignmentService */
export class ServerAssignmentService {

    /**
     * @summary Assignments.before.update
     * @description
     * - Collection Hooks :  Assignments.before.update
     * - Assignment can not be updated
     */
    static preventUpdate() {
        throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
    }

    /**
     * @summary Assignments.before.insert
     * @description
     * - Collection Hooks :  Assignments.before.insert
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }

    /**
     * @summary Assignments.before.update
     * @description
     * - Collection Hooks :  Assignments.before.update
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }

    /**
     * @summary Assignments.before.remove
     * @description
     * - Collection Hooks :  Assignments.before.remove
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }
}

