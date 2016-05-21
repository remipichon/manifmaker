class AssignmentUserList extends BlazeComponent {

    events() {
        return [{
            "click .href-assignment-user": this.onClickUserName,
            "click li": this.onClickUser,
            "keyup #search_user_name": this.performSearch,
            "change .filter_team": this.performFilterTeam,
            "change #filter_skills_user": this.performFilterSkills,

        }]
    }

    onRendered(){
        this.$('#assignment-user-list-collapsible').collapsible({});
    }

    template(){
        return "assignmentUserList";
    }

    onClickUserName(event) {
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/user/" + this.currentData()._id);
        Router.go("/assignment/user/" + this.currentData()._id);
    }

    onClickUser(event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = CurrentAssignmentType.get();
        var isUnassignment = IsUnassignment.get();
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
                if (isUnassignment) {
                    Meteor.call("removeAssignUserToTaskTimeSlot", SelectedPeopleNeed.get()._id, _id);
                    IsUnassignment.set(false)
                } else
                    Meteor.call("assignUserToTaskTimeSlot", SelectedPeopleNeed.get()._id, _id);
                SelectedTimeSlot.set(null);
                break;
        }

    }

    performSearch(event) {
        var searchInput = $("#search_user_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/user/search/"+query);
        //Router.go("/assignment/user/search/"+query);

        if (searchInput === "") {
            UserIndexFilter.set(noSearchFilter);
        } else {
            UserIndexFilter.set(searchInput);
        }
    }

    performFilterTeam(event) {
        var _id = $(event.target).val();
        if (_id === "") {
            UserTeamFilter.set(defaultFilter);
        } else {
            UserTeamFilter.set({
                teams: _id
            });
        }
    }

    performFilterSkills(event) {
        var _ids = $(event.target).val();
        if (!_ids) {
            UserSkillsFilter.set(defaultFilter);
        } else {
            UserSkillsFilter.set({
                skills: {
                    $all: _ids
                }
            });
        }
    }


    users() {
        var filter = UserFilter.get();
        var filterIndex = UserIndexFilter.get();
        var teamFilter = UserTeamFilter.get();
        var skillsFilter = UserSkillsFilter.get();

        var searchResult;
        var filterResult;

        filterResult = Users.find({
            $and: [
                filter,
                teamFilter,
                skillsFilter
            ]
        }, {limit: 20}).fetch();
        searchResult = UsersIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
    }

    team() {
        return Teams.findOne({_id: this.currentData().toString()}).name;
    }

    userTeamsWithoutGlobalTeam() {
        var teams = this.currentData().teams;
        var result = [];
        var assignmentReadyTeam = Teams.findOne({name: ASSIGNMENTREADYTEAM});
        teams.forEach(teamId => {
            if (teamId !== assignmentReadyTeam._id)
                result.push(teamId)
        });
        return result;
    }
}


AssignmentUserList.register("AssignmentUserList");