import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"

defaultFilter = {};
noSearchFilter = "";
noneFilter = {none: "none"};

//TODO don't user global var
UserFilter = new ReactiveVar(defaultFilter);
UserIndexFilter = new ReactiveVar(noSearchFilter);
UserTeamFilter = new ReactiveVar(defaultFilter);
UserSkillsFilter = new ReactiveVar(defaultFilter);


//

SelectedUser = new ReactiveVar(null);
TaskFilter = new ReactiveVar(defaultFilter);
TaskIndexFilter = new ReactiveVar(noSearchFilter);
TaskTeamFilter = new ReactiveVar(defaultFilter);
DisplayAssignedTask = new ReactiveVar(false);
TaskNeededTeamFilter = new ReactiveVar(null);
TaskSkillsFilter = new ReactiveVar(null);
SelectedTask = new ReactiveVar(null);
SelectedTaskBreadCrumb = new ReactiveVar(null); //TODO voir si on peut la merger avec SelectedTask
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

SelectedAvailability = new ReactiveVar(null);
SelectedPeopleNeed = new ReactiveVar(null);

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);
IsUnassignment = new ReactiveVar(false);

TaskListTeamFilter = new ReactiveVar(defaultFilter);


function preSelecterTaskByTaskName(name) {
    UserFilter.set(noneFilter);
    TaskFilter.set(defaultFilter);
    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);

    var query = Tasks.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedTask.set({_id: _id});
            UserFilter.set(noneFilter);
        }
    });

}


function preSelectedUserByUserName(name) {
    UserFilter.set(defaultFilter);
    TaskFilter.set(noneFilter);
    CurrentAssignmentType.set(AssignmentType.USERTOTASK);

    var query = Users.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedUser.set({_id: _id});
            SelectedAvailability.set(null);
            TaskFilter.set(noneFilter);
        }
    });

}


Meteor.startup(function () {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");
    Meteor.subscribe("group-roles");
    Meteor.subscribe("roles");
    Meteor.subscribe("equipment-categories");
    Meteor.subscribe("equipment-storages");
    Meteor.subscribe("equipments");
    Meteor.subscribe("water-supplies");
    Meteor.subscribe("water-disposals");
    Meteor.subscribe("power-supplies");
    Meteor.subscribe("assignment-terms", function () {
        AssignmentServiceClient.setCalendarTerms();
    });

    TempCollection = new Meteor.Collection(null)


    //preSelecterTaskByTaskName("task1");
    //preSelectedUserByUserName("user1");

    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log("AutoForm.addHooks : "+name + " error:", error);
        }
    });

    var accuracy = CalendarAccuracyEnum["1"];
    AssignmentServiceClient.setCalendarAccuracy(accuracy);


    //hide custom select popover when click outside popover
    $('body').on('click', function (e) {
        $('.custom-select-label-wrapper[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
});

