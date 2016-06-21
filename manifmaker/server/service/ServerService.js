import {ServerAssignmentService} from "./ServerAssignmentService";
import {ServerUserService} from "./ServerUserService";
import {ServerTaskService} from "./ServerTaskService";
import {ServerReferenceCollectionsService} from "./ServerReferenceCollectionsService";

/**
 * @class ServerService
 */
export class ServerService {

    /**
     * @summary add collection hooks
     * @description
     * Add hooks to the following collection
     *  - Assignments
     *  - Users
     *  - GroupRoles
     *  - Tasks
     *  - all ReferenceCollection
     *
     *  See collection server service to have details about hooks
     */
    static addCollectionHooks(){
        //propagate assignment update
        //Assignments.before.insert( /*if we need to add user and task data to assignments*/);
        Assignments.after.insert(ServerAssignmentService.propagateAssignment);
        Assignments.before.update(ServerAssignmentService.preventUpdate);
        Assignments.after.remove(ServerAssignmentService.removeAssignment);

        //propagate roles update
        Users.after.insert(ServerUserService.propagateRoles);
        Users.after.update(ServerUserService.propagateRoles);
        GroupRoles.after.update(ServerUserService.propagateGroupRoles);

        //allow/deny policy
        Tasks.before.insert(ServerTaskService.allowInsert);
        Tasks.before.update(ServerTaskService.allowUpdate);
        Tasks.before.remove(ServerTaskService.allowDelete);

        Users.before.insert(ServerUserService.allowInsert);
        Users.before.update(ServerUserService.allowUpdate);
        Users.before.remove(ServerUserService.allowDelete);

        Assignments.before.insert(ServerAssignmentService.allowInsert);
        Assignments.before.update(ServerAssignmentService.allowUpdate);
        Assignments.before.remove(ServerAssignmentService.allowDelete);


        var referencesCollections = [Skills, Teams, Places, AssignmentTerms, GroupRoles];
        referencesCollections.forEach(ReferenceCollection => {
            ReferenceCollection.before.insert(ServerReferenceCollectionsService.allowInsert);
            ReferenceCollection.before.update(ServerReferenceCollectionsService.allowUpdate);
            ReferenceCollection.before.remove(ServerReferenceCollectionsService.allowDelete);
        });
    }
}