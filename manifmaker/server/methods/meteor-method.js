import {InjectDataServerService} from "../service/InjectDataServerService"


Meteor.methods({
     injectData: function(){
         if(Meteor.isDevelopment){
             InjectDataServerService.injectAllData();
         } else {
             throw new Meteor.Error(500,"Meteor Methods injectData has been called but cancel because Meteor is not in developement mode")
         }
    },
    deleteAll: function(){
        if(Meteor.isDevelopment){
            InjectDataServerService.deleteAll();
        } else {
            throw new Meteor.Error(500,"Meteor Methods deleteAll has been called but cancel because Meteor is not in developement mode")
        }
    },
    initAccessRightData: function(){
        if(Meteor.isDevelopment){
            InjectDataServerService.initAccessRightData();
        } else {
            throw new Meteor.Error(500,"Meteor Methods initAccessRightData has been called but cancel because Meteor is not in developement mode")
        }
    },
    populateData: function(){
        if(Meteor.isDevelopment){
            InjectDataServerService.populateData();
        } else {
            throw new Meteor.Error(500,"Meteor Methods populateData has been called but cancel because Meteor is not in developement mode")
        }
    }
});

