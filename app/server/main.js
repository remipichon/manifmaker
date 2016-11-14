import {ServerAssignmentService} from "../server/service/ServerAssignmentService"
import {ServerReferenceCollectionsService} from "../server/service/ServerReferenceCollectionsService"
import {ServerUserService} from "../server/service/ServerUserService"
import {ServerTaskService} from "../server/service/ServerTaskService"
import {ServerService} from "./service/ServerService";
import {InjectDataServerService} from "./service/InjectDataServerService";
import {Inject24hDataServerService} from "./service/Inject24hDataServerService";
import {InjectDataHelperServerService} from "./service/InjectDataHelperServerService";

Meteor.startup(function () {
    Meteor.isStartingUp = true;

    // code to run on server at startup

    ServerService.addCollectionHooks();

    var inject24hDataServerService = new Inject24hDataServerService();
    var injectDataServerService = new InjectDataServerService();

    Meteor.injectDataServerService = inject24hDataServerService;

    var injectAll = process.env.INJECT_ALL;
    if (typeof(injectAll) !== 'undefined' && injectAll == "true") {
        console.info("Meteor.startup : injectAll trigger by ENV (deleteAll, initAccessRightData, injectAllData)");
        InjectDataHelperServerService.deleteAll();
        InjectDataHelperServerService.initAccessRightData();
        Meteor.injectDataServerService.injectAllData();
    }
    var initAccessRight = process.env.INJECT_MINIMUM_ACCESS_RIGHT;
    if (typeof(initAccessRight) !== 'undefined' && initAccessRight == "true") {
        console.info("Meteor.startup : initAccessRight trigger by ENV (deleteAll, initAccessRightData)");
        InjectDataHelperServerService.deleteAll();
        InjectDataHelperServerService.initAccessRightData();
    }

    if(Meteor.isDevelopment){
        //specific to the dev needs
        console.info("Meteor.startup : isDevelopment, injecting or not");
        InjectDataHelperServerService.deleteAll();
        InjectDataHelperServerService.initAccessRightData();
        Meteor.injectDataServerService.injectAllData();
    }



    Meteor.isStartingUp = false;
});












