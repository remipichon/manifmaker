import {ServerAssignmentService} from "../server/service/ServerAssignmentService"
import {ServerReferenceCollectionsService} from "../server/service/ServerReferenceCollectionsService"
import {ServerUserService} from "../server/service/ServerUserService"
import {ServerTaskService} from "../server/service/ServerTaskService"

Meteor.startup(function () {

    // code to run on server at startup

    //propagate assignment update
    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
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

    injectData();


});












