import {ServerAssignmentService} from "../server/service/ServerAssignmentService"
import {ServerReferenceCollectionsService} from "../server/service/ServerReferenceCollectionsService"
import {ServerUserService} from "../server/service/ServerUserService"
import {ServerTaskService} from "../server/service/ServerTaskService"
import {ServerService} from "./service/ServerService";
import {InjectDataServerService} from "./service/InjectDataServerService";

Meteor.startup(function () {
    Meteor.isStartingUp = true;

    // code to run on server at startup

    ServerService.addCollectionHooks();

    var injectAll = process.env.INJECT_ALL;
    if (typeof(injectAll) !== 'undefined') {
        console.info("Meteor.startup : injectAll trigger by ENV (deleteAll, initAccessRightData, injectAllData)");
        InjectDataServerService.deleteAll();
        InjectDataServerService.initAccessRightData();
        InjectDataServerService.injectAllData();
    }
    var initAccessRight = process.env.INJECT_MINIMUM_ACCESS_RIGHT;
    if (typeof(initAccessRight) !== 'undefined') {
        console.info("Meteor.startup : initAccessRight trigger by ENV (deleteAll, initAccessRightData)");
        InjectDataServerService.deleteAll();
        InjectDataServerService.initAccessRightData();
    }

    if(Meteor.isDevelopment){
        //specific to the dev needs
        console.info("Meteor.startup : isDevelopment, injecting or not");
        InjectDataServerService.deleteAll();
        InjectDataServerService.initAccessRightData();
        InjectDataServerService.injectAllData();
    }



    Meteor.isStartingUp = false;
});












