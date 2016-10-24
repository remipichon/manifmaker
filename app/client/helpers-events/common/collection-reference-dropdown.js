Template.commonTeamListDropdown.events({
    "change .filter_team": function (event, template) {
        var _id = $(event.target).val();
        var $adviceAll = $(template.find(".filter_team_option_advice_all"));
        if (_id === "") {
            $adviceAll.text($adviceAll.data("chooselabel"));
        } else {
            $adviceAll.text($adviceAll.data("alllabel"));
        }
    }
});

Template.collectionReferenceButtons.helpers({
    onError: function(){
        return function(error){
            sAlert.error("An error occurred : "+error);
        }
    },
    onSuccess: function(){
        return function(){
            sAlert.info("Delete succeed");
        }
    }
});



