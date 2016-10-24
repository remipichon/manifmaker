import {ServerAssignmentService} from "./ServerAssignmentService";
import {ServerUserService} from "./ServerUserService";
import {ServerTaskService} from "./ServerTaskService";
import {ServerTaskGroupService} from "./ServerTaskGroupService";
import {ServerGroupRoleService} from "./ServerGroupRoleService";
import {ServerAssignmentTermService} from "./ServerAssignmentTermService";
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
        //create user when Account register a new one
        Meteor.users.after.insert(ServerUserService.createCustomUser);

        //propagate assignment update
        //Assignments.before.insert( /*if we need to add user and task data to assignments*/);
        Assignments.after.insert(ServerAssignmentService.propagateAssignment);
        Assignments.before.update(ServerAssignmentService.preventUpdate);
        Assignments.after.remove(ServerAssignmentService.removeAssignment);

        //propagate roles update
        Users.after.insert(ServerUserService.propagateRoles); //Users hooks are bypassed with .direct when registering a new user
        Users.after.update(ServerUserService.propagateRoles);
        GroupRoles.after.update(ServerUserService.propagateGroupRoles);

        //allow/deny policy
        Tasks.before.insert(ServerTaskService.allowInsert);
        Tasks.before.update(ServerTaskService.allowUpdate);
        Tasks.before.remove(ServerTaskService.allowDelete);

        TaskGroups.before.insert(ServerTaskGroupService.allowInsert);
        TaskGroups.before.update(ServerTaskGroupService.allowUpdate);
        TaskGroups.before.remove(ServerTaskGroupService.allowDelete);
        TaskGroups.after.remove(ServerTaskGroupService.afterRemove);

        Users.before.insert(ServerUserService.allowInsert); //Users hooks are bypassed with .direct when registering a new user
        Users.before.update(ServerUserService.allowUpdate); //Users hooks are bypassed with .direct when registering a new user
        Users.before.remove(ServerUserService.allowDelete); //Users hooks are bypassed with .direct when registering a new user

        Assignments.before.insert(ServerAssignmentService.allowInsert);
        Assignments.before.update(ServerAssignmentService.allowUpdate);
        Assignments.before.remove(ServerAssignmentService.allowDelete);

        GroupRoles.before.insert(ServerGroupRoleService.allowInsert);
        GroupRoles.before.update(ServerGroupRoleService.allowUpdate);
        GroupRoles.before.remove(ServerGroupRoleService.allowDelete);

        GroupRoles.before.insert(ServerGroupRoleService.allowInsert);
        GroupRoles.before.update(ServerGroupRoleService.allowUpdate);

        AssignmentTerms.before.update(ServerAssignmentTermService.allowUpdate);
        AssignmentTerms.before.remove(ServerAssignmentTermService.allowDelete);


        var referencesCollections = [Skills, Teams, Places, AssignmentTerms];
        referencesCollections.forEach(ReferenceCollection => {
            ReferenceCollection.before.insert(ServerReferenceCollectionsService.allowInsert);
            ReferenceCollection.before.update(ServerReferenceCollectionsService.allowUpdate);
            ReferenceCollection.before.remove(ServerReferenceCollectionsService.allowDelete);
        });
    }
}