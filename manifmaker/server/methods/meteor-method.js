import {InjectDataServerService} from "../service/InjectDataServerService"


Meteor.methods({
     injectData: function(){
         if(Meteor.isDevelopment){
             InjectDataServerService.injectAllData();
         } else {
             throw new Meteor.Error(500,"Meteor Methods injectData has been called but cancel because Meteor is not in developement mode")
         }
    }
});

