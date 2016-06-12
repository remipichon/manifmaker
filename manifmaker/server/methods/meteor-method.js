Meteor.methods({
     injectData: function(){
         if(Meteor.isDevelopment){
             injectData();
         } else {
             throw new Meteor.Error(500,"Meteor Methods injectData has been called but cancel because Meteor is not in developement mode")
         }
    }
});

