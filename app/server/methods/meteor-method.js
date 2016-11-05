import {InjectDataServerService} from "../service/InjectDataServerService"
import {SecurityServiceServer} from "../service/SecurityServiceServer"
import {ServerUserService} from "../service/ServerUserService"


Meteor.methods({
     injectData: function(){
         SecurityServiceServer.isItProd("inject data from front");
         Meteor.isStartingUp = true;
         InjectDataServerService.deleteAll();
         InjectDataServerService.initAccessRightData();
         InjectDataServerService.injectAllData();
         Meteor.isStartingUp = false;
     },
    updateUserName: function(userId,newUsername){
        ServerUserService.updateUserName(userId,newUsername)
    },
    updateUserEmail: function(userId,newUserEmail){
        ServerUserService.updateUserEmail(userId,newUserEmail)
    },
    sendVerificationEmail: function(userId){
        ServerUserService.sendVerificationEmail(userId)
    }
});

