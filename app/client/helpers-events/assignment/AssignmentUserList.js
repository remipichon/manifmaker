import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"
import {TeamService} from "../../../both/service/TeamService"
import {AssignmentServiceClient} from "../../service/AssignmentServiceClient"

class AssignmentUserList extends BlazeComponent {

    constructor(parent){
        super();
        this.userTeamFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
        this.userSkillsFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
    }

    events() {
        return [{
            "click .href-assignment-user": this.onClickUserName,
            "click .user": this.onClickUser,
            "click .users-list-header": this.switchUsersListDeveloped,
            "keyup #search_user_name": this.performSearch,
        }]
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
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
        var isUnassignment = AssignmentReactiveVars.IsUnassignment.get();
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
                    Meteor.call("removeAssignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, _id, function(error, result){
                            if(!error){
                                AssignmentServiceClient.congratsRemoveAssignment(AssignmentType.TASKTOUSER,_id);
                            }
                        });
                    AssignmentReactiveVars.IsUnassignment.set(false)
                } else
                    Meteor.call("assignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, _id,function(error, result){
                        if(!error){
                            AssignmentServiceClient.congratsAssignment(AssignmentType.TASKTOUSER,_id);
                        }
                    });
                AssignmentReactiveVars.SelectedTimeSlot.set(null);
                break;
        }

    }

    switchUsersListDeveloped(event){
        AssignmentReactiveVars.isUsersListDeveloped.set(!AssignmentReactiveVars.isUsersListDeveloped.get());
        if(AssignmentReactiveVars.isTasksListDeveloped.get()){
            AssignmentReactiveVars.isTasksListDeveloped.set(false);
        }
    }

    isUsersListDeveloped(){ return AssignmentReactiveVars.isUsersListDeveloped.get()}


    performSearch(event) {
        var searchInput = $("#search_user_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/user/search/"+query);
        //Router.go("/assignment/user/search/"+query);

        if (searchInput === "") {
            AssignmentReactiveVars.UserIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
        } else {
            AssignmentReactiveVars.UserIndexFilter.set(searchInput);
        }
    }

    filterTeam(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _id = newOption;
            if (!_id) {
                this.userTeamFilter.set(AssignmentReactiveVars.defaultFilter);
            } else {
                this.userTeamFilter.set({
                    teams: _id
                });
            }
        },this);
    }
    filterSkill(error, docModified, newOption) {
        return _.bind(function (error, docModifier, newOption) {
            var _ids = newOption;
            if (!_ids || _ids=="") {
                this.userSkillsFilter.set(AssignmentReactiveVars.defaultFilter);
            } else {
                this.userSkillsFilter.set({
                    skills: {
                        $all: _ids
                    }
                });
            }
        },this);
    }

    optionQueryTeamsWithoutAlreadyAssigned(){
        return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
    }

    users() {
        var filter = AssignmentReactiveVars.UserFilter.get();
        var filterIndex = AssignmentReactiveVars.UserIndexFilter.get();
        var teamFilter = this.userTeamFilter.get();
        var skillsFilter = this.userSkillsFilter.get();
        var isReadyForAssignmentFilter = {
            isReadyForAssignment: true
        };

        var currentAssignmentTerm = AssignmentTerms.findOne(AssignmentCalendarDisplayedDays.findOne().assignmentTermId);
        var assignmentTermFilter = {
            availabilities:{
                $elemMatch: {
                    start: { $gte : currentAssignmentTerm.start},
                    end: {$lt: currentAssignmentTerm.end}
                }
            }
        };

        var hasAvailabilitiesFilter = {$or: []};
        var daysDisplayed = AssignmentCalendarDisplayedDays.find().fetch();
        daysDisplayed.forEach(day => {
            var start = day.date.toDate();
            var end = new moment(day.date).add(1,'day').toDate();

            var filter = {
                $or: [ //$or does't work on $elemMatch with miniMongo, so we use it here
                    {
                        availabilities: {
                            $elemMatch: {
                                start: {$gte: start, $lte: end},
                            }
                        }
                    }, {
                        availabilities: {
                            $elemMatch: {
                                end: {$gte: start, $lte: end}
                            }
                        }
                    }
                ]
            };
            hasAvailabilitiesFilter.$or.push(filter);
        });

        var searchResult;
        var filterResult;

        filterResult = Meteor.users.find({
            $and: [
                assignmentTermFilter,
                filter,
                teamFilter,
                skillsFilter,
                hasAvailabilitiesFilter,
                isReadyForAssignmentFilter
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