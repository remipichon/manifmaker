import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerTaskService */
export class ServerTaskService {

    /**
     * @summary  Tasks.before.insert
     * @description
     * - Collection Hooks :  Tasks.before.insert
     * - Needed role : TASKWRITE
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKWRITE, doc, 'task');
    }

    /**
     * @summary  Tasks.before.update
     * @description
     * - Collection Hooks :  Tasks.before.update
     * - Needed role : TASKWRITE
     *   - ACCESSPASSVALIDATION
     *   - ASSIGNMENTVALIDATION
     *   - EQUIPMENTVALIDATION
     *   - ASSIGNMENTTASKUSER
     *
     *   Also check task validation state to authorize
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKWRITE, doc, 'task');

        if (_.contains(fieldNames, "assignmentValidation")) {
            if (modifier.$set.assignmentValidation.currentState !== ValidationState.TOBEVALIDATED)
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTVALIDATION, doc, 'task');
        }

        if (_.contains(fieldNames, "equipmentValidation"))
            if (( modifier.$set.equipmentValidation && modifier.$set.equipmentValidation.currentState !== ValidationState.TOBEVALIDATED &&
                modifier.$set["equipmentValidation.currentState"] !== ValidationState.TOBEVALIDATED))
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.EQUIPMENTVALIDATION, doc, 'task');


        if (_.contains(fieldNames, "assignments")) {
            if (modifier.$push)
                if (modifier.$push.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
            if (modifier.$set)//TODO a virer
                if (modifier.$set.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
            if (modifier.$pull)
                if (modifier.$pull.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
        }
    }

    /**
     * @summary  Tasks.before.delete
     * @description
     * - Collection Hooks :  Tasks.before.delete
     * - Needed role : TASKDELETE
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKDELETE, doc, 'task');
    }
}