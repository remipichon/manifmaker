Meteor.methods({
     populateData: function(){
         deleteAll();
         populateData();
    },
    initAccessRightData: function(){
        initAccessRightData();
    }
});

