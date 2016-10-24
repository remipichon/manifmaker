import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"
import {ServerTaskService} from "../../server/service/ServerTaskService"

/** @class ServerAssignmentTermService */
export class ServerAssignmentTermService {


    static isUsed(assignmentTerm){
        var start = assignmentTerm.start;
        var end = assignmentTerm.end;

        //has availabilities
        if (Users.find({
                "availabilities": {
                    $elemMatch: {
                        start: {
                            $gte: start,
                            $lt: end
                        },
                        end: {
                            $gt: start,
                            $lt: end
                        }
                    }
                }
            }).fetch().length !== 0)
            throw new Meteor.Error("403", `Can't update/delete assignment term with availabilities`);


        //has timeSlots
        if (Tasks.find({
                "timeSlots": {
                    $elemMatch: {
                        start: {
                            $gte: start,
                            $lt: end
                        },
                        end: {
                            $gt: start,
                            $lt: end
                        }
                    }
                }
            }).fetch().length !== 0)
            throw new Meteor.Error("403", `Can't  update/delete assignment term with timeSlots`);
    }

    /**
     * @summary  AssignmentTerm.before.insert
     * @description
     * - Collection Hooks :  AssignmentTerm.before.insert
     * - Needed role : CONFMAKER
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');
    }

    /**
     * @summary  AssignmentTerm.before.update
     * @description
     * - Collection Hooks :  AssignmentTerm.before.update
     * - Needed role : CONFMAKER
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');
        ServerAssignmentTermService.isUsed(doc);
    }

    /**
     * @summary  AssignmentTerm.before.remove
     * @description
     * - Collection Hooks :  AssignmentTerm.before.remove
     * - Needed role : CONFMAKER
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');
        ServerAssignmentTermService.isUsed(doc);
    }

}