import {ServerAssignmentService} from "../server/service/ServerAssignmentService"
import {ServerReferenceCollectionsService} from "../server/service/ServerReferenceCollectionsService"
import {ServerUserService} from "../server/service/ServerUserService"
import {ServerTaskService} from "../server/service/ServerTaskService"
import {ServerService} from "./service/ServerService";

Meteor.startup(function () {

    // code to run on server at startup

    ServerService.addCollectionHooks();


});












