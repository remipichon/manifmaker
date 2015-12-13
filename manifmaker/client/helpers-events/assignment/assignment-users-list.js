Template.assignmentUsersList.helpers({
    users: function () {
        var filter = UserFilter.get();
        var filterIndex = UserIndexFilter.get();
        var teamFilter = UserTeamFilter.get();

        var searchResult;
        var filterResult;

        filterResult = Users.find({
            $and: [
                filter,
                teamFilter
            ]
        }, {limit: 20}).fetch();
        searchResult = UsersIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
    },

    "allTeams": function () {
        return Teams.find();
    }
});


Template.assignmentUsersList.events({
    "click .href-assignment-user": function (event) {
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/user/" + this._id);
        Router.go("/assignment/user/" + this._id);
    },

    "click li": function (event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _id;
        if (target.hasClass("user"))
            _id = target.data("_id");
        else
            _id = target.parents(".user").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                break;
            case AssignmentType.TASKTOUSER:
                Meteor.call("assignUserToTaskTimeSlot", _id, SelectedTask.get()._id, selectedTimeslotId);
                break;
        }

    },

    "keyup #search_user_name": function (event) {
        var searchInput = $("#search_user_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/user/search/"+query);
        //Router.go("/assignment/user/search/"+query);

        if (searchInput === "") {
            UserIndexFilter.set(noSearchFilter);
        } else {
            UserIndexFilter.set(searchInput);
        }
    },

    "change #filter_team_user" : function(event){
        var _id = $(event.target).val();
        //TODO
        console.debug("TODO");
    }
});