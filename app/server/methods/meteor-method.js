import {InjectDataServerService} from "../service/InjectDataServerService"
import {SecurityServiceServer} from "../service/SecurityServiceServer"


Meteor.methods({
     injectData: function(){
         SecurityServiceServer.isItProd("inject data from front");
         Meteor.isStartingUp = true;
         InjectDataServerService.deleteAll();
         InjectDataServerService.initAccessRightData();
         InjectDataServerService.injectAllData();
         Meteor.isStartingUp = false;
     }
});

