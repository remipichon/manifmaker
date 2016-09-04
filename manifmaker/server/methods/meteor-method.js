import {InjectDataServerService} from "../service/InjectDataServerService"
import {SecurityServiceServer} from "../service/SecurityServiceServer"


Meteor.methods({
     injectData: function(){
         SecurityServiceServer.isItProd("inject data from front");
         InjectDataServerService.injectAllData();
    }
});

