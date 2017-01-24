Template.collectionReferenceButtons.helpers({
    onError: function (error) {
        return function(error){
            sAlert.error(`${error.reason}`);
        }

    },
    onSuccess: function () {
        return function(){
            UpdateInfo.insert({date:new Date()});
        }

    }
})