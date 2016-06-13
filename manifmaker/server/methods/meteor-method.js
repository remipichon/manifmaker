Meteor.methods({
     injectData: function(){
         if(Meteor.isDevelopment){
             injectData();
         } else {
             throw new Meteor.Error(500,"Meteor Methods injectData has been called but cancel because Meteor is not in developement mode")
         }
    },
    deleteAll: function(){
        if(Meteor.isDevelopment){
            deleteAll();
        } else {
            throw new Meteor.Error(500,"Meteor Methods deleteAll has been called but cancel because Meteor is not in developement mode")
        }
    },
    initAccessRightData: function(){
        if(Meteor.isDevelopment){
            initAccessRightData();
        } else {
            throw new Meteor.Error(500,"Meteor Methods initAccessRightData has been called but cancel because Meteor is not in developement mode")
        }
    },
    populateData: function(){
        if(Meteor.isDevelopment){
            populateData();
        } else {
            throw new Meteor.Error(500,"Meteor Methods populateData has been called but cancel because Meteor is not in developement mode")
        }
    }
});

